import mongoose from 'mongoose';

const donationRequestSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bloodType: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
    required: true
  },
  urgency: {
    type: Number,
    min: 1,
    max: 10,
    required: true
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  status: {
    type: String,
    enum: ['pending', 'accepted', 'completed', 'cancelled'],
    default: 'pending'
  },
  donor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  priorityScore: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

donationRequestSchema.index({ location: '2dsphere' });

export default mongoose.model('DonationRequest', donationRequestSchema);