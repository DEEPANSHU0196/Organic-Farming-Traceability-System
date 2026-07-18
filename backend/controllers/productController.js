const Product = require("../models/Product");
const cloudinary = require("../config/cloudinary");
const streamifier = require("streamifier");


// ======================
// CLOUDINARY HELPERS
// ======================

const ensureCloudinaryConfig = () => {

  const hasConfig = Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
    process.env.CLOUDINARY_API_KEY &&
    process.env.CLOUDINARY_API_SECRET
  );


  if (!hasConfig) {

    throw new Error(
      "Image upload is not configured. Please check Cloudinary credentials."
    );

  }

};



const uploadFromBuffer = (buffer) => {

  return new Promise((resolve, reject) => {

    ensureCloudinaryConfig();


    const stream =
      cloudinary.uploader.upload_stream(
        {
          folder: "products",
        },

        (error, result) => {

          if (error) {

            reject(error);

          } else {

            resolve(result);

          }

        }
      );


    streamifier
      .createReadStream(buffer)
      .pipe(stream);

  });

};



const uploadFromBodyImage = async(image)=>{


  if(!image){
    return "";
  }


  if(
    image.startsWith("http://") ||
    image.startsWith("https://")
  ){

    return image;

  }


  ensureCloudinaryConfig();


  const result =
    await cloudinary.uploader.upload(
      image,
      {
        folder:"products"
      }
    );


  return result.secure_url;

};




// ======================
// ADD PRODUCT
// ======================

const addProduct = async(req,res)=>{

  try{


    let imageUrl="";


    if(req.file){

      const result =
        await uploadFromBuffer(
          req.file.buffer
        );


      imageUrl =
        result.secure_url;


    }
    else if(req.body.image){

      imageUrl =
        await uploadFromBodyImage(
          req.body.image
        );

    }



    // Accept both fields
    const productName =
      req.body.name ||
      req.body.productName;



    const {
      category,
      quantity,
      price,
      location,
      description,
      harvestDate
    } = req.body;



    const farmerId =
      req.user?._id ||
      req.user?.id;



    if(!farmerId){

      return res.status(401).json({

        success:false,

        message:
        "User not authenticated"

      });

    }




    const product =
      await Product.create({

        farmer: farmerId,

        name: productName,

        category,

        quantity,

        price,

        location,

        description,

        harvestDate,

        image:imageUrl

      });



    res.status(201).json({

      success:true,

      message:
      "Product Added Successfully",

      product

    });



  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};





// ======================
// GET ALL PRODUCTS
// ======================

const getAllProducts = async(req,res)=>{

  try{


    const products =
      await Product.find()
      .populate(
        "farmer",
        "fullName email phone address"
      );


    res.status(200).json({

      success:true,

      products

    });


  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};





// ======================
// GET MY PRODUCTS
// ======================

const getMyProducts = async(req,res)=>{

  try{


    const products =
      await Product.find({

        farmer:req.user._id

      });


    res.status(200).json({

      success:true,

      products

    });


  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};





// ======================
// GET SINGLE PRODUCT
// ======================

const getProductById = async(req,res)=>{

  try{


    const product =
      await Product.findById(
        req.params.id
      )
      .populate(
        "farmer",
        "fullName email phone address"
      );



    if(!product){

      return res.status(404).json({

        success:false,

        message:
        "Product Not Found"

      });

    }



    res.status(200).json({

      success:true,

      product

    });


  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};





// ======================
// UPDATE PRODUCT
// ======================

const updateProduct = async(req,res)=>{

  try{


    const product =
      await Product.findById(
        req.params.id
      );



    if(!product){

      return res.status(404).json({

        success:false,

        message:
        "Product Not Found"

      });

    }



    let imageUrl =
      product.image;



    if(req.file){

      const result =
        await uploadFromBuffer(
          req.file.buffer
        );


      imageUrl =
        result.secure_url;

    }



    const updated =
      await Product.findByIdAndUpdate(

        req.params.id,

        {

          ...req.body,

          name:
          req.body.name ||
          req.body.productName ||
          product.name,

          image:imageUrl

        },

        {
          new:true
        }

      );



    res.status(200).json({

      success:true,

      product:updated

    });



  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};





// ======================
// DELETE PRODUCT
// ======================

const deleteProduct = async(req,res)=>{

  try{


    await Product.findByIdAndDelete(
      req.params.id
    );


    res.status(200).json({

      success:true,

      message:
      "Product Deleted"

    });



  }
  catch(error){

    res.status(500).json({

      success:false,

      message:error.message

    });

  }

};





module.exports = {

  addProduct,

  getAllProducts,

  getMyProducts,

  getProductById,

  updateProduct,

  deleteProduct

};