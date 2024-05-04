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

const Table = ({ pointsData, filter }) => {
  const [points, setPoints] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddGramsDialogOpen, setIsAddGramsDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);

  // Handle setting points data on component mount
  useEffect(() => {
    setPoints(pointsData);
  }, [pointsData]);

  // Apply filters to the data
  useEffect(() => {
    let filtered = points;

    // Apply filters based on the filter object
    if (filter.customerCode) {
      filtered = filtered.filter((point) =>
        point["CUSTOMER CODE"]
          .toString()
          .toLowerCase()
          .includes(filter.customerCode.toLowerCase())
      );
    }

    if (filter.address1) {
      filtered = filtered.filter((point) =>
        point["ADDRESS1"]
          .toString()
          .toLowerCase()
          .includes(filter.address1.toLowerCase())
      );
    }

    // Add the rest of your filter logic here

    setFilteredData(filtered);
  }, [points, filter]);

  // Handle pagination changes
  useEffect(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setPaginatedData(filteredData.slice(startIndex, endIndex));

    // Reset the current page to 1 when the filtered data changes
    if (
      filteredData.length > 0 &&
      currentPage > Math.ceil(filteredData.length / ITEMS_PER_PAGE)
    ) {
      setCurrentPage(1);
    }
  }, [currentPage, filteredData]);
  // Handle real-time updates from Supabase
  useEffect(() => {
    const subscription = supabase
      .channel("realtime-points")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "points" },
        (payload) => {
          const { eventType, new: newData, old: oldData } = payload;

          if (eventType === "INSERT" || eventType === "UPDATE") {
            setPoints((prevPoints) => {
              const updatedPoints = prevPoints.filter(
                (point) => point["CUSTOMER CODE"] !== newData["CUSTOMER CODE"]
              );
              return [...updatedPoints, newData];
            });
          } else if (eventType === "DELETE") {
            setPoints((prevPoints) =>
              prevPoints.filter(
                (point) => point["CUSTOMER CODE"] !== oldData["CUSTOMER CODE"]
              )
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription); // Clean up on component unmount
    };
  }, []);

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // Reset to page 1 if the current page exceeds the total pages
      setCurrentPage(1);
    }
  };

  const handleJumpToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    } else {
      // Reset to page 1 if the requested page is out of range
      setCurrentPage(1);
    }
  };

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE);

  // Alert handler
  const handleAlert = (message, type) => {
    setAlertMessage(message);
    setAlertType(type);
  };

  // PDF download handler
  const handleDownloadClick = () => {
    const doc = new jsPDF();
    const tableData = paginatedData.map((point) => [
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
    });

    doc.save("points_table.pdf");
  };

  // Data update handler
  const handleDataUpdate = async () => {
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

      setPoints((prevPoints) =>
        prevPoints.filter((point) => point["CUSTOMER CODE"] !== customerCode)
      );
    } catch (error) {
      handleAlert("Error deleting customer.", "error");
      console.error("Error deleting customer:", error.message);
    }
  };

  const handleClaim = async (updatedCustomer) => {
    try {
      const { error } = await supabase
        .from("points")
        .update({
          "CLAIMED POINTS": updatedCustomer["CLAIMED POINTS"],
          "UNCLAIMED POINTS": updatedCustomer["UNCLAIMED POINTS"],
        })
        .eq("CUSTOMER CODE", updatedCustomer["CUSTOMER CODE"]);

      if (error) {
        throw error;
      }

      setPoints((prevPoints) =>
        prevPoints.map((point) =>
          point["CUSTOMER CODE"] === updatedCustomer["CUSTOMER CODE"]
            ? updatedCustomer
            : point
        )
      );
    } catch (error) {
      handleAlert("Error claiming points.", "error");
      console.error("Error claiming points:", error.message);
    }
  };

  return (
    <div className="min-h-screen">
      <Alerts alertMessage={alertMessage} alertType={alertType} />
      <div className="flex justify-between items-center mb-4">
        <DownloadButton pointsData={filteredData} />

        <CSVUpload
          onUploadSuccess={(newData) => {
            setPoints((prev) => [...prev, ...newData]);
          }}
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
        onJump={handleJumpToPage}
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
        onDataUpdate={handleDataUpdate}
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
