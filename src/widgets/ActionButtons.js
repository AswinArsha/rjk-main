import React from "react";
import { FaEdit, FaTrash, FaPlusCircle, FaPlus } from "react-icons/fa";

const ActionButtons = ({ point, onEdit, onDelete, onClaim, onAddGrams }) => {
  if (!point || typeof point["UNCLAIMED POINTS"] === "undefined") {
    return <td className="px-4 py-2">Invalid Data</td>; // Handle invalid data cases
  }

  return (
    <td className="px-6 py-2 flex flex-wrap gap-2 justify-between">
      {point["UNCLAIMED POINTS"] > 0 && (
        <button
          className="px-3 py-1 rounded-lg bg-green-600 text-white transition-colors duration-150 hover:bg-green-700 flex items-center gap-2"
          onClick={() => onClaim(point)}
        >
          <FaPlus /> {/* Icon indicating claim */}
          Claim
        </button>
      )}
      <button
        className="px-4 py-1 rounded-lg bg-blue-600 text-white transition-colors duration-150 hover:bg-blue-700 flex items-center gap-2"
        onClick={() => onEdit(point)}
      >
        <FaEdit /> {/* Icon indicating edit */}
        Edit
      </button>
      <button
        className="px-4 py-1 rounded-lg bg-yellow-600 text-white transition-colors duration-150 hover:bg-yellow-700 flex items-center gap-2"
        onClick={() => onAddGrams(point)}
      >
        <FaPlusCircle /> {/* Icon indicating adding grams */}
        Add
      </button>
      <button
        className="px-2 py-1 rounded-lg bg-red-600 text-white transition-colors duration-150 hover:bg-red-700 flex items-center gap-2"
        onClick={() => onDelete(point)}
      >
        <FaTrash /> {/* Icon indicating delete */}
        Delete
      </button>
    </td>
  );
};

export default ActionButtons;
