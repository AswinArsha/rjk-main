import React from 'react';

const FilterControls = ({ showFilters, onToggle, onClear }) => {
  return (
    <div className="flex flex-wrap justify-between items-center mb-4">
      <button
        onClick={onToggle}
        className={`px-4 py-2 rounded-lg transition-colors duration-150 ${
          showFilters ? 'bg-gray-300' : 'bg-gray-200'
        } hover:bg-gray-400`}
      >
        {showFilters ? 'Hide Filters' : 'Show Filters'}
      </button>

      {showFilters && (
        <button
          onClick={onClear}
          className="px-4 py-2 rounded-lg transition-colors duration-150 bg-red-500 text-white hover:bg-red-600"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};

export default FilterControls;
