import React from "react";
import { FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable"; // Ensure you have installed this package

const DownloadButton = ({ pointsData }) => {
  const handleDownloadClick = () => {
    const doc = new jsPDF({
      orientation: "landscape", // Landscape to fit more data
      unit: "pt", // Points for units
      format: "A4", // Standard A4 paper size
    });

    // Document properties and context
    doc.setProperties({
      title: "Points Table Report",
      subject: "Customer Points Data",
    });

    const now = new Date();
    const formattedDate = now.toLocaleDateString(); // Format date
    const formattedTime = now.toLocaleTimeString(); // Format time

    // Header with title and footer with generated date and time
    doc.setFontSize(18);
    doc.text("Customer Points Report", 40, 40);

    doc.setFontSize(10);
    doc.setTextColor(150); // Light gray text for footer
    doc.text(`Generated on: ${formattedDate} at ${formattedTime}`, 500, 40);

    // Table data and styling
    const tableData = pointsData.map((point) => [
      point["CUSTOMER CODE"],
      point["ADDRESS1"],
      point["ADDRESS2"],
      point["ADDRESS3"],
      point["ADDRESS4"],
      point["MOBILE"],
      parseFloat(point["TOTAL POINTS"]).toFixed(1),
      parseFloat(point["CLAIMED POINTS"]).toFixed(1),
      parseFloat(point["UNCLAIMED POINTS"]).toFixed(1),
      point["LAST SALES DATE"],
    ]);

    doc.autoTable({
      head: [
        [
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
        ],
      ],
      body: tableData,
      startY: 60, // Start the table below the header
      styles: {
        font: "helvetica",
        fontSize: 10,
        cellPadding: 4,
        valign: "middle",
        textColor: "#000000", // Black text for the table
        lineColor: "#cccccc", // Light gray for column lines
        lineWidth: 0.5, // Column line width
      },
      headStyles: {
        fillColor: "#2c3e50", // Dark blue background for headers
        textColor: "#ffffff", // White text for headers
        fontStyle: "bold",
        fontSize: 11, // Set font size for table headings
      },
      alternateRowStyles: {
        fillColor: "#f2f2f2", // Light gray background for alternate rows
      },
      tableLineColor: "#cccccc", // Line color for borders
      tableLineWidth: 0.5,
      columnStyles: {
        0: { cellWidth: "auto" }, // Adjust width based on content
      },
    });

    doc.save("points_table.pdf");
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
