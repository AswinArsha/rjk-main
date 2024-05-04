import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "../supabase"; // Ensure the Supabase instance is imported
import { format } from "date-fns"; // For formatting date input

const Edit = ({ isOpen, customer, onClose, onDataUpdate }) => {
  const [editedCustomer, setEditedCustomer] = useState({});
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customer) {
      setEditedCustomer({
        ...customer,
        "TOTAL POINTS": parseFloat(customer["TOTAL POINTS"]).toFixed(1),
        "CLAIMED POINTS": parseFloat(customer["CLAIMED POINTS"]).toFixed(1),
        "UNCLAIMED POINTS": parseFloat(customer["UNCLAIMED POINTS"]).toFixed(1),
        "LAST SALES DATE": customer["LAST SALES DATE"]
          ? format(new Date(customer["LAST SALES DATE"]), "yyyy-MM-dd")
          : "",
      });
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({ ...editedCustomer, [name]: value });
  };

  const handleSave = async () => {
    try {
      const { error } = await supabase
        .from("points")
        .update({
          ...editedCustomer,
          "TOTAL POINTS": parseFloat(editedCustomer["TOTAL POINTS"]).toFixed(1),
          "CLAIMED POINTS": parseFloat(
            editedCustomer["CLAIMED POINTS"]
          ).toFixed(1),
          "UNCLAIMED POINTS": parseFloat(
            editedCustomer["UNCLAIMED POINTS"]
          ).toFixed(1),
        })
        .eq("CUSTOMER CODE", customer["CUSTOMER CODE"]);

      if (error) {
        throw error;
      }

      onClose(); // Close the dialog
      onDataUpdate(editedCustomer); // Callback to update the parent component
    } catch (error) {
      setError("An error occurred while saving changes. Please try again.");
      console.error("Error updating customer:", error.message);
    }
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0 scale-95"
          enterTo="opacity-100 scale-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-95"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Edit Customer
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  {/* Customer Code (read-only) */}
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="customerCode">
                      Customer Code
                    </label>
                    <input
                      type="text"
                      name="CUSTOMER CODE"
                      value={editedCustomer["CUSTOMER CODE"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="customerCode"
                      disabled // Primary key, cannot be edited
                    />
                  </div>

                  {/* Editable Fields */}
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="address1">
                      Address 1
                    </label>
                    <input
                      type="text"
                      name="ADDRESS1"
                      value={editedCustomer["ADDRESS1"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="address1"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="address2">
                      Address 2
                    </label>
                    <input
                      type="text"
                      name="ADDRESS2"
                      value={editedCustomer["ADDRESS2"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="address2"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="address3">
                      Address 3
                    </label>
                    <input
                      type="text"
                      name="ADDRESS3"
                      value={editedCustomer["ADDRESS3"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="address3"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="address4">
                      Address 4
                    </label>
                    <input
                      type="text"
                      name="ADDRESS4"
                      value={editedCustomer["ADDRESS4"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="address4"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="mobile">
                      Mobile
                    </label>
                    <input
                      type="text"
                      name="MOBILE"
                      value={editedCustomer["MOBILE"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="mobile"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="totalPoints">
                      Total Points
                    </label>
                    <input
                      type="number"
                      name="TOTAL POINTS"
                      value={editedCustomer["TOTAL POINTS"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="totalPoints"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="claimedPoints">
                      Claimed Points
                    </label>
                    <input
                      type="number"
                      name="CLAIMED POINTS"
                      value={editedCustomer["CLAIMED POINTS"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="claimedPoints"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="unclaimedPoints">
                      Unclaimed Points
                    </label>
                    <input
                      type="number"
                      name="UNCLAIMED POINTS"
                      value={editedCustomer["UNCLAIMED POINTS"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="unclaimedPoints"
                    />
                  </div>

                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="lastSalesDate">
                      Last Sales Date
                    </label>
                    <input
                      type="date"
                      name="LAST SALES DATE"
                      value={editedCustomer["LAST SALES DATE"] || ""}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                      id="lastSalesDate"
                    />
                  </div>
                </div>

                {error && (
                  <div className="mt-4 text-red-600 text-sm">{error}</div>
                )}

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="inline-block rounded bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-500 hover:bg-gray-100 transition-colors duration-150"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-block rounded bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700 transition-colors duration-150"
                    onClick={handleSave}
                  >
                    Save Changes
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default Edit;
