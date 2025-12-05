const express = require('express');
const Class = require('../models/Class');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new class
router.post('/', auth, async (req, res) => {
  try {
    const { name, subject, passcode } = req.body;
    
    // Check if passcode already exists
    const existingClass = await Class.findOne({ passcode: passcode.toUpperCase() });
    if (existingClass) {
      return res.status(400).json({ message: 'Passcode already exists. Please choose another.' });
    }

    // Create new class
    const newClass = new Class({
      name,
      subject,
      passcode: passcode.toUpperCase(),
      teacher: req.user.id
    });

    await newClass.save();

    // Add class to user's classes array
    await User.findByIdAndUpdate(req.user.id, {
      $push: { classes: newClass._id }
    });

    res.status(201).json({
      message: 'Class created successfully',
      class: newClass
    });
  } catch (error) {
    console.error('Create class error:', error);
    res.status(500).json({ message: 'Server error creating class' });
  }
});

// Get all classes for authenticated teacher
router.get('/', auth, async (req, res) => {
  try {
    const classes = await Class.find({ teacher: req.user.id })
      .populate('assignments')
      .sort({ createdAt: -1 });

    res.json(classes);
  } catch (error) {
    console.error('Get classes error:', error);
    res.status(500).json({ message: 'Server error fetching classes' });
  }
});

// Get single class
router.get('/:id', auth, async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.id,
      teacher: req.user.id
    }).populate('assignments');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json(classData);
  } catch (error) {
    console.error('Get class error:', error);
    res.status(500).json({ message: 'Server error fetching class' });
  }
});

// Update class
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, subject } = req.body;
    
    const classData = await Class.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user.id },
      { name, subject },
      { new: true }
    );

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    res.json({
      message: 'Class updated successfully',
      class: classData
    });
  } catch (error) {
    console.error('Update class error:', error);
    res.status(500).json({ message: 'Server error updating class' });
  }
});

// Delete class
router.delete('/:id', auth, async (req, res) => {
  try {
    const classData = await Class.findOneAndDelete({
      _id: req.params.id,
      teacher: req.user.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Remove class from user's classes array
    await User.findByIdAndUpdate(req.user.id, {
      $pull: { classes: req.params.id }
    });

    res.json({ message: 'Class deleted successfully' });
  } catch (error) {
    console.error('Delete class error:', error);
    res.status(500).json({ message: 'Server error deleting class' });
  }
});

// Generate random passcode
router.post('/generate-passcode', auth, async (req, res) => {
  try {
    const passcode = await Class.generatePasscode();
    res.json({ passcode });
  } catch (error) {
    console.error('Generate passcode error:', error);
    res.status(500).json({ message: 'Server error generating passcode' });
  }
});

module.exports = router;