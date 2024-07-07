import React, { useState, useEffect } from 'react';
import SongList from './components/SongList';
import AudioPlayer from './components/AudioPlayer';
import './App.css';

const App = () => {
  const [songs, setSongs] = useState([]);
  const [currentSong, setCurrentSong] = useState(null);

  useEffect(() => {
    const loadSongs = async () => {
      try {
        const response = await fetch('/LocalSongs');
        const songs = await response.json();
        console.log('Fetched songs:', songs); // Debugging output
        setSongs(songs);
      } catch (error) {
        console.error('Error loading songs:', error);
      }
    };

    loadSongs();
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
