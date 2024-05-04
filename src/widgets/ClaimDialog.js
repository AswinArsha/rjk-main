import React, { useState, useEffect } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "../supabase";

const ClaimDialog = ({ isOpen, onClose, onConfirmClaim, customer }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (customer && parseFloat(customer["UNCLAIMED POINTS"]).toFixed(1) < 1) {
      setError("No points available to claim.");
    } else {
      setError(null);
    }
  }, [customer]);

  const handleConfirm = async () => {
    if (parseFloat(customer["UNCLAIMED POINTS"]).toFixed(1) < 1) {
      return; // If there are no points, prevent further action
    }

    try {
      setIsLoading(true);

      const updatedCustomer = {
        ...customer,
        "CLAIMED POINTS": (parseFloat(customer["CLAIMED POINTS"]) + 1).toFixed(
          1
        ),
        "UNCLAIMED POINTS": (
          parseFloat(customer["UNCLAIMED POINTS"]) - 1
        ).toFixed(1),
      };

      const { error } = await supabase
        .from("points")
        .update({
          "CLAIMED POINTS": updatedCustomer["CLAIMED POINTS"],
          "UNCLAIMED POINTS": updatedCustomer["UNCLAIMED POINTS"],
        })
        .eq("CUSTOMER CODE", customer["CUSTOMER CODE"]);

      if (error) {
        throw error;
      }

      onConfirmClaim(updatedCustomer);
      onClose();
    } catch (error) {
      console.error("Error claiming points:", error.message);
      setError("Error claiming points. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition appear show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
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
                  Confirm Claim
                </Dialog.Title>
                <div className="mt-2">
                  {error ? (
                    <p className="text-sm text-red-500">{error}</p>
                  ) : (
                    <p className="text-sm text-gray-600">
                      Are you sure you want to claim these points?
                    </p>
                  )}
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="inline-block rounded bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-600 transition-colors duration-150 hover:bg-gray-200"
                    onClick={onClose}
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  {!error && (
                    <button
                      className="inline-block rounded bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-green-700 disabled:bg-green-400 disabled:cursor-not-allowed"
                      onClick={handleConfirm}
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : "Confirm Claim"}
                    </button>
                  )}
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default ClaimDialog;
