const mongoose = require("mongoose")

const cart = mongoose.Schema({
    product : {
        type : mongoose.Schema.Types.ObjectId,
        ref : "product"
    },
    count : {
        type : Number,
        default  :1
    },
    isSelected : {
        type :  Boolean,
        default : true
    }
})

const profileSchema = mongoose.Schema({
    name : {type:String, required:true},
    email : {type:String, required:true},
    password : {type:String, required:true},
    cart : {
        type : [cart],
        default : []
    }
})

module.exports = mongoose.model("user" , profileSchema)