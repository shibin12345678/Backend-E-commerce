const express=require("express");
const router=express.Router();
const  verifyToken=require("../Middlewares/userAuthMiddleware");
const  userContoroll=require("../Controller/userControll");
const tryCatchMiddleware =require("../Middlewares/tryCatchMiddleware ");
  router
  .post('/register',tryCatchMiddleware(userContoroll.userRegistration))
  .post("/login",tryCatchMiddleware(userContoroll.userLogin))
  .use(verifyToken)
  .get("/products",tryCatchMiddleware(userContoroll.viewProduct))




  module.exports=router;