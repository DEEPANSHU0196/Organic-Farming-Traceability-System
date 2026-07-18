const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
{
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required:true
    },

    name:{
        type:String,
        required:true
    },

    category:{
        type:String
    },

    quantity:{
        type:Number
    },

    harvestDate:{
        type:Date
    },


    qrCode:{
        type:String
    },

    traceabilityId:{
        type:String,
        unique:true
    }


},
{
    timestamps:true
});


module.exports =
mongoose.model(
    "Product",
    productSchema
);