import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { supabase } from "../supabase";

const EditUserDialog = ({ isOpen, onClose }) => {
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen) {
      fetchUsers();
    }
  }, [isOpen]);

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase.from("users").select("*");

      if (error) {
        throw error;
      }

      setUsers(data);
    } catch (error) {
      console.error("Error fetching users:", error.message);
    }
  };

  const handleEdit = (user) => {
    setCurrentUser(user);
    setEmail(user.email);
    setPassword(""); // Start with an empty password to ensure security
  };

  const handleSave = async () => {
    if (!currentUser) return;

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from("users")
        .update({
          email: email.trim() || currentUser.email,
          password: password.trim() || currentUser.password,
        })
        .eq("id", currentUser.id);

      if (error) {
        throw error;
      }

      setCurrentUser(null);
      fetchUsers(); // Refresh the user list
      onClose(); // Close the dialog
    } catch (error) {
      setError("An error occurred while updating the user. Please try again.");
      console.error("Error updating user:", error.message);
    } finally {
      setIsLoading(false);
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
              <Dialog.Panel className="w-full max-w-md transform overflow-hidden bg-white rounded-lg p-6 shadow-xl text-left transition-all">
                <Dialog.Title className="text-xl font-bold text-gray-800">
                  Edit Users
                </Dialog.Title>

                <div className="mt-4">
                  {users.length === 0 ? (
                    <p className="text-gray-600">No users found.</p>
                  ) : (
                    <table className="w-full text-left text-sm border-separate border-spacing-0">
                      <thead>
                        <tr className="bg-gray-100 text-gray-800">
                          <th className="py-2 px-4">Email</th>
                          <th className="py-2 px-4">Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {users.map((user) => (
                          <tr
                            key={user.id}
                            className="border-b hover:bg-gray-100 transition"
                          >
                            <td className="py-2 px-4">{user.email}</td>
                            <td className="py-2 px-4">
                              <button
                                onClick={() => handleEdit(user)}
                                className="bg-blue-600 text-white px-3 py-1 rounded-lg transition duration-150 hover:bg-blue-700"
                              >
                                Edit
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>

                {currentUser && (
                  <div className="mt-6 space-y-4">
                    <div className="flex flex-col">
                      <label className="text-gray-700">Email:</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label className="text-gray-700">Password:</label>
                      <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button
                        onClick={handleSave}
                        className="bg-green-600 text-white px-4 py-2 rounded-lg transition duration-150 hover:bg-green-700"
                        disabled={isLoading}
                      >
                        {isLoading ? "Saving..." : "Save Changes"}
                      </button>
                    </div>
                    {error && <p className="text-red-600 mt-2">{error}</p>}
                  </div>
                )}
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default EditUserDialog;
