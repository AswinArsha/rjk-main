import React from 'react';

const PointsFilter = ({ filter, setFilter }) => {
  const handleInputChange = (key, value) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      [key]: value,
    }));
  };

  return (
    <div className="flex flex-wrap gap-4 mt-4 mb-6">
      <div className="w-full md:flex md:gap-4">
        <input
          type="text"
          placeholder="Customer Code"
          value={filter.customerCode}
          onChange={(e) => handleInputChange('customerCode', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Address 1"
          value={filter.address1}
          onChange={(e) => handleInputChange('address1', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
        <input
          type="text"
          placeholder="Mobile Number"
          value={filter.mobileNumber}
          onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
      </div>

      <div className="w-full md:flex md:gap-4">
        <input
          type="number"
          placeholder="Min Total Points"
          value={filter.totalPointsMin}
          onChange={(e) => handleInputChange('totalPointsMin', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
        <input
          type="number"
          placeholder="Max Total Points"
          value={filter.totalPointsMax}
          onChange={(e) => handleInputChange('totalPointsMax', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
      </div>

      <div className="w-full md:flex md:gap-4">
        <input
          type="number"
          placeholder="Min Unclaimed Points"
          value={filter.unclaimedPointsMin}
          onChange={(e) => handleInputChange('unclaimedPointsMin', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
        <input
          type="number"
          placeholder="Max Unclaimed Points"
          value={filter.unclaimedPointsMax}
          onChange={(e) => handleInputChange('unclaimedPointsMax', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
      </div>

      <div className="w-full md:flex md:gap-4">
        <input
          type="date"
          placeholder="From Date"
          value={filter.fromDate}
          onChange={(e) => handleInputChange('fromDate', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
        <input
          type="date"
          placeholder="To Date"
          value={filter.toDate}
          onChange={(e) => handleInputChange('toDate', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        />
      </div>

      <div className="w-full md:flex md:gap-4">
        <select
          value={filter.sortBy}
          onChange={(e) => handleInputChange('sortBy', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        >
          <option value="CUSTOMER CODE">Sort by Customer Code</option>
          <option value="TOTAL POINTS">Sort by Total Points</option>
        </select>
        <select
          value={filter.sortOrder}
          onChange={(e) => handleInputChange('sortOrder', e.target.value)}
          className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
        >
          <option value="ASC">Ascending</option>
          <option value="DESC">Descending</option>
        </select>
      </div>
    </div>
  );
};

export default PointsFilter;
