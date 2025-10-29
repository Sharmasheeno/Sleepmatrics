const mongoose = require('mongoose');

const historySchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    // --- All the inputs from the form ---
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    occupation: { type: String, required: true },
    sleepDuration: { type: Number, required: true },
    activityLevel: { type: Number, required: true },
    stressLevel: { type: Number, required: true },
    bmiCategory: { type: String, required: true },
    heartRate: { type: Number, required: true },
    dailySteps: { type: Number, required: true },
    bloodPressure: { type: String, required: true },
    sleepDisorder: { type: String, required: true },
    
    // --- The result ---
    predicted_quality: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PredictionHistory = mongoose.model('PredictionHistory', historySchema);
module.exports = PredictionHistory;

