const express = require("express")
const router = express()
const cartData = require("./cart.json")
const User = require("../models/User")
const {checkUser} = require("../auth/authentication")
const mongoose = require("mongoose")
router.get("/",async (req,res)=>{
    const user = await User.findById(req.user._id).populate("cart.product")
    console.log(user.cart,'sdddddddd')
    return res.status(200).json(user.cart)
})
router.post("/add-product/:productId", async (req,res)=>{
    let user = await User.findById(req.user._id)
    user.cart.push({
        product :req.params.productId
    })
    await user.save()
    user  = await user.populate("cart.product")

    return res.status(200).send(user.cart)
})

router.patch("/increase-product-count/:id", async (req,res)=>{
    let user = await User.findById(req.user._id)
    user.cart = user.cart.map((data)=>{
        console.log(data._id , req.params.id,data._id == req.params.id)   
        if(data._id == req.params.id){
            return {...data,count:data.count+1}
        }
        return data
    })
    // console.log(user)
    await user.save()
    user  = await user.populate("cart.product")
    return res.status(200).send(user.cart)
})

router.patch("/decrease-product-count/:id", async (req,res)=>{
    let user = await User.findById(req.user._id)
    user.cart = user.cart.map((data)=>{
        console.log(data._id , req.params.id,data._id == req.params.id)   
        if(data._id == req.params.id){
            return {...data,count:data.count-1}
        }
        return data
    })
    // console.log(user)
    await user.save()
    user  = await user.populate("cart.product")
    return res.status(200).send(user.cart)
})

router.patch("/remove-product-from-cart/:id", async (req,res)=>{
    let user = await User.findById(req.user._id)
    user.cart = user.cart.filter((data)=>{console.log(data._id == req.params.id);return data._id.toString() !== req.params.id})
    console.log(user.cart,req.params.id)
    await user.save()
    user  = await user.populate("cart.product")
    
    return res.status(200).send(user.cart)
})


router.patch("/change-product-selection/:id", async (req,res)=>{
    let user = await User.findById(req.user._id)
    user.cart = user.cart.map((data)=>{
        if(data._id == req.params.id){
            return {...data,isSelected:!data.isSelected}
        }
        return data
    })
    await user.save()
    user  = await user.populate("cart.product")
    return res.status(200).send(user.cart)
})


module.exports = {cartRouter: router}