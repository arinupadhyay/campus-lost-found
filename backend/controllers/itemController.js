const Item = require('../models/Item');

const createItem = async (req, res) => {
  try {
    const { title, description, category, type, location } = req.body;

    if (!req.file) {
      return res.status(400).json({ message: 'Please upload an image' });
    }

    const item = new Item({
      title,
      description,
      category,
      type,
      location,
      imageUrl: `/uploads/${req.file.filename}`,
      postedBy: req.user._id
    });

    const createdItem = await item.save();
    res.status(201).json(createdItem);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getItems = async (req, res) => {
  try {
    const { search, category, type, location } = req.query;
    let query = {};

    if (search) query.title = { $regex: search,$options: 'i' };
    if (category) query.category = category;
    if (type) query.type = type;
    if (location) query.location = { $regex: location,$options: 'i' };

    const items = await Item.find(query)
      .populate('postedBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id).populate('postedBy', 'name email');

    if (item) {
      res.json(item);
    } else {
      res.status(404).json({ message: 'Item not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);

    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this item' });
    }

    await item.deleteOne();
    res.json({ message: 'Item removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { createItem, getItems, getItemById, deleteItem };