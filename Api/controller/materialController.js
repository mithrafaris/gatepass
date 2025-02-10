// controllers/materialController.js
const Material = require('../models/material.model');
const { errorHandler } = require('../utils/error');

// Create Material
exports.createMaterial = async (req, res, next) => {
  try {
    const newMaterial = await Material.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'Material created successfully!',
      newMaterial,
    });
  } catch (error) {
    return next(errorHandler(400, 'Failed to create material!'));
  }
};

// Get All Materials
exports.getMaterial = async (req, res, next) => {
  try {
    const materials = await Material.find();
    if (!materials.length) {
      return next(errorHandler(404, 'No materials found!'));
    }
    res.status(200).json({
      success: true,
      materials,
    });
  } catch (error) {
    next(errorHandler(500, 'Server error occurred while fetching materials.'));
  }
};

// Get Material by ID
exports.getMaterialsbyID = async (req, res, next) => {
  try {
    const material = await Material.findById(req.params.id);
    if (!material) {
      return next(errorHandler(404, 'Material not found!'));
    }
    res.status(200).json({
      success: true,
      material,
    });
  } catch (error) {
    next(errorHandler(500, 'Server error occurred while fetching the material.'));
  }
};

// Edit Material
exports.editMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedMaterial = await Material.findByIdAndUpdate(id, req.body, { new: true, runValidators: true });
    if (!updatedMaterial) {
      return next(errorHandler(404, 'Material not found!'));
    }
    res.status(200).json({
      success: true,
      message: 'Material updated successfully!',
      updatedMaterial,
    });
  } catch (error) {
    next(errorHandler(400, 'Failed to update material! Please check the provided data.'));
  }
};

// Delete Material
// Delete Material
exports.deleteMaterial = async (req, res, next) => {
  try {
    const { id } = req.params;
    const deletedMaterial = await Material.findByIdAndDelete(id); // Remove req.body
    if (!deletedMaterial) {
      return next(errorHandler(404, 'Material not found!'));
    }
    res.status(200).json({
      success: true,
      message: 'Material deleted successfully!',
      deletedMaterial,
    });
  } catch (error) {
    next(errorHandler(500, 'Server error occurred while deleting the material.'));
  }
};
