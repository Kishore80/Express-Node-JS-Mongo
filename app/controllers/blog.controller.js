import Blogs from "../model/blog.model.js"
import Users from "../model/user.model.js"
import __ from "../../helpers/globalFunctions.js"
import s3GetSignedUrl from "../../helpers/s3SignedUrl.js"

class blogs {
    createBlog = async(req , res)=>{
        try {
            console.log("Req.user",req.user)
            let {title , description , imageUrl } = req.body
            let imageAttachment = []
            if(req.file){
                imageAttachment.push({
                    path:req.file.location,
                    data:req.file
                })
            }
            let createBlog = await Blogs.create({
                title,
                description,
                imageUrl:imageAttachment,
                userId:req.user.userId
            })
            
            // if (req.files) {
            //     let myArray = []
            //     let findPreviousImages = confirmAPest.attachmentFile;
            //     if (findPreviousImages.length > 0) {
            //         myArray = findPreviousImages
            //     }
            //     for (const value of req.files) {
            //         myArray.push({
            //             path: value.location,
            //             data: value
            //         })
            //         //('myarr', myArray)
            //     }
            //     confirmAPest.attachmentFile = myArray
            // }
            if(createBlog){
                return __.out(res,200,{
                    message:"Blog Created Successfully",
                    data: createBlog._id
                })
            }else{
                return __.out(res,400,{
                    message:"Unable to Create a Blog. Please Try Again Later"
                })
            }
        } catch (error) {
            console.log("Error",error)
            return __.out(res,500,"Internal Server Error Occured")
        }
    }

    listAllblogs = async(req,res) =>{
        try{
            let listAllBlogs = await Blogs.find();
            if(!listAllBlogs.length){
                return __.out(res,200,{
                    message:"Sorry there are no blogs to show",
                    data:[]
                })
            }else{
                return __.out(res,200,{
                    message:"Blog List",
                    data:listAllBlogs
                })
            }
        }catch(error) {
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error Occured")
        }
    }

    listBlogsOfUser = async(req , res)=>{
        try {
            let blogsByaUser = await Blogs
                .find({
                    userId:req.user.userId,
                    status:1
                })
                .populate({
                    path: 'userId',
                    select: 'email isActive'
                })
            for(const x of blogsByaUser){
                // console.log('x',x.imageUrl.length)
                if(x.imageUrl.length){
                    let key = x.imageUrl[0].data.key
                    let signedUrl = await s3GetSignedUrl(key)
                    x.imageUrl[0].path = signedUrl
                    x.imageUrl[0].data.location = signedUrl
                }
            }    
            return __.out(res,200,{
                message:"Blogs",
                data:blogsByaUser
            })  
        }catch (error) {
            console.log(error,"ErROR")
        }
    }

    deleteABlog = async(req,res)=>{
        try {
            let deleteABlog = await Blogs.updateOne({
                _id : req.params.blogId
            },{
                $set:{
                    status : 2 //Soft Delete a Blog
                }
            })
            return __.out(res,200,"Blog Deleted Successfully")
        } catch (error) {
            console.log("ERROR",error)
            return __.out(res,500,"Internal Server Error")
        }
    }

    updateBlog = async(req,res)=>{
        try {
            let updateABlog = await Blogs.updateOne({
                _id:req.body.id
            },{
                $set:{
                    title:req.body.title,
                    description:req.body.description
                }
            })
            return __.out(res,200,"Blog Updated Successfully")
        } catch (error) {
            return __.out(res,500,"Internal Server Error")
        }
    }
}

blogs = new blogs()
export default blogs

