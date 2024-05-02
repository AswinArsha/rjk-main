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
import { supabase } from "./supabase";

const ITEMS_PER_PAGE = 10;

const Table = ({ pointsData }) => {
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
      parseFloat(point["TOTAL POINTS"]).toFixed(1), // Format TOTAL POINTS to one decimal place
      parseFloat(point["CLAIMED POINTS"]).toFixed(1), // Format CLAIMED POINTS to one decimal place
      parseFloat(point["UNCLAIMED POINTS"]).toFixed(1), // Format UNCLAIMED POINTS to one decimal place
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

  const handleDataUpdate = async (updatedCustomer) => {
    try {
      const { data, error } = await supabase
        .from("points")
        .select("*")
        .order("CUSTOMER CODE", { ascending: true });

      if (error) {
        throw error;
      }

      setPoints(data);
    } catch (error) {
      console.error("Error fetching updated data:", error.message);
    }
  };

  const handleDelete = async (customerCode) => {
    try {
      const { error } = await supabase
        .from("points")
        .delete()
        .eq("CUSTOMER CODE", customerCode);

      if (error) {
        throw error;
      }

      // Update the local state after successful deletion
      const updatedPoints = points.filter(
        (point) => point["CUSTOMER CODE"] !== customerCode
      );
      setPoints(updatedPoints);
    } catch (error) {
      console.error("Error deleting customer:", error.message);
    }
  };

  const handleClaim = (updatedCustomer) => {
    const updatedPoints = points.map((point) => {
      if (point["CUSTOMER CODE"] === updatedCustomer["CUSTOMER CODE"]) {
        return updatedCustomer;
      }
      return point;
    });
    setPoints(updatedPoints);
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
        onConfirmClaim={(updatedCustomer) => {
          handleClaim(updatedCustomer);
          setIsClaimDialogOpen(false);
        }}
        customer={currentCustomer}
      />

      <AddGramsDialog
        isOpen={isAddGramsDialogOpen}
        customer={currentCustomer}
        onClose={() => setIsAddGramsDialogOpen(false)}
        onConfirm={() => {
          setIsAddGramsDialogOpen(false);
        }}
        onDataUpdate={handleDataUpdate}
        points={points}
        setPoints={setPoints}
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