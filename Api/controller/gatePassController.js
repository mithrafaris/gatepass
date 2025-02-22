const Gatepass = require('../models/gate.pass'); 
const Material = require('../models/material.model');
const { errorHandler } = require('../utils/error');

exports.createPass = async (req, res) => {
  try {
    const { PassNumber, customerName, customerAddress, materials, OutDate, totalAmount, paymentMethod, Remarks } = req.body;

    // Fetch material names and update stock
    const updatedMaterials = await Promise.all(materials.map(async (mat) => {
      const materialData = await Material.findById(mat.materialId);
      if (!materialData) {
        throw new Error(`Material with ID ${mat.materialId} not found`);
      }

      // Check if stock is available
      if (materialData.stock < mat.quantity) {
        throw new Error(`Insufficient stock for material ${materialData.materialName}`);
      }

      // Deduct stock
      materialData.stock -= mat.quantity;
      await materialData.save();

      return {
        materialId: mat.materialId,
        materialName: materialData.materialName,
        quantity: mat.quantity,
        Remarks: mat.Remarks || ""
      };
    }));

    const newPass = new Gatepass({
      PassNumber,
      customerName,
      customerAddress,
      materials: updatedMaterials,
      OutDate,
      totalAmount,
      paymentMethod,
      Remarks
    });

    await newPass.save();
    console.log(req.body);

    res.status(201).json({ success: true, message: "Pass created successfully!" });
  } catch (error) {
    console.error("Error creating pass:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all gate passes
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
    return next(errorHandler(500, 'Server error occurred while fetching gate passes.'));
  }
};

// Return material (update the stock)
exports.returnMaterial = async (req, res, next) => {
  try {
    const { PassNumber, materials, ReturnDate } = req.body;

    // Validate input
    if (!PassNumber || !materials || !Array.isArray(materials) || materials.length === 0 || !ReturnDate) {
      return next(errorHandler(400, "Invalid input data!"));
    }

    const gatePass = await Gatepass.findOne({ PassNumber });
    if (!gatePass) {
      return next(errorHandler(404, "Gate Pass not found!"));
    }

    // Check if material has already been returned
    if (gatePass.ReturnDate) {
      return next(errorHandler(400, "This material has already been returned!"));
    }

    // Loop through each material being returned
    for (let item of materials) {
      const { materialName, quantity } = item;

      if (!materialName || !quantity || quantity <= 0) {
        return next(errorHandler(400, "Invalid material or quantity!"));
      }

      // Find the material document in the stock
      const materialDoc = await Material.findOne({ materialName });
      if (!materialDoc) {
        return next(errorHandler(404, `Material ${materialName} not found in stock!`));
      }

      // Increase the stock based on the quantity returned
      materialDoc.stock += parseInt(quantity);
      await materialDoc.save();
    }

    // Set the return date in the gate pass
    gatePass.ReturnDate = ReturnDate;
  
    await gatePass.save();

    res.status(200).json({
      success: true,
      message: "Materials returned successfully!",
      gatePass,
    });
  } catch (error) {
    console.error(error);
    next(errorHandler(500, "Failed to return materials!"));
  }
};

// Delete Gatepass
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
    console.error(error);
    next(errorHandler(500, 'Failed to delete gate pass!'));
  }
};


exports.editPass = async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // Parse dates if they exist
    const parseDateString = (dateStr) => {
      if (!dateStr) return null;
      
      // Split the date string into components
      const [day, month, year] = dateStr.split('/');
      // Create a new Date object (month is 0-based in JavaScript)
      return new Date(year, month - 1, day);
    };

    const updateData = {
      customerName: req.body.customerName,
      customerAddress: req.body.customerAddress,
      totalAmount: req.body.totalAmount,
      paymentMethod: req.body.paymentMethod,
      Remarks: req.body.Remarks
    };

    // Only add dates if they exist and are valid
    if (req.body.OutDate) {
      const parsedOutDate = parseDateString(req.body.OutDate);
      if (parsedOutDate && !isNaN(parsedOutDate)) {
        updateData.OutDate = parsedOutDate;
      }
    }

    if (req.body.ReturnDate) {
      const parsedReturnDate = parseDateString(req.body.ReturnDate);
      if (parsedReturnDate && !isNaN(parsedReturnDate)) {
        updateData.ReturnDate = parsedReturnDate;
      }
    }

    // Find and update the gate pass
    const updatedGatePass = await Gatepass.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedGatePass) {
      return next(errorHandler(404, 'Gate pass not found!'));
    }

    res.status(200).json({
      success: true,
      message: 'Gate pass updated successfully!',
      updatedGatePass,
    });
  } catch (error) {
    console.error('Error updating gate pass:', error);
    return next(errorHandler(500, 'Failed to update gate pass!'));
  }
};