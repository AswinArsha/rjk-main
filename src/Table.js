import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import CustomerTable from './widgets/CustomerTable';
import DeleteDialog from './widgets/DeleteDialog';
import ClaimDialog from './widgets/ClaimDialog';
import AddGramsDialog from './widgets/AddGramsDialog';
import Edit from './widgets/Edit';
import { FaDownload, FaUpload } from 'react-icons/fa'; // Import suitable icons


const ITEMS_PER_PAGE = 10; // Define items per page

const Table = ({ pointsData, handleClaim, handleDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isClaimDialogOpen, setIsClaimDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isAddGramsDialogOpen, setIsAddGramsDialogOpen] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);

  useEffect(() => {
    // Paginate data based on the current page
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = currentPage * ITEMS_PER_PAGE;
    setPaginatedData(pointsData.slice(startIndex, endIndex));
  }, [currentPage, pointsData]);

  const handleDownloadClick = () => {
    const doc = new jsPDF();
    const tableData = pointsData.map((point) => [
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
    doc.save('points_table.pdf');
  };

  const totalPages = Math.ceil(pointsData.length / ITEMS_PER_PAGE); // Calculate total pages

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

  return (
    <div className="min-h-screen  ">
     <div className="flex flex-wrap gap-4 mb-4">
  <button
    onClick={handleDownloadClick}
    className="px-4 py-2 flex items-center gap-2 rounded bg-green-600 text-white transition-colors duration-150 hover:bg-green-700"
  >
    <FaDownload /> {/* Icon for Download */}
    Download PDF
  </button>
  <button
    onClick={() => (window.location.href = 'https://supabase.com/dashboard/project/smfonqblavmkgmcylqoc/editor/30374')}
    className="px-4 py-2 flex items-center gap-2 rounded bg-red-600 text-white transition-colors duration-150 hover:bg-red-700"
  >
    <FaUpload /> {/* Icon for Upload */}
    Upload Data
  </button>
</div>


      {/* Customer Table with Paginated Data */}
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

      {/* Pagination Controls */}
      <div className="flex justify-center mt-4">
        <nav aria-label="Page navigation">
          <ul className="inline-flex">
            <li>
              <button
                className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white border border-r-0 border-indigo-600 rounded-l-lg focus:shadow-outline hover:bg-indigo-100"
                onClick={handlePrevPage}
                disabled={currentPage <= 1}
              >
                Prev
              </button>
            </li>
            {[...Array(totalPages)].map((_, index) => (
              <li key={index}>
                <button
                  className={`h-10 px-5 transition-colors duration-150 bg-white border border-r-0 border-indigo-600 focus:shadow-outline ${
                    currentPage === index + 1
                      ? 'text-white bg-indigo-600' // Ensure text is white when active
                      : 'text-indigo-600 hover:bg-indigo-100'
                  }`}
                  onClick={() => setCurrentPage(index + 1)}
                >
                  {index + 1}
                </button>
              </li>
            ))}
            <li>
              <button
                className="h-10 px-5 text-indigo-600 transition-colors duration-150 bg-white border border-indigo-600 rounded-r-lg focus:shadow-outline hover:bg-indigo-100"
                onClick={handleNextPage}
                disabled={currentPage >= totalPages}
              >
                Next
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* Dialogs */}
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
          console.log('Grams added'); // Implement logic to add grams
          setIsAddGramsDialogOpen(false);
        }}
      />

      <Edit
        isOpen={isEditDialogOpen}
        customer={currentCustomer}
        onClose={() => setIsEditDialogOpen(false)}
      />
    </div>
  );
};

export default Table;
