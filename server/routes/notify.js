const express = require('express');
const Class = require('../models/Class');
const Assignment = require('../models/Assignment');
const auth = require('../middleware/auth');

const router = express.Router();

// Initialize Twilio client only if credentials are provided
let client = null;
if (process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
  try {
    const twilio = require('twilio');
    client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  } catch (error) {
    console.warn('Twilio initialization failed:', error.message);
  }
}

// Send SMS notification
router.post('/sms', auth, async (req, res) => {
  try {
    const { phoneNumbers, message, classId, assignmentId } = req.body;

    if (!client) {
      return res.status(400).json({ 
        message: 'SMS service not configured. Please add Twilio credentials to enable SMS notifications.' 
      });
    }

    if (!process.env.TWILIO_PHONE_NUMBER) {
      return res.status(400).json({ 
        message: 'Twilio phone number not configured' 
      });
    }

    let finalMessage = message;
    
    // If class or assignment ID provided, add relevant info
    if (classId) {
      const classData = await Class.findOne({
        _id: classId,
        teacher: req.user.id
      });
      
      if (classData) {
        const classUrl = `${process.env.CLIENT_URL || 'http://localhost:3000'}/class/${classData.passcode}`;
        finalMessage += `\n\nClass: ${classData.name}\nPasscode: ${classData.passcode}\nLink: ${classUrl}`;
      }
    }

    if (assignmentId) {
      const assignment = await Assignment.findOne({
        _id: assignmentId,
        teacher: req.user.id
      }).populate('class');
      
      if (assignment) {
        finalMessage += `\n\nAssignment: ${assignment.title}\nDeadline: ${assignment.deadline.toLocaleDateString()}`;
      }
    }

    // Send SMS to each phone number
    const results = [];
    for (const phoneNumber of phoneNumbers) {
      try {
        const result = await client.messages.create({
          body: finalMessage,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phoneNumber
        });
        results.push({ phoneNumber, status: 'sent', messageId: result.sid });
      } catch (error) {
        results.push({ phoneNumber, status: 'failed', error: error.message });
      }
    }

    res.json({
      message: 'SMS notifications processed',
      results
    });
  } catch (error) {
    console.error('SMS notification error:', error);
    res.status(500).json({ message: 'Server error sending SMS notifications' });
  }
});

module.exports = router;