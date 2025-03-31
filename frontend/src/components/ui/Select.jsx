import React from 'react';

const Select = ({ value, onChange, options }) => {
  return (
    <select
      value={value}
      onChange={onChange}
      className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
    >
      {options.map(option => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
