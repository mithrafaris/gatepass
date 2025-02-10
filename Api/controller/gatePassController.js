const Gatepass = require('../models/gate.pass'); 
const Material = require('../models/material.model');

const { errorHandler } = require('../utils/error');

// Create Gatepass
exports.createPass = async (req, res, next) => {
  try {
    const { material, totalAmount } = req.body;

    const materialDoc = await Material.findOne({ materialName: material.trim().toLowerCase() });
    if (!materialDoc) {
      return next(errorHandler(404, `Material '${material}' not found in stock!`));
    }

    if (totalAmount > 0) {
      if (materialDoc.stock <= 0) {
        return next(errorHandler(400, 'Material is out of stock!'));
      }
      materialDoc.stock -= 0;
    } else {
      materialDoc.stock += 0;
    }

    await materialDoc.save();

    const newGatePass = await Gatepass.create(req.body);

    return res.status(201).json({
      success: true,
      message: 'Gatepass created successfully!',
      gatePass: newGatePass,
    });
  } catch (error) {
    return next(errorHandler(400, 'Failed to create gatepass!'));
  }
};
exports.getpass = async (req, res, next) => {
  try {
    const pass = await Gatepass.find(); 
    if (!pass || pass.length === 0) {
      return next(errorHandler(404, 'No gate passes found!'));
    }
    res.status(200).json({
      success: true,
      pass,
    });
  } catch (error) {
    console.error('Error fetching gate passes:', error);
    next(errorHandler(500, 'Server error occurred while fetching gate passes.'));
  }
};
exports.returnMaterial = async (req, res, next) => {
  try {
    const { PassNumber, material, ReturnDate } = req.body;

    console.log(req.body);

    const gatePass = await Gatepass.findOne({ PassNumber });
    if (!gatePass) {
      return next(errorHandler(404, "Gate Pass not found!"));
    }

    // Check if material has already been returned
    if (gatePass.ReturnDate) {
      return next(errorHandler(400, "This material has already been returned!"));
    }

    const materialDoc = await Material.findOne({ materialName: material.trim().toLowerCase() });
    if (!materialDoc) {
      return next(errorHandler(404, "Material not found in stock!"));
    }

    materialDoc.stock += gatePass.totalAmount;
    await materialDoc.save();

    gatePass.ReturnDate = ReturnDate;
    await gatePass.save();

    res.status(200).json({
      success: true,
      message: "Material returned successfully!",
      gatePass,
    });
  } catch (error) {
    next(errorHandler(500, "Failed to return material!"));
  }
};

exports.deletePass = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Find and delete the gate pass by id
    const deletedPass = await Gatepass.findByIdAndDelete(id);

    if (!deletedPass) {
      return next(errorHandler(404, 'Gate Pass not found!'));
    }

    res.status(200).json({
      success: true,
      message: 'Gate Pass deleted successfully!',
      deletedPass,
    });
  } catch (error) {
    next(errorHandler(500, 'Failed to delete gate pass!'));
  }
};