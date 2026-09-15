const express = require("express");
const router = express.Router();
const { queryChatbot } = require("../controllers/chatbotController");

// POST /api/chatbot/query
router.post("/query", queryChatbot);

module.exports = router;
