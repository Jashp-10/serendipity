import React from 'react';

const Sync = () => {
  const handleSync = () => {
    console.log("Sync button clicked"); // Debug log
    if (!navigator.onLine) {
      alert('You need to be connected to the internet to sync.');
      return;
    }
    console.log("Redirecting to /auth/google");
    window.location.href = 'http://localhost:5000/auth/google'; // Ensure this URL is correct
  };

  return (
    <button onClick={handleSync} className="sync-button">
      Sync with Spotify
    </button>
  );
};

export default Sync;
