const mongoose = require("mongoose");


const productSchema = new mongoose.Schema(
  {

    // Farmer who owns the product
    farmer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },


    // Product Information

    name: {
      type: String,
      required: true,
      trim: true,
    },


    category: {
      type: String,
      required: true,
    },


    quantity: {
      type: Number,
      required: true,
    },


    price: {
      type: Number,
      required: true,
    },


    location: {
      type: String,
      default: "",
    },


    description: {
      type: String,
      default: "",
    },


    image: {
      type: String,
      default: "",
    },


    // Farming Details

    harvestDate: {
      type: Date,
    },


    organicCertified: {
      type: Boolean,
      default: true,
    },


    certificationNumber: {
      type: String,
      default: "",
    },



    // QR Traceability

    qrCode: {
      type: String,
      default: "",
    },


    traceabilityId: {
      type: String,
      default: "",
    },



    // Shipment Information

    shipment: {

      transporter: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },


      updates: [

        {
          stage: {
            type: String,
            default: "",
          },

          status: {
            type: String,
            enum: ["Pending", "Picked", "In Transit", "Delivered", "Delayed", "Completed", "In Progress",
                   "pending", "picked", "in transit", "delivered", "delayed", "completed"],
            default: "Pending",
          },

          date: {
            type: Date,
          },

          location: {
            type: String,
            default: "",
          },

          description: {
            type: String,
            default: "",
          },

          icon: {
            type: String,
            default: "",
          },
        },

      ],


      status: {
        type: String,
        enum: [
          "Pending", "Picked", "In Transit", "Delivered",
          "pending", "picked", "in transit", "delivered",
        ],
        default: "Pending",
      },


      currentLocation: {
        type: String,
        default: "",
      },


      estimatedDelivery: {
        type: Date,
      },

    },



    // Admin Approval

    status: {
      type: String,
      enum: [
        "Pending", "Approved", "Rejected",
        "pending", "approved", "rejected",
      ],
      default: "Pending",
    },


  },

  {
    timestamps: true,
  }

);


module.exports =
mongoose.model(
  "Product",
  productSchema
);