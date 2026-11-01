const express = require("express");
const router = express.Router();

const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { getUsers, createUserByAdmin, deleteUserByAdmin, updateProfile, updateProfilePhoto } = require("../controllers/authController");
const multer = require("multer");

const profilePhotoUpload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

const uploadProfilePhoto = (req, res, next) => {
  profilePhotoUpload.single("photo")(req, res, (error) => {
    if (error) {
      const tooLarge = error.code === "LIMIT_FILE_SIZE";
      return res.status(tooLarge ? 413 : 400).json({
        success: false,
        message: tooLarge ? "Profile photo must be 5 MB or smaller" : error.message,
      });
    }
    next();
  });
};

// Get Logged-in User Profile
router.get("/profile", protect, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Profile fetched successfully",
    user: req.user,
  });
});

router.put("/profile", protect, updateProfile);
router.post("/profile/photo", protect, uploadProfilePhoto, updateProfilePhoto);

// Admin-only user management
router.get("/", protect, authorizeRoles("admin"), getUsers);
router.post("/", protect, authorizeRoles("admin"), createUserByAdmin);
router.delete("/:id", protect, authorizeRoles("admin"), deleteUserByAdmin);

module.exports = router;