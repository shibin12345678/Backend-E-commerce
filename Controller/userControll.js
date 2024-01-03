const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userSchema');
const Products = require('../Models/productSchema')
const { joiUserSchema } = require('../Models/validationSchema');

//   registration
module.exports = {
  userRegistration: async (req, res) => {
   
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
  
       if(!products){
            res.status(404).send({status:'error',message:"product not fount"})
       }
       console.log("..........")
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
/// view product from cart
viewCartProdut: async(req,res)=>{
  const userId = req.params.id;
  const user = await User.findById(userId);
  if (!user) {
    return res
      .status(404)
      .json({ status: "Failear", message: "User Not Fount" });
  }
  const cartProductIds = user.cart;
  if (cartProductIds.length === 0) {
    return res
      .status(200)
      .json({ status: "Succes", message: "User Cart is Emty", data: [] });
  }
  const cartProducts = await Products.find({ _id: { $in: cartProductIds } });
  res
  .status(200)
  .json({
    status: "Success",
    message: "Cart products fetched successfully",
    data: cartProducts,
  });
// console.log(product);
},

}






