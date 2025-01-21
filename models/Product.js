const mongoose = require("mongoose")


const profileSchema = mongoose.Schema({
    name: { type: String, required: true },
    image: { type: String, required: true },
    price: { type: Number, required: true },
    originalPrice: { type: Number, required: true },
    discount: { type: Number, required: true },
    color: { type: String, required: true },
    size: { type: String, required: true },
    pattern: { type: String, required: true },
    material: { type: String, required: true },
    threadCount: { type: Number, required: true },
    washingInstructions: { type: String, required: true },
    deliveryEstimate: { type: String, required: true },
    seller: { type: String, required: true },
    ratings: { type: Number, required: true },
    reviews: { type: Number, required: true },
    quantity: { type: Number, required: true },
    inStock: { type: Boolean, required: true },
    isFulfilled: { type: Boolean, required: true },
    isGift: { type: Boolean, required: true },
})

module.exports = mongoose.model("product" , profileSchema)