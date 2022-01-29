const mongoose= require('mongoose')
const Joi= require('joi')

const UserSchema=new mongoose.Schema({
 name:{type:String,
        required:true,
        minLength:5,
        maxLength:30},

 email:{type:String,
        required:true,
        minLength:5,
        maxLength:100,
        unique:true},

 password:{type:String,
        required:true,
        minLength:5,
        maxLength:1024},      
})


const User=mongoose.model('User',UserSchema)

const registeringSchema = Joi.object({
       name: Joi.string()
            .alphanum()
            .min(5)
            .max(30)
            .required(),
      
       email: Joi.string()
            .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }), 

            password: Joi.string()
            .min(8)
            .max(25)
            .required()
            .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, 
      'password')
          
   })

function validateNewUser(user){
   
     return registeringSchema.validate({ name: user.name, email: user.email,password:user.password });
}

const loggingSchema = Joi.object({

       email: Joi.string()
           .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
       
       password: Joi.string()
           .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),
       
   })

function validateUser(user){

   return  loggingSchema.validate({ email: user.email,password:user.password });
        
 
}
exports.User= User
exports.validateNewUser= validateNewUser
exports.validateUser= validateUser
