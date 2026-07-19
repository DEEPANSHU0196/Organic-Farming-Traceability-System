const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const mongoose = require("mongoose");
const cookieParser = require("cookie-parser");


// Load Environment Variables
dotenv.config();


// Routes

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const orderRoutes = require("./routes/orderRoutes");
const shipmentRoutes = require("./routes/shipmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const qrRoutes = require("./routes/qrRoutes");
const reviewRoutes = require("./routes/reviewRoutes");



// App

const app = express();



// Middleware

app.use(
  cors({
    origin: "http://localhost:5173",
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
  .then(() => {
    console.log("MongoDB Connected");
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