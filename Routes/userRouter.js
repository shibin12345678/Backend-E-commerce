const express=require("express");
const router=express.Router();
const  verifyToken=require("../Middlewares/userAuthMiddleware");
// const  userContoroll=require("../Controller/userControll");
const tryCatchMiddleware =require("../Middlewares/tryCatchMiddleware ");
const userControll = require("../Controller/userControll");
  router
  .post('/register',tryCatchMiddleware(userControll.userRegistration))
  .post("/login",tryCatchMiddleware(userControll.userLogin))
  .use(verifyToken)
  .get("/products",tryCatchMiddleware(userControll.viewProduct))
  .get("/products/:id",tryCatchMiddleware(userControll.productById))
  .get("/products/category/:categoryname",tryCatchMiddleware(userControll.productByCatogery))
  .post("/:id/cart",tryCatchMiddleware(userControll.addToCart))
  .get("/:id/cart",tryCatchMiddleware(userControll.viewCartProdut))
  .post("/:id/wishlists",tryCatchMiddleware(userControll.addToWishlist))
  .get("/:id/wishlists",tryCatchMiddleware(userControll.showWishlist))
  .delete("/:id/wishlists",tryCatchMiddleware(userControll.delete)) 
  .post("/:id/payment",tryCatchMiddleware(userControll.payment))
  .get("/payment/succes",tryCatchMiddleware(userControll.success))
  .post("/paymnet/cancel",tryCatchMiddleware(userControll.cansel))

  .get('/specify',tryCatchMiddleware(userControll.catogoryProducts))



  module.exports=router;