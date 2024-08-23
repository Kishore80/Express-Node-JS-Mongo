import express from 'express';
import mongoose from 'mongoose'
import userRouter from './app/routes/user.route.js';
import blogRouter from './app/routes/blog.route.js';
import dotenv from 'dotenv'
import passport from 'passport'
import bodyParser from 'body-parser';

//This helps us to Access the Configuration Files like .env
dotenv.config()

//This Creates an Express Application
const app = express();

//This tells Expresss Application to receive JSON requests
//Earlier Days we used Body Parser but now Express has this built in Methodology
app.use(express.json())
app.use(passport.initialize());

app.use(bodyParser.json({
    limit: '50mb'
  }));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: '50mb',
    parameterLimit: 1000000
}));
//Connect to MongoDB
mongoose.connect(process.env.DB_HOST)
.then(()=>{
    console.log("Mongo DB is Connected")
    //Only when the Mongo DB is Connected , We can tell our Express Application to Act as a Server on a dedicated port
    app.listen(process.env.PORT,(req,res)=>{
        console.log("Server is Connected to Port 3000")
    })   
})
.catch((error)=>{
    console.log("Error",error)
    console.log("Mongo DB Connection Failed")
    process.exit()
})

import './helpers/authentication.js';

//Router Root Path for Every Individual Routers
app.use("/api",userRouter);
app.use("/blog",blogRouter);
