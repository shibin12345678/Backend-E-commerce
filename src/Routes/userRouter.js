const express=require("express");
const router=express.Router();

  const  userContoroll=require("../Controller/userControll");

  const tryCatchMiddleware =require("../Middlewares/tryCatchMiddleware ");
  router
  .post('/register',tryCatchMiddleware(userContoroll.userRegistraion))
  module.exports=router;