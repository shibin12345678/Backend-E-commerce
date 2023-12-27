const express=require("express");
const router=express.Router();

  const  userContoroll=require("../Controller/userControll");

  const tryCatchMiddleware =require("../Middlewares/tryCatchMiddleware ");
  router
  .post('/register',tryCatchMiddleware(userContoroll.userRegistration));
  .post("/login",tryCatchMiddleware(userController.userLogin))
  module.exports=router;