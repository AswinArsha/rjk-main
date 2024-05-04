import React, { useState, useEffect } from "react";
import { supabase } from "./supabase";
import Table from "./Table";
import PointsFilter from "./widgets/PointsFilter";
import FilterControls from "./widgets/FilterControls";

const PointsTable = () => {
  const [pointsData, setPointsData] = useState([]);
  const [showFilters, setShowFilters] = useState(true);
  const [filter, setFilter] = useState({
    customerCode: "",
    address1: "",
    mobileNumber: "",
    totalPointsMin: "",
    totalPointsMax: "",
    unclaimedPointsMin: "",
    unclaimedPointsMax: "",
    fromDate: "",
    toDate: "",
    sortBy: "CUSTOMER CODE",
    sortOrder: "ASC",
  });

  useEffect(() => {
    const fetchPointsData = async () => {
      try {
        const { data, error } = await supabase.from("points").select("*");

        if (error) {
          throw error;
        }

        // Apply filters to the fetched data
        let filteredData = data;

        // Ensure case-insensitive comparisons and correct data handling
        if (filter.customerCode) {
          filteredData = filteredData.filter((point) =>
            point["CUSTOMER CODE"]
              .toString()
              .toLowerCase()
              .includes(filter.customerCode.toLowerCase())
          );
        }

        if (filter.address1) {
          filteredData = filteredData.filter((point) =>
            point["ADDRESS1"]
              .toString()
              .toLowerCase()
              .includes(filter.address1.toLowerCase())
          );
        }

        if (filter.mobileNumber) {
          filteredData = filteredData.filter((point) =>
            point["MOBILE"].toString().includes(filter.mobileNumber.toString())
          );
        }

        if (filter.totalPointsMin) {
          filteredData = filteredData.filter(
            (point) =>
              parseInt(point["TOTAL POINTS"], 10) >=
              parseInt(filter.totalPointsMin, 10)
          );
        }

        if (filter.totalPointsMax) {
          filteredData = filteredData.filter(
            (point) =>
              parseInt(point["TOTAL POINTS"], 10) <=
              parseInt(filter.totalPointsMax, 10)
          );
        }

        if (filter.unclaimedPointsMin) {
          filteredData = filteredData.filter(
            (point) =>
              parseInt(point["UNCLAIMED POINTS"], 10) >=
              parseInt(filter.unclaimedPointsMin, 10)
          );
        }

        if (filter.unclaimedPointsMax) {
          filteredData = filteredData.filter(
            (point) =>
              parseInt(point["UNCLAIMED POINTS"], 10) <=
              parseInt(filter.unclaimedPointsMax, 10)
          );
        }

        if (filter.fromDate) {
          const fromDate = new Date(filter.fromDate);
          filteredData = filteredData.filter(
            (point) => new Date(point["LAST SALES DATE"]) >= fromDate
          );
        }

        if (filter.toDate) {
          const toDate = new Date(filter.toDate);
          filteredData = filteredData.filter(
            (point) => new Date(point["LAST SALES DATE"]) <= toDate
          );
        }

        // Apply sorting
        filteredData.sort((a, b) => {
          const valueA = a[filter.sortBy];
          const valueB = b[filter.sortBy];

          if (typeof valueA === "string") {
            valueA = valueA.toLowerCase(); // Ensure case-insensitive sorting
          }
          if (typeof valueB === "string") {
            valueB = valueB.toLowerCase(); // Ensure case-insensitive sorting
          }

          return filter.sortOrder === "ASC" ? valueA - valueB : valueB - valueA;
        });

        setPointsData(filteredData);
      } catch (error) {
        console.error("Error fetching points data:", error.message);
      }
    };

    fetchPointsData(); // Fetch data with applied filters
  }, [filter]); // Fetch when filter changes

  const clearFilters = () => {
    setFilter({
      customerCode: "",
      address1: "",
      mobileNumber: "",
      totalPointsMin: "",
      totalPointsMax: "",
      unclaimedPointsMin: "",
      unclaimedPointsMax: "",
      fromDate: "",
      toDate: "",
      sortBy: "CUSTOMER CODE",
      sortOrder: "ASC",
    });
  };

  const handleToggleFilters = () => {
    setShowFilters((prevState) => !prevState);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <FilterControls
        showFilters={showFilters}
        onToggle={handleToggleFilters}
        onClear={clearFilters}
      />
      {showFilters && <PointsFilter filter={filter} setFilter={setFilter} />}
      <Table pointsData={pointsData} filter={filter} />{" "}
      {/* Pass the filter state */}
    </div>
  );
};

export default PointsTable;
