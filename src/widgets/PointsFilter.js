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
        {/* Customer Code */}
        <div className="w-full  md:w-1/3">
          <label className=" hidden md:block text-sm font-medium text-gray-700" htmlFor="customerCode">
            Customer Code
          </label>
          <input
            type="text"
            id="customerCode"
            placeholder="Customer Code"
            value={filter.customerCode}
            onChange={(e) => handleInputChange('customerCode', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>

        {/* Address 1 */}
        <div className="w-full pt-3 md:pt-0 md:w-1/3">
          <label className=" hidden md:block text-sm font-medium text-gray-700" htmlFor="address1">
            Address 1
          </label>
          <input
            type="text"
            id="address1"
            placeholder="Address 1"
            value={filter.address1}
            onChange={(e) => handleInputChange('address1', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>

        {/* Mobile Number */}
        <div className="w-full pt-3 md:pt-0 md:w-1/3">
          <label className="hidden md:block  text-sm font-medium text-gray-700" htmlFor="mobileNumber">
            Mobile Number
          </label>
          <input
            type="text"
            id="mobileNumber"
            placeholder="Mobile Number"
            value={filter.mobileNumber}
            onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="w-full hidden md:block md:flex md:gap-4">
        {/* Total Points Min */}
        <div className="w-full  md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="totalPointsMin">
            Min Total Points
          </label>
          <input
            type="number"
            id="totalPointsMin"
            placeholder="Min Total Points"
            value={filter.totalPointsMin}
            onChange={(e) => handleInputChange('totalPointsMin', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>

        {/* Total Points Max */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="totalPointsMax">
            Max Total Points
          </label>
          <input
            type="number"
            id="totalPointsMax"
            placeholder="Max Total Points"
            value={filter.totalPointsMax}
            onChange={(e) => handleInputChange('totalPointsMax', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="w-full hidden md:block md:flex md:gap-4">
        {/* Unclaimed Points Min */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="unclaimedPointsMin">
            Min Unclaimed Points
          </label>
          <input
            type="number"
            id="unclaimedPointsMin"
            placeholder="Min Unclaimed Points"
            value={filter.unclaimedPointsMin}
            onChange={(e) => handleInputChange('unclaimedPointsMin', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>

        {/* Unclaimed Points Max */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="unclaimedPointsMax">
            Max Unclaimed Points
          </label>
          <input
            type="number"
            id="unclaimedPointsMax"
            placeholder="Max Unclaimed Points"
            value={filter.unclaimedPointsMax}
            onChange={(e) => handleInputChange('unclaimedPointsMax', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="w-full hidden md:block md:flex md:gap-4">
        {/* From Date */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="fromDate">
            From Date
          </label>
          <input
            type="date"
            id="fromDate"
            placeholder="From Date"
            value={filter.fromDate}
            onChange={(e) => handleInputChange('fromDate', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>

        {/* To Date */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="toDate">
            To Date
          </label>
          <input
            type="date"
            id="toDate"
            placeholder="To Date"
            value={filter.toDate}
            onChange={(e) => handleInputChange('toDate', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
        </div>
      </div>

      <div className="w-full hidden md:block md:flex md:gap-4">
        {/* Sort By */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="sortBy">
            Sort By
          </label>
          <select
            value={filter.sortBy}
            onChange={(e) => handleInputChange('sortBy', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          >
            <option value="CUSTOMER CODE">Sort by Customer Code</option>
            <option value="TOTAL POINTS">Sort by Total Points</option>
          </select>
        </div>

        {/* Sort Order */}
        <div className="w-full md:w-1/3">
          <label className="block text-sm font-medium text-gray-700" htmlFor="sortOrder">
            Sort Order
          </label>
          <select
            value={filter.sortOrder}
            onChange={(e) => handleInputChange('sortOrder', e.target.value)}
            className="w-full p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default PointsFilter;
