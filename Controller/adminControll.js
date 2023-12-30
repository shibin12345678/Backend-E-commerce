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
        // if( email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD){
        //         //  "true"
        //         return res.status(200).json("woerkig")
        //     }
        //     res.status(404).json("not fount")

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

       if(allUsers.length===0){
          return res.status(404).json({
             status:"error",
             message:"Users not found"
          })
       }
     res.status(200).json({
          status:"succeful",
          message:'success fully feched used data',
          data:"allUser"
     })



  }



    
  module.exports = { login ,allUsers};