import React, { useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const AddGramsDialog = ({ isOpen, onClose, onConfirm }) => {
  const [grams, setGrams] = useState('');

  const handleInputChange = (e) => {
    setGrams(e.target.value);
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
                      className="w-full h-10 px-3 text-base placeholder-gray-600 border rounded-lg focus:shadow-outline"
                      id="gramsInput"
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
                    className="inline-block rounded bg-yellow-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-yellow-700"
                    onClick={() => onConfirm(grams)}
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
