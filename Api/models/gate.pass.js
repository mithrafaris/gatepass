const mongoose = require("mongoose");

const passSchema = new mongoose.Schema({
    PassNumber: { 
        type: Number, 
        required: true 
    },
    customerName: { 
        type: String, 
        required: true 
    },
    Remarks:{
        type: String
    },
    customerAddress: { 
        type: String, 
        required: true 
    },
    
    materials: [
        {
            materialId: { 
                type: mongoose.Schema.Types.ObjectId, 
                ref: "Material", 
                required: true 
            },
            materialName: { 
                type: String, 
                required: true 
            },
            quantity: { 
                type: Number, 
                required: true 
            }
        }
    ],
    OutDate: {
        type: Date,
        default: Date.now,
        get: function(value) {
            return value ? new Date(value).toLocaleDateString('en-GB') : null;
        }
    },
    ReturnDate: {
        type: Date,
        get: function(value) {
            return value ? new Date(value).toLocaleDateString('en-GB') : null;
        }
    },
    totalAmount: { 
        type: Number, 
        required: true 
    },
    paymentMethod: { 
        type: String, 
        required: true 
    }
}, {
    toJSON: { getters: true }, 
    toObject: { getters: true } 
});

const Pass = mongoose.model("Pass", passSchema);

module.exports = Pass; 