const express = require('express');
const QRCode = require('qrcode');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate printable slip for a class
router.get('/slip/:classId', auth, async (req, res) => {
  try {
    const classData = await Class.findOne({
      _id: req.params.classId,
      teacher: req.user.id
    }).populate('assignments');

    if (!classData) {
      return res.status(404).json({ message: 'Class not found' });
    }

    // Generate QR code for the class
    const classUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/class/${classData.passcode}`;
    const qrCode = await QRCode.toDataURL(classUrl);

    // Filter active assignments
    const now = new Date();
    const activeAssignments = classData.assignments.filter(assignment => {
      return assignment.availableFrom <= now && assignment.expiresAt >= now;
    });

    res.json({
      class: {
        name: classData.name,
        subject: classData.subject,
        passcode: classData.passcode,
        teacher: req.user.name
      },
      assignments: activeAssignments,
      qrCode,
      classUrl,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Generate print slip error:', error);
    res.status(500).json({ message: 'Server error generating print slip' });
  }
});

// Generate printable slip for specific assignment
router.get('/assignment/:assignmentId', auth, async (req, res) => {
  try {
    const assignment = await Assignment.findOne({
      _id: req.params.assignmentId,
      teacher: req.user.id
    }).populate('class');

    if (!assignment) {
      return res.status(404).json({ message: 'Assignment not found' });
    }

    // Generate QR code for the class
    const classUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/class/${assignment.class.passcode}`;
    const qrCode = await QRCode.toDataURL(classUrl);

    res.json({
      assignment: {
        title: assignment.title,
        description: assignment.description,
        subject: assignment.subject,
        deadline: assignment.deadline,
        submissionInstructions: assignment.submissionInstructions
      },
      class: {
        name: assignment.class.name,
        subject: assignment.class.subject,
        passcode: assignment.class.passcode
      },
      teacher: req.user.name,
      qrCode,
      classUrl,
      generatedAt: new Date()
    });
  } catch (error) {
    console.error('Generate assignment slip error:', error);
    res.status(500).json({ message: 'Server error generating assignment slip' });
  }
});

module.exports = router;