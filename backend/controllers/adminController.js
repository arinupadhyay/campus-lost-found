const User = require('../models/User');
const Item = require('../models/Item');
const Claim = require('../models/Claim');

const getAdminStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalItems = await Item.countDocuments();
    const totalClaims = await Claim.countDocuments();

    res.json({ totalUsers, totalItems, totalClaims });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { getAdminStats, getAllUsers };