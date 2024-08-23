import dotenv from 'dotenv'
import AWS from 'aws-sdk';
import __ from './globalFunctions.js';
dotenv.configDotenv()

const s3 = new AWS.S3({
    accessKeyId:process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    signatureVersion:"v4",
    region:process.env.AWS_REGION
})

const s3GetSignedUrl = async (key) =>{
 try {
    let signedUrl = await s3.getSignedUrl("getObject",{
        Bucket:process.env.AWS_BUCKET_NAME,
        Key:key,
        Expires:180// 80 Seconds
    })
    return signedUrl
 } catch (error) {
    console.log("Error in SIgned URL Generation")
    return __.out('',500,"Internal Server Error")
 }
}

export default s3GetSignedUrl