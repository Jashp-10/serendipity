require('dotenv').config();
const express = require('express');
const session = require('express-session');
const passport = require('passport');
const { Strategy: GoogleStrategy } = require('passport-google-oauth20');
const { Strategy: SpotifyStrategy } = require('passport-spotify');
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const { exec } = require('child_process');

const app = express();

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the public directory

// Express session setup
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: true }));

// Passport setup
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

// Google Strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_REDIRECT_URI,
},
(accessToken, refreshToken, profile, done) => {
  const user = { googleId: profile.id, displayName: profile.displayName };
  return done(null, user);
}));

// Spotify Strategy
passport.use(new SpotifyStrategy({
  clientID: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  callbackURL: process.env.SPOTIFY_REDIRECT_URI,
},
async (accessToken, refreshToken, expires_in, profile, done) => {
  const likedSongsResponse = await axios.get('https://api.spotify.com/v1/me/tracks', {
    headers: { 'Authorization': `Bearer ${accessToken}` }
  });
  const likedSongs = likedSongsResponse.data.items.map(item => ({
    song_id: item.track.id,
    song_name: item.track.name,
    artist: item.track.artists[0].name,
    album: item.track.album.name,
    album_art: item.track.album.images[0].url,
    preview_url: item.track.preview_url,
    duration: item.track.duration_ms,
  }));

  const likedSongsFile = path.join(__dirname, 'likedSongs.json');
  let storedSongs = [];
  if (fs.existsSync(likedSongsFile)) {
    storedSongs = JSON.parse(fs.readFileSync(likedSongsFile, 'utf8'));
  }

  // Avoid duplicates
  const newSongs = likedSongs.filter(song => !storedSongs.some(storedSong => storedSong.song_id === song.song_id));
  storedSongs = storedSongs.concat(newSongs);

  fs.writeFileSync(likedSongsFile, JSON.stringify(storedSongs, null, 2));

  return done(null, profile);
}));

// Routes
app.get('/auth/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback', 
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/auth/spotify');
  }
);

app.get('/auth/spotify',
  passport.authenticate('spotify', { scope: ['user-library-read'] })
);

app.get('/auth/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('http://localhost:3000/'); // Redirect to the frontend URL
  }
);

app.get('/LocalSongs', (req, res) => {
  const songsDir = path.join(__dirname, 'public', 'LocalSongs');
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load songs' });
    }
    const songs = files.filter(file => file.endsWith('.mp3'));
    res.json(songs);
  });
});

app.post('/upload', multer({ dest: 'public/LocalSongs' }).array('files'), (req, res) => {
  res.status(200).json({ message: 'Files uploaded successfully' });
});

app.get('/likedSongs', (req, res) => {
  const likedSongsFile = path.join(__dirname, 'likedSongs.json');
  if (fs.existsSync(likedSongsFile)) {
    const likedSongs = JSON.parse(fs.readFileSync(likedSongsFile, 'utf8'));
    res.json(likedSongs);
  } else {
    res.json([]);
  }
});

app.post('/download-songs', (req, res) => {
  const scriptPath = 'C:\\Users\\jashp\\OneDrive\\Desktop\\vacation doin\\PROJECTS\\Serendipity\\serendipity\\youtube_downloader.py';
  exec(`python "${scriptPath}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(`exec error: ${error}`);
      return res.status(500).json({ error: `Error executing Python script: ${error.message}`, stderr });
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
    res.status(200).json({ message: 'Download started', stdout, stderr });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
