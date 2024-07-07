import React, { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ song, onPrevious, onNext }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = `/LocalSongs/${song}`;
      audioRef.current.load();
      audioRef.current.onloadedmetadata = () => {
        setDuration(audioRef.current.duration);
        audioRef.current.play();
        setIsPlaying(true);
      };
    }
  }, [song]);

  const handlePlayPause = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    setCurrentTime(audioRef.current.currentTime);
  };

  const handleProgressChange = (e) => {
    audioRef.current.currentTime = e.target.value;
    setCurrentTime(e.target.value);
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
      >
        <source src={`/LocalSongs/${song}`} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      <div className="controls">
        <button onClick={onPrevious}>Previous</button>
        <button onClick={handlePlayPause}>{isPlaying ? 'Pause' : 'Play'}</button>
        <button onClick={onNext}>Next</button>
      </div>
      <div className="progress-bar">
        <input
          type="range"
          min="0"
          max={duration}
          value={currentTime}
          onChange={handleProgressChange}
        />
        <div>{new Date(currentTime * 1000).toISOString().substr(11, 8)} / {new Date(duration * 1000).toISOString().substr(11, 8)}</div>
      </div>
    </div>
  );
};

export default AudioPlayer;
