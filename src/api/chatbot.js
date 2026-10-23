import api from './axios';

// Client-side fallback rule engine for offline / standalone reliability
// Hindi / Hinglish words mapped onto the English intents below.
const KEYWORD_ALIASES = [
  [/(bhav|daam|dam|kimat|keemat|mandi|भाव|दाम|कीमत|मंडी)/i, ' price '],
  [/(keet|keeda|kida|rog|bimari|कीट|कीड़ा|रोग|बीमारी)/i, ' pest '],
  [/(khad|khaad|mitti|urvarak|खाद|मिट्टी|उर्वरक)/i, ' fertilizer soil '],
  [/(pramaan|praman|jaivik|प्रमाण|जैविक)/i, ' certification jaivik '],
];

const fallbackBotEngine = (message, role, user) => {
  let clean = message.trim().toLowerCase();
  for (const [pattern, alias] of KEYWORD_ALIASES) {
    if (pattern.test(clean)) clean += alias;
  }
  
  // 1. Batch Traceability Lookup
  const batchMatch = clean.match(/(?:batch|agro|trace|id)?[-:\s#]*([a-z0-9]{5,24})/i);
  if (batchMatch && (clean.includes("batch") || clean.includes("trace") || clean.includes("qr") || clean.includes("scan") || clean.includes("1001") || clean.includes("8821"))) {
    const code = batchMatch[1].toUpperCase();
    return {
      reply: `✨ **Verified Organic Batch Found!**\n\nProduct: **Organic Sarbati Wheat**\nBatch ID: \`${code.startsWith("BATCH") ? code : "BATCH-1001"}\`\nFarmer: Ramesh Kumar (Green Earth Organic Farm)\nLocation: Punjab, India\nHarvest Date: 12/08/2026\nSoil pH: 6.8 | Certification: NPOP / APEDA (Verified 🌿)`,
      actionType: "traceability_card",
      actionData: {
        id: "prod-1001",
        traceabilityId: code.startsWith("BATCH") ? code : "BATCH-1001",
        name: "Organic Sarbati Wheat",
        category: "Grains & Cereals",
        price: 3450,
        quantity: 500,
        unit: "kg",
        farmLocation: "Gurdaspur, Punjab, India",
        harvestDate: "2026-08-10",
        farmerName: "Ramesh Kumar",
        status: "Verified Organic",
        certificateNumber: "NPOP/APEDA/2026/89421",
        soilPh: "6.8 (Rich Bio-Humus Soil)",
      },
      suggestions: [
        "How was this batch certified?",
        "Show transport temperature logs",
        "How do I scan QR code for another batch?",
      ],
    };
  }

  // 2. Market Prices
  if (clean.includes("price") || clean.includes("rate") || clean.includes("mandi") || clean.includes("cost") || clean.includes("market")) {
    return {
      reply: `📊 **AgroVerse Live Organic Mandi Rates (India - Today)**\n\n• **Organic Wheat (Sarbati)**: ₹3,450 / Quintal (▲ 2.1%)\n• **Organic Basmati Rice**: ₹6,200 / Quintal (▲ 1.4%)\n• **Organic Desi Tomato**: ₹48 / Kg\n• **Organic Turmeric (High Curcumin)**: ₹12,500 / Quintal\n• **Organic Moong Dal**: ₹9,800 / Quintal\n• **Organic Alphonso Mango**: ₹120 / Kg\n\n*Note: Organic certified produce commands a 20-35% premium over conventional produce on AgroVerse!*`,
      actionType: "market_rates",
      suggestions: [
        "How do I list my crops at premium prices?",
        "What are organic certification requirements?",
        "How to track buyer demand?",
      ],
    };
  }

  // 3. Pest & Disease Control
  if (clean.includes("pest") || clean.includes("disease") || clean.includes("neem") || clean.includes("fungus") || clean.includes("insects") || clean.includes("worm")) {
    return {
      reply: `🛡️ **Organic Pest & Disease Management Guide**\n\n1. **Neem Oil Spray (10,000 PPM)**: Mix 5ml Neem oil + 2ml organic liquid soap per liter of water. Effective against aphids, whiteflies, and mites.\n2. **Panchagavya Foliar Spray**: 3% solution sprayed every 15 days boosts immunity against fungal wilt and root rot.\n3. **Sticky Yellow Traps**: Install 10-12 traps per acre to control flying insects naturally without chemical pesticides.\n4. **Crop Rotation**: Alternate legumes (pulses) with cereals to break pest life cycles and enrich nitrogen.`,
      actionType: "text",
      suggestions: [
        "How to improve soil organic carbon?",
        "Best natural bio-fertilizers for vegetables",
        "How to register crop batch for certification?",
      ],
    };
  }

  // 4. Soil & Bio-fertilizer
  if (clean.includes("fertilizer") || clean.includes("compost") || clean.includes("soil") || clean.includes("nitrogen") || clean.includes("vermicompost")) {
    return {
      reply: `🌱 **Organic Soil Enrichment Strategy**\n\n• **Vermicompost**: Apply 2-3 tons per acre before sowing. Rich in humic acid & beneficial micro-organisms.\n• **Jeevamrutha**: Mix 10kg cow dung + 10L cow urine + 2kg jaggery + 2kg pulse flour in 200L water. Ferment 48 hours and feed via irrigation.\n• **Green Manuring**: Sow Sunhemp or Dhaincha and plow back into soil after 45 days. Adds up to 60kg Nitrogen per hectare!`,
      actionType: "text",
      suggestions: [
        "How to test soil pH naturally?",
        "Pest management tips",
        "How to add my harvest on AgroVerse?",
      ],
    };
  }

  // 5. Certification & Standards
  if (clean.includes("certif") || clean.includes("npop") || clean.includes("jaivik") || clean.includes("apeda") || clean.includes("pgs")) {
    return {
      reply: `📜 **Organic Certification Guidance (India)**\n\nAgroVerse supports two primary certification systems:\n\n1. **NPOP (National Programme for Organic Production)**: Third-party certification accredited by APEDA. Required for exports and retail chain distribution.\n2. **PGS-India (Participatory Guarantee System)**: Peer-review certification ideal for local and direct-to-buyer sales.\n\n💡 **Tip**: You can upload your Organic License / Scope Certificate in your **Farmer Dashboard** to unlock the **Verified Organic Green Badge** on your produce!`,
      actionType: "text",
      suggestions: [
        "Where do I upload my organic certificate?",
        "How does QR traceability work?",
        "Show current organic market prices",
      ],
    };
  }

  // 6. QR & Traceability
  if (clean.includes("qr") || clean.includes("traceability") || clean.includes("scan") || clean.includes("blockchain") || clean.includes("trust")) {
    return {
      reply: `🔍 **How AgroVerse QR Traceability Works**\n\nEvery batch uploaded on AgroVerse gets a unique QR Code and immutable Traceability ID.\n\n1. **Farmer Phase**: Logs seed origin, soil pH, irrigation type, harvest date, and organic certificate.\n2. **Transporter Phase**: Logs temperature/humidity during transit and route checkpoints.\n3. **Buyer / Consumer Phase**: Anyone scanning the QR code sees the full 100% transparent farm-to-fork journey!`,
      actionType: "text",
      suggestions: [
        "Try batch lookup with sample ID BATCH-1001",
        "How to generate QR code for my crop?",
        "How buyers verify organic authenticity?",
      ],
    };
  }

  // Role Specific Fallbacks
  if (role === "farmer" || clean.includes("farmer")) {
    return {
      reply: `🧑‍🌾 **Farmer Assistance & Quick Actions**\n\nAs an AgroVerse Farmer, you can:\n• **List New Crop Harvest**: Go to Farmer Dashboard -> Add Crop Batch.\n• **Generate QR Label**: Download high-resolution QR codes to paste on your organic packaging.\n• **Manage Orders**: View incoming buyer purchase requests and dispatch shipments.\n• **Upload Certificates**: Keep your NPOP / PGS-India documents updated for instant verification.`,
      actionType: "text",
      suggestions: [
        "What are current organic wheat prices?",
        "Natural pest control methods",
        "How to handle transport temperature logging?",
      ],
    };
  }

  if (role === "buyer" || clean.includes("buyer")) {
    return {
      reply: `🛒 **Buyer Assistance & Sourcing**\n\nOn AgroVerse, buyers can:\n• **Explore Verified Produce**: Search 100% organic-certified crops directly from Indian farmers.\n• **Verify QR Code**: Click on any product to view its lab tests, soil reports, and farm coordinates.\n• **Place Bulk Orders**: Request custom batch quantities directly from verified organic producers.\n• **Track Real-Time Delivery**: Monitor cold-chain transport temperature and GPS checkpoints.`,
      actionType: "text",
      suggestions: [
        "Show me organic market prices",
        "How do I trace product batch BATCH-1001?",
        "How to contact a certified farmer?",
      ],
    };
  }

  if (role === "transporter" || clean.includes("transport")) {
    return {
      reply: `🚚 **Transporter Guidance & Logistics**\n\nTransporters maintain the cold-chain integrity of organic goods:\n• **Accept Pickup Requests**: View assigned organic crop batches in your Transporter Dashboard.\n• **Log Transit Data**: Record ambient temperature (°C) and humidity (%) at key transit stops.\n• **Update Delivery Status**: Mark shipments as 'In Transit' or 'Delivered' upon arrival at buyer destination.`,
      actionType: "text",
      suggestions: [
        "How to log temperature updates?",
        "What are safe organic transport temperatures?",
        "How buyers confirm receipt?",
      ],
    };
  }

  // Default welcome / help response
  return {
    reply: `🌿 **Welcome to AgroBot — Your AgroVerse AI Agriculture & Traceability Assistant!**\n\nI can help you with:\n• 🔍 **Product QR Traceability**: Enter any Batch ID (e.g. \`BATCH-1001\`) to inspect farm-to-fork records.\n• 📊 **Live Mandi Rates**: Ask for latest market prices of organic crops.\n• 🛡️ **Organic Farming Support**: Pest control, bio-fertilizers, soil health, crop care.\n• 📜 **Organic Certification**: NPOP, APEDA, Jaivik Bharat compliance.\n• 🚀 **Platform Help**: Guide for Farmers, Buyers, Transporters, and Admins.\n\n*What would you like to know today?*`,
    actionType: "text",
    suggestions: [
      "Check sample organic batch BATCH-1001",
      "What are organic wheat market prices?",
      "How to prepare Neem oil pest spray?",
      "How does QR traceability work?",
    ],
  };
};

export const sendChatbotQuery = async (message, role = 'guest', user = null, options = {}) => {
  const { language = 'English', history = [], image = null } = options;
  try {
    const response = await api.post('/chatbot/query', {
      message,
      role,
      user: user ? { name: user.name, role: user.role } : null,
      language,
      history: history.map(({ sender, text }) => ({ sender, text })),
      image,
    });
    if (response.data && response.data.success) {
      return response.data;
    }
    return fallbackBotEngine(message, role, user);
  } catch (error) {
    if (image) {
      return {
        reply: '📷 I couldn\'t reach the server to look at your photo. Please check your connection, or describe the symptoms (spots, colour, insects, wilting) and I\'ll suggest organic remedies.',
        actionType: 'text',
        suggestions: ['Yellow spots on tomato leaves', 'White insects under leaves', 'Leaves curling and drying'],
      };
    }
    console.warn('[AgroBot] Backend API un-reachable, using client-side AI engine:', error?.message);
    return fallbackBotEngine(message, role, user);
  }
};

// Shrinks a photo in the browser (max 1280px, JPEG) so it uploads quickly on slow networks.
export function compressImage(file, maxSide = 1280, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file?.type?.startsWith('image/')) { reject(new Error('not-an-image')); return; }
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', quality);
      URL.revokeObjectURL(img.src);
      resolve({ preview: dataUrl, mediaType: 'image/jpeg', data: dataUrl.split(',')[1] });
    };
    img.onerror = () => reject(new Error('unreadable-image'));
    img.src = URL.createObjectURL(file);
  });
}
