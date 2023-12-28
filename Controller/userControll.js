const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../Models/userSchema');
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

      const token = jwt.sign(
       
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
};

//view product by category


viewProduct:async(req,res)=>{
  const products = await product.find();
       if(!products){
            res.status(404).send({status:'error',message:"product not fount"})
       }
       console.log("..........")
       res.status(200).send({
               status:"succes",
               message:"Succes fully  fetched data",
               data:products,
              

       });
}