const mongoose = require("mongoose");
const User = require("../models/User");
const Product = require("../models/Product");
const Shipment = require("../models/Shipment");
const Review = require("../models/Review");
const Notification = require("../models/Notification");
const ContactMessage = require("../models/ContactMessage");
const { getMandiPrices } = require("../utils/mandiPrices");

const APPROVED = { $in: ["Approved", "approved"] };

// GET /api/public/stats - real platform counts for the landing page
const getPlatformStats = async (req, res) => {
  try {
    const [farmers, buyers, approvedProducts, totalProducts, deliveries] = await Promise.all([
      User.countDocuments({ role: "farmer" }),
      User.countDocuments({ role: { $in: ["buyer", "consumer"] } }),
      Product.countDocuments({ status: APPROVED }),
      Product.countDocuments({}),
      Shipment.countDocuments({ status: "Delivered" }),
    ]);
    res.json({
      success: true,
      stats: {
        farmers,
        buyers,
        approvedProducts,
        verifiedShare: totalProducts ? Math.round((approvedProducts / totalProducts) * 100) : 0,
        deliveries,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load platform stats" });
  }
};

// Very small per-IP limiter for the contact form (5 messages / 15 min).
const contactHits = new Map();
const CONTACT_WINDOW_MS = 15 * 60 * 1000;
const CONTACT_MAX = 5;
const isRateLimited = (ip) => {
  const now = Date.now();
  const recent = (contactHits.get(ip) || []).filter((t) => now - t < CONTACT_WINDOW_MS);
  recent.push(now);
  contactHits.set(ip, recent);
  return recent.length > CONTACT_MAX;
};

// POST /api/public/contact
const submitContactMessage = async (req, res) => {
  try {
    if (isRateLimited(req.ip)) {
      return res.status(429).json({ success: false, message: "Too many messages. Please try again in a few minutes." });
    }
    const { name = "", email = "", topic = "General", message = "", website = "" } = req.body || {};
    // `website` is a hidden honeypot field; humans leave it empty.
    if (website) return res.json({ success: true });
    if (!name.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !message.trim()) {
      return res.status(400).json({ success: false, message: "Please provide your name, a valid email and a message." });
    }

    const saved = await ContactMessage.create({ name, email, topic, message });

    const admins = await User.find({ role: "admin" }).select("_id").lean();
    if (admins.length) {
      await Notification.insertMany(admins.map((admin) => ({
        recipient: admin._id,
        type: "contact_message",
        title: `New message: ${topic}`,
        message: `${name} (${email}) wrote: ${message.slice(0, 140)}${message.length > 140 ? "…" : ""}`,
      })));
    }

    res.status(201).json({ success: true, id: saved._id });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not send your message right now." });
  }
};

// GET /api/public/mandi?commodity=Wheat&state=Punjab
const getMandi = async (req, res) => {
  try {
    const { commodity, state, limit } = req.query;
    const data = await getMandiPrices({ commodity, state, limit });
    res.json({ success: true, ...data });
  } catch (error) {
    res.status(502).json({ success: false, message: "Mandi price feed is unavailable right now." });
  }
};

// GET /api/public/farmers/:id - public farmer profile (no contact details)
const getFarmerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.isValidObjectId(id)) return res.status(404).json({ success: false, message: "Farmer not found" });

    const farmer = await User.findOne({ _id: id, role: "farmer" }).select("fullName address createdAt").lean();
    if (!farmer) return res.status(404).json({ success: false, message: "Farmer not found" });

    const products = await Product.find({ farmer: id, status: APPROVED })
      .select("name category price quantity unit image location harvestDate traceabilityId certificationNumber certificationVerified organicCertified createdAt")
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const reviews = await Review.find({ product: { $in: products.map((p) => p._id) } })
      .select("buyerName rating comment createdAt product")
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();
    const ratingAvg = reviews.length ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length : null;

    res.json({
      success: true,
      farmer: {
        id: farmer._id,
        name: farmer.fullName,
        location: farmer.address || products[0]?.location || "",
        memberSince: farmer.createdAt,
        certified: products.some((p) => p.certificationVerified === true),
        certificationSubmitted: products.some((p) => Boolean(p.certificationNumber)),
      },
      products,
      reviews,
      rating: { average: ratingAvg ? Number(ratingAvg.toFixed(1)) : null, count: reviews.length },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Could not load this farmer profile" });
  }
};

module.exports = { getPlatformStats, submitContactMessage, getMandi, getFarmerProfile };
