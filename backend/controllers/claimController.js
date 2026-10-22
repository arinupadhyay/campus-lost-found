const Claim = require('../models/Claim');
const Item = require('../models/Item');

const createClaim = async (req, res) => {
  try {
    const { itemId, proofDescription } = req.body;

    const item = await Item.findById(itemId);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    if (item.postedBy.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot claim your own posted item' });
    }

    const existingClaim = await Claim.findOne({ item: itemId, claimedBy: req.user._id });
    if (existingClaim) {
      return res.status(400).json({ message: 'You have already submitted a claim for this item' });
    }

    const claim = new Claim({
      item: itemId,
      claimedBy: req.user._id,
      proofDescription
    });

    const createdClaim = await claim.save();
    res.status(201).json(createdClaim);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const getMyClaims = async (req, res) => {
  try {
    const claims = await Claim.find({ claimedBy: req.user._id })
      .populate('item')
      .sort({ createdAt: -1 });

    res.json(claims);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

const updateClaimStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const claim = await Claim.findById(req.params.id).populate('item');

    if (!claim) return res.status(404).json({ message: 'Claim not found' });

    if (claim.item.postedBy.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to update this claim' });
    }

    claim.status = status;
    await claim.save();

    if (status === 'Approved') {
      await Item.findByIdAndUpdate(claim.item._id, { status: 'Claimed' });
    }

    res.json(claim);
  } catch (error) {
    res.status(500).json({ message: 'Server error: ' + error.message });
  }
};

module.exports = { createClaim, getMyClaims, updateClaimStatus };