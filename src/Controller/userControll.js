const User=require("../Models/userSchema");
const { joiUserSchema}= require('../Models/validationSchema')




// user Rgistration

module.exports={

   userRegistraion:async(req,res)=>{
        const {value,error}=joiUserSchema.validate(req.body)
        const {name,email,username,password}=req.body;
        if(error){
            res.status(400).json({
                 status:"Error",
                 message: "Invalid user input ☹️. Please check your data. 🙂 ",
            })
        }
        await  User.create({
               name:name,
               email:email,
               username:username,
               password:password
        });
        res.status(201).json({
             status:"status",
             message:"User registration succefful"
        })

   }
}