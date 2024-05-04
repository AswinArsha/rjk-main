import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "../supabase";

const AddGramsDialog = ({
  isOpen,
  customer,
  onClose,
  onDataUpdate, // Receive the onDataUpdate function as a prop
}) => {
  const [grams, setGrams] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen) {
      // Clear error and reset grams when the dialog is reopened
      setError(null);
      setGrams("");
    }
  }, [isOpen]);

  const handleInputChange = (e) => {
    setGrams(e.target.value);
    setError(null); // Clear error on input change
  };

  const handleConfirm = async () => {
    const gramsValue = parseFloat(grams);

    if (isNaN(gramsValue) || gramsValue <= 0) {
      setError("Please enter a valid number of grams greater than zero.");
      return;
    }

    const pointsToAdd = (gramsValue / 10).toFixed(1); // 10:1 ratio, formatted to one decimal place

    setIsLoading(true);

    const updatedCustomer = {
      ...customer,
      "TOTAL POINTS": parseFloat(
        (customer["TOTAL POINTS"] || 0) + parseFloat(pointsToAdd)
      ).toFixed(1),
      "UNCLAIMED POINTS": parseFloat(
        (customer["UNCLAIMED POINTS"] || 0) + parseFloat(pointsToAdd)
      ).toFixed(1),
    };

    const { error } = await supabase
      .from("points")
      .update({
        "TOTAL POINTS": updatedCustomer["TOTAL POINTS"],
        "UNCLAIMED POINTS": updatedCustomer["UNCLAIMED POINTS"],
      })
      .eq("CUSTOMER CODE", customer["CUSTOMER CODE"]);

    if (error) {
      console.error("Error updating grams:", error.message);
    } else {
      if (onDataUpdate) {
        onDataUpdate(updatedCustomer); // Call the onDataUpdate function from the parent
      }

      setGrams(""); // Clear the input
      setError(null); // Reset the error
      onClose(); // Close the dialog
    }

    setIsLoading(false);
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
                  Add Grams
                </Dialog.Title>

                <div className="mt-4 text-gray-700">
                  <label className="block mb-1" htmlFor="gramsInput">
                    Grams to be Added
                  </label>
                  <input
                    type="number"
                    value={grams}
                    onChange={handleInputChange}
                    className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:border-indigo-500"
                    id="gramsInput"
                    placeholder="Enter amount of grams"
                  />
                  {error && (
                    <p className="mt-2 text-red-500 text-sm">{error}</p>
                  )}
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="inline-block rounded bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-500 hover:bg-gray-100"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-block rounded bg-yellow-600 px-4 py-2 text-center text-sm font-semibold text-white transition duration-150 hover:bg-yellow-700"
                    onClick={handleConfirm}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "Confirm"}
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

export default AddGramsDialog;
