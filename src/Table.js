// Table.js
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
import { supabase } from "./supabase"; // Import the Supabase client

const ITEMS_PER_PAGE = 10;

const Table = ({ pointsData, handleDelete }) => {
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

  const handleDataUpdate = async (updatedCustomer) => {
    try {
      const { data, error } = await supabase
        .from("points")
        .select('"TOTAL POINTS"', '"UNCLAIMED POINTS"', "CLAIMED POINTS")
        .eq('"CUSTOMER CODE"', updatedCustomer["CUSTOMER CODE"].toString())
        .single();

      if (error) {
        console.error("Error fetching customer data:", error);
        return;
      }

      const {
        "TOTAL POINTS": currentTotalPoints,
        "UNCLAIMED POINTS": currentUnclaimedPoints,
        "CLAIMED POINTS": currentClaimedPoints,
      } = data;

      const newTotalPoints =
        currentTotalPoints + updatedCustomer["TOTAL POINTS"];
      const newUnclaimedPoints =
        currentUnclaimedPoints + updatedCustomer["UNCLAIMED POINTS"];
      const newClaimedPoints =
        currentUnclaimedPoints + updatedCustomer["CLAIMED POINTS"];

      const { error: updateError } = await supabase
        .from("points")
        .update({
          "TOTAL POINTS": newTotalPoints,
          "UNCLAIMED POINTS": newUnclaimedPoints,
        })
        .eq('"CUSTOMER CODE"', updatedCustomer["CUSTOMER CODE"].toString());

      if (updateError) {
        console.error("Error updating customer data:", updateError);
        return;
      }

      const updatedPoints = points.map((point) => {
        if (point["CUSTOMER CODE"] === updatedCustomer["CUSTOMER CODE"]) {
          return {
            ...point,
            "TOTAL POINTS": newTotalPoints,
            "UNCLAIMED POINTS": newUnclaimedPoints,
            "CLAIMED POINTS": newClaimedPoints,
          };
        }
        return point;
      });

      setPoints(updatedPoints); // Update the table with the new data
    } catch (error) {
      console.error("Error updating customer data:", error);
    }
  };
  const handleClaim = async (customer) => {
    try {
      console.log("Current claimed points:", currentClaimedPoints);

      const { data, error } = await supabase
        .from("points")
        .select('"UNCLAIMED POINTS"', '"CLAIMED POINTS"')
        .eq('"CUSTOMER CODE"', customer["CUSTOMER CODE"].toString())
        .single();

      if (error) {
        console.error("Error fetching customer data:", error);
        return;
      }

      const {
        "UNCLAIMED POINTS": currentUnclaimedPoints,
        "CLAIMED POINTS": currentClaimedPoints,
      } = data;

      // Check if there are unclaimed points available
      if (currentUnclaimedPoints <= 0) {
        handleAlert(
          "No unclaimed points available for this customer.",
          "error"
        );
        return;
      }

      const newClaimedPoints = currentClaimedPoints + 1;
      const newUnclaimedPoints = currentUnclaimedPoints - 1;

      const { error: updateError } = await supabase
        .from("points")
        .update({
          "UNCLAIMED POINTS": newUnclaimedPoints,
          "CLAIMED POINTS": newClaimedPoints,
        })
        .eq('"CUSTOMER CODE"', customer["CUSTOMER CODE"].toString());

      if (updateError) {
        console.error("Error updating customer data:", updateError);
        return;
      }

      const updatedCustomer = {
        ...customer,
        "UNCLAIMED POINTS": newUnclaimedPoints,
        "CLAIMED POINTS": newClaimedPoints,
      };

      const updatedPoints = points.map((point) => {
        if (point["CUSTOMER CODE"] === updatedCustomer["CUSTOMER CODE"]) {
          return updatedCustomer;
        }
        return point;
      });

      setPoints(updatedPoints); // Update the table with the new data
      handleAlert("Points claimed successfully.", "success");
    } catch (error) {
      console.error("Error updating customer data:", error);
      handleAlert("An error occurred while claiming points.", "error");
    }
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
        onConfirmClaim={(customer) => {
          handleClaim(customer);
          setIsClaimDialogOpen(false);
        }}
        customer={currentCustomer}
      />

      <AddGramsDialog
        isOpen={isAddGramsDialogOpen}
        onClose={() => setIsAddGramsDialogOpen(false)}
        onConfirm={(updatedCustomer) => {
          handleDataUpdate(updatedCustomer);
          setIsAddGramsDialogOpen(false);
        }}
        customer={currentCustomer}
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
