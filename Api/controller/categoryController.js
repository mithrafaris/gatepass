const category = require('../models/category')
const { errorHandler } = require('../utils/error');


exports.createcategory = async (req, res, next) => {
  try {
    const newcategory = await category.create(req.body);
    return res.status(201).json({
      success: true,
      message: 'category created successfully!',
      newcategory,
    });
  } catch (error) {
    return next(errorHandler(404,'Failed to create  category!'));  
  }
};
exports.deletecategory = async (req, res, next) => {
  try {
    const newcategory = await category.findById(req.params.id);
    if (!newcategory) {
      return next(errorHandler(404, 'Material not found!'));
    }
 const deletedcategory = await category.findByIdAndDelete(req.params.id);
    if (!deletedcategory) {
      return next(errorHandler(500, 'Failed to delete category!'));
    }

    res.status(200).json({
      success: true,
      message: 'category has been deleted!',
    });
  } catch (error) {
    next(errorHandler(500, 'Server error occurred while deleting category.'));
  }
};
exports.updatecategory = async (req, res, next) => {
  try {
    const category= await category.findById(req.params.id);
    if (!category) {
      return next(errorHandler(404, 'category not found!'));
    }
     const updatedcategory = await category.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedcategory) {
      return next(errorHandler(500, 'Failed to update category.'));
    }

    res.status(200).json({
      success: true,
      message: 'category updated successfully!',
      updatedMaterial,
    });
  } catch (error) {
    next(errorHandler(500, 'Server error occurred while updating category.'));
  }
};

exports.getcategory = async (req, res, next) => {
  try {
    const category = await category.findById(req.params.id);  
    if (!category) {
      return next(errorHandler(404, 'category not found!'));
    }
    res.status(200).json(category);  
  } catch (error) {
    next(error);  
  }
};