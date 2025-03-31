import React, { useState, useEffect } from 'react';
import { createUserHealth } from '../services/userHealthService';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // toast css
import { useNavigate } from 'react-router-dom';

const UserHealthForm = () => {
  const [userHealthData, setUserHealthData] = useState({
    user_id: '', // We'll set this from localStorage
    birthDate: '',
    gender: 'male',
    height: '',
    weight: '',
    target_weight: '', // Add target weight
    bmi: '' // Add BMI field
  });
  const [userName, setUserName] = useState('');
  const [calculatedAge, setCalculatedAge] = useState(null);
  
  const navigate = useNavigate(); 

  useEffect(() => {
    // Get user ID from token or localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Decode the token to get user ID
      const decodedToken = JSON.parse(atob(token.split('.')[1]));
      setUserHealthData(prev => ({
        ...prev,
        user_id: decodedToken.id
      }));
      // Kullanıcı adını localStorage'dan al
      const name = localStorage.getItem('userName');
      setUserName(name || 'User');
    }
  }, []);

  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const calculateBMI = (weight, height) => {
    if (!weight || !height) return 0;
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(2);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserHealthData(prev => {
      const newData = {
        ...prev,
        [name]: value
      };

      // Calculate BMI when weight or height changes
      if (name === 'weight' || name === 'height') {
        if (newData.weight && newData.height) {
          newData.bmi = calculateBMI(newData.weight, newData.height);
        }
      }

      return newData;
    });

    if (name === 'birthDate') {
      const age = calculateAge(value);
      setCalculatedAge(age);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createUserHealth(userHealthData);
      toast.success('Health information saved successfully');
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Health Information Form</h2>
        <p className="text-lg text-indigo-600 font-medium">Welcome, {userName}!</p>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 font-medium" htmlFor="birthDate">
            Birth Date:
          </label>
          <input
            type="date"
            name="birthDate"
            value={userHealthData.birthDate}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          {calculatedAge !== null && (
            <p className="mt-1 text-sm text-gray-500">
              Age: {calculatedAge} years old
            </p>
          )}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium" htmlFor="gender">Gender:</label>
          <select
            name="gender"
            value={userHealthData.gender}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium" htmlFor="height">Height (cm):</label>
          <input
            type="number"
            name="height"
            value={userHealthData.height}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium" htmlFor="weight">Weight (kg):</label>
          <input
            type="number"
            name="weight"
            value={userHealthData.weight}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium" htmlFor="target_weight">
            Target Weight (kg):
          </label>
          <input
            type="number"
            name="target_weight"
            value={userHealthData.target_weight}
            onChange={handleChange}
            required
            className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {userHealthData.bmi && (
          <div className="mb-4 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-medium text-gray-700">Your BMI</h3>
            <p className="text-2xl font-bold text-indigo-600">{userHealthData.bmi}</p>
            <p className="text-sm text-gray-500">
              {userHealthData.bmi < 18.5 ? 'Underweight' :
              userHealthData.bmi < 25 ? 'Normal weight' :
              userHealthData.bmi < 30 ? 'Overweight' : 'Obese'}
            </p>
          </div>
        )}

        <button
          type="submit"
          className="w-full bg-indigo-600 text-white py-2 rounded-lg mt-6 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          Submit
        </button>
      </form>
      <ToastContainer autoClose={3000} />
    </div>
  );
};

export default UserHealthForm;
