const path = require("path");
const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config({ path: path.resolve(__dirname, ".env") });

const connectDB = require("./config/db");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");

// Connect Database
connectDB();

const app = express();


// ======================
// Middlewares
// ======================

app.use(cors());

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  })
);


// ======================
// Routes
// ======================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message:
      "Organic Farming Traceability API Running 🚀",
  });
});

app.use(
  "/api/auth",
  authRoutes
);

app.use(
  "/api/products",
  productRoutes
);

app.use(
  "/api/orders",
  orderRoutes
);

app.use(
  "/api/shipments",
  shipmentRoutes
);


// ======================
// Route Not Found
// ======================

app.use("*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "Route Not Found",
  });
});


// ======================
// Start Server
// ======================

const PORT =
  process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on port ${PORT}`
  );
});