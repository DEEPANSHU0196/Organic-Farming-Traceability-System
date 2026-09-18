import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  BadgeCheck,
  Building2,
  CalendarDays,
  Clock3,
  Copy,
  Leaf,
  MapPin,
  Navigation,
  Package,
  QrCode,
  ShieldCheck,
  ScanLine,
  Sparkles,
  Thermometer,
  Truck,
  UserRound,
  XCircle,
  Activity,
  Globe,
  Hash,
  Link2,
  Award,
  Warehouse,
} from "lucide-react";
import api from "../api/axios";
import { LeafLoader, StatusBadge } from "../shared/ui";

const EMPTY_IMAGE = "https://placehold.co/1200x900?text=Organic+Product";

const progressSteps = ["Pending", "Picked", "In Transit", "Delivered"];

const formatDateTime = (value) => {
  if (!value) return "Awaiting update";
  return new Date(value).toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
};

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString([], { year: "numeric", month: "short", day: "numeric" });
};

const getDisplayPerson = (person, fallbackName = "Unknown") => {
  if (!person || typeof person === "string") return { name: fallbackName, email: "N/A", phone: "N/A", address: "N/A" };
  return {
    name: person.fullName || person.name || fallbackName,
    email: person.email || "N/A",
    phone: person.phone || "N/A",
    address: person.address || "N/A",
  };
};

const getShipmentLabel = (status) => {
  switch ((status || "Pending").toLowerCase()) {
    case "delivered": return { label: "Delivered", tone: "completed" };
    case "in transit": return { label: "In Transit", tone: "inprogress" };
    case "picked": return { label: "Picked", tone: "inprogress" };
    case "delayed": return { label: "Delayed", tone: "delayed" };
    default: return { label: "Pending", tone: "pending" };
  }
};

const buildTimeline = (product) => {
  const updates = Array.isArray(product?.shipment?.updates) ? product.shipment.updates : [];
  const shippedAt = product?.updatedAt || product?.createdAt;
  const harvestAt = product?.harvestDate || shippedAt;
  return [
    { key: "harvest", title: "Product Harvested", icon: Leaf, status: updates[0]?.status || (product?.harvestDate ? "Completed" : "Pending"), date: updates[0]?.date || harvestAt, description: updates[0]?.description || `The crop was harvested from ${product?.location || "the farm"} and prepared for traceability logging.`, location: updates[0]?.location || product?.location || "Farm location" },
    { key: "marketplace", title: "Added To Marketplace", icon: Package, status: updates[1]?.status || (product?.createdAt ? "Completed" : "Pending"), date: updates[1]?.date || product?.createdAt, description: updates[1]?.description || "The product was registered in the marketplace and is visible to buyers and auditors.", location: updates[1]?.location || product?.location || "Marketplace" },
    { key: "qr", title: "QR Code Generated", icon: QrCode, status: updates[2]?.status || (product?.qrCode ? "Completed" : "Pending"), date: updates[2]?.date || product?.updatedAt, description: updates[2]?.description || "The verification QR was generated and linked to the consumer traceability page.", location: updates[2]?.location || "Traceability hub" },
    { key: "pickup", title: "Shipment Picked Up", icon: Truck, status: updates[3]?.status || (["Picked","In Transit","Delivered"].includes(product?.shipment?.status) ? "Completed" : "Pending"), date: updates[3]?.date || product?.shipment?.updatedAt || product?.updatedAt, description: updates[3]?.description || "The shipment was handed to the transporter and scanned into the logistics network.", location: updates[3]?.location || product?.shipment?.currentLocation || "Dispatch center" },
    { key: "warehouse", title: "Warehouse Updates", icon: MapPin, status: updates[4]?.status || (["In Transit","Delivered"].includes(product?.shipment?.status) ? "In Progress" : "Pending"), date: updates[4]?.date || product?.shipment?.updatedAt || product?.createdAt, description: updates[4]?.description || "Warehouse checkpoints, route scans, and location changes are recorded here.", location: updates[4]?.location || product?.shipment?.currentLocation || "Transit checkpoint" },
    { key: "delivered", title: "Delivered To Consumer", icon: BadgeCheck, status: updates[5]?.status || (product?.shipment?.status === "Delivered" ? "Completed" : "Pending"), date: updates[5]?.date || product?.shipment?.estimatedDelivery || product?.updatedAt, description: updates[5]?.description || "The product reached the final consumer and completed the traceable journey.", location: updates[5]?.location || product?.shipment?.currentLocation || "Delivery destination" },
  ];
};

const getTimelineTone = (status) => {
  const value = (status || "Pending").toLowerCase();
  if (value.includes("deliver") || value.includes("complete") || value === "approved") return "completed";
  if (value.includes("progress") || value.includes("pick") || value.includes("transit")) return "inprogress";
  if (value.includes("delay")) return "delayed";
  return "pending";
};

const getDistanceTravelled = (product) => {
  const explicit = product?.shipment?.distanceTravelledKm;
  if (typeof explicit === "number") return `${explicit.toFixed(0)} km`;
  const fallback = (product?.shipment?.updates?.length || 0) * 18;
  return fallback > 0 ? `~${fallback} km` : "Awaiting route data";
};

const getSustainabilityScore = (product) => {
  const base = product?.organicCertified ? 92 : 68;
  const updatesBonus = Math.min((product?.shipment?.updates?.length || 0) * 2, 6);
  const deliveryBonus = product?.shipment?.status === "Delivered" ? 2 : 0;
  return Math.min(base + updatesBonus + deliveryBonus, 99);
};

const toneStyles = {
  completed: { badge: "bg-green-100 text-green-700", border: "border-green-300", iconColor: "text-green-600" },
  inprogress: { badge: "bg-blue-100 text-blue-700", border: "border-blue-300", iconColor: "text-blue-600" },
  delayed: { badge: "bg-red-100 text-red-700", border: "border-red-300", iconColor: "text-red-600" },
  pending: { badge: "bg-gray-100 text-gray-500", border: "border-gray-200", iconColor: "text-gray-400" },
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-surface px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <LeafLoader label="Verifying your product journey..." />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="h-80 rounded-xl bg-surface-alt animate-pulse" />
          <div className="h-72 rounded-xl bg-surface-alt animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-64 rounded-xl bg-surface-alt animate-pulse" />
          <div className="h-56 rounded-xl bg-surface-alt animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen bg-surface flex items-center justify-center px-4">
    <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl bg-white rounded-xl shadow-md border border-surface-alt p-10 text-center">
      <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-surface-alt">
        <XCircle className="h-10 w-10 text-accent-muted" />
      </div>
      <h1 className="text-2xl font-bold text-primary mb-3">Product Not Found</h1>
      <p className="text-accent-muted mb-6">The QR link may be outdated, or the product record is not available yet.</p>
      <div className="grid gap-3 sm:grid-cols-3">
        {["Check the QR code", "Refresh the trace link", "Contact the farmer or brand"].map((item) => (
          <div key={item} className="rounded-lg border border-surface-alt bg-surface-alt px-4 py-3 text-sm font-medium text-accent-muted">{item}</div>
        ))}
      </div>
    </motion.div>
  </div>
);

function SectionCard({ title, subtitle, icon: Icon, children }) {
  return (
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45 }} className="trace-section-card">
      <div className="trace-section-heading">
        <div className="trace-section-icon">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-accent-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="trace-section-body">{children}</div>
    </motion.section>
  );
}

function DetailRow({ label, value, wide = false }) {
  return (
    <div className={`rounded-lg border border-surface-alt bg-surface-alt px-4 py-3 ${wide ? "col-span-2" : ""}`}>
      <div className="text-xs font-semibold uppercase tracking-widest text-accent-muted mb-1">{label}</div>
      <div className="text-sm font-medium text-primary leading-relaxed">{value}</div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value }) {
  return (
    <div className="rounded-lg border border-surface-alt bg-surface-alt px-4 py-3">
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-accent-muted mb-1">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className="text-sm font-semibold text-primary">{value}</div>
    </div>
  );
}

function StatCard({ label, value, helper, icon: Icon }) {
  return (
    <div className="rounded-lg border border-surface-alt bg-white p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white mb-3">
        <Icon className="h-4 w-4" />
      </div>
      <div className="text-xs font-semibold uppercase tracking-widest text-accent-muted mb-1">{label}</div>
      <div className="text-xl font-bold text-primary">{value}</div>
      <div className="text-xs text-accent-muted mt-1">{helper}</div>
    </div>
  );
}

function BadgePill({ active, icon: Icon, label }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-semibold ${active ? "border-green-200 bg-green-100 text-green-700" : "border-white/30 bg-white/20 text-white/80"}`}>
      <Icon className="h-3.5 w-3.5" />
      {label}
    </div>
  );
}

const journeyStageImages = [
  "https://images.unsplash.com/photo-1500595046743-cd271d694d30?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1592838064575-70ed626d3a0e?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?auto=format&fit=crop&w=900&q=80",
  "https://images.unsplash.com/photo-1488459716781-31db52582fe9?auto=format&fit=crop&w=900&q=80",
];

const getTemperature = (update, product) => {
  const temperature = update?.temperature ?? product?.shipment?.temperature ?? product?.temperature;
  return temperature === undefined || temperature === null || temperature === "" ? "Not captured" : `${temperature}°C`;
};

const shortenHash = (hash) => (hash ? `${hash.slice(0, 10)}...${hash.slice(-8)}` : "Awaiting hash");

function FarmToTableJourney({ product, traceData }) {
  const updates = Array.isArray(product?.shipment?.updates) ? product.shipment.updates : [];
  const shipmentStatus = product?.shipment?.status || "Pending";
  const stages = [
    { label: "Farm", role: "Origin", icon: Leaf, location: product?.location || "Farm location", status: product?.harvestDate ? "Harvest recorded" : "Awaiting harvest", update: updates[0], image: product?.image || journeyStageImages[0] },
    { label: "Collection center", role: "Quality handoff", icon: Building2, location: updates[1]?.location || "Collection center", status: updates[1]?.status || "Awaiting scan", update: updates[1], image: journeyStageImages[1] },
    { label: "Transporter", role: traceData.transporter.name, icon: Truck, location: product?.shipment?.currentLocation || updates[2]?.location || "Route location", status: shipmentStatus, update: updates[2], image: journeyStageImages[2] },
    { label: "Warehouse", role: "Storage checkpoint", icon: Warehouse, location: updates[3]?.location || product?.shipment?.currentLocation || "Warehouse checkpoint", status: updates[3]?.status || "Awaiting checkpoint", update: updates[3], image: journeyStageImages[3] },
    { label: "Buyer", role: "Final destination", icon: UserRound, location: product?.shipment?.order?.buyer?.address || "Delivery destination", status: shipmentStatus === "Delivered" ? "Journey complete" : "In progress", update: updates[4], image: journeyStageImages[4] },
  ];
  const activeIndex = Math.max(0, stages.findIndex((stage) => stage.status.toLowerCase().includes("transit") || stage.status.toLowerCase().includes("progress")));

  return (
    <SectionCard title="Farm-to-table journey" subtitle="A living view of every handoff in the supply chain" icon={Globe}>
      <div className="journey-map-shell">
        <div className="journey-map-header">
          <div>
            <div className="journey-live-label"><span className="journey-live-dot" /> Live journey signal</div>
            <p className="mt-2 text-sm text-white/70">Every checkpoint becomes part of this product's verified story.</p>
          </div>
          <div className="journey-route-stat"><Navigation className="h-4 w-4" /> {traceData.distanceTravelled}</div>
        </div>
        <div className="journey-route" aria-label="Farm to table supply chain journey">
          <div className="journey-route-line" />
          <motion.div className="journey-route-packet" animate={{ left: ["4%", "96%"] }} transition={{ duration: 4.5, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }} />
          <div className="journey-stage-grid">
            {stages.map((stage, index) => {
              const Icon = stage.icon;
              const isActive = index === activeIndex || (index === 0 && activeIndex === 0);
              return (
                <motion.div key={stage.label} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={{ y: -7 }} className={`journey-map-stage ${isActive ? "journey-map-stage-active" : ""}`}>
                  <div className="journey-stage-photo"><img src={stage.image} alt={`${stage.label} checkpoint`} onError={(event) => { event.currentTarget.src = journeyStageImages[index]; }} /><span className="journey-stage-index">0{index + 1}</span></div>
                  <div className="journey-stage-marker"><Icon className="h-5 w-5" /></div>
                  <div className="journey-stage-copy">
                    <div className="flex items-start justify-between gap-2"><div><h3>{stage.label}</h3><p>{stage.role}</p></div><span className={`journey-status ${isActive ? "journey-status-live" : ""}`}>{isActive ? "Live" : "Logged"}</span></div>
                    <div className="journey-stage-detail"><MapPin className="h-3.5 w-3.5 shrink-0" /> <span>{stage.location}</span></div>
                    <div className="journey-stage-detail"><Thermometer className="h-3.5 w-3.5 shrink-0" /> <span>{getTemperature(stage.update, product)}</span><span className="journey-stage-status">{stage.status}</span></div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
        <div className="journey-map-footer"><span><ShieldCheck className="h-4 w-4 text-[#a8d5ba]" /> QR-linked trace record</span><span><Clock3 className="h-4 w-4 text-[#e9c46a]" /> Updated {formatDateTime(product?.shipment?.updatedAt || product?.updatedAt)}</span></div>
      </div>
    </SectionCard>
  );
}

const ProductTraceability = () => {
  const { productId, id } = useParams();
  const routeId = productId || id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [traceIdCopied, setTraceIdCopied] = useState(false);

  useEffect(() => {
    if (!routeId) { setProduct(null); setLoading(false); return undefined; }
    let active = true;
    setLoading(true);
    api.get(`/products/trace/${routeId}`)
      .then((res) => { if (active) setProduct({ ...res.data.product, blockchain: res.data.blockchain }); })
      .catch((error) => { console.error(error); if (active) setProduct(null); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [routeId]);

  const traceData = useMemo(() => {
    if (!product) return null;
    const farmer = getDisplayPerson(product.farmer, "Farmer");
    const transporter = getDisplayPerson(product.shipment?.transporter, "Transporter");
    const shipmentStatus = getShipmentLabel(product.shipment?.status || product.status);
    const timeline = buildTimeline(product);
    return {
      farmer, transporter, shipmentStatus, timeline,
      scanCount: product.scanCount ?? product.qrScanCount ?? 0,
      daysSinceHarvest: product.harvestDate ? Math.max(1, Math.floor((Date.now() - new Date(product.harvestDate).getTime()) / (1000 * 60 * 60 * 24))) : null,
      distanceTravelled: getDistanceTravelled(product),
      sustainabilityScore: getSustainabilityScore(product),
    };
  }, [product]);

  if (loading) return <LoadingSkeleton />;
  if (!product || !traceData) return <EmptyState />;

  const productVerified = Boolean(product.organicCertified);
  const qrVerified = Boolean(product.qrCode || product.traceabilityId);
  const currentShipmentStageIndex = Math.max(0, progressSteps.findIndex((step) => step.toLowerCase() === (product.shipment?.status || "Pending").toLowerCase()));
  const displayedTraceabilityId = product.traceabilityId || `TRACE-${product._id}`;
  const displayedStatus = product.shipment?.status || product.status || "Pending";

  return (
    <div className="min-h-screen bg-surface trace-page">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="trace-hero" style={{ "--trace-hero-image": `url(${product.image || EMPTY_IMAGE})` }}>
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="trace-hero-kicker">
                <Sparkles className="h-3.5 w-3.5" />
                AgroVerse verified product passport
              </div>
              <h1 className="trace-hero-title"><span className="trace-product-mark">{typeof product.image === "string" && /^(https?:\/\/|data:image\/)/.test(product.image) ? <img src={product.image} alt="" /> : <Leaf className="h-10 w-10" />}</span> {product.name || "Product Traceability"}</h1>
              <p className="trace-hero-copy">A living digital passport for this harvest. Follow its origin, quality signals, handoffs, and route from the farm to your table.</p>
              <div className="trace-hero-pills">
                <BadgePill active={productVerified} icon={ShieldCheck} label="Organic Verified" />
                <BadgePill active={qrVerified} icon={QrCode} label="QR Authenticated" />
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-semibold">
                  <Activity className="h-3.5 w-3.5" />
                  {displayedTraceabilityId}
                </div>
              </div>
            </div>
            <div className="trace-hero-stats">
              {[
                { label: "Product Status", value: displayedStatus },
                { label: "Shipment Stage", value: traceData.shipmentStatus.label },
                { label: "Total Scans", value: `${traceData.scanCount} scans` },
                { label: "Sustainability", value: `${traceData.sustainabilityScore}/100` },
              ].map(({ label, value }) => (
                <div key={label} className="rounded-lg bg-white/15 border border-white/25 px-4 py-3">
                  <div className="text-xs text-white/70 font-medium mb-1">{label}</div>
                  <div className="text-base font-bold">{value}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Body */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="trace-content-grid grid gap-8 lg:grid-cols-[3fr_2fr]">

          {/* Left */}
          <div className="trace-primary-column space-y-8">
            <FarmToTableJourney product={product} traceData={traceData} />
            <SectionCard title="Product Information" subtitle="Origin, quality, and certification details" icon={Leaf}>
              <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="relative overflow-hidden rounded-xl border border-surface-alt bg-surface-alt shadow-inner">
                  <img src={product.image || EMPTY_IMAGE} alt={product.name} className="h-full min-h-[18rem] w-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-4 text-white">
                    <div className="text-xs font-semibold uppercase tracking-widest text-green-300 mb-1">Fresh from the farm</div>
                    <div className="text-xl font-bold">{product.name}</div>
                  </div>
                </div>
                <div className="grid gap-3 content-start">
                  <DetailRow label="Product Name" value={product.name || "N/A"} />
                  <DetailRow label="Category" value={product.category || "N/A"} />
                  <div className="grid grid-cols-2 gap-3">
                    <DetailRow label="Quantity" value={`${product.quantity ?? 0}`} />
                    <DetailRow label="Price" value={`₹${product.price ?? 0}`} />
                  </div>
                  <DetailRow label="Harvest Date" value={formatDate(product.harvestDate)} />
                  <DetailRow label="Description" value={product.description || "No description available."} wide />
                  <div className="grid grid-cols-2 gap-3">
                    <DetailRow label="Cert. Number" value={product.certificationNumber || "Pending"} />
                    <DetailRow label="Trace ID" value={displayedTraceabilityId} />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Journey Statistics" subtitle="At-a-glance journey metrics" icon={Sparkles}>
              <div className="grid gap-4 grid-cols-2">
                <StatCard label="Days Since Harvest" value={traceData.daysSinceHarvest ?? "N/A"} helper="days from farm" icon={CalendarDays} />
                <StatCard label="Distance Travelled" value={traceData.distanceTravelled} helper="route covered" icon={Globe} />
                <StatCard label="Shipment Status" value={traceData.shipmentStatus.label} helper="logistics update" icon={Truck} />
                <StatCard label="Sustainability" value={`${traceData.sustainabilityScore}/100`} helper="eco impact score" icon={Leaf} />
              </div>
            </SectionCard>

          </div>

          {/* Right */}
          <div className="trace-secondary-column space-y-8">
            <SectionCard title="Farmer Profile" subtitle="Verified producer information" icon={UserRound}>
              <div className="flex items-center gap-4 rounded-lg border border-surface-alt bg-surface-alt p-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-md shrink-0">
                  <UserRound className="h-7 w-7" />
                </div>
                <div>
                  <div className="text-base font-bold text-primary">{traceData.farmer.name}</div>
                  <div className="mt-1 inline-flex items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-semibold text-green-700">
                    <ShieldCheck className="h-3 w-3" />
                    Farmer account verified
                  </div>
                </div>
              </div>
              <div className="grid gap-2">
                <DetailRow label="Phone Number" value={traceData.farmer.phone} />
                <DetailRow label="Email" value={traceData.farmer.email} />
                <DetailRow label="Address" value={traceData.farmer.address} />
                <DetailRow label="Farm Location" value={product.location || "N/A"} />
              </div>
            </SectionCard>

            <SectionCard title="Shipment Tracking" subtitle="Live logistics progress" icon={Truck}>
              <div className="mb-4 flex items-center justify-between">
                <div>
                  <div className="text-xs font-semibold uppercase tracking-widest text-accent-muted mb-1">Current Status</div>
                  <div className="text-2xl font-bold text-primary">{product.shipment?.status || "Pending"}</div>
                </div>
                <StatusBadge status={traceData.shipmentStatus.label} />
              </div>
              <div className="mb-4">
                <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-accent-muted mb-2">
                  {progressSteps.map((step) => (<span key={step}>{step}</span>))}
                </div>
                <div className="relative h-2.5 overflow-hidden rounded-full bg-surface-alt">
                  <motion.div initial={{ width: 0 }} animate={{ width: `${((currentShipmentStageIndex + 1) / progressSteps.length) * 100}%` }} transition={{ duration: 0.8, ease: "easeOut" }} className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-green-500" />
                </div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <InfoTile icon={MapPin} label="Current Location" value={product.shipment?.currentLocation || "Awaiting update"} />
                <InfoTile icon={CalendarDays} label="Est. Delivery" value={formatDate(product.shipment?.estimatedDelivery)} />
                <InfoTile icon={Truck} label="Transporter" value={traceData.transporter.name} />
                <InfoTile icon={Clock3} label="Progress" value={traceData.shipmentStatus.label} />
              </div>
            </SectionCard>

            <SectionCard title="Organic Certificate" subtitle="Official quality & certification checks" icon={Award}>
              <div className="rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 p-5 text-white mb-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Government Approved
                  </div>
                  <BadgeCheck className="h-6 w-6 text-white/80" />
                </div>
                <div className="text-xs text-white/70 mb-1">Certificate Number</div>
                <div className="text-xl font-bold">{product.certificationNumber || "Pending certification"}</div>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <InfoTile icon={BadgeCheck} label="Verification Status" value={product.organicCertified ? "Certified Organic" : "Verification Pending"} />
                <InfoTile icon={Leaf} label="Trace Type" value="Farm-to-consumer" />
              </div>
            </SectionCard>

            <SectionCard title="QR Verification" subtitle="Consumer scan identity & authentication" icon={QrCode}>
              <div className="qr-identity-banner">
                <div className="qr-identity-orbit"><ScanLine className="h-5 w-5" /></div>
                <div className="min-w-0"><div className="qr-eyebrow"><span className="qr-live-dot" /> Scan-ready identity</div><p>One scan opens the verified farm-to-table record.</p></div>
                <BadgeCheck className="ml-auto h-6 w-6 shrink-0 text-[#b9f1cf]" />
              </div>
              <div className="qr-verification-layout">
                <div className="qr-frame-wrap">
                  <div className="qr-scan-corner qr-scan-corner-tl" /><div className="qr-scan-corner qr-scan-corner-tr" /><div className="qr-scan-corner qr-scan-corner-bl" /><div className="qr-scan-corner qr-scan-corner-br" />
                  {product.qrCode ? (
                    <img src={product.qrCode} alt="Product QR Code" className="h-40 w-40 rounded-lg bg-white object-contain p-2 shadow-sm" />
                  ) : (
                    <div className="flex h-40 w-40 flex-col items-center justify-center rounded-lg bg-white text-center text-xs text-accent-muted gap-2 shadow-inner">
                      <QrCode className="h-10 w-10 text-surface-warm" />
                      <span>QR not generated</span>
                    </div>
                  )}
                  {product.qrCode && <div className="qr-scan-line" />}
                </div>
                <div className="qr-data-panel">
                  <div className="qr-data-label">Traceability ID</div>
                  <div className="qr-id-row"><strong>{displayedTraceabilityId}</strong><button type="button" aria-label="Copy traceability ID" title="Copy traceability ID" className="qr-copy-button" onClick={() => { navigator.clipboard?.writeText(displayedTraceabilityId); setTraceIdCopied(true); window.setTimeout(() => setTraceIdCopied(false), 1600); }}>{traceIdCopied ? <BadgeCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}</button></div>
                  <div className="qr-data-grid">
                    <div><span>Scan count</span><strong>{traceData.scanCount}</strong></div>
                    <div><span>Authentication</span><strong className="text-emerald-700">{qrVerified ? "Verified" : "Pending"}</strong></div>
                    <div><span>Organic status</span><strong>{product.organicCertified ? "Certified" : "Reviewing"}</strong></div>
                    <div><span>Record type</span><strong>Public trace</strong></div>
                    <div><span>Ledger integrity</span><strong className={product.blockchain?.valid ? "text-emerald-700" : "text-amber-700"}>{product.blockchain?.valid ? "Chain verified" : "Awaiting blocks"}</strong></div>
                  </div>
                  <div className="qr-instruction"><ScanLine className="h-4 w-4 shrink-0 text-[#2d6a4f]" /><span>Point your phone camera at the code to verify this product's origin and journey.</span></div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Blockchain Ledger" subtitle="Tamper-evident event history for this product" icon={Link2}>
              <div className={`ledger-status ${product.blockchain?.valid ? "ledger-status-valid" : "ledger-status-pending"}`}>
                <ShieldCheck className="h-5 w-5" />
                <div><strong>{product.blockchain?.valid ? "Chain verified" : "Awaiting ledger events"}</strong><p>{product.blockchain?.valid ? `${product.blockchain.blockCount} linked block${product.blockchain.blockCount === 1 ? "" : "s"} checked successfully.` : "Generate a QR code or update the shipment to create the first blocks."}</p></div>
              </div>
              {product.blockchain?.blocks?.length > 0 ? (
                <div className="ledger-list">
                  {product.blockchain.blocks.map((block, index) => (
                    <motion.div key={block._id || block.hash} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.08 }} className="ledger-block">
                      <div className="ledger-block-index">{String(block.index).padStart(2, "0")}</div>
                      <div className="min-w-0 flex-1"><div className="flex items-center gap-2"><strong>{block.eventType.replaceAll("_", " ")}</strong><span className="ledger-block-time">{formatDateTime(block.timestamp)}</span></div><div className="ledger-hash-row"><span><Link2 className="h-3 w-3" /> prev {shortenHash(block.previousHash)}</span><span><Hash className="h-3 w-3" /> hash {shortenHash(block.hash)}</span></div></div>
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="ledger-empty"><Hash className="h-7 w-7" /><p>No blocks recorded for this legacy product yet.</p></div>
              )}
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTraceability;
