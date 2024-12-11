const express = require('express');
const { signUp, signIn, signOut, getuser } = require('../controller/userController');
const { createMaterial, getMaterial,getMaterialsbyID } = require('../controller/materialController');
const { verifyToken } = require('../utils/verifyUser');

const router = express.Router();

router.post('/signup', signUp);
router.post('/signin', signIn);
router.get('/signout', signOut);
router.get('/getuser', getuser);


//materia
router.post('/material',createMaterial)
router.get('/getMaterial',getMaterial )
router.get('/getMaterial/:id',getMaterialsbyID );

module.exports = router;
