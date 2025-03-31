import React from 'react';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';

const DatePicker = ({ selectedDate, onSelect }) => {
  const footer = selectedDate ? (
    <p className="mt-1 text-xs text-gray-600 text-center">
      {selectedDate.toLocaleDateString()}
    </p>
  ) : null;

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm h-fit">
      <style>
        {`
          .rdp {
            --rdp-cell-size: 35px !important;
            margin: 0;
          }
          .rdp-caption {
            margin-bottom: 0.5em;
          }
          .rdp-month {
            padding: 0;
          }
        `}
      </style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        footer={footer}
        modifiers={{
          selected: selectedDate
        }}
        modifiersStyles={{
          selected: {
            backgroundColor: '#4F46E5',
            color: 'white'
          }
        }}
        className="border rounded-lg p-2"
      />
    </div>
  );
};

export default DatePicker;
