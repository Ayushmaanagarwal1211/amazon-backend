const dotenv = require('dotenv');
dotenv.config();
require('./mongoose_conn');
const express = require('express');
const app = express();
const PORT = process.env.PORT;
const {cartRouter} = require('./cart/cart.js')
const {router,checkUser} = require("./auth/authentication.js");

const cors = require("cors")
app.use(cors())
app.use("/cart",checkUser, cartRouter)
app.use(express.json());
app.use("/auth",router)
const Products = require('./models/Product.js')

app.get('/products',async (req,res)=>{
    const products = await Products.find()
    return res.status(200).json(products)
})

app.get('/get-user',checkUser,(req,res)=>{
    console.log(req.user)
    if(!req.user){
        return res.status(400).send("Not Valid User")
    }

    return res.status(200).json(req.user)
})
app.listen(PORT);
