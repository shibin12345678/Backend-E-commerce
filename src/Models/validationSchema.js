const Joi=require("joi");


const joiUserSchema=Joi.object({
      name:Joi.string(),
      username:Joi.string().alphanum().min(3).max(30).required(),
      email:Joi.string().email(),
    password: Joi.string().required()
})
module.exports={joiUserSchema};