import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const DatePicker = ({ selectedDate, onSelect }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        className="border rounded-lg p-4"
      />
    </div>
  );
};

export default DatePicker;
