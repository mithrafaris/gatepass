const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
    PassNumber: {
        type: Number,
        required: true,
    },
    customerName: {
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
    },
    address: {
        type: String,
    },
    material: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "Material",
    },
});

module.exports = mongoose.model("Pass", passSchema);
