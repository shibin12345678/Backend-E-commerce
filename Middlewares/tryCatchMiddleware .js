const tryCatchMiddleware=(tryCatchandler)=>{
       return async (req,res,next)=>{
        try{
              await tryCatchandler(req,res,next)
        }catch(error){
            console.log(error);
            res.status(500).send({status:"Failuire", message: "error", error_massage: error.message})
        }
       }
        
} 
module.exports=tryCatchMiddleware