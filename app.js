require("dotenv").config();

const mongoos=require("mongoose");
const express=require("express");
const app=express();
const PORT=3000;
//Routes 
const userRouter=require("./Routes/userRouter");
const adminRouter=require("./Routes/adminRouter");
//Error Handler
const ErrorHandler=require("./Middlewares/ErrorHandler");
const bodyParser=require("body-parser");

mongoos.connect("mongodb://localhost:27017/e-commerce", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.json());

app.use("/api/user",userRouter);
app.use("/api/admin",adminRouter);
// app.use(ErrorHandler);
app.listen(PORT, ()=>{
        console.log("Server running",PORT)
})

