import mongoose from 'mongoose'

let blogSchema = new mongoose.Schema({
    title:{
        type : String ,
        required: true
    },
    description :{
        type : String ,
        required: true
    },
    imageUrl:[{
        path: { type: String },
        data: { type: Object }
    }],
    userId:{
        type:mongoose.Schema.ObjectId,
        ref: 'user'
    },
    status:{
        type:Number,
        default:1 // 1- Blog Exist , 2 -- Blog Delete - Soft Delete
    }
},{
    timestamps:true
})

export default mongoose.model('blogs',blogSchema);