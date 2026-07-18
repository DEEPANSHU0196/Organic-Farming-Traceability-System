const QRCode = require("qrcode");
const Product = require("../models/Product");



// Generate QR Code

exports.generateProductQR = async(req,res)=>{

    try{

        const product =
        await Product.findById(req.params.id)
        .populate(
            "farmer",
            "fullName email phone address"
        );


        if(!product){
            return res.status(404).json({
                success:false,
                message:"Product not found"
            });
        }



        const traceabilityURL =
        `http://localhost:5173/product/${product._id}`;



        const qr =
        await QRCode.toDataURL(
            traceabilityURL
        );


        product.qrCode = qr;

        product.traceabilityId =
        "TRACE-" + product._id;


        await product.save();



        res.json({

            success:true,

            message:
            "QR Generated Successfully",

            qrCode:qr,

            traceabilityId:
            product.traceabilityId

        });



    }
    catch(error){

        res.status(500).json({

            success:false,
            message:error.message

        });

    }

};