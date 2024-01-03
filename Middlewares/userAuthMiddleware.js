
     const jwt=require("jsonwebtoken");
     module.exports=function verifyToken(req,res,next){
      const Btoken=req.headers['authorization']
      const token = Btoken.split(' ')[1];
      console.log(token,'provide')

      if(!token){
           return  res.status(403).json({error:"No token provaided"})
      }
      
      jwt.verify(token,process.env.USER_ACCESS_TOKEN_SECRET,(err,decode)=>{
           if(err){
     return res.status(401).json({error:"Unatherized"});
           }
          
           req.username=decode.username;
           next()
      })

}