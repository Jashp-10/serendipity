import React, { useState, useEffect } from 'react';
import SongList from './components/SongList';
import AudioPlayer from './components/AudioPlayer';
import Sync from './components/Sync';
import FileUpload from './components/FileUpload';
import './App.css';

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch('/LocalSongs');
        const songs = await response.json();
        setSongs(songs);
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };

    loadSongs();
  }, []);

  const fetchLikedSongs = async () => {
    try {
      const response = await fetch('/likedSongs');
      const likedSongs = await response.json();
      setLikedSongs(likedSongs);
    } catch (error) {
      console.error('Error fetching liked songs:', error);
    }
  };

  useEffect(() => {
    fetchLikedSongs();
  }, []);

  const handleNext = () => {
    const currentIndex = songs.indexOf(currentSong);
    const nextIndex = (currentIndex + 1) % songs.length;
    setCurrentSong(songs[nextIndex]);
  };

  const handlePrevious = () => {
    const currentIndex = songs.indexOf(currentSong);
    const previousIndex = (currentIndex - 1 + songs.length) % songs.length;
    setCurrentSong(songs[previousIndex]);
  };

  return (
    <div className="app-container">
      <div className="song-list-container">
        <SongList songs={songs} onSelect={setCurrentSong} />
        <Sync /> {/* Ensure this component is correctly placed */}
        <FileUpload />
        <div>
          <h3>Liked Songs</h3>
          <ul>
            {likedSongs.map((song) => (
              <li key={song.song_id}>{song.song_name} by {song.artist}</li>
            ))}
          </ul>
        </div>
      </div>
      <div className="player-container">
        {currentSong ? (
          <AudioPlayer
            song={currentSong}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        ) : (
          <div className="placeholder">Select a song to play</div>
        )}
      </div>
    </div>
  );
};

export default App;
