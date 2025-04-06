import React from "react";

const NotificationModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 max-w-md w-full text-gray-800 shadow-lg">
        <h2 className="text-xl font-bold mb-4">Notifications</h2>
        <p className="text-base mb-6">
          Currently, no notifications are available. However, our AI and web
          scraping models are already implemented in the backend, which is
          available in our GitHub repository. We are currently working on
          integrating these components to automatically send email alerts and
          on-site notifications.
        </p>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationModal;
