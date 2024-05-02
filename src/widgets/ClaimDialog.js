import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const ClaimDialog = ({ isOpen, onClose, onConfirmClaim, customer }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50" />
        </Transition.Child>
        <Transition.Child>
          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900"
                >
                  Confirm Claim
                </Dialog.Title>
                <div className="mt-2">
                  <p className="text-sm text-gray-600">
                    Are you sure you want to claim these points?
                  </p>
                </div>
                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="inline-block rounded bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-600 transition-colors duration-150 hover:bg-gray-200"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-block rounded bg-green-600 px-4 py-2 text-center text-sm font-semibold text-white transition-colors duration-150 hover:bg-green-700"
                    onClick={() => onConfirmClaim(customer)}
                  >
                    Confirm Claim
                  </button>
                </div>
              </Dialog.Panel>
            </div>
          </div>
        </Transition.Child>
      </Dialog>
    </Transition>
  );
};

export default ClaimDialog;
