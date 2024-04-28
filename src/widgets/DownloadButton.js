import React from 'react';
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const DownloadButton = ({ points }) => {
  const handleDownloadClick = () => {
    const doc = new jsPDF();
    const tableData = points.map((point) => [
      point['CUSTOMER CODE'],
      point['ADDRESS1'],
      point['ADDRESS2'],
      point['ADDRESS3'],
      point['ADDRESS4'],
      point['MOBILE'],
      point['TOTAL POINTS'],
      point['CLAIMED POINTS'],
      point['UNCLAIMED POINTS'],
      point['LAST SALES DATE'],
    ]);

    doc.autoTable({
      head: [
        ['CUSTOMER CODE', 'ADDRESS1', 'ADDRESS2', 'ADDRESS3', 'ADDRESS4', 'MOBILE', 'TOTAL POINTS', 'CLAIMED POINTS', 'UNCLAIMED POINTS', 'LAST SALES DATE'],
      ],
      body: tableData,
    });

    doc.save('points_table.pdf');
  };

  return (
    <button
      onClick={handleDownloadClick}
      className="px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-150 bg-green-600 text-white hover:bg-green-700"
    >
      <FaDownload />
      Download PDF
    </button>
  );
};

export default DownloadButton;
