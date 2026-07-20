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

    price:{
        type:Number
    },

    description:{
        type:String
    },

    location:{
        type:String
    },

    unit:{
        type:String,
        default:"kg"
    },

    image:{
        type:String
    },

    harvestDate:{
        type:Date
    },


    qrCode:{
        type:String
    },

    traceabilityId:{
        type:String,
        unique:true,
        sparse:true
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