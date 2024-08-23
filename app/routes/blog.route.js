import express from "express"
import blogController from "../controllers/blog.controller.js"
import passport from 'passport'
import __ from '../../helpers/globalFunctions.js'
import AWS from 'aws-sdk'
import multer from "multer"
import multerS3 from 'multer-s3'
import dotenv from "dotenv"

dotenv.configDotenv()

const router = express.Router()

//Configure AWS S3 Informaion
const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion: 'v4',
    region:process.env.AWS_REGION
})

//Create a Storage Engine for Multer S3 to use
const storageS3 = multerS3({
    s3:s3,
    bucket:process.env.AWS_BUCKET_NAME,
    // metadata:(req,res,cb)=>{
    //     cb(null,{
    //         fieldName:res.fieldName
    //     })
    // },
    key:(req,res,cb)=>{
        cb(null,`Users ${Date.now()}${res.originalname}`)
    }
})

//Create a Middleware for Uploading Files to S3
const upload = multer({storage:storageS3})

//All the Routes below this passport Authentication will require a JWT Token
router.use(passport.authenticate('jwt',{
    session:false
}),
    (req,res,next)=>{
        if(req.user){
            next();
        }else{
            return __.out(res,401,"Unauthorized")
        }
    }

)

router.post('/createBlog',upload.single('imageUrl'),blogController.createBlog);

router.get('/listBlogs',blogController.listBlogsOfUser);

router.get('/delete/:blogId',blogController.deleteABlog);

router.post('/update',blogController.updateBlog);

export default router;