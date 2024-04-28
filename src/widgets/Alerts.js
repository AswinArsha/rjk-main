import React from 'react';

const Alerts = ({ alertMessage, alertType }) => {
  if (!alertMessage) return null;

  return (
    <div
      className={`px-4 py-3 leading-normal rounded-lg mx-4 ${
        alertType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
      }`}
      role="alert"
    >
      <p className="font-bold">{alertType === 'success' ? 'Upload Successful' : 'Error'}</p>
      <p>{alertMessage}</p>
    </div>
  );
};

export default Alerts;
