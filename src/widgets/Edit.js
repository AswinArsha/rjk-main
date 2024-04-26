import React, { useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Edit = ({ isOpen, customer, onClose }) => {
  const [editedCustomer, setEditedCustomer] = useState({});

  useEffect(() => {
    if (customer) {
      setEditedCustomer(customer); // Initialize with customer data
    }
  }, [customer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedCustomer({ ...editedCustomer, [name]: value });
  };

  const handleSave = () => {
    console.log('Edited customer data:', editedCustomer);
    onClose(); // Close the dialog
    // Here, you would typically send the updated data to the server or state management
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
                  {/* CUSTOMER CODE */}
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="customerCode">
                      Customer Code
                    </label>
                    <input
                      type="text"
                      name="CUSTOMER CODE"
                      value={editedCustomer['CUSTOMER CODE'] || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                      id="customerCode"
                      disabled
                    />
                  </div>
                  
                  {/* ADDRESS1 */}
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="address1">
                      Address 1
                    </label>
                    <input
                      type="text"
                      name="ADDRESS1"
                      value={editedCustomer['ADDRESS1'] || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                      id="address1"
                    />
                  </div>

                  {/* ADDRESS2 */}
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="address2">
                      Address 2
                    </label>
                    <input
                      type="text"
                      name="ADDRESS2"
                      value={editedCustomer['ADDRESS2'] || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                      id="address2"
                    />
                  </div>

                  {/* MOBILE */}
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="mobile">
                      Mobile
                    </label>
                    <input
                      type="text"
                      name="MOBILE"
                      value={editedCustomer['MOBILE'] || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                      id="mobile"
                    />
                  </div>

                  {/* TOTAL POINTS */}
                  <div className="text-gray-700">
                    <label className="block mb-1" htmlFor="totalPoints">
                      Total Points
                    </label>
                    <input
                      type="number"
                      name="TOTAL POINTS"
                      value={editedCustomer['TOTAL POINTS'] || ''}
                      onChange={handleInputChange}
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                      id="totalPoints"
                    />
                  </div>
                </div>

                <div className="mt-6 flex justify-end gap-4">
                  <button
                    className="inline-block rounded bg-gray-50 px-4 py-2 text-center text-sm font-semibold text-gray-500 hover:bg-gray-100"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button
                    className="inline-block rounded bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-700"
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
