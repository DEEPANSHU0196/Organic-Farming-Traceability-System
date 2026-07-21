import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  BadgeCheck,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Clock3,
  CircleDollarSign,
  Leaf,
  MapPin,
  Package,
  QrCode,
  ShieldCheck,
  Sparkles,
  Truck,
  UserRound,
  XCircle,
} from "lucide-react";
import api from "../api/axios";

const EMPTY_IMAGE = "https://placehold.co/1200x900?text=Organic+Product";

const stageStyles = {
  completed: "border-emerald-500 bg-emerald-500/10 text-emerald-700",
  inprogress: "border-sky-500 bg-sky-500/10 text-sky-700",
  pending: "border-zinc-300 bg-zinc-100 text-zinc-500",
  delayed: "border-rose-500 bg-rose-500/10 text-rose-700",
};

const progressSteps = ["Pending", "Picked", "In Transit", "Delivered"];

const formatDateTime = (value) => {
  if (!value) return "Awaiting update";

  return new Date(value).toLocaleString([], {
    dateStyle: "medium",
    timeStyle: "short",
  });
};

const formatDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString([], {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const getDisplayPerson = (person, fallbackName = "Unknown") => {
  if (!person) {
    return { name: fallbackName, email: "N/A", phone: "N/A", address: "N/A" };
  }

  if (typeof person === "string") {
    return { name: fallbackName, email: "N/A", phone: "N/A", address: "N/A" };
  }

  return {
    name: person.fullName || person.name || fallbackName,
    email: person.email || "N/A",
    phone: person.phone || "N/A",
    address: person.address || "N/A",
  };
};

const getShipmentLabel = (status) => {
  switch ((status || "Pending").toLowerCase()) {
    case "delivered":
      return { label: "Delivered", tone: "completed" };
    case "in transit":
      return { label: "In Transit", tone: "inprogress" };
    case "picked":
      return { label: "Picked", tone: "inprogress" };
    case "delayed":
      return { label: "Delayed", tone: "delayed" };
    default:
      return { label: "Pending", tone: "pending" };
  }
};

const buildTimeline = (product) => {
  const updates = Array.isArray(product?.shipment?.updates)
    ? product.shipment.updates
    : [];

  const shippedAt = product?.updatedAt || product?.createdAt;
  const harvestAt = product?.harvestDate || shippedAt;

  return [
    {
      key: "harvest",
      title: "Product Harvested",
      icon: Leaf,
      status: updates[0]?.status || (product?.harvestDate ? "Completed" : "Pending"),
      date: updates[0]?.date || harvestAt,
      description:
        updates[0]?.description ||
        `The crop was harvested from ${product?.location || "the farm"} and prepared for traceability logging.`,
      location: updates[0]?.location || product?.location || "Farm location",
    },
    {
      key: "marketplace",
      title: "Product Added To Marketplace",
      icon: Package,
      status: updates[1]?.status || (product?.createdAt ? "Completed" : "Pending"),
      date: updates[1]?.date || product?.createdAt,
      description:
        updates[1]?.description ||
        "The product was registered in the marketplace and is visible to buyers and auditors.",
      location: updates[1]?.location || product?.location || "Marketplace",
    },
    {
      key: "qr",
      title: "QR Code Generated",
      icon: QrCode,
      status: updates[2]?.status || (product?.qrCode ? "Completed" : "Pending"),
      date: updates[2]?.date || product?.updatedAt,
      description:
        updates[2]?.description ||
        "The verification QR was generated and linked to the consumer traceability page.",
      location: updates[2]?.location || "Traceability hub",
    },
    {
      key: "pickup",
      title: "Shipment Picked Up",
      icon: Truck,
      status: updates[3]?.status || (product?.shipment?.status === "Picked" || product?.shipment?.status === "In Transit" || product?.shipment?.status === "Delivered" ? "Completed" : "Pending"),
      date: updates[3]?.date || product?.shipment?.updatedAt || product?.updatedAt,
      description:
        updates[3]?.description ||
        "The shipment was handed to the transporter and scanned into the logistics network.",
      location: updates[3]?.location || product?.shipment?.currentLocation || "Dispatch center",
    },
    {
      key: "warehouse",
      title: "Warehouse Updates",
      icon: MapPin,
      status: updates[4]?.status || (product?.shipment?.status === "In Transit" || product?.shipment?.status === "Delivered" ? "In Progress" : "Pending"),
      date: updates[4]?.date || product?.shipment?.updatedAt || product?.createdAt,
      description:
        updates[4]?.description ||
        "Warehouse checkpoints, route scans, and location changes are recorded here.",
      location: updates[4]?.location || product?.shipment?.currentLocation || "Transit checkpoint",
    },
    {
      key: "delivered",
      title: "Delivered To Consumer",
      icon: BadgeCheck,
      status: updates[5]?.status || (product?.shipment?.status === "Delivered" ? "Completed" : "Pending"),
      date: updates[5]?.date || product?.shipment?.estimatedDelivery || product?.updatedAt,
      description:
        updates[5]?.description ||
        "The product reached the final consumer and completed the traceable journey.",
      location: updates[5]?.location || product?.shipment?.currentLocation || "Delivery destination",
    },
  ];
};

const getTimelineTone = (status) => {
  const value = (status || "Pending").toLowerCase();

  if (value.includes("deliver") || value.includes("complete") || value === "approved") {
    return "completed";
  }

  if (value.includes("progress") || value.includes("pick") || value.includes("transit") || value === "in transit") {
    return "inprogress";
  }

  if (value.includes("delay")) {
    return "delayed";
  }

  return "pending";
};

const getDistanceTravelled = (product) => {
  const explicit = product?.shipment?.distanceTravelledKm;
  if (typeof explicit === "number") {
    return `${explicit.toFixed(0)} km`;
  }

  const fallback = (product?.shipment?.updates?.length || 0) * 18;
  return fallback > 0 ? `~${fallback} km` : "Awaiting route data";
};

const getSustainabilityScore = (product) => {
  const base = product?.organicCertified ? 92 : 68;
  const updatesBonus = Math.min((product?.shipment?.updates?.length || 0) * 2, 6);
  const deliveryBonus = product?.shipment?.status === "Delivered" ? 2 : 0;
  return Math.min(base + updatesBonus + deliveryBonus, 99);
};

const LoadingSkeleton = () => (
  <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f0fdf4_0%,_#ffffff_45%,_#f8fafc_100%)] px-4 py-8 sm:px-6 lg:px-8">
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="h-56 rounded-[2rem] border border-white/60 bg-white/70 shadow-[0_20px_80px_rgba(16,24,40,0.08)] backdrop-blur-xl animate-pulse" />
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="space-y-6">
          <div className="h-[28rem] rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl animate-pulse" />
          <div className="h-80 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl animate-pulse" />
        </div>
        <div className="space-y-6">
          <div className="h-64 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl animate-pulse" />
          <div className="h-72 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl animate-pulse" />
          <div className="h-80 rounded-[2rem] border border-white/60 bg-white/70 backdrop-blur-xl animate-pulse" />
        </div>
      </div>
    </div>
  </div>
);

const EmptyState = () => (
  <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_#f0fdf4_0%,_#ffffff_45%,_#f8fafc_100%)] px-4 py-10 sm:px-6 lg:px-8">
    <div className="mx-auto flex min-h-[80vh] max-w-3xl items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative w-full overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 p-8 text-center shadow-[0_30px_100px_rgba(16,24,40,0.12)] backdrop-blur-xl sm:p-12"
      >
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(16,185,129,0.12),rgba(255,255,255,0))]" />
        <div className="relative mx-auto mb-8 flex h-28 w-28 items-center justify-center rounded-full bg-emerald-50">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
            className="absolute inset-4 rounded-full border border-emerald-200"
          />
          <Leaf className="h-12 w-12 text-emerald-600" />
        </div>
        <h1 className="relative text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          Product Not Found
        </h1>
        <p className="relative mt-4 text-base text-slate-600 sm:text-lg">
          The QR link may be outdated, or the product record is not available yet.
        </p>
        <div className="relative mt-8 grid gap-3 sm:grid-cols-3">
          {[
            "Check the QR code",
            "Refresh the trace link",
            "Contact the farmer or brand",
          ].map((item) => (
            <div key={item} className="rounded-2xl border border-emerald-100 bg-emerald-50/70 px-4 py-3 text-sm font-medium text-emerald-800">
              {item}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  </div>
);

const ProductTraceability = () => {
  const { productId, id } = useParams();
  const routeId = productId || id;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openTimeline, setOpenTimeline] = useState(0);

  useEffect(() => {
    if (!routeId) {
      setProduct(null);
      setLoading(false);
      return undefined;
    }

    let active = true;

    setLoading(true);

    api
      .get(`/products/trace/${routeId}`)
      .then((res) => {
        if (active) {
          setProduct(res.data.product);
        }
      })
      .catch((error) => {
        console.error(error);
        if (active) {
          setProduct(null);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, [routeId]);

  const traceData = useMemo(() => {
    if (!product) return null;

    const farmer = getDisplayPerson(product.farmer, "Farmer");
    const transporter = getDisplayPerson(product.shipment?.transporter, "Transporter");
    const shipmentStatus = getShipmentLabel(product.shipment?.status || product.status);
    const timeline = buildTimeline(product);

    return {
      farmer,
      transporter,
      shipmentStatus,
      timeline,
      scanCount: product.scanCount ?? product.qrScanCount ?? 0,
      daysSinceHarvest: product.harvestDate
        ? Math.max(1, Math.floor((Date.now() - new Date(product.harvestDate).getTime()) / (1000 * 60 * 60 * 24)))
        : null,
      distanceTravelled: getDistanceTravelled(product),
      sustainabilityScore: getSustainabilityScore(product),
    };
  }, [product]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (!product || !traceData) {
    return <EmptyState />;
  }

  const productVerified = Boolean(product.organicCertified);
  const qrVerified = Boolean(product.qrCode || product.traceabilityId);
  const currentShipmentStageIndex = Math.max(
    0,
    progressSteps.findIndex((step) => step.toLowerCase() === (product.shipment?.status || "Pending").toLowerCase())
  );
  const displayedTraceabilityId = product.traceabilityId || `TRACE-${product._id}`;
  const displayedStatus = product.shipment?.status || product.status || "Pending";

  return (
    <div className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.14),_rgba(255,255,255,0)_36%),linear-gradient(180deg,#f8fafc_0%,#ffffff_46%,#f0fdf4_100%)] text-slate-900">
      <div className="absolute left-[-8rem] top-8 h-72 w-72 rounded-full bg-emerald-200/40 blur-3xl" />
      <div className="absolute right-[-7rem] top-36 h-80 w-80 rounded-full bg-lime-200/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <motion.section
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/75 p-6 shadow-[0_20px_80px_rgba(16,24,40,0.10)] backdrop-blur-xl sm:p-8 lg:p-10"
        >
          <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800">
                <Sparkles className="h-4 w-4" />
                Premium traceability for organic supply chains
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl lg:text-6xl">
                🌱 Product Traceability
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                Track your food from farm to table with verified QR authentication, shipment visibility, and a complete journey timeline.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <BadgePill active={productVerified} icon={ShieldCheck} label="Organic Verified Badge" />
                <BadgePill active={qrVerified} icon={QrCode} label="QR Authenticated Badge" />
                <BadgePill active={true} icon={Sparkles} label={`Traceability ID: ${displayedTraceabilityId}`} />
              </div>

              <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <HeroMetric label="Product Status" value={displayedStatus} tone={traceData.shipmentStatus.tone} />
                <HeroMetric label="Shipment Stage" value={traceData.shipmentStatus.label} tone={traceData.shipmentStatus.tone} />
                <HeroMetric label="Scan Count" value={`${traceData.scanCount}`} tone="inprogress" />
                <HeroMetric label="Sustainability Score" value={`${traceData.sustainabilityScore}/100`} tone="completed" />
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.55, delay: 0.05 }}
              className="relative overflow-hidden rounded-[2rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 via-white to-lime-50 p-5 shadow-[0_20px_60px_rgba(16,185,129,0.12)]"
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(16,185,129,0.16),transparent_45%)]" />
              <div className="relative space-y-4">
                <div className="flex items-center gap-3 text-sm font-semibold text-emerald-700">
                  <Leaf className="h-4 w-4" />
                  Verified food journey
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <InfoTile icon={CalendarDays} label="Harvest date" value={formatDate(product.harvestDate)} />
                  <InfoTile icon={Clock3} label="Updated" value={formatDateTime(product.updatedAt)} />
                  <InfoTile icon={Package} label="Category" value={product.category || "N/A"} />
                  <InfoTile icon={CircleDollarSign} label="Price" value={`₹${product.price ?? 0}`} />
                </div>
                <div className="rounded-2xl border border-white/70 bg-white/80 p-4 shadow-sm backdrop-blur">
                  <div className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500">Product Status</div>
                  <div className="mt-2 text-2xl font-semibold text-slate-950">{displayedStatus}</div>
                  <div className="mt-1 text-sm text-slate-600">
                    {product.organicCertified ? "Organic certificate active" : "Verification pending"}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="space-y-6">
            <SectionCard title="Product Information" subtitle="Origin, quality, and certification details" icon={Leaf}>
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="relative overflow-hidden rounded-[1.75rem] border border-white/70 bg-slate-100 shadow-inner">
                  <img
                    src={product.image || EMPTY_IMAGE}
                    alt={product.name}
                    className="h-full min-h-[22rem] w-full object-cover"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent p-4 text-white">
                    <div className="text-sm font-medium uppercase tracking-[0.25em] text-emerald-200">Fresh from the farm</div>
                    <div className="mt-1 text-2xl font-semibold">{product.name}</div>
                  </div>
                </div>

                <div className="grid gap-4">
                  <DetailRow label="Product Name" value={product.name || "N/A"} />
                  <DetailRow label="Category" value={product.category || "N/A"} />
                  <DetailRow label="Quantity" value={`${product.quantity ?? 0}`} />
                  <DetailRow label="Price" value={`₹${product.price ?? 0}`} />
                  <DetailRow label="Harvest Date" value={formatDate(product.harvestDate)} />
                  <DetailRow label="Description" value={product.description || "No description available."} wide />
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailRow label="Organic Certification Number" value={product.certificationNumber || "Pending certification"} />
                    <DetailRow label="Traceability ID" value={displayedTraceabilityId} />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Dynamic Timeline" subtitle="Amazon-style supply chain history" icon={Truck}>
              <div className="relative">
                <div className="absolute left-[1.15rem] top-2 bottom-2 w-px bg-gradient-to-b from-emerald-300 via-sky-300 to-slate-300" />
                <div className="space-y-4">
                  {traceData.timeline.map((item, index) => {
                    const tone = getTimelineTone(item.status);
                    const expanded = openTimeline === index;
                    const Icon = item.icon;

                    return (
                      <motion.div
                        key={item.key}
                        initial={{ opacity: 0, y: 18 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, amount: 0.2 }}
                        transition={{ duration: 0.35, delay: index * 0.05 }}
                        className="relative pl-14"
                      >
                        <button
                          type="button"
                          onClick={() => setOpenTimeline(expanded ? -1 : index)}
                          className={`w-full rounded-[1.5rem] border px-5 py-4 text-left shadow-sm backdrop-blur transition-transform duration-300 hover:-translate-y-0.5 ${stageStyles[tone]}`}
                        >
                          <div className="absolute left-0 top-5 flex h-9 w-9 items-center justify-center rounded-full border bg-white shadow-lg">
                            <motion.div
                              animate={tone === "completed" ? { scale: [1, 1.08, 1] } : {}}
                              transition={{ repeat: tone === "completed" ? Infinity : 0, duration: 1.8 }}
                            >
                              <Icon className={`h-4 w-4 ${tone === "pending" ? "text-slate-500" : tone === "delayed" ? "text-rose-600" : tone === "inprogress" ? "text-sky-600" : "text-emerald-600"}`} />
                            </motion.div>
                          </div>

                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <div className="text-base font-semibold text-slate-950">{item.title}</div>
                              <div className="mt-1 text-sm text-slate-600">{item.description}</div>
                            </div>
                            <div className="flex items-center gap-2 text-sm font-semibold">
                              <span>{item.status || "Pending"}</span>
                              {expanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </div>
                          </div>

                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="mt-4 grid gap-3 rounded-2xl border border-white/60 bg-white/85 p-4 text-sm text-slate-600 sm:grid-cols-3">
                                  <InfoTile icon={Clock3} label="Date & time" value={formatDateTime(item.date)} compact />
                                  <InfoTile icon={MapPin} label="Location" value={item.location || "N/A"} compact />
                                  <InfoTile icon={BadgeCheck} label="Status" value={item.status || "Pending"} compact />
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

          <div className="space-y-6">
            <SectionCard title="Farmer Profile" subtitle="Verified producer information" icon={UserRound}>
              <div className="flex items-start gap-4 rounded-[1.5rem] border border-emerald-100 bg-emerald-50/70 p-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-emerald-700 shadow-sm">
                  <UserRound className="h-8 w-8" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xl font-semibold text-slate-950">{traceData.farmer.name}</div>
                  <div className="mt-1 inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Farmer account verified
                  </div>
                </div>
              </div>

              <div className="mt-4 grid gap-3">
                <DetailRow label="Phone Number" value={traceData.farmer.phone} />
                <DetailRow label="Email" value={traceData.farmer.email} />
                <DetailRow label="Address" value={traceData.farmer.address} />
                <DetailRow label="Farm Location" value={product.location || "N/A"} />
              </div>
            </SectionCard>

            <SectionCard title="Shipment Tracking" subtitle="Live logistics progress" icon={Truck}>
              <div className="rounded-[1.5rem] border border-slate-200 bg-slate-50/80 p-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-sm font-medium text-slate-500">Current Status</div>
                    <div className="mt-1 text-2xl font-semibold text-slate-950">{product.shipment?.status || "Pending"}</div>
                  </div>
                  <div className={`rounded-full border px-4 py-2 text-sm font-semibold ${stageStyles[traceData.shipmentStatus.tone]}`}>
                    {traceData.shipmentStatus.label}
                  </div>
                </div>

                <div className="mt-6">
                  <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.22em] text-slate-500">
                    {progressSteps.map((step) => (
                      <span key={step}>{step}</span>
                    ))}
                  </div>
                  <div className="relative mt-3 h-3 overflow-hidden rounded-full bg-slate-200">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${((currentShipmentStageIndex + 1) / progressSteps.length) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-lime-500 to-sky-500"
                    />
                  </div>
                </div>

                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  <InfoTile icon={MapPin} label="Current Location" value={product.shipment?.currentLocation || "Awaiting update"} compact />
                  <InfoTile icon={CalendarDays} label="Estimated Delivery" value={formatDate(product.shipment?.estimatedDelivery)} compact />
                  <InfoTile icon={Truck} label="Transporter" value={traceData.transporter.name} compact />
                  <InfoTile icon={Clock3} label="Progress" value={traceData.shipmentStatus.label} compact />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Organic Verification Certificate" subtitle="Official quality and certification checks" icon={BadgeCheck}>
              <div className="rounded-[1.5rem] border border-emerald-100 bg-gradient-to-br from-emerald-50 to-white p-5">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-800">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  Government Approved
                </div>
                <div className="mt-4 text-sm text-slate-500">Certificate Number</div>
                <div className="mt-1 text-xl font-semibold text-slate-950">{product.certificationNumber || "Pending certification"}</div>
                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  <InfoTile icon={BadgeCheck} label="Verification Status" value={product.organicCertified ? "Certified Organic" : "Verification Pending"} compact />
                  <InfoTile icon={Leaf} label="Trace Type" value="Farm-to-consumer" compact />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="QR Section" subtitle="Consumer verification and scan identity" icon={QrCode}>
              <div className="flex flex-col gap-4 rounded-[1.5rem] border border-slate-200 bg-white p-5">
                <div className="flex items-center justify-between gap-4 rounded-[1.25rem] bg-slate-950 px-4 py-3 text-white">
                  <div className="text-sm font-semibold uppercase tracking-[0.24em] text-emerald-300">Verified Product</div>
                  <BadgeCheck className="h-5 w-5 text-emerald-300" />
                </div>

                <div className="grid gap-4 sm:grid-cols-[0.9fr_1.1fr] sm:items-center">
                  <div className="flex items-center justify-center rounded-[1.5rem] border border-dashed border-emerald-200 bg-emerald-50 p-5">
                    {product.qrCode ? (
                      <img
                        src={product.qrCode}
                        alt="Product QR Code"
                        className="h-56 w-56 rounded-2xl bg-white object-contain p-3 shadow-sm"
                      />
                    ) : (
                      <div className="flex h-56 w-56 items-center justify-center rounded-2xl bg-white text-center text-sm text-slate-500">
                        QR code not generated yet
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                    <DetailRow label="Traceability ID" value={displayedTraceabilityId} />
                    <DetailRow label="Scan Count" value={`${traceData.scanCount}`} />
                    <DetailRow label="QR Verification" value={qrVerified ? "Authenticated" : "Pending"} />
                    <DetailRow label="Reference Status" value={product.organicCertified ? "Organic Verified" : "Awaiting review"} />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Statistics" subtitle="At-a-glance journey metrics" icon={Sparkles}>
              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4 lg:grid-cols-2 xl:lg:grid-cols-4">
                <StatCard label="Days Since Harvest" value={traceData.daysSinceHarvest ?? "N/A"} helper="days" />
                <StatCard label="Distance Travelled" value={traceData.distanceTravelled} helper="route" />
                <StatCard label="Shipment Status" value={traceData.shipmentStatus.label} helper="logistics" />
                <StatCard label="Sustainability Score" value={`${traceData.sustainabilityScore}/100`} helper="impact" />
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
};

function SectionCard({ title, subtitle, icon: Icon, children }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45 }}
      className="overflow-hidden rounded-[2rem] border border-white/70 bg-white/80 shadow-[0_18px_70px_rgba(16,24,40,0.08)] backdrop-blur-xl"
    >
      <div className="flex items-start gap-4 border-b border-slate-100 px-5 py-5 sm:px-6">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-700">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-xl font-semibold tracking-tight text-slate-950 sm:text-2xl">{title}</h2>
          <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
        </div>
      </div>
      <div className="p-5 sm:p-6">{children}</div>
    </motion.section>
  );
}

function BadgePill({ active, icon: Icon, label }) {
  return (
    <div className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold ${active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-slate-200 bg-slate-50 text-slate-500"}`}>
      <Icon className="h-4 w-4" />
      {label}
    </div>
  );
}

function HeroMetric({ label, value, tone }) {
  const toneClass =
    tone === "completed"
      ? "from-emerald-50 to-white text-emerald-800"
      : tone === "inprogress"
      ? "from-sky-50 to-white text-sky-800"
      : tone === "delayed"
      ? "from-rose-50 to-white text-rose-800"
      : "from-slate-50 to-white text-slate-700";

  return (
    <div className={`rounded-[1.4rem] border border-white/80 bg-gradient-to-br px-4 py-4 shadow-sm ${toneClass}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">{label}</div>
      <div className="mt-2 text-lg font-semibold text-slate-950">{value}</div>
    </div>
  );
}

function InfoTile({ icon: Icon, label, value, compact = false }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm ${compact ? "" : ""}`}>
      <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        <Icon className="h-3.5 w-3.5" />
        {label}
      </div>
      <div className={`mt-1 font-medium text-slate-950 ${compact ? "text-sm" : "text-base"}`}>{value}</div>
    </div>
  );
}

function DetailRow({ label, value, wide = false }) {
  return (
    <div className={`rounded-2xl border border-slate-200 bg-slate-50/80 px-4 py-4 ${wide ? "sm:col-span-2" : ""}`}>
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-2 text-sm font-medium leading-6 text-slate-950">{value}</div>
    </div>
  );
}

function StatCard({ label, value, helper }) {
  return (
    <div className="rounded-[1.5rem] border border-slate-200 bg-gradient-to-b from-white to-emerald-50/50 p-4 shadow-sm">
      <div className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{label}</div>
      <div className="mt-3 text-2xl font-semibold text-slate-950">{value}</div>
      <div className="mt-1 text-sm text-slate-500">{helper}</div>
    </div>
  );
}

export default ProductTraceability;