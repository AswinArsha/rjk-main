import React from 'react';

const ActionButtons = ({ point, onEdit, onDelete, onClaim, onAddGrams }) => {
  // Ensure `point` is not undefined, and all expected properties are present
  if (!point || typeof point["UNCLAIMED POINTS"] === 'undefined') {
    return <td className="px-4 py-2">Invalid Data</td>; // Fallback to prevent crash
  }

  return (
    <td className="px-6 py-2 flex flex-wrap gap-2 justify-between">
      {point["UNCLAIMED POINTS"] > 0 && (
        <button
          className="mr-2 px-4 py-1 rounded bg-green-600 text-white hover:bg-green-700 text-xs"
          onClick={() => onClaim(point)}
        >
          Add 
        </button>
      )}
    
      <button
        className="px-4 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 text-xs"
        onClick={() => onEdit(point)}
      >
        Edit
      </button>
      <button
        className="px-4 py-1 rounded bg-yellow-600 text-white hover:bg-yellow-700 text-xs"
        onClick={() => onAddGrams(point)}
      >
        New
      </button>
      <button
        className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700 text-xs"
        onClick={() => onDelete(point)}
      >
        Delete
      </button>
    </td>
  );
};

export default ActionButtons;
