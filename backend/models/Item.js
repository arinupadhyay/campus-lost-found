const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please add a title'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'Please add a description']
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
      enum: ['Electronics', 'IDs/Cards', 'Clothing', 'Keys', 'Books', 'Other']
    },
    type: {
      type: String,
      required: [true, 'Please specify if lost or found'],
      enum: ['Lost', 'Found']
    },
    location: {
      type: String,
      required: [true, 'Please add a campus location']
    },
    imageUrl: {
      type: String,
      required: [true, 'Please provide an image']
    },
    status: {
      type: String,
      enum: ['Open', 'Claimed', 'Resolved'],
      default: 'Open'
    },
    postedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model('Item', itemSchema);