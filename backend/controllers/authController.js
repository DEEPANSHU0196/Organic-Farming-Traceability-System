const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { isPortalAllowedForRole } = require("../utils/portalAccess");

const DEFAULT_ADMIN_PASSWORD = "Admin1234";
const PASSWORD_MIN_LENGTH = 6;
const DEFAULT_ADMIN_ACCOUNTS = [
  {
    fullName: "Yana Saroha",
    email: "yana.saroha05@gmail.com",
    role: "admin",
  },
  {
    fullName: "Deepanshu Yadav",
    email: "deepanshu.ya2004@gmail.com",
    role: "admin",
  },
];

const validatePassword = (password) => {
  return typeof password === "string" && password.trim().length >= PASSWORD_MIN_LENGTH;
};

const normalizeRole = (role) => {
  if (role === "farmer") return "farmer";
  if (role === "transporter") return "transporter";
  if (role === "admin") return "admin";
  return "buyer";
};

const allowedPublicRoles = ["farmer", "buyer", "transporter"];

const seedDefaultAdminAccounts = async () => {
  try {
    for (const admin of DEFAULT_ADMIN_ACCOUNTS) {
      const existingAdmin = await User.findOne({ email: admin.email });
      const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 10);

      if (existingAdmin) {
        await User.findByIdAndUpdate(existingAdmin._id, {
          fullName: admin.fullName,
          role: "admin",
          password: hashedPassword,
        });
      } else {
        await User.create({
          fullName: admin.fullName,
          email: admin.email,
          password: hashedPassword,
          role: "admin",
        });
      }
    }
  } catch (error) {
    console.error("Default admin seeding failed:", error.message);
  }
};

// ==============================
// Register User
// ==============================
const registerUser = async (req, res) => {
  try {
    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, email, and password",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
      });
    }

    const portal = req.params?.portal;
    const normalizedRole = portal ? normalizeRole(portal) : null;

    if (!normalizedRole || !allowedPublicRoles.includes(normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: "Self-registration is only allowed for farmer, buyer, or transporter accounts",
      });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create User
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: normalizedRole,
      phone,
      address,
    });

    // Send response without password
    res.status(201).json({
      success: true,
      message: "User Registered Successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
        createdAt: user.createdAt,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Login User
// ==============================
const loginUser = async (req, res) => {
  try {
    const { email, password, portal } = req.body;

    // Check email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Email or Password",
      });
    }

    const normalizedRole = user.role === "consumer" ? "buyer" : user.role;
    if (portal && !isPortalAllowedForRole(portal, normalizedRole)) {
      return res.status(403).json({
        success: false,
        message: "This account is not authorized for the selected portal",
      });
    }

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { fullName, email, phone, address } = req.body;

    if (!fullName || !email) {
      return res.status(400).json({
        success: false,
        message: "Please provide your full name and email",
      });
    }

    const existingUser = await User.findOne({ email, _id: { $ne: req.user._id } });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Another account is already using this email",
      });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.fullName = fullName;
    user.email = email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getUsers = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can manage users",
      });
    }

    const users = await User.find({}).select("-password").sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const createUserByAdmin = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can create users",
      });
    }

    const { fullName, email, password, phone, address } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide full name, email, and password",
      });
    }

    if (!validatePassword(password)) {
      return res.status(400).json({
        success: false,
        message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters long`,
      });
    }

    const normalizedRole = normalizeRole(req.body?.role);

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      fullName,
      email,
      password: hashedPassword,
      role: normalizedRole,
      phone,
      address,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUserByAdmin = async (req, res) => {
  try {
    if (req.user?.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Only admins can delete users",
      });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.email === "yana.saroha05@gmail.com" || user.email === "deepanshu.ya2004@gmail.com") {
      return res.status(400).json({
        success: false,
        message: "The default admin accounts cannot be removed",
      });
    }

    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ==============================
// Export
// ==============================
module.exports = {
  registerUser,
  loginUser,
  seedDefaultAdminAccounts,
  getUsers,
  createUserByAdmin,
  deleteUserByAdmin,
  updateProfile,
};