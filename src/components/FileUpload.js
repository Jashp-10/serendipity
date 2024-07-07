import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FileUpload = () => {
  const [songs, setSongs] = useState([]);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/LocalSongs');
        setSongs(response.data);
      } catch (error) {
        console.error('Error fetching songs:', error);
      }
    };

    const fetchLikedSongs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/likedSongs');
        setLikedSongs(response.data);
      } catch (error) {
        console.error('Error fetching liked songs:', error);
      }
    };

    fetchSongs();
    fetchLikedSongs();
  }, []);

  const handleUpload = async () => {
    try {
      const response = await axios.post('http://localhost:5000/download-songs');
      if (response.status === 200) {
        alert('Download started');
      }
    } catch (error) {
      console.error('Error downloading songs:', error);
      alert('Error downloading songs');
    }
  };

  return (
    <div>
      <div>
        <h3>Local Songs</h3>
        <ul>
          {songs.map((song, index) => (
            <li key={index}>{song}</li>
          ))}
        </ul>
      </div>
      <button onClick={handleUpload}>Sync with Spotify</button>
      <div>
        <h3>Upload Songs</h3>
        <input type="file" multiple={false} />
        <button onClick={handleUpload}>Upload Songs</button>
      </div>
      <div>
        <h3>Liked Songs</h3>
        <ul>
          {likedSongs.map((song, index) => (
            <li key={index}>
              {song.song_name} by {song.artist}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FileUpload;
