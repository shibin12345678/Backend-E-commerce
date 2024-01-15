const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userSchema');
const Products = require('../Models/productSchema')
const { joiUserSchema } = require('../Models/validationSchema');
const Order=require("../Models/orederSchema");
const { default: mongoose } = require("mongoose");
const { json } = require("body-parser");
const stripe=require("stripe")(process.env.STRIPE_SECRET_KEY);
let sValue = [];
//   registration
module.exports = {
  userRegistration: async (req, res) => {
    console.log("rquss", req.body)
   
    const { value, error } = joiUserSchema.validate(req.body);
    const { name, email, username, password } = req.body;
  console.log(value)
    if (error) {
      return res.status(400).json({
        status: 'Error',
        message: 'Invalid user input ☹️. Please check your data. 🙂 ',
      });
    }
    await User.create({
      name: name,
      email: email,
      username: username,
      password: password,
    });

    res.status(201).json({
      status: 'status',
      message: 'User registration successful',
    });
  },
//   Usre login
  userLogin: async (req, res) => {
    console.log('......')
    const { value, error } = joiUserSchema.validate(req.body);
    console.log(value)

    if (error) {
      return res.json(error.message);
    }
    const { username, password } = value;
    const user = await User.findOne({
      username: username,
 
    });
 console.log(user)
    if (!user) {
       return res.status(404).json({
        status: 'error',
        message: 'User not found 🧐',
      });
    }
    if (!password || !user.password) {
      return res.status(400).json({ status: 'error', message: 'Invalid input' });
    }
    const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
      return res
        .status(401)
        .json({ error: 'error', message: 'Incorrect password' });
    }
      const token =jwt.sign(
       
      { username: user.username },
      process.env.USER_ACCESS_TOKEN_SECRET,
      {
        expiresIn: 86400,
      },
      console.log(process.env.USER_ACCESS_TOKEN_SECRET)
    );
    console.log(token)

    res.status(200).json({
    status: 'success',
    message: 'Login successful',
    data: token,
    });
  }, 
  //view product by category
viewProduct:async(req,res)=>{
  const products = await Products.find();
    console.log(products)
       if(!products){
            res.status(404).send({status:'error',message:"product not fount"})
       }
      
       res.status(200).send({
               status:"succes",
               message:"Succes fully  fetched data",
               data:products,    
       });
},
 //  View a specific product.
 productById: async (req, res) => {
  const productId = req.params.id;
  const prod = await Products.findById(productId);

  if (!prod) {
    return res.status(404).json({
      status: "error",
      message: "Product not found",
    });
  }
  res.status(200).json({
    status: "Success",  
    data: prod,
  });
},
 ///  product by category    this not work
 productByCatogery:async(req,res)=>{
        const prodCatogery= req.params.categoryname;
        const products = await Products.find({ category: prodCatogery });
        if(!products){
             return status(200).send({
                 status:"succes",
                 message:"Succesfully  fetched",
                 data:products,
             })
        }
 },
  //   USER PRODUCT ADD TO CART
  addToCart: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    // console.log(user)
    if (!user) {
      return res.status(404).send({
        status: "Failear",
        message: "User not fount",
      });
    }
    const { producId } = req.body;
    console.log(req.body)
    
    if (!producId) {
      return res.status(404).send({
        status: "Failear",
        message: "Product not fount ☹️",
      });
    }

    await User.updateOne({ _id: userId }, { $addToSet: { cart: producId } });
    res.status(200).send({
      status: "Succes",
      message: "Succes fully product added to cart",
    });
  },
///  product from cart
viewCartProdut: async(req,res)=>{
  const userId = req.params.id;
  const user = await User.findById(userId);
  console.log(req.body)
  if (!user) {
    return res
      .status(404)
      .json({ status: "Failear", message: "User Not Fount" });
  }
  const cartProductIds = user.cart;
  if (cartProductIds.length === 0) {
    return res
      .status(200)
      .json({ status: "success", message: "User Cart is Emty", data: [] });
  }
  const cartProducts = await Products.find({ _id: { $in: cartProductIds } });
  res
  .status(200)
  .json({
    status: "Success",
    message: "Cart products fetched successfully",
    data: cartProducts,
  });
// console.log(Products);
},

//ADD PRoduct Wisilist

addToWishlist: async (req, res) => {
  const userId = req.params.id;
  if (!userId) {
    return res
      .status(404)
      .json({ status: "Failear", message: "User Not Fount!" });
  }
  const { productId } = req.body;
    const prod = await Products.findById(productId);
    if (!prod) {
      return res
        .status(404)
        .json({ status: "Failear", message: "Product not found" });
    }

    const findProd = await User.findOne({ _id: userId, wishlist: productId });
    if (findProd) {
      return res
        .status(409)
        .json({ message: "Product already on your wishlist " });
    }
 // console.log(prod);

 await User.updateOne({ _id: userId }, { $push: { wishlist: prod } });
 res.status(201).json({
   status: "Success",
   message: "Product Succesfuly added to wishList",
 });
},


  /// show wishList
  showWishlist: async (req, res) => {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if (!user) {
      return res
         .status(404)
        .json({ status: "Failear", message: "User Not Found" });
    }
    const wishProId = user.wishlist;
    if (wishProId.length === 0) {
      return res
        .status(200)
        .json({ status: "Succes", message: "User Wishlist is Emty", data: [] });
    }
    const wishProducts = await Products.find({ _id: { $in: wishProId } });
    res
        .status(200)
        .json({
         status: "Success",
         message: "Wishlist products fetched successfully",
         data: wishProducts,
      });
  },


  //Delete wisiilist 

  
  delete:async(req,res)=>{
    const userId = req.params.id;
    const { productId } = req.body;
    if (!productId) {
      return res.status(404).json({ message: "Product not Fount" });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ status: "Failear", message: "User Not Found" });
    }
    console.log(productId);
    await User.updateOne({ _id: userId }, { $pull: { wishlist: productId } });
    res.status(200).json({ status: "Successfully removed from wishlist" });
  },

//payment


payment: async (req, res) => {
  const userId = req.params.id;
 
  const user = await User.findOne({ _id: userId }).populate("cart");

  if (!user) {
    return res.status(404).json({ message: "User Not found" });
  }

  const cartProdcts = user.cart;
  // console.log(cartProdcts);
  if (cartProdcts.length === 0) {
    return res
      .status(200)
      .json({ status: "Succes", message: "User Cart is Emty", data: [] });
  }

  const lineItems = cartProdcts.map((item) => {
    return {
      price_data: {
        currency: "inr",
        product_data: {
          name: item.title,
          description: item.description,
        },
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    };
  });
  session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items: lineItems,
    mode: "payment",
    success_url: `http://localhost:3000/api/users/payment/success`, // Replace with your success URL
    cancel_url: "http://localhost:3000/api/users/payment/cancel", // Replace with your cancel URL
})

if(!session){
     return  res.json({
         status:"Failur",
         message:" Error occured on  Session side",
     })
}
sValue = {
  userId,
  user,
  session,

  };
  res.status(200).json({
    status: "Success",
    message: "Strip payment session created",
    url: session.url,
  });
},

success: async (req, res) => {
  const { id, user, session } = sValue;
  // console.log(id)
  const userId = user._id;
  const cartItems = user.cart;
  const orders = await Order.create({
    userId: id,
    products: cartItems.map(
      (value) => new mongoose.Types.ObjectId(value._id)
    ),
    order_id: session.id,
    payment_id: `demo ${Date.now()}`,
    total_amount: session.amount_total / 100,
  });
  if (!orders) {
    return res.json({ message: "error occured while inputing to orderDB" });
  }
  const orderId = orders._id;

  const userUpdate = await User.updateOne(
    { _id: userId },
    {
      $push: { orders: orderId },
      $set: { cart: [] },
    },
    { new: true }
  );
  console.log(userUpdate);

  // console.log ("uSer Update",userUpdate)

  if (userUpdate) {
    res.status(200).json({
      status: "Success",
      message: "Payment Successful.",
    });
  } else {
    res.status(500).json({
      status: "Error",
      message: "Failed to update user data.",
    });
  }
},

 //Cancel Product

cansel: async (req, res) => {
  res.status(200).json({
    status: "Success",
    message: "Payment cancelled.",
  });
},


// catogoryProducts:async(req,res)=>{
//          const specifyP=req.body.category;
//          const products=  await Products.find({category:specifyP});
//           console.log(products)
//          if(products.length > 0){
//          return res.status(200).json({
//          status: "success",
//          message: "Category fetched successfully",
//          data: products,
//          });
            
//         }
// }




















}








