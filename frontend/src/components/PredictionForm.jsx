import React, { useState } from 'react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Loader, BarChart, Zap } from 'lucide-react'; // Zap for Predict icon
import { getSleepPrediction, savePredictionHistory } from '../api/api.js';
import PredictionModal from './PredictionModal'; // We'll create this next

// --- Define options based on common sleep datasets (adjust as needed) ---
const OCCUPATION_OPTIONS = [
  'Software Engineer', 'Doctor', 'Sales Representative', 'Teacher', 
  'Nurse', 'Engineer', 'Accountant', 'Scientist', 'Lawyer', 'Manager'
];
const BMI_OPTIONS = ['Normal', 'Overweight', 'Obese', 'Normal Weight'];
const DISORDER_OPTIONS = ['None', 'Insomnia', 'Sleep Apnea'];
// Stress Level is 1-10 slider/input

const PredictionForm = () => {
  const [formData, setFormData] = useState({
    Age: '',
    Gender: 'Male', 
    'Sleep Duration': '',
    'Heart Rate': '',
    'Systolic BP': '', 
    'Diastolic BP': '',
    'Body Temperature': '',
    // VVV ADDED MISSING FIELDS VVV
    'Occupation': OCCUPATION_OPTIONS[0],
    'BMI Category': BMI_OPTIONS[0], 
    'Sleep Disorder': DISORDER_OPTIONS[0], 
    'Stress Level': '5', 
    'Daily Steps': '5000', 
    'Physical Activity Level': '50', 
  });
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading('Getting prediction...');

    // Prepare data for ML API (convert types, combine BP)
   const dataForPrediction = {
        Age: Number(formData.Age),
        Gender: formData.Gender,
        'Sleep Duration': Number(formData['Sleep Duration']),
        'Heart Rate': Number(formData['Heart Rate']),
        'Blood Pressure': `${formData['Systolic BP']}/${formData['Diastolic BP']}`,
        'Body Temperature': Number(formData['Body Temperature']),
        // VVV ENSURING ALL FIELDS ARE SENT AS EXPECTED BY PYTHON API VVV
        'Occupation': formData.Occupation,
        'BMI Category': formData['BMI Category'],
        'Sleep Disorder': formData['Sleep Disorder'],
        'Stress Level': Number(formData['Stress Level']), 
        'Daily Steps': Number(formData['Daily Steps']), 
        'Physical Activity Level': Number(formData['Physical Activity Level']),
    };

    try {
      // 1. Get prediction from ML API
      const predictionResponse = await getSleepPrediction(dataForPrediction);
      const predictionValue = predictionResponse.data.prediction; // Assuming the API returns { "prediction": 8.2 }
      setPredictionResult(predictionValue); // Store the numerical prediction
      setShowModal(true); // Show the result modal
      toast.success('Prediction complete!', { id: toastId });

      // 2. Save prediction history to Backend (don't wait for this)
      const userId = JSON.parse(localStorage.getItem('user'))?.id;
      if (userId) {
         const historyData = {
              // Ensure these fields match your Mongoose schema in PredictionHistory model!
           user: userId,
             age: dataForPrediction.Age,
             gender: dataForPrediction.Gender,
             occupation: dataForPrediction.Occupation,
           sleepDuration: dataForPrediction['Sleep Duration'],
             activityLevel: dataForPrediction['Physical Activity Level'], // Corrected field name
             stressLevel: dataForPrediction['Stress Level'],
             bmiCategory: dataForPrediction['BMI Category'],
           heartRate: dataForPrediction['Heart Rate'],
             dailySteps: dataForPrediction['Daily Steps'],
           bloodPressure: dataForPrediction['Blood Pressure'], // Note: Storing combined BP string
             sleepDisorder: dataForPrediction['Sleep Disorder'],
           predicted_quality: predictionValue, // Save the numerical prediction
         };
          
          // NOTE: The backend savePredictionHistory API call MUST accept all these fields now.
         savePredictionHistory(historyData).catch(err => {
            console.error("Failed to save history:", err);
            // Don't bother the user if history save fails
         });
      } else {
        console.warn("User ID not found, cannot save history.");
      }


    } catch (error) {
      console.error("Prediction Error:", error);
      toast.error(
        error.response?.data?.error || 'Prediction failed. Please check inputs and ensure ML API is running.',
        { id: toastId }
      );
      setPredictionResult(null); // Clear any previous result on error
    } finally {
      setLoading(false);
    }
  };

  // Input field variants for animation
  const inputVariants = {
    rest: { scale: 1, borderColor: 'var(--border-color, #D1D5DB)' }, // Use CSS variables for theme
    focus: { scale: 1.02, borderColor: 'var(--primary-color, #4F46E5)', transition: { duration: 0.2 } },
  };

  // Helper function for common input styles
  const getInputStyles = (isSelect = false) => ({
    className: `w-full rounded-lg border bg-transparent p-3 text-light-text outline-none transition-all duration-300 focus:ring-2 focus:ring-opacity-50 dark:text-dark-text ${isSelect ? 'appearance-none pr-8' : ''}`,
    style: { borderColor: 'var(--border-color)', '--primary-color': 'var(--primary-color-light)', '--border-color': 'var(--border-color-light)' },
    onFocus: (e) => { e.target.style.setProperty('--border-color', 'var(--primary-color)'); e.target.style.setProperty('--ring-color', 'var(--primary-color)'); },
    onBlur: (e) => { e.target.style.setProperty('--border-color', document.documentElement.classList.contains('dark') ? 'var(--border-color-dark)' : 'var(--border-color-light)'); },
  });

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
        className="mx-auto max-w-2xl rounded-2xl bg-light-card p-8 shadow-xl dark:bg-dark-card"
        style={{
          '--border-color-light': '#D1D5DB', // gray-300
          '--border-color-dark': '#4B5563',  // gray-600
          '--primary-color-light': '#0a58ca', // light-primary from tailwind.config
          '--primary-color-dark': '#00f2ff',  // dark-primary from tailwind.config
        }}
      >
        <div className="mb-8 text-center">
          <BarChart className="mx-auto h-12 w-12 text-light-primary dark:text-dark-primary" />
          <h2 className="mt-4 text-3xl font-bold">Predict Your Sleep Quality</h2>
          <p className="mt-2 text-light-text/70 dark:text-dark-text/70">
            Enter your details below.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          {/* Age */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
             <label htmlFor="Age" className="block text-sm font-medium mb-1">Age</label>
            <input
              type="number"
              name="Age"
              id="Age"
              value={formData.Age}
              onChange={handleChange}
              required
              min="1"
              max="120"
              placeholder="e.g., 35"
              {...getInputStyles()}
            />
          </motion.div>

          {/* Gender */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
             <label htmlFor="Gender" className="block text-sm font-medium mb-1">Gender</label>
            <select
              name="Gender"
              id="Gender"
              value={formData.Gender}
              onChange={handleChange}
              required
              {...getInputStyles(true)}
            >
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </motion.div>
          
          {/* VVV NEW FIELD: Occupation VVV */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
             <label htmlFor="Occupation" className="block text-sm font-medium mb-1">Occupation</label>
            <select
              name="Occupation"
              id="Occupation"
              value={formData.Occupation}
              onChange={handleChange}
              required
              {...getInputStyles(true)}
            >
              {OCCUPATION_OPTIONS.map(occ => <option key={occ} value={occ}>{occ}</option>)}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </motion.div>

          {/* NEW FIELD: BMI Category */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
             <label htmlFor="BMI Category" className="block text-sm font-medium mb-1">BMI Category</label>
            <select
              name="BMI Category"
              id="BMI Category"
              value={formData['BMI Category']}
              onChange={handleChange}
              required
              {...getInputStyles(true)}
            >
              {BMI_OPTIONS.map(bmi => <option key={bmi} value={bmi}>{bmi}</option>)}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </motion.div>

          {/* Sleep Duration */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
             <label htmlFor="Sleep Duration" className="block text-sm font-medium mb-1">Sleep Duration (hours)</label>
            <input
              type="number"
              name="Sleep Duration"
              id="Sleep Duration"
              step="0.1"
              value={formData['Sleep Duration']}
              onChange={handleChange}
              required
              min="1"
              max="24"
              placeholder="e.g., 7.5"
              {...getInputStyles()}
             />
          </motion.div>

          {/* Heart Rate */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
            <label htmlFor="Heart Rate" className="block text-sm font-medium mb-1">Heart Rate (bpm)</label>
            <input
              type="number"
              name="Heart Rate"
               id="Heart Rate"
              value={formData['Heart Rate']}
              onChange={handleChange}
              required
              min="30"
              max="220"
              placeholder="e.g., 65"
              {...getInputStyles()}
             />
          </motion.div>

          {/* NEW FIELD: Daily Steps */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
            <label htmlFor="Daily Steps" className="block text-sm font-medium mb-1">Daily Steps</label>
            <input
              type="number"
              name="Daily Steps"
               id="Daily Steps"
              value={formData['Daily Steps']}
              onChange={handleChange}
              required
              min="0"
              placeholder="e.g., 5000"
              {...getInputStyles()}
             />
          </motion.div>
          
          {/* NEW FIELD: Physical Activity Level */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
            <label htmlFor="Physical Activity Level" className="block text-sm font-medium mb-1">Physical Activity Level</label>
            <input
              type="number"
              name="Physical Activity Level"
               id="Physical Activity Level"
              value={formData['Physical Activity Level']}
              onChange={handleChange}
              required
              min="0"
              max="100"
              placeholder="e.g., 50"
              {...getInputStyles()}
             />
          </motion.div>

          {/* Blood Pressure (Systolic) */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
            <label htmlFor="Systolic BP" className="block text-sm font-medium mb-1">Systolic BP (mmHg)</label>
            <input
              type="number"
              name="Systolic BP"
              id="Systolic BP"
              value={formData['Systolic BP']}
              onChange={handleChange}
              required
              min="70"
              max="200"
              placeholder="e.g., 120"
              {...getInputStyles()}
             />
          </motion.div>

          {/* Blood Pressure (Diastolic) */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
             <label htmlFor="Diastolic BP" className="block text-sm font-medium mb-1">Diastolic BP (mmHg)</label>
            <input
              type="number"
              name="Diastolic BP"
               id="Diastolic BP"
              value={formData['Diastolic BP']}
              onChange={handleChange}
              required
              min="40"
              max="120"
              placeholder="e.g., 80"
              {...getInputStyles()}
             />
          </motion.div>

          {/* NEW FIELD: Stress Level */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
            <label htmlFor="Stress Level" className="block text-sm font-medium mb-1">Stress Level (1-10)</label>
            <input
              type="number"
              name="Stress Level"
               id="Stress Level"
              value={formData['Stress Level']}
              onChange={handleChange}
              required
              min="1"
              max="10"
              placeholder="e.g., 5"
              {...getInputStyles()}
             />
          </motion.div>
          
          {/* NEW FIELD: Sleep Disorder */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative">
             <label htmlFor="Sleep Disorder" className="block text-sm font-medium mb-1">Sleep Disorder</label>
            <select
              name="Sleep Disorder"
              id="Sleep Disorder"
              value={formData['Sleep Disorder']}
              onChange={handleChange}
              required
              {...getInputStyles(true)}
            >
              {DISORDER_OPTIONS.map(disorder => <option key={disorder} value={disorder}>{disorder}</option>)}
            </select>
             <div className="pointer-events-none absolute inset-y-0 right-0 top-6 flex items-center px-2 text-gray-700 dark:text-gray-400">
                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </motion.div>

          {/* Body Temperature */}
          <motion.div variants={inputVariants} initial="rest" whileFocus="focus" className="relative sm:col-span-2"> {/* Span across two columns */}
             <label htmlFor="Body Temperature" className="block text-sm font-medium mb-1">Body Temp (°C)</label>
            <input
              type="number"
              name="Body Temperature"
              id="Body Temperature"
              step="0.1"
              value={formData['Body Temperature']}
              onChange={handleChange}
              required
              min="35.0"
              max="42.0"
              placeholder="e.g., 36.6"
              {...getInputStyles()}
             />
          </motion.div>

          {/* Submit Button */}
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-light-primary p-3 text-lg font-semibold text-white transition-all duration-300 hover:bg-light-primary/80 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-dark-primary dark:hover:bg-dark-primary/80 sm:col-span-2" // Span across two columns
          >
            {loading ? (
              <Loader className="animate-spin" />
            ) : (
              <Zap className="h-5 w-5" /> // Use Zap icon
            )}
            {loading ? 'Predicting...' : 'Predict Sleep Quality'}
          </motion.button>
        </form>
      </motion.div>

      {/* Conditionally render the modal */}
      {showModal && predictionResult !== null && (
        <PredictionModal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            // Optionally clear the form after closing modal
            // setFormData({ Age: '', Gender: 'Male', 'Sleep Duration': '', 'Heart Rate': '', 'Systolic BP': '', 'Diastolic BP': '', 'Body Temperature': '' });
          }}
          prediction={predictionResult}
        />
      )}
    </>
  );
};

export default PredictionForm;