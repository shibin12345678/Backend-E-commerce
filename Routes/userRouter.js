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
  .get("/:id/carts",tryCatchMiddleware(userControll.viewCartProdut))
  .post("/:id/wishlists",tryCatchMiddleware(userControll.addToWishlist))
  .get("/:id/wishlists",tryCatchMiddleware(userControll.showWishlist))
  .delete("/:id/wishlists",tryCatchMiddleware(userControll.delete)) 


  module.exports=router;