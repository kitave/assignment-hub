const express = require('express');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');

const router = express.Router();

// Get class by passcode (public route for students)
router.get('/class/:passcode', async (req, res) => {
  try {
    const passcode = req.params.passcode.toUpperCase();
    
    const classData = await Class.findOne({ passcode })
      .populate('teacher', 'name')
      .populate({
        path: 'assignments',
        select: '-teacherNotes' // Exclude teacher notes from student view
      });

    if (!classData) {
      return res.status(404).json({ message: 'Class not found with this passcode' });
    }

    // Filter assignments based on availability
    const now = new Date();
    const availableAssignments = classData.assignments.filter(assignment => {
      return assignment.availableFrom <= now && assignment.expiresAt >= now;
    });

    res.json({
      class: {
        name: classData.name,
        subject: classData.subject,
        passcode: classData.passcode,
        teacher: classData.teacher.name
      },
      assignments: availableAssignments
    });
  } catch (error) {
    console.error('Get class by passcode error:', error);
    res.status(500).json({ message: 'Server error fetching class' });
  }
});

// Get public classes list (for notice board)
router.get('/classes/public', async (req, res) => {
  try {
    const classes = await Class.find()
      .populate('teacher', 'name')
      .select('name subject passcode teacher')
      .sort({ createdAt: -1 });

    res.json(classes);
  } catch (error) {
    console.error('Get public classes error:', error);
    res.status(500).json({ message: 'Server error fetching public classes' });
  }
});

module.exports = router;