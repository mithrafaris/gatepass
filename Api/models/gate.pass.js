const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
    PassNumber: {
        type: String, 
        required: true,
        unique: true, 
    },
    customerName: {
        type: String, 
        required: true,
    },
    customerAddress: {
        type: String, 
        required: true,
    },
    OutDate: {
        type: Date,
        default: Date.now,
        get: function(value) {
            if (!value) return null;
            return new Date(value).toLocaleDateString('en-GB'); 
        }
    },
    ReturnDate: {
        type: Date,
        get: function(value) {
            if (!value) return null;
            return new Date(value).toLocaleDateString('en-GB');
        }
    },
    totalAmount: {
        type: Number,
    },
    paymentMethod: {
        type: String,
        enum: ['Cash', 'Card', 'Online'],
        required: true,
    },
    material: {
        type: String,
        required: true,
    }
}, { 
    toJSON: { getters: true }, 
    toObject: { getters: true } 
});

module.exports = mongoose.model("Pass", passSchema);
