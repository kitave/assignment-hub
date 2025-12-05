const express = require('express');
const Assignment = require('../models/Assignment');
const Class = require('../models/Class');
const auth = require('../middleware/auth');
const upload = require('../middleware/upload');

const router = express.Router();

// Create new assignment
router.post('/', auth, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      deadline,
      availableFrom,
      expiresAt,
      submissionInstructions,
      teacherNotes,
      classId
    } = req.body;

    // Verify class belongs to teacher
    const classData = await Class.findOne({
      _id: classId,
      teacher: req.user.id
    });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Create assignment data
    const assignmentData = {
      title,
      description,
      subject,
      deadline: new Date(deadline),
      availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
      expiresAt: new Date(expiresAt),
      submissionInstructions,
      teacherNotes,
      class: classId,
      teacher: req.user.id
    };

    // Add file data if uploaded
    if (req.file) {
      assignmentData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    const assignment = new Assignment(assignmentData);
    await assignment.save();

    // Add assignment to class
    await Class.findByIdAndUpdate(classId, {
      $push: { assignments: assignment._id }
    });

    res.status(201).json({
      message: 'Assignment created successfully',
      assignment
    });
  } catch (error) {
    console.error('Create assignment error:', error);
    res.status(500).json({ message: 'Server error creating assignment' });
  }
});

// Get all assignments for authenticated teacher
router.get('/', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ teacher: req.user.id })
      .populate('class', 'name subject passcode')
      .sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get assignments error:', error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
});

// Get assignments for a specific class
router.get('/class/:classId', auth, async (req, res) => {
  try {
    const assignments = await Assignment.find({ 
      class: req.params.classId,
      teacher: req.user.id 
    }).sort({ createdAt: -1 });

    res.json(assignments);
  } catch (error) {
    console.error('Get class assignments error:', error);
    res.status(500).json({ message: 'Server error fetching assignments' });
  }
});

// Get single assignment
router.get('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.id,
      teacher: req.user.id
    }).populate('class', 'name subject passcode');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json(assignment);
  } catch (error) {
    console.error('Get assignment error:', error);
    res.status(500).json({ message: 'Server error fetching assignment' });
  }
});

// Update assignment
router.put('/:id', auth, upload.single('file'), async (req, res) => {
  try {
    const {
      title,
      description,
      subject,
      deadline,
      availableFrom,
      expiresAt,
      submissionInstructions,
      teacherNotes
    } = req.body;

    const updateData = {
      title,
      description,
      subject,
      deadline: new Date(deadline),
      availableFrom: availableFrom ? new Date(availableFrom) : new Date(),
      expiresAt: new Date(expiresAt),
      submissionInstructions,
      teacherNotes
    };

    // Add file data if uploaded
    if (req.file) {
      updateData.file = {
        filename: req.file.filename,
        originalName: req.file.originalname,
        path: req.file.path,
        mimetype: req.file.mimetype,
        size: req.file.size
      };
    }

    const assignment = await Assignment.findOneAndUpdate(
      { _id: req.params.id, teacher: req.user.id },
      updateData,
      { new: true }
    ).populate('class', 'name subject passcode');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    res.json({
      message: 'Assignment updated successfully',
      assignment
    });
  } catch (error) {
    console.error('Update assignment error:', error);
    res.status(500).json({ message: 'Server error updating assignment' });
  }
});

// Delete assignment
router.delete('/:id', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({
      _id: req.params.id,
      teacher: req.user.id
    });

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Remove assignment from class
    await Class.findByIdAndUpdate(assignment.class, {
      $pull: { assignments: req.params.id }
    });

    res.json({ message: 'Assignment deleted successfully' });
  } catch (error) {
    console.error('Delete assignment error:', error);
    res.status(500).json({ message: 'Server error deleting assignment' });
  }
});

module.exports = router;