const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getUsers, createUserByAdmin, deleteUserByAdmin, updateProfile } = require("../controllers/authController");

// Get Logged-in User Profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

router.put("/profile", protect, updateProfile);

// Admin-only user management
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.post("/", protect, authorizeRoles("admin"), createUserByAdmin);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUserByAdmin);

module.exports = router;