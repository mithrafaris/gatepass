const mongoose = require("mongoose");
const Material = require('./material.model')

const passSchema = new mongoose.Schema({
    PassNumber: {
        type: Number,
        required: true,
    },
    customerName: {
        type: String,
    }, 
    customerAddress: {
        type: String,
    },
    OutDate: {
        type: Date,
        default: new Date(),
    },
    inDate: {
        type: Date,
        default: new Date(),
    },
    totalAmount: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        required: true,
        enum: ['Cash','Card', 'Online'],
      },
    material: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Material",
    },
});

module.exports = mongoose.model("Pass", passSchema);
