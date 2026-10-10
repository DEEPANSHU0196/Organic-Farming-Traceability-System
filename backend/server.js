const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


// Load Environment Variables
dotenv.config();

const { startTraceRetryWorker } = require("./utils/polygonTrace");


// Routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const qrRoutes = require("./routes/qrRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const chatbotRoutes = require("./routes/chatbotRoutes");


const getAllowedOrigins = () => {

  const defaults = [
    "http://localhost:5173",
    "http://localhost:5174",
    "http://localhost:5175",
    "http://localhost:5176",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:5174",
    "http://127.0.0.1:5175",
    "http://127.0.0.1:5176",
  ];

  const configured = process.env.FRONTEND_URL
    ? process.env.FRONTEND_URL.split(",").map((origin) => origin.trim()).filter(Boolean)
    : [];

  return [...new Set([...defaults, ...configured])];
};


// App

const app = express();



// Middleware

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || getAllowedOrigins().includes(origin)) {
        callback(null, true);
        return;
      }

      callback(new Error(`CORS blocked for origin: ${origin}`));
    },
    credentials: true,
  })
);


app.use(express.json());


app.use(
  express.urlencoded({
    extended: true,
  })
);


app.use(cookieParser());




// MongoDB Connection

mongoose
  .connect(process.env.MONGO_URI)
  .then(async () => {
    console.log("MongoDB Connected");

    try {
      const db = mongoose.connection.db;
      if (db) {
        await db.collection("products").dropIndex("traceabilityId_1").catch(() => {});
        await db.collection("products").dropIndex("traceabilityId_1").catch(() => {});
        console.log("Ensured stale traceability index is removed");
      }
    } catch (error) {
      console.log("Index cleanup skipped:", error.message);
    }

    startTraceRetryWorker();
  })
  .catch((error) => {
    console.log(
      "MongoDB Error:",
      error.message
    );
  });





// Test Route

app.get("/", (req, res) => {

  res.json({

    success: true,

    message:
    "Organic Farming Traceability API Running"

  });

});





// API Routes


// Authentication
app.use(
  "/api/auth",
  authRoutes
);


// Users
app.use(
  "/api/users",
  userRoutes
);


// Products
app.use(
  "/api/products",
  productRoutes
);


// Orders
app.use(
  "/api/orders",
  orderRoutes
);


// Shipment Tracking
app.use(
  "/api/shipments",
  shipmentRoutes
);

app.use(
  "/api/reviews",
  reviewRoutes
);

app.use(
  "/api/users",
  userRoutes
);


// Admin
app.use(
  "/api/admin",
  adminRoutes
);


// QR Traceability
app.use(
  "/api/qr",
  qrRoutes
);

// Notifications
app.use(
  "/api/notifications",
  notificationRoutes
);

app.use(
  "/api/chatbot",
  chatbotRoutes
);



// 404 Handler

app.use(
  (req,res)=>{

    res.status(404).json({

      success:false,

      message:
      "Route Not Found"

    });

  }
);





// Global Error Handler

app.use(
  (err,req,res,next)=>{

    console.log(err);


    res.status(
      err.status || 500
    )
    .json({

      success:false,

      message:
      err.message ||
      "Server Error"

    });

  }
);





// Server Start

const PORT =
process.env.PORT || 5000;


app.listen(
  PORT,
  ()=>{

    console.log(
      `🚀 Server running on port ${PORT}`
    );

  }
);