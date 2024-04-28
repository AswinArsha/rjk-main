import React, { useState, useEffect } from "react";
import CustomerTable from "./widgets/CustomerTable";
import DeleteDialog from "./widgets/DeleteDialog";
import ClaimDialog from "./widgets/ClaimDialog";
import AddGramsDialog from "./widgets/AddGramsDialog";
import Edit from "./widgets/Edit";
import CSVUpload from "./widgets/CSVUpload";
import Pagination from "./widgets/Pagination";
import DownloadButton from "./widgets/DownloadButton";
import Alerts from "./widgets/Alerts";
import jsPDF from "jspdf";
import "jspdf-autotable";

const ITEMS_PER_PAGE = 10;

const Table = ({ pointsData, handleClaim, handleDelete }) => {
  const [points, setPoints] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddGramsDialogOpen, setIsAddGramsDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  useEffect(() => {
    setPoints(pointsData);
  }, [pointsData]);

  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setPaginatedData(points.slice(startIndex, endIndex));
  }, [currentPage, points]);

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const totalPages = Math.ceil(points.length / ITEMS_PER_PAGE);

  const handleAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
  };

  const handleDownloadClick = () => {
    const doc = new jsPDF();
    const tableData = points.map((point) => [
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
    });
    doc.save("points_table.pdf");
  };

  const handleDataUpdate = (updatedCustomer) => {
    const updatedPoints = points.map((point) => {
      if (point["CUSTOMER CODE"] === updatedCustomer["CUSTOMER CODE"]) {
        return updatedCustomer;
      }
      return point;
    });
    setPoints(updatedPoints); // Update the table with the new data
  };

  return (
    <div className="min-h-screen">
      <Alerts alertMessage={alertMessage} alertType={alertType} />

      <div className="flex flex-wrap justify-between items-center mb-4">
        <DownloadButton onClick={handleDownloadClick} />

        <CSVUpload
          onUploadSuccess={(newData) =>
            setPoints((prev) => [...prev, ...newData])
          }
          onAlert={handleAlert}
        />
      </div>

      <CustomerTable
        pointsData={paginatedData}
        onEdit={(customer) => {
          setCurrentCustomer(customer);
          setIsEditDialogOpen(true);
        }}
        onDelete={(customer) => {
          setCurrentCustomer(customer);
          setIsDeleteDialogOpen(true);
        }}
        onClaim={(customer) => {
          setCurrentCustomer(customer);
          setIsClaimDialogOpen(true);
        }}
        onAddGrams={(customer) => {
          setCurrentCustomer(customer);
          setIsAddGramsDialogOpen(true);
        }}
      />

      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPrev={handlePrevPage}
        onNext={handleNextPage}
        onJump={(page) => setCurrentPage(page)}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirmDelete={() => {
          handleDelete(currentCustomer["CUSTOMER CODE"]);
          setIsDeleteDialogOpen(false);
        }}
      />

      <ClaimDialog
        isOpen={isClaimDialogOpen}
        onClose={() => setIsClaimDialogOpen(false)}
        onConfirmClaim={() => {
          handleClaim(currentCustomer);
          setIsClaimDialogOpen(false);
        }}
      />

      <AddGramsDialog
        isOpen={isAddGramsDialogOpen}
        onClose={() => setIsAddGramsDialogOpen(false)}
        onConfirm={(grams) => {
          console.log("Grams added");
          setIsAddGramsDialogOpen(false);
        }}
      />

      <Edit
        isOpen={isEditDialogOpen}
        customer={currentCustomer}
        onClose={() => setIsEditDialogOpen(false)}
        onDataUpdate={handleDataUpdate}
      />
    </div>
  );
};

export default Table;
