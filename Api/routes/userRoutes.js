// routes/index.js
const express = require('express');
const {
  signUp,
  signIn,
  signOut,
  getuser,
  deleteUser
} = require('../controller/userController');
const {
  createMaterial,
  getMaterial,
  getMaterialsbyID,
  editMaterial,
  deleteMaterial,
  
} = require('../controller/materialController');
const { verifyToken } = require('../utils/verifyUser');
const { createPass, getpass, returnMaterial,deletePass,editPass } = require('../controller/gatePassController');

const router = express.Router();

// User routes
router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.get('/getuser', getuser);
router.delete('/delete/:id', deleteUser);

// Material routes
router.post('/material', createMaterial);
router.get('/getMaterial', getMaterial);
router.get('/getMaterial/:id', getMaterialsbyID);
router.put('/editMaterial/:id', editMaterial)
router.put('/return-material', returnMaterial);
router.delete('/deleteMaterial/:id', deleteMaterial); // Remove the extra space after `:id`


// Gate pass routes
router.post('/gatepass', createPass);
router.get('/getpass', getpass);

router.delete('/deletepass/:id', deletePass);  
router.put('/editpass/:id', editPass)

module.exports = router;
