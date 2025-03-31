import React, { useState } from 'react';
import { addDailyHealth } from '../services/dailyHealthService';
import { toast } from 'react-toastify';

const DailyHealthForm = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    sleep_hours: '',
    steps: '',
    distance_km: '',
    calories_burned: '',
    weight: '',
    height: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const userId = JSON.parse(atob(token.split('.')[1])).id;
      
      // Calculate BMI
      const heightInMeters = formData.height / 100;
      const bmi = formData.weight / (heightInMeters * heightInMeters);
      
      await addDailyHealth({
        ...formData,
        user_id: userId,
        bmi: parseFloat(bmi.toFixed(2))
      });
      
      toast.success('Daily health data saved successfully');
      onSuccess();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-8 max-w-md w-full">
        <h2 className="text-2xl font-bold mb-6">Add Daily Health Data</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {Object.keys(formData).map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {field.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </label>
              <input
                type="number"
                step="0.01"
                value={formData[field]}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  [field]: e.target.value
                }))}
                className="w-full p-2 border rounded-md"
                required
              />
            </div>
          ))}
          <div className="flex justify-end space-x-4 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded-md"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DailyHealthForm;
