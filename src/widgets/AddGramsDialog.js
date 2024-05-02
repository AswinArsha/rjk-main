// src\AddGramsDialog.js
import React, { useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import { supabase } from "../supabase"; // Import Supabase instance
import { FaTimes } from "react-icons/fa"; // Icon for close button

const AddGramsDialog = ({ isOpen, customer, onClose, onDataUpdate }) => {
  const [grams, setGrams] = useState("");

  const handleInputChange = (e) => {
    setGrams(e.target.value);
  };
  const handleConfirm = async () => {
    const gramsValue = parseFloat(grams);
    if (isNaN(gramsValue) || gramsValue <= 0) {
      alert("Please enter a valid number of grams.");
      return;
    }
  
    const pointsToAdd = gramsValue / 10;
  
    try {
      const { data: customerData, error } = await supabase
        .from("points")
        .select('"TOTAL POINTS"', '"UNCLAIMED POINTS"', '"CLAIMED POINTS"')
        .eq('"CUSTOMER CODE"', customer["CUSTOMER CODE"])
        .single();
  
      if (error) {
        throw error;
      }
  
      const updatedTotalPoints = (customerData["TOTAL POINTS"] || 0) + pointsToAdd;
      const updatedClaimedPoints = (customerData["CLAIMED POINTS"] || 0);
      const updatedUnclaimedPoints = updatedTotalPoints - updatedClaimedPoints;
  
      const { error: updateError } = await supabase
        .from("points")
        .update({
          "TOTAL POINTS": updatedTotalPoints,
          "UNCLAIMED POINTS": updatedUnclaimedPoints,
          "CLAIMED POINTS": updatedClaimedPoints,
        })
        .eq('"CUSTOMER CODE"', customer["CUSTOMER CODE"]);
  
      if (updateError) {
        throw updateError;
      }
  
      const updatedCustomer = {
        ...customer,
        "TOTAL POINTS": updatedTotalPoints,
        "UNCLAIMED POINTS": updatedUnclaimedPoints,
        "CLAIMED POINTS": updatedClaimedPoints,
      };
  
      if (onDataUpdate) {
        onDataUpdate(updatedCustomer);
      }
  
      setGrams("");
      onClose();
    } catch (error) {
      console.error("Error updating grams:", error.message);
      alert("Error adding grams. Please try again.");
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
                  Add Grams
                </Dialog.Title>

                <div className="mt-4 space-y-4">
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="gramsInput">
                      Grams to be Added
                    </label>
                    <input
                      type="number"
                      value={grams}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline focus:border-indigo-500"
                      id="gramsInput"
                      placeholder="Enter amount of grams"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="inline-block rounded bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-500 hover:bg-gray-100 focus:shadow-outline"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-block rounded bg-yellow-600 px-4 py-2 text-center text-sm font-semibold text-white transition duration-150 hover:bg-yellow-700"
                    onClick={handleConfirm}
                  >
                    Confirm
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