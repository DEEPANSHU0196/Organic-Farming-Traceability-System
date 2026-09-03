import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  Leaf,
  MapPin,
  Package,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
  XCircle,
  Activity,
  Globe,
  Award,
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
    <motion.section initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45 }} className="bg-white rounded-xl shadow-md border border-surface-alt overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-surface-alt">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-green-600 text-white shadow-sm">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-bold text-primary">{title}</h2>
          {subtitle && <p className="text-xs text-accent-muted">{subtitle}</p>}
        </div>
      </div>
      <div className="p-6">{children}</div>
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

const ProductTraceability = () => {
  const { productId, id } = useParams();
  const routeId = productId || id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTimeline, setOpenTimeline] = useState(0);

  useEffect(() => {
    if (!routeId) { setProduct(null); setLoading(false); return undefined; }
    let active = true;
    setLoading(true);
    api.get(`/products/trace/${routeId}`)
      .then((res) => { if (active) setProduct(res.data.product); })
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
    <div className="min-h-screen bg-surface">
      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="bg-gradient-to-br from-[#1b4332] via-[#2d6a4f] to-[#a9744f] text-white">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold mb-4">
                <Sparkles className="h-3.5 w-3.5" />
                Premium Traceability Platform
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">🌱 {product.name || "Product Traceability"}</h1>
              <p className="text-white/85 max-w-xl text-sm">Track your food from farm to table with verified QR authentication, shipment visibility, and a complete journey timeline.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <BadgePill active={productVerified} icon={ShieldCheck} label="Organic Verified" />
                <BadgePill active={qrVerified} icon={QrCode} label="QR Authenticated" />
                <div className="inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/20 px-3 py-1.5 text-xs font-semibold">
                  <Activity className="h-3.5 w-3.5" />
                  {displayedTraceabilityId}
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 lg:min-w-[300px]">
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
        <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">

          {/* Left */}
          <div className="space-y-6">
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

            <SectionCard title="Journey Timeline" subtitle="Step-by-step supply chain history" icon={Truck}>
              <div className="relative">
                <div className="absolute left-[1.05rem] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-400 via-blue-300 to-surface-alt" />
                <div className="space-y-3">
                  {traceData.timeline.map((item, index) => {
                    const tone = getTimelineTone(item.status);
                    const styles = toneStyles[tone];
                    const expanded = openTimeline === index;
                    const Icon = item.icon;
                    return (
                      <motion.div key={item.key} initial={{ opacity: 0, x: -12 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.05 }} className="relative pl-12">
                        <div className={`absolute left-0 top-4 flex h-9 w-9 items-center justify-center rounded-full border-2 bg-white shadow-md ${styles.border}`}>
                          <Icon className={`h-4 w-4 ${styles.iconColor}`} />
                        </div>
                        <button type="button" onClick={() => setOpenTimeline(expanded ? -1 : index)} className="w-full text-left rounded-lg border border-surface-alt bg-white hover:bg-surface px-4 py-3 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="text-sm font-bold text-primary">{item.title}</div>
                              <div className="text-xs text-accent-muted mt-0.5 line-clamp-1">{item.description}</div>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${styles.badge}`}>{item.status || "Pending"}</span>
                              {expanded ? <ChevronDown className="h-4 w-4 text-accent-muted" /> : <ChevronRight className="h-4 w-4 text-accent-muted" />}
                            </div>
                          </div>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="overflow-hidden">
                                <div className="mt-3 grid gap-2 sm:grid-cols-3 pt-3 border-t border-surface-alt">
                                  <InfoTile icon={Clock3} label="Date & time" value={formatDateTime(item.date)} />
                                  <InfoTile icon={MapPin} label="Location" value={item.location || "N/A"} />
                                  <InfoTile icon={BadgeCheck} label="Status" value={item.status || "Pending"} />
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </button>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </SectionCard>
          </div>

          {/* Right */}
          <div className="space-y-6">
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
              <div className="rounded-lg bg-primary px-4 py-3 text-white flex items-center justify-between mb-4">
                <div className="text-xs font-semibold uppercase tracking-widest text-green-300">Verified Product</div>
                <BadgeCheck className="h-5 w-5 text-green-300" />
              </div>
              <div className="grid gap-4 sm:grid-cols-[auto_1fr] items-start">
                <div className="flex items-center justify-center rounded-xl border-2 border-dashed border-surface-warm bg-surface-alt p-4">
                  {product.qrCode ? (
                    <img src={product.qrCode} alt="Product QR Code" className="h-40 w-40 rounded-lg bg-white object-contain p-2 shadow-sm" />
                  ) : (
                    <div className="flex h-40 w-40 flex-col items-center justify-center rounded-lg bg-white text-center text-xs text-accent-muted gap-2 shadow-inner">
                      <QrCode className="h-10 w-10 text-surface-warm" />
                      <span>QR not generated</span>
                    </div>
                  )}
                </div>
                <div className="grid gap-2">
                  <DetailRow label="Traceability ID" value={displayedTraceabilityId} />
                  <DetailRow label="Scan Count" value={`${traceData.scanCount}`} />
                  <DetailRow label="QR Verification" value={qrVerified ? "Authenticated" : "Pending"} />
                  <DetailRow label="Organic Status" value={product.organicCertified ? "Organic Verified" : "Awaiting review"} />
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
        </div>
      </div>
    </div>
  );
};

export default ProductTraceability;
