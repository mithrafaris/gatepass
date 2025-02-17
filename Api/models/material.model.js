const mongoose = require('mongoose');

const materialSchema = new mongoose.Schema({
  materialNumber: {
    type: Number,
    required: true,
  },
  materialName: {
    type: String,
    required: true,
    lowercase: true,
  },
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    required: true,
    min: [0, "Stock must be a non-negative number"],
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['Accessories', 'Tools', 'Parts'],
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Material', materialSchema);
