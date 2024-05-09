import React, { useRef, useState } from "react";
import { FaUpload } from "react-icons/fa";
import Papa from "papaparse";
import { supabase } from "../supabase";
import { parse, isValid, format } from "date-fns";

const CSVUpload = ({ onUploadSuccess }) => {
  const fileInputRef = useRef();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) {
      setErrorMessage("No file selected. Please choose a CSV file.");
      setShowErrorModal(true);
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const data = results.data;

        // Validate and filter data
        const validData = data.filter((row) => {
          const customerCode = parseInt(row["CUSTOMER CODE"], 10);
          const netWeight = parseFloat(row["NET WEIGHT"]);
          return !isNaN(customerCode) && !isNaN(netWeight);
        });

        if (validData.length === 0) {
          setErrorMessage(
            "Invalid CSV data. Please check CUSTOMER CODE and NET WEIGHT."
          );
          setShowErrorModal(true);
          return;
        }

        const convertedData = validData.map((row) => {
          const customerCode = parseInt(row["CUSTOMER CODE"], 10);
          const netWeight = parseFloat(row["NET WEIGHT"]);
          const points = (netWeight / 10).toFixed(1);
          const unclaimedPoints = parseFloat(points);

          let lastSalesDate = null;
          const rawDate = row["LAST SALES DATE"];
          if (rawDate) {
            const parsedDate = parse(rawDate, "dd-MM-yyyy", new Date());
            if (isValid(parsedDate)) {
              lastSalesDate = format(parsedDate, "yyyy-MM-dd");
            }
          }

          return {
            "CUSTOMER CODE": customerCode,
            "SL NO": row["SL NO"] ? parseInt(row["SL NO"], 10) : null,
            ADDRESS1: row["ADDRESS1"] || "",
            ADDRESS2: row["ADDRESS2"] || "",
            ADDRESS3: row["ADDRESS3"] || "",
            ADDRESS4: row["ADDRESS4"] || "",
            "PIN CODE": row["PIN CODE"] || "",
            PHONE: row["PHONE"] || "",
            MOBILE: row["MOBILE"] || "",
            "TOTAL POINTS": unclaimedPoints,
            "CLAIMED POINTS": 0,
            "UNCLAIMED POINTS": unclaimedPoints,
            "LAST SALES DATE": lastSalesDate,
          };
        });

        try {
          const { data: existingData, error: fetchError } = await supabase
            .from("points")
            .select('"CUSTOMER CODE", "TOTAL POINTS", "UNCLAIMED POINTS"');

          if (fetchError) {
            throw fetchError;
          }

          const updatedData = convertedData.map((newRecord) => {
            const existingRecord = existingData.find(
              (record) => record["CUSTOMER CODE"] === newRecord["CUSTOMER CODE"]
            );

            if (existingRecord) {
              const newTotalPoints = (
                parseFloat(existingRecord["TOTAL POINTS"]) +
                parseFloat(newRecord["TOTAL POINTS"])
              ).toFixed(1);

              const newUnclaimedPoints = (
                parseFloat(existingRecord["UNCLAIMED POINTS"]) +
                parseFloat(newRecord["UNCLAIMED POINTS"])
              ).toFixed(1);

              return {
                ...newRecord,
                "TOTAL POINTS": newTotalPoints,
                "UNCLAIMED POINTS": newUnclaimedPoints,
              };
            }

            return newRecord; // If new customer, return as-is
          });

          const { error: upsertError } = await supabase
            .from("points")
            .upsert(updatedData, {
              onConflict: "CUSTOMER CODE",
            });

          if (upsertError) {
            throw upsertError;
          }

          setShowSuccessModal(true);

          if (onUploadSuccess) {
            onUploadSuccess(updatedData); // Notify parent component of successful upload
          }

          // Reset the file input to allow re-uploading
          fileInputRef.current.value = ""; // This allows re-uploading the same or another CSV file
        } catch (error) {
          setErrorMessage("Error uploading data. Please try again.");
          setShowErrorModal(true);
        }
      },
      error: (parseError) => {
        setErrorMessage("Error parsing CSV. Please check the file format.");
        setShowErrorModal(true);
      },
    });
  };

  const handleSuccessModalClose = () => {
    setShowSuccessModal(false);
  };

  const handleErrorModalClose = () => {
    setShowErrorModal(false);
  };

  return (
    <div>
      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Data Upload Success
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        The data has been successfully uploaded.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleSuccessModalClose}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen"></span>
            &#8203;
            <div
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
              role="dialog"
              aria-modal="true"
              aria-labelledby="modal-headline"
            >
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-red-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 9l-3 3m0 0l3 3m-3-3h7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3
                      className="text-lg leading-6 font-medium text-gray-900"
                      id="modal-headline"
                    >
                      Data Upload Error
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm leading-5 text-gray-500">
                        {errorMessage}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleErrorModalClose}
                >
                  OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleUpload}
        className="hidden"
        id="csv-upload-input"
      />
      <label
        htmlFor="csv-upload-input"
        className="px-4 py-2 flex items-center gap-2 rounded-lg transition-colors duration-150 bg-red-600 text-white hover:bg-red-700"
      >
        <FaUpload />
        Upload Data
      </label>
    </div>
  );
};

export default CSVUpload;
