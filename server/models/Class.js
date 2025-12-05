const mongoose = require('mongoose');

const ClassSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Class name is required'],
    trim: true,
    maxlength: [100, 'Class name cannot exceed 100 characters']
  },
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true,
    maxlength: [50, 'Subject cannot exceed 50 characters']
  },
  passcode: {
    type: String,
    required: [true, 'Passcode is required'],
    unique: true,
    uppercase: true,
    minlength: [4, 'Passcode must be at least 4 characters'],
    maxlength: [8, 'Passcode cannot exceed 8 characters']
  },
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  assignments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Assignment'
  }],
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Generate unique passcode
ClassSchema.statics.generatePasscode = async function() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let passcode;
  let exists = true;
  
  while (exists) {
    passcode = '';
    for (let i = 0; i < 6; i++) {
      passcode += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    exists = await this.findOne({ passcode });
  }
  
  return passcode;
};

module.exports = mongoose.model('Class', ClassSchema);