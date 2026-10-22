const express = require('express');
const router = express.Router();
const { createItem, getItems, getItemById, deleteItem } = require('../controllers/itemController');
const { protect } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
  .get(getItems)
  .post(protect, upload.single('image'), createItem);

router.route('/:id')
  .get(getItemById)
  .delete(protect, deleteItem);

module.exports = router;