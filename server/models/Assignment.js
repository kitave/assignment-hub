const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Assignment title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Assignment description is required'],
    maxlength: [2000, 'Description cannot exceed 2000 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [50, 'Subject cannot exceed 50 characters']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    }
  },
  availableFrom: {
    type: Date,
    default: Date.now
  },
  expiresAt: {
    type: Date,
    required: [true, 'Expiration date is required']
  },
  file: {
    filename: String,
    originalName: String,
    path: String,
    mimetype: String,
    size: Number
  },
  submissionInstructions: {
    type: String,
    default: '',
    maxlength: [1000, 'Submission instructions cannot exceed 1000 characters']
  },
  teacherNotes: {
    type: String,
    default: '',
    maxlength: [1000, 'Teacher notes cannot exceed 1000 characters']
  },
  class: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Check if assignment is currently available
AssignmentSchema.methods.isAvailable = function() {
  const now = new Date();
  return now >= this.availableFrom && now <= this.expiresAt;
};

// Check if assignment is expired
AssignmentSchema.methods.isExpired = function() {
  return new Date() > this.expiresAt;
};

module.exports = mongoose.model('Assignment', AssignmentSchema);