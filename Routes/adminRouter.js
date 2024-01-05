const express = require("express")
const router = express.Router()
const admin = require("../Controller/adminControll");


// middleware

const tryCatchMiddleware = require("../Middlewares/tryCatchMiddleware ")
const verifyToken = require("../Middlewares/adminAuthMiddelware")
// const imageUplod = require("../Middlewares/imageUplod/imageUpload")
router.use(express.json())

router
.post("/login",tryCatchMiddleware(admin.login))
   //apk middleware  start
.use(verifyToken)

// apk middleware  end

.get("/users",tryCatchMiddleware(admin.allUsers))
.get("/user/:id", tryCatchMiddleware(admin.findById))
.post("/product", tryCatchMiddleware(admin.createProduct))
.get("/products", tryCatchMiddleware(admin.allProducts))
.get("/products/:id", tryCatchMiddleware(admin.productsById))
.delete("/products", tryCatchMiddleware(admin.deleteProduct))
.put("/products", tryCatchMiddleware(admin.updateProduct))







module.exports = router