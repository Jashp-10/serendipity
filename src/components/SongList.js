import React from 'react';
import './SongList.css';

const SongList = ({ songs, onSelect }) => {
  return (
    <div className="song-list">
      {songs.map((song, index) => (
        <div
          key={index}
          className="song-item"
          onClick={() => onSelect(song)}
        >
          {song}
        </div>
      ))}
    </div>
  );
};

export default SongList;
