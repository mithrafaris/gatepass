const gatepass = require('../models/gate.pass')
const { errorHandler } = require('../utils/error');

exports.createPass = async (req, res, next) => {
  try {
    console.log("hi");
    
    const newgatepass  = await gatepass.create(req.body);
    console.log(req.body);
    
    return res.status(201).json({
      success: true,
      message: 'gatepass created successfully!',
      newgatepass,
    });
  } catch (error) {
    return next(errorHandler(400, 'Failed to create gatepass!'));
  }
};