import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { FaTimes } from "react-icons/fa"; // Icon for close button
import { supabase } from "../supabase"; // Ensure the Supabase instance is imported

const Edit = ({ isOpen, customer, onClose, onDataUpdate }) => {
  const [editedCustomer, setEditedCustomer] = useState({});

  useEffect(() => {
    if (customer) {
      setEditedCustomer(customer);
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({ ...editedCustomer, [name]: value });
  };

  const handleSave = async () => {
    try {
      // Update the customer record in the Supabase `points` table
      const { error } = await supabase
        .from("points")
        .update(editedCustomer) // Use edited data
        .eq("CUSTOMER CODE", customer["CUSTOMER CODE"]); // Filter by primary key

      if (error) {
        throw error; // If error, throw to catch block
      }

      onClose(); // Close the dialog
      onDataUpdate(editedCustomer); // Call callback to update points data in the table
    } catch (error) {
      console.error("Error updating customer:", error.message);
      alert("An error occurred while saving changes. Please try again.");
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
                  {" "}
                  {/* Consistent spacing */}
                  {/* Input fields for editing */}
                  {/* Customer Code */}
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
                  {/* Other editable fields */}
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
                </div>

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
