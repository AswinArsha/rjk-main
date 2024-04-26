import React, { useEffect, useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import Table from './Table';

const supabaseUrl = 'https://smfonqblavmkgmcylqoc.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNtZm9ucWJsYXZta2dtY3lscW9jIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTIxMjI0MjQsImV4cCI6MjAyNzY5ODQyNH0.Yk9jlcLu2Svi8cAsQLuMJHflvBqbtusICyNj2ZfrVZg';
const supabase = createClient(supabaseUrl, supabaseKey);

const PointsTable = () => {
  const [pointsData, setPointsData] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [filter, setFilter] = useState({
    customerCode: '',
    address1: '',
    mobileNumber: '',
    totalPointsMin: '',
    totalPointsMax: '',
    unclaimedPointsMin: '',
    unclaimedPointsMax: '',
    fromDate: '',
    toDate: '',
    sortBy: 'CUSTOMER CODE',
    sortOrder: 'ASC',
  });

  useEffect(() => {
    fetchPointsData();
  }, [filter]);

  const fetchPointsData = async () => {
    try {
      let { data, error } = await supabase.from('points').select('*');

      if (error) {
        throw error;
      }

      let filteredData = data;

      // Apply filtering logic based on user input
      if (filter.customerCode) {
        filteredData = filteredData.filter((point) =>
          point["CUSTOMER CODE"].toString().toLowerCase().includes(filter.customerCode.toLowerCase())
        );
      }
      if (filter.address1) {
        filteredData = filteredData.filter((point) =>
          point["ADDRESS1"].toString().toLowerCase().includes(filter.address1.toLowerCase())
        );
      }
      if (filter.mobileNumber) {
        filteredData = filteredData.filter((point) =>
          point["MOBILE"].toString().includes(filter.mobileNumber.toString())
        );
      }
      if (filter.totalPointsMin) {
        filteredData = filteredData.filter(
          (point) => point["TOTAL POINTS"] >= filter.totalPointsMin
        );
      }
      if (filter.totalPointsMax) {
        filteredData = filteredData.filter(
          (point) => point["TOTAL POINTS"] <= filter.totalPointsMax
        );
      }
      if (filter.unclaimedPointsMin) {
        filteredData = filteredData.filter(
          (point) => point["UNCLAIMED POINTS"] >= filter.unclaimedPointsMin
        );
      }
      if (filter.unclaimedPointsMax) {
        filteredData = filteredData.filter(
          (point) => point["UNCLAIMED POINTS"] <= filter.unclaimedPointsMax
        );
      }
      if (filter.fromDate) {
        filteredData = filteredData.filter(
          (point) => new Date(point["LAST SALES DATE"]) >= new Date(filter.fromDate)
        );
      }
      if (filter.toDate) {
        filteredData = filteredData.filter(
          (point) => new Date(point["LAST SALES DATE"]) <= new Date(filter.toDate)
        );
      }

      filteredData.sort((a, b) => {
        const valueA = a[filter.sortBy];
        const valueB = b[filter.sortBy];
        return filter.sortOrder === 'ASC' ? valueA - valueB : valueB - valueA;
      });

      setPointsData(filteredData);
    } catch (error) {
      console.error('Error fetching points data:', error.message);
    }
  };

  const handleDelete = (customerCode) => {
    const updatedPointsData = pointsData.filter(
      (point) => point["CUSTOMER CODE"] !== customerCode
    );
    setPointsData(updatedPointsData);
  };

  const handleToggleFilters = () => {
    setShowFilters((prevState) => !prevState);
  };

  const handleClaim = async (point) => {
    try {
      const { data, error } = await supabase
        .from('points')
        .update({
          "CLAIMED POINTS": point["CLAIMED POINTS"] + 1,
          "UNCLAIMED POINTS": point["UNCLAIMED POINTS"] - 1,
        })
        .eq('CUSTOMER CODE', point["CUSTOMER CODE"]);

      if (error) {
        throw error;
      }

      const updatedPointsData = pointsData.map((item) => {
        if (item["CUSTOMER CODE"] === point["CUSTOMER CODE"]) {
          return {
            ...item,
            "CLAIMED POINTS": item["CLAIMED POINTS"] + 1,
            "UNCLAIMED POINTS": item["UNCLAIMED POINTS"] - 1,
          };
        }
        return item;
      });

      setPointsData(updatedPointsData);
      alert('Point claimed successfully!');
    } catch (error) {
      console.error('Error claiming point:', error.message);
      alert('Failed to claim point. Please try again later.');
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <div className="flex flex-wrap justify-between items-center mb-4">
        <button
          onClick={handleToggleFilters}
          className={`px-4 py-2 rounded-lg transition-colors duration-150 ${
            showFilters ? 'bg-gray-300' : 'bg-gray-200'
          } hover:bg-gray-400`}
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-wrap gap-4 mt-4 mb-6">
          <input
            type="text"
            placeholder="Customer Code"
            value={filter.customerCode}
            onChange={(e) => setFilter({ ...filter, customerCode: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Address 1"
            value={filter.address1}
            onChange={(e) => setFilter({ ...filter, address1: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            value={filter.mobileNumber}
            onChange={(e) => setFilter({ ...filter, mobileNumber: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Min Total Points"
            value={filter.totalPointsMin}
            onChange={(e) => setFilter({ ...filter, totalPointsMin: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Max Total Points"
            value={filter.totalPointsMax}
            onChange={(e) => setFilter({ ...filter, totalPointsMax: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Min Unclaimed Points"
            value={filter.unclaimedPointsMin}
            onChange={(e) => setFilter({ ...filter, unclaimedPointsMin: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="number"
            placeholder="Max Unclaimed Points"
            value={filter.unclaimedPointsMax}
            onChange={(e) => setFilter({ ...filter, unclaimedPointsMax: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="date"
            placeholder="From Date"
            value={filter.fromDate}
            onChange={(e) => setFilter({ ...filter, fromDate: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <input
            type="date"
            placeholder="To Date"
            value={filter.toDate}
            onChange={(e) => setFilter({ ...filter, toDate: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          />
          <select
            value={filter.sortBy}
            onChange={(e) => setFilter({ ...filter, sortBy: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          >
            <option value="CUSTOMER CODE">Sort by Customer Code</option>
            <option value="TOTAL POINTS">Sort by Total Points</option>
          </select>
          <select
            value={filter.sortOrder}
            onChange={(e) => setFilter({ ...filter, sortOrder: e.target.value })}
            className="w-full md:w-1/3 p-2 rounded-lg border-gray-300 focus:border-indigo-500"
          >
            <option value="ASC">Ascending</option>
            <option value="DESC">Descending</option>
          </select>
        </div>
      )}

      <Table
        pointsData={pointsData}
        handleClaim={handleClaim}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default PointsTable;
