const express = require("express")
const router = express.Router()
const bcrypt = require("bcrypt")
const users  = []
const jwt =  require("jsonwebtoken")
const dotenv = require("dotenv").config()
const JWT_SECRET = process.env.JWT_SECRET
const refreshTokensSet = new Set()
const REFRESH_TOKEN =process.env.REFRESH_TOKEN
const User = require('../models/User')

router.post("/",async (req,res)=>{
    
    const {password,name,email} = req.body.data
    const hashed_password = await bcrypt.hash(password, 10)
    const user = await User.create({password:hashed_password,name,email})
    res.json(user)
})

router.delete('/logout',async (req,res)=>{
    refreshTokensSet.delete(req.body.refresh_token)
    return res.json(refreshTokensSet )  
})
router.post('/login',async (req,res)=>{
    const {password,email} = req.body.data
    const users = await User.find()
    const user = users.find((data)=>data.email == email)
    if(!user){
        return res.status(400).json("User not found")
    }
    const isCorrect = await bcrypt.compare(password , user.password)
    if(isCorrect){
        const user_to_encrypt = {email,name:user.name,_id:user._id}
        const refresh_token = jwt.sign(user_to_encrypt,REFRESH_TOKEN)
        const token = generateToken({...user_to_encrypt})
        refreshTokensSet.add(refresh_token)
        return  res.status(200).json({user:user_to_encrypt,token,refresh_token})
    }
    res.status(400).json("Wrong user")
})

router.post("/refresh-token",(req,res)=>{
    const refresh__token = req.body.refresh_token
    // if(!refreshTokensSet.has(refresh__token)){return res.status(400).send("Expired")}
    const data = jwt.verify(refresh__token, REFRESH_TOKEN)
    const user_to_encrypt = {email:data.email,name:data.name,_id:data._id}

    const new_token = generateToken(user_to_encrypt)
    return res.status(200).json({new_token})
})
function checkUser(req,res,next){
    let token = req.headers.authorization
    if(token){
        token = token.split(" ")[1]
    }
    if(!token){
        return  res.status(401).json({message : "unauthorized"})
    }
    console.log(token)
    try{
        const user  = jwt.verify(token, JWT_SECRET)
        if(!user){
            return res.json("Not Valid")
        }
        req.user = user
        next()
    }catch(err){
        return res.status(403).json({message : "jwt expired"})
    }
}
function generateToken(data){
    const token = jwt.sign(data,JWT_SECRET,{expiresIn:"5s"})
    return token
}

module.exports = {router,refreshTokensSet,checkUser}