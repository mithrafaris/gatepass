const mongoose = require('mongoose');

const CategorySchema = new mongoose.Schema({
    sl_no:{
        type:Number,
        required:true,

    },
   categoryName: {
        type: String,
        required: true,
        lowercase: true
    },
    description: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        default: 0
    },
    
   gatePass: [{ type: mongoose.Schema.Types.ObjectId, ref: 'gatePass' }]
});

module.exports = mongoose.model('Category',CategorySchema);