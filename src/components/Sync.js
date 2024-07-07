import React from 'react';

const Sync = ({ onSyncComplete }) => {
  const handleSync = () => {
    // Mock sync action for the offline scenario
    setTimeout(() => {
      alert('Songs synced successfully');
      onSyncComplete(); // Refresh the song list
    }, 1000);
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <button onClick={handleSync}>Sync Liked Songs</button>
    </div>
  );
};

export default Sync;
