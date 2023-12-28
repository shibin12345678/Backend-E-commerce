const jwt=require("jsonwebtoken");


module.exports=function verifyToken(req,res,next){
      const token=req.headers['authorization']
      if(!token){
           return  res.status(403).json({error:"No token provaided"})
      }
      jwt.verify(token,process.env.ADMIN_ACCES_TOKEN_SECRET,(err,decode)=>{
           if(err){
               return res.status(401).json({error:"Unatherized"})
           }
      })

}