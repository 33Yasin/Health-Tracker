import React from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const DatePicker = ({ selectedDate, onSelect }) => {
  // Generate array of dates for timeline (3 days before and after selected date)
  const getDates = () => {
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(selectedDate);
      date.setDate(selectedDate.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  const handlePrevDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() - 1);
    onSelect(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + 1);
    onSelect(newDate);
  };

  const formatDate = (date) => {
    return new Intl.DateTimeFormat('en-US', {
      weekday: 'short',
      day: 'numeric',
    }).format(date);
  };

  const isToday = (date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  return (
    <div className="bg-white shadow-sm rounded-lg p-4 mb-8">
      <div className="flex items-center justify-between">
        <button
          onClick={handlePrevDay}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaChevronLeft className="text-gray-600 cursor-pointer" />
        </button>

        <div className="flex space-x-4 overflow-x-auto py-2">
          {getDates().map((date) => (
            <button
              key={date.toISOString()}
              onClick={() => onSelect(date)}
              className={`flex flex-col items-center min-w-[60px] p-2 rounded-lg transition-all cursor-pointer
                ${date.toDateString() === selectedDate.toDateString()
                  ? 'bg-indigo-600 text-white'
                  : 'hover:bg-gray-100'}
                ${isToday(date) ? 'border-2 border-indigo-600' : ''}
              `}
            >
              <span className="text-xs font-medium">{formatDate(date)}</span>
            </button>
          ))}
        </div>

        <button
          onClick={handleNextDay}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <FaChevronRight className="text-gray-600 cursor-pointer" />
        </button>
      </div>
    </div>
  );
};

export default DatePicker;
