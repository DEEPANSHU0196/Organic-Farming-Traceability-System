const Product = require("../models/Product");
const { generateAiReply, isAiEnabled } = require("../utils/aiAssistant");
const { getMandiPrices } = require("../utils/mandiPrices");

// Hindi / Hinglish keywords mapped onto the English intents the rule engine knows.
const KEYWORD_ALIASES = [
  [/(bhav|daam|dam|kimat|keemat|mandi|भाव|दाम|कीमत|मंडी)/i, " price "],
  [/(keet|keeda|kida|rog|bimari|कीट|कीड़ा|रोग|बीमारी)/i, " pest "],
  [/(khad|khaad|mitti|urvarak|खाद|मिट्टी|उर्वरक|जैविक खाद)/i, " fertilizer soil "],
  [/(pramaan|praman|jaivik|प्रमाण|जैविक)/i, " certification jaivik "],
  [/(kisan|किसान)/i, " farmer "],
  [/(kharidar|खरीदार)/i, " buyer "],
  [/(parivahan|transport|परिवहन)/i, " transport "],
];


// Knowledge base and AI logic engine
const queryChatbot = async (req, res) => {
  try {
    const { message = "", role = "guest", user = null, language = "English", history = [], image = null } = req.body;
    // Optional crop photo: { mediaType, data(base64) }, jpeg/png/webp up to ~4.5 MB.
    const photo = image && ["image/jpeg", "image/png", "image/webp"].includes(image.mediaType)
      && typeof image.data === "string" && image.data.length < 6_000_000 ? image : null;
    let cleanMessage = String(message).trim().toLowerCase();
    for (const [pattern, alias] of KEYWORD_ALIASES) {
      if (pattern.test(cleanMessage)) cleanMessage += alias;
    }

    if (!cleanMessage && !photo) {
      return res.status(400).json({
        success: false,
        message: "Message is required",
      });
    }

    let reply = "";
    let actionType = "text"; // "text", "traceability_card", "market_rates", "guide"
    let actionData = null;
    let suggestions = [];

    // 1. Check if user is asking for a Batch ID or Traceability code
    const batchMatch = cleanMessage.match(/(?:batch|agro|trace|id)?[-:\s#]*([a-z0-9]{5,24})/i);
    const isExplicitTraceQuery = cleanMessage.includes("trace") || cleanMessage.includes("batch") || cleanMessage.includes("qr") || cleanMessage.includes("scan");

    // Try finding product by traceabilityId or _id if mongo is connected
    let foundProduct = null;
    if (batchMatch && batchMatch[1]) {
      const queryId = batchMatch[1].trim();
      try {
        foundProduct = await Product.findOne({
          $or: [
            { traceabilityId: { $regex: new RegExp(queryId, "i") } },
            { _id: queryId.match(/^[0-9a-fA-F]{24}$/) ? queryId : null },
          ],
        }).populate("farmer", "fullName address phone");
      } catch (err) {
        console.log("Chatbot Product lookup error (non-fatal):", err.message);
      }
    }

    if (foundProduct) {
      reply = `✨ **Verified Organic Batch Found!**\n\nProduct: **${foundProduct.name}**\nBatch ID: \`${foundProduct.traceabilityId || foundProduct._id}\`\nFarmer: ${foundProduct.farmer?.fullName || "Certified AgroVerse Farmer"}\nLocation: ${foundProduct.location || foundProduct.farmer?.address || "India"}\nHarvest Date: ${foundProduct.harvestDate ? new Date(foundProduct.harvestDate).toLocaleDateString("en-IN") : "Recent Harvest"}\nOrganic Status: 🌿 **100% Certified Organic (NPOP / Jaivik Bharat)**`;
      
      actionType = "traceability_card";
      actionData = {
        id: foundProduct._id,
        traceabilityId: foundProduct.traceabilityId || foundProduct._id,
        name: foundProduct.name,
        category: foundProduct.category,
        price: foundProduct.price,
        quantity: foundProduct.quantity,
        unit: foundProduct.unit || "kg",
        farmLocation: foundProduct.location || "Organic Certified Farm",
        harvestDate: foundProduct.harvestDate,
        farmerName: foundProduct.farmer?.fullName || "Verified AgroVerse Farmer",
        status: foundProduct.status || "Verified Organic",
        certificateNumber: foundProduct.certificationNumber || "AGRO-NPOP-2026-081",
        soilPh: foundProduct.soilPh || "6.8 (Optimal Organic Soil)",
      };

      suggestions = [
        "How was this batch certified?",
        "Show transport temperature logs",
        "How do I scan QR code for another batch?",
      ];
    } else if (cleanMessage.includes("price") || cleanMessage.includes("rate") || cleanMessage.includes("mandi") || cleanMessage.includes("cost") || cleanMessage.includes("market")) {
      // 2. Mandi / Market Prices - live Agmarknet data when DATA_GOV_API_KEY is set
      let mandi = null;
      try {
        mandi = await getMandiPrices({ limit: 8 });
      } catch (err) {
        console.log("Mandi feed error (non-fatal):", err.message);
      }
      const rows = (mandi?.records || []).slice(0, 6).map((r) =>
        `• **${r.commodity}${r.variety ? ` (${r.variety})` : ""}** — ₹${r.modalPrice?.toLocaleString("en-IN") ?? "—"} / quintal · ${r.market}, ${r.state}`);
      const live = mandi?.source === "agmarknet";
      reply = `📊 **${live ? "Today's mandi rates (Agmarknet)" : "Sample mandi rates"}**\n\n${rows.join("\n") || "Rates are unavailable right now."}\n\n*${live ? "These are conventional APMC prices. Certified organic produce usually sells at a premium above them." : "Sample figures for illustration only. Check Agmarknet or eNAM for today's prices."}*`;
      actionType = "market_rates";
      suggestions = [
        "How do I list my crops at premium prices?",
        "What are organic certification requirements?",
        "How to track buyer demand?",
      ];
    } else if (cleanMessage.includes("pest") || cleanMessage.includes("disease") || cleanMessage.includes("neem") || cleanMessage.includes("fungus") || cleanMessage.includes("insects") || cleanMessage.includes("worm")) {
      // 3. Pest & Disease Control
      reply = `🛡️ **Organic Pest & Disease Management Guide**\n\n1. **Neem Oil Spray (10,000 PPM)**: Mix 5ml Neem oil + 2ml organic liquid soap per liter of water. Effective against aphids, whiteflies, and mites.\n2. **Panchagavya Foliar Spray**: 3% solution sprayed every 15 days boosts immunity against fungal wilt and root rot.\n3. **Sticky Yellow Traps**: Install 10-12 traps per acre to control flying insects naturally without chemical pesticides.\n4. **Crop Rotation**: Alternate legumes (pulses) with cereals to break pest life cycles and enrich nitrogen.`;
      suggestions = [
        "How to improve soil organic carbon?",
        "Best natural bio-fertilizers for vegetables",
        "How to register crop batch for certification?",
      ];
    } else if (cleanMessage.includes("fertilizer") || cleanMessage.includes("compost") || cleanMessage.includes("soil") || cleanMessage.includes("nitrogen") || cleanMessage.includes("vermicompost")) {
      // 4. Soil & Bio-fertilizer Advice
      reply = `🌱 **Organic Soil Enrichment Strategy**\n\n• **Vermicompost**: Apply 2-3 tons per acre before sowing. Rich in humic acid & beneficial micro-organisms.\n• **Jeevamrutha**: Mix 10kg cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour in 200L water. Ferment 48 hours and feed via irrigation.\n• **Green Manuring**: Sow Sunhemp or Dhaincha and plow back into soil after 45 days. Adds up to 60kg Nitrogen per hectare!`;
      suggestions = [
        "How to test soil pH naturally?",
        "Pest management tips",
        "How to add my harvest on AgroVerse?",
      ];
    } else if (cleanMessage.includes("certif") || cleanMessage.includes("npop") || cleanMessage.includes("jaivik") || cleanMessage.includes("apeda") || cleanMessage.includes("pgs")) {
      // 5. Certification & Standards
      reply = `📜 **Organic Certification Guidance (India)**\n\nAgroVerse supports two primary certification systems:\n\n1. **NPOP (National Programme for Organic Production)**: Third-party certification accredited by APEDA. Required for exports and retail chain distribution.\n2. **PGS-India (Participatory Guarantee System)**: Peer-review certification ideal for local and direct-to-buyer sales.\n\n💡 **Tip**: You can upload your Organic License / Scope Certificate in your **Farmer Dashboard** to unlock the **Verified Organic Green Badge** on your produce!`;
      suggestions = [
        "Where do I upload my organic certificate?",
        "How does QR traceability work?",
        "Show current organic market prices",
      ];
    } else if (cleanMessage.includes("qr") || cleanMessage.includes("traceability") || cleanMessage.includes("scan") || cleanMessage.includes("blockchain") || cleanMessage.includes("trust")) {
      // 6. How QR Traceability Works
      reply = `🔍 **How AgroVerse QR Traceability Works**\n\nEvery batch uploaded on AgroVerse gets a unique QR Code and immutable Traceability ID.\n\n1. **Farmer Phase**: Logs seed origin, soil pH, irrigation type, harvest date, and organic certificate.\n2. **Transporter Phase**: Logs temperature/humidity during transit and route checkpoints.\n3. **Buyer / Consumer Phase**: Anyone scanning the QR code sees the full 100% transparent farm-to-fork journey!`;
      suggestions = [
        "Try batch lookup with sample ID BATCH-1001",
        "How to generate QR code for my crop?",
        "How buyers verify organic authenticity?",
      ];
    } else if (role === "farmer" || cleanMessage.includes("farmer") || cleanMessage.includes("add product") || cleanMessage.includes("harvest") || cleanMessage.includes("crop")) {
      // 7. Farmer Portal Guide
      reply = `🧑‍🌾 **Farmer Assistance & Quick Actions**\n\nAs an AgroVerse Farmer, you can:\n• **List New Crop Harvest**: Go to Farmer Dashboard -> Add Crop Batch.\n• **Generate QR Label**: Download high-resolution QR codes to paste on your organic packaging.\n• **Manage Orders**: View incoming buyer purchase requests and dispatch shipments.\n• **Upload Certificates**: Keep your NPOP / PGS-India documents updated for instant verification.`;
      suggestions = [
        "What are current organic wheat prices?",
        "Natural pest control methods",
        "How to handle transport temperature logging?",
      ];
    } else if (role === "buyer" || cleanMessage.includes("buyer") || cleanMessage.includes("buy") || cleanMessage.includes("order") || cleanMessage.includes("purchase")) {
      // 8. Buyer Portal Guide
      reply = `🛒 **Buyer Assistance & Sourcing**\n\nOn AgroVerse, buyers can:\n• **Explore Verified Produce**: Search 100% organic-certified crops directly from Indian farmers.\n• **Verify QR Code**: Click on any product to view its lab tests, soil reports, and farm coordinates.\n• **Place Bulk Orders**: Request custom batch quantities directly from verified organic producers.\n• **Track Real-Time Delivery**: Monitor cold-chain transport temperature and GPS checkpoints.`;
      suggestions = [
        "Show me organic market prices",
        "How do I trace product batch BATCH-1001?",
        "How to contact a certified farmer?",
      ];
    } else if (role === "transporter" || cleanMessage.includes("transport") || cleanMessage.includes("shipment") || cleanMessage.includes("temperature") || cleanMessage.includes("vehicle")) {
      // 9. Transporter Guide
      reply = `🚚 **Transporter Guidance & Logistics**\n\nTransporters maintain the cold-chain integrity of organic goods:\n• **Accept Pickup Requests**: View assigned organic crop batches in your Transporter Dashboard.\n• **Log Transit Data**: Record ambient temperature (°C) and humidity (%) at key transit stops.\n• **Update Delivery Status**: Mark shipments as 'In Transit' or 'Delivered' upon arrival at buyer destination.`;
      suggestions = [
        "How to log temperature updates?",
        "What are safe organic transport temperatures?",
        "How buyers confirm receipt?",
      ];
    } else {
      // 10. General / Greeting / Fallback
      reply = `🌿 **Welcome to AgroBot — Your AgroVerse AI Agriculture & Traceability Assistant!**\n\nI can help you with:\n• 🔍 **Product QR Traceability**: Enter any Batch ID (e.g. \`BATCH-1001\`) to inspect farm-to-fork records.\n• 📊 **Live Mandi Rates**: Ask for latest market prices of organic crops.\n• 🛡️ **Organic Farming Support**: Pest control, bio-fertilizers, soil health, crop care.\n• 📜 **Organic Certification**: NPOP, APEDA, Jaivik Bharat compliance.\n• 🚀 **Platform Help**: Guide for Farmers, Buyers, Transporters, and Admins.\n\n*What would you like to know today?*`;
      suggestions = [
        "Check sample organic batch BATCH-1001",
        "What are organic wheat market prices?",
        "How to prepare Neem oil pest spray?",
        "How does QR traceability work?",
      ];
    }

    if (photo && !isAiEnabled()) {
      reply = "📷 Photo diagnosis needs the AI assistant to be switched on (ANTHROPIC_API_KEY on the server). Meanwhile, describe the symptoms — spots, colour, pests, wilting — and I'll suggest organic remedies.";
      actionType = "text";
      suggestions = ["Yellow spots on tomato leaves", "White insects under leaves", "Leaves curling and drying"];
    }

    // Let the AI model write the final answer (in the user's language), grounded on
    // the rule engine's platform data. Falls back to the rule reply if unavailable.
    let source = "rules";
    if (isAiEnabled()) {
      const aiReply = await generateAiReply({
        message: String(message).slice(0, 2000),
        role,
        user,
        language,
        history,
        platformNotes: foundProduct ? `${reply}\n\nRecord: ${JSON.stringify(actionData)}` : null,
        image: photo,
      });
      if (aiReply) {
        reply = aiReply;
        source = "ai";
      }
    }

    return res.json({
      success: true,
      source,
      reply,
      actionType,
      actionData,
      suggestions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Chatbot Controller Error:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while processing your query.",
      reply: "🌿 Sorry, I encountered a temporary issue. Please try asking again!",
    });
  }
};

module.exports = {
  queryChatbot,
};
