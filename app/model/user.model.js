//To Create a Schema , Import Mongoose
import mongoose from 'mongoose';


//Create a New Schema using Mongoose Schema Method 
const userSchema = new mongoose.Schema({
   name:{
        type:String,
        required:true
   },
   email:{
        type:String,
        required:true,
        unique:true
   },
   password:{
        type:String,
        required:true,
        minLength:6
   },
   age:{
        type :Number,
        required: true
   },
   gender:{
        type:String
   },
   isActive:{
        type:Boolean,
        default:true
   }
},{
    timestamps:true
});

/*
The Below line does 2 things

It Creates a Model named "users" from userSchema variable declared above

At the Same time it exports the model , So it can be imported in other modules
*/ 
export default mongoose.model("user",userSchema);