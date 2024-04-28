import React, { useState, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import Papa from "papaparse";
import { supabase } from "../supabase";
import { parse, format, isValid } from "date-fns";

const CSVUpload = ({ onUploadSuccess, onAlert }) => {
  const [alertMessage, setAlertMessage] = useState(null);
  const [alertType, setAlertType] = useState(null);
  const [alertTimeout, setAlertTimeout] = useState(null);

  const clearAlert = () => {
    setAlertMessage(null);
    setAlertType(null);
  };

  useEffect(() => {
    if (alertMessage) {
      if (alertTimeout) {
        clearTimeout(alertTimeout); // Clear previous timeout if it exists
      }

      const timeout = setTimeout(clearAlert, 3000); // 3 seconds timeout
      setAlertTimeout(timeout);
    }
  }, [alertMessage]); // Trigger when alertMessage changes

  const handleUpload = async (event) => {
    const file = event.target.files[0];

    if (!file) {
      onAlert("No file selected. Please choose a CSV file.", "error");
      return;
    }

    Papa.parse(file, {
      header: true,
      complete: async (results) => {
        const data = results.data;

        const validData = data.filter((row) => {
          const customerCode = row["CUSTOMER CODE"];
          return customerCode && !isNaN(parseInt(customerCode, 10)); // Ensure valid customer code
        });

        if (validData.length === 0) {
          onAlert(
            "Invalid CSV data. CUSTOMER CODE must not be empty.",
            "error"
          );
          return;
        }

        const convertedData = validData.map((row) => {
          const netWeight = parseFloat(row["NET WEIGHT"]);
          const totalPoints = parseFloat((netWeight / 10).toFixed(1)); // Conversion logic
          const unclaimedPoints = totalPoints;

          let lastSalesDate = row["LAST SALES DATE"];
          if (lastSalesDate) {
            try {
              const parsedDate = parse(lastSalesDate, "dd-MM-yyyy", new Date());
              if (isValid(parsedDate)) {
                lastSalesDate = format(parsedDate, "yyyy-MM-dd");
              } else {
                throw new Error("Invalid date format");
              }
            } catch (error) {
              lastSalesDate = null; // Fallback if parsing fails
            }
          }

          return {
            "CUSTOMER CODE": parseInt(row["CUSTOMER CODE"], 10),
            "SL NO": row["SL NO"] ? parseInt(row["SL NO"], 10) : null,
            ADDRESS1: row["ADDRESS1"] || "",
            ADDRESS2: row["ADDRESS2"] || "",
            ADDRESS3: row["ADDRESS3"] || "",
            ADDRESS4: row["ADDRESS4"] || "",
            "PIN CODE": row["PIN CODE"] || "",
            PHONE: row["PHONE"] || "",
            MOBILE: row["MOBILE"] || "",
            "TOTAL POINTS": totalPoints,
            "CLAIMED POINTS": 0,
            "UNCLAIMED POINTS": unclaimedPoints,
            "LAST SALES DATE": lastSalesDate,
          };
        });

        try {
          const { error } = await supabase.from("points").insert(convertedData);

          if (error) {
            throw error;
          }

          onAlert("Data uploaded successfully!", "success");
          if (onUploadSuccess) {
            onUploadSuccess(convertedData); // Pass new data on success
          }
        } catch (error) {
          onAlert("Error uploading data. Please try again.", "error");
        }
      },
      error: (error) => {
        onAlert("Error parsing CSV. Please check the file format.", "error");
      },
    });
  };

  return (
    <div>
      <input
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
