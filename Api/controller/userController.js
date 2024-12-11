const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');


exports.signUp = async (req, res, next) => {
  const { username, email, password } = req.body;

  try {
    if (!username || !email || !password) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });

    await newUser.save();
    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error('Error while saving new user:', error);
    next({ status: 500, message: 'An error occurred while creating the user' });
  }
};


exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'User not found' });
    }
  const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY);
    const { password: pass, ...rest } = user._doc;
    res
      .cookie('access_token', token, { httpOnly: true })
      .status(200)
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Sign-Out
exports.signOut = async (req, res, next) => {
  try {
    res.clearCookie('access_token');
    res.status(200).json('User has been signed out');
  } catch (error) {
    next(error);
  }
};
exports.getuser= async(req,res,next)=>{
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch users" });
  }
}

exports.getSearching = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    const searchTerm = req.query.searchTerm || '';
    const sort = req.query.sort || 'createdAt';
    const order = req.query.order || 'desc';
    const sortFields = ['materialName', 'category', 'materialNumber'];
    const sortBy = sortFields.includes(sort) ? sort : 'createdAt';
    const sortOrder = order === 'desc' ? -1 : 1;

    const materials = await Material.find({
      name: { $regex: searchTerm, $options: 'i' }, 
    })
      .sort({ [sortBy]: sortOrder })
      .limit(limit)
      .skip(startIndex);

    return res.status(200).json(materials);
  } catch (error) {
    next(error);  
  }
}
