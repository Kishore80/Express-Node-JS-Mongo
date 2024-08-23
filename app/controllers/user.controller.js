import User from "../model/user.model.js"
import __ from "../../helpers/globalFunctions.js"
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
import dotenv from 'dotenv'

dotenv.config()

class users {
    getAllUsers = async(req , res , next)=>{
        try{
          let users = await User.find();
          if(!users){
              return __.out(res,400,"User Exist Already")
          }else{
              return __.out(res,200,{
                message:"Users Found Successfully",
                data:users
              })
          }
        }catch(error){
          console.log("Error",error);
          return __.out(res,500,"Internal Server Error")
        }
    }
    
    signUpUser = async(req, res , next)=>{
        try{
           console.log("Req.body",req.body)
           let {name , email , password , age , gender} = req.body    
           let findUser = await User.findOne({email});
    
           if(findUser){
             //User Already Exists
             return __.out(res,400,"User Exist Already")
            }else{
             let newUser = {
                name: name,
                email:email,
                password:password,
                age:age,
                gender:gender
            }
            newUser.password = bcrypt.hashSync(password,10)
            let createUser = await User.create(newUser);
            console.log("User Created",createUser);
            return __.out(res,200,{
                message:"User Created Successfully",
                data:createUser._id
              })        
            }
        }catch(error){
            console.log("Error",error)
            return __.out(res,500,"Internal Server Error")
        }
    }

    loginUser = async(req , res)=>{
        try{
            let {email , password } = req.body;
            let checkExistingUser = await User.findOne({email});
            console.log("Check",checkExistingUser)
            if(!checkExistingUser){
                return __.out(res,400,`Account with ${email} don't exist . Please Create an Account to Login`)
            }else{
                let decryptPassword = await bcrypt.compareSync(password,checkExistingUser.password);
                console.log("Decrypt",decryptPassword)
                if(decryptPassword){
                    let createJwtToken = jwt.sign({
                        userId:checkExistingUser._id,
                        email:checkExistingUser.email,
                        isActive:checkExistingUser.isActive
                    },process.env.JWT_KEY)
                    return __.out(res,200,{
                        message:"Login Successful",
                        token : `Bearer ${createJwtToken}`
                    })
                }else{
                    return __.out(res,400,{
                        message:"Incorrect Password . Please enter correct password"
                    })
                }
            }
        }catch(err){
            console.log("Error",err)
            return __.out(res,500,"Internal Server Error")
        }
    }
} 

users = new users();
export default users


