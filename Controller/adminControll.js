require("dotenv").config();
const mongoos=require("mongoose");
const products=require("../Models/productSchema");
const jwt=require("jsonwebtoken");
const {joiProductSchema}=require("../Models/validationSchema");
const Users=require("../Models/userSchema");



   //admin login
   const login = async (req, res) => {  
    const { email, password } = req.body;
    console.log("Emil",process.env.ADMIN_EMAIL , process.env.ADMIN_PASSWORD)
       
        if (
        email === process.env.ADMIN_EMAIL &&
        password === process.env.ADMIN_PASSWORD
        ) {
        const toekn = jwt.sign(
            { email: email },
            process.env.ADMIN_ACCES_TOKEN_SECRET
        );
        return res.status(200).send({
            statu: "Succes",
            message: "Admin registratin succs full",
            data: toekn,
        });
        } else {
        return res.status(404).json({
            status: "error",
            message: "Thsi is no an admin ",
        });
        }
  };   
  // finding all users
 const   allUsers=async(req,res)=>{
       const allUsers=await Users.find();
       console.log(allUsers)

       if(allUsers.length===0){
          return res.status(404).json({
             status:"error",
             message:"Users not found"
          })
       }
     res.status(200).json({
          status:"succeful",
          message:'success fully feched used data',
          data:allUsers
          
     })
      

  }

  //View a specific user details by id;
  const findById = async (req, res) => {
  const userId = req.params.id;

 try {
        const user = await Users.findById(userId);
        console.log(user)

        if (!user) {
            return res.status(404).json({
                status: "error",
                message: 'User not found',
            });
        }

        res.status(200).json({
            status: "success",
            message: 'Successfully found user',
            data: user,
        });
    }catch (error) {
       
        res.status(500).json({
            status: "error",
            message: 'Internal Server Error',
        });
    }
};

/////-> Create a product.

const  createProduct= async (req, res) => {
    console.log('.....')
    const { value, error } = joiProductSchema.validate(req.body);
    console.log(value)
    const { title, description, price, image, category } = value;
    console.log(value)
    if (error) {
        return res.status(400).json({ error: error.details[0].message });
    } else {
        try {
            // Assuming 'products' is your model or schema
            const createdProduct = await products.create({
                title,
                description,
                price,
                image,
                category,
            });
  
            res.status(201).json({
                status: 'success',
                message: "Successfully created product",
                data: createdProduct,
            });
        } catch (err) {
            console.error(err);
            res.status(500).json({
                status: 'error',
                message: 'Internal Server Error',
            });
        }
    }
}

///View all the products by category

const allProducts = async (req, res) => {
    try {
        const prods = await products.find();

        if (prods.length === 0) {
            return res.status(404).json({
                status: "error",
                message: "Products not found",
            });
        }

        res.status(200).json({
            status: "success",
            message: "Successfully fetched products detail.",
            data: prods,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: "error",
            message: "Internal Server Error",
        });
    }
};
 //Product by id 
     const  productsById=async(req,res)=>{
            productId=req.params.id;
            const product= await products.findById(productId);
            if(!product){
                res.status(404).send({
                       status:"error",
                       message:'Prioduct not fount'
                  })
            }
            res.status(200).json({
                 status:"success",
                 message:'Succeful fetched product details',
                 data:product
            })
     }
//Delete Product
const deleteProduct=async(req,res)=>{
        const {productId}=req.body;
          console.log(productId)

        if(!productId||!mongoos.Types.ObjectId.isValid(productId)){
              return res.status(400).json({
                   status:"failer",
                   message:'invalid ProducID provaided'
              })
        }
        return res.status(200).json({
               status:"succes",
               message:'Product deleted succesfully'
        })
}
 // admin update product
 const updateProduct = async (req, res) => {
    const { value, error } = joiProductSchema.validate(req.body);
    console.log(value);
  
    if (error) {
      return res.status(400).json({ message: error.details[0].message });
    }
  
    const { id, title, description, price, image, category } = value;
  
    // Use findOne instead of find for a single product
    const product = await products.findOne({ _id: id });
  
    // Check if the product exists
    if (!product) {
      return res.status(404).json({
        status: "Failure",
        message: "Product not found in the database",
      });
    }
    // Use findByIdAndUpdate with the proper options
    await products.findByIdAndUpdate(
      id,
      {
        title,
        description,
        price,
        image,
        category,
      },
      { new: true } // Return the modified document rather than the original
    );
    res.status(200).json({
      status: "Success",
      message: "Product successfully updated",
    });
  };
  
  module.exports = {
    login,
    allUsers,
    findById,
    allProducts,
    productsById,
    deleteProduct,
    createProduct,
    updateProduct,
  };
  