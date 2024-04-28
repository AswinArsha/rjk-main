// src\widgets\CustomerTable.js
import React from "react";
import ActionButtons from "./ActionButtons";

const CustomerTable = ({
  pointsData,
  onEdit,
  onDelete,
  onClaim,
  onAddGrams,
}) => {
  if (!pointsData || pointsData.length === 0) {
    return <div className="text-gray-500 p-4">No data available</div>; // Improved "No data" message
  }

  return (
    <div className="overflow-x-auto bg-white border border-gray-200 rounded-lg ">
      {" "}
      {/* Consistent padding */}
      <table className="min-w-full divide-y divide-gray-200 text-sm">
        <thead className="bg-gray-300 text-left">
          {" "}
          {/* Improved table header styling */}
          <tr>
            {[
              "CUSTOMER CODE",
              "ADDRESS1",
              "ADDRESS2",
              "ADDRESS3",
              "ADDRESS4",
              "MOBILE",
              "TOTAL POINTS",
              "CLAIMED POINTS",
              "UNCLAIMED POINTS",
              "LAST SALES DATE",
              "Action",
            ].map((header) => (
              <th
                key={header}
                className="px-4 py-2 border-r border-white font-semibold"
              >
                {" "}
                {/* Consistent borders */}
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {pointsData.map((point, index) => (
            <tr
              key={point["CUSTOMER CODE"] || index}
              className="hover:bg-gray-100 transition-colors duration-150"
            >
              {[
                point["CUSTOMER CODE"],
                point["ADDRESS1"],
                point["ADDRESS2"],
                point["ADDRESS3"],
                point["ADDRESS4"],
                point["MOBILE"],
                point["TOTAL POINTS"],
                point["CLAIMED POINTS"],
                point["UNCLAIMED POINTS"],
                point["LAST SALES DATE"],
              ].map((value, index) => (
                <td
                  key={index}
                  className={`px-4 py-2 ${
                    index < 9 ? "border-r border-gray-200" : ""
                  }`}
                >
                  {value || "0"} {/* Default value if undefined */}
                </td>
              ))}

              <ActionButtons
                point={point}
                onEdit={onEdit}
                onDelete={onDelete}
                onClaim={onClaim}
                onAddGrams={onAddGrams}
              />
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerTable;
