const express = require("express");
const {
  getMyNotifications,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// Get all notifications for current user
router.get("/", protect, getMyNotifications);

// Get unread notifications count and list (must come before /:id routes)
router.get("/unread", protect, getUnreadNotifications);

// Mark all notifications as read (must come before /:id routes)
router.put("/read-all", protect, markAllNotificationsAsRead);

// Mark single notification as read
router.put("/:id/read", protect, markNotificationAsRead);

// Delete notification
router.delete("/:id", protect, deleteNotification);

module.exports = router;
