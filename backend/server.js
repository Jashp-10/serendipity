const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/LocalSongs', (req, res) => {
  const songsDir = path.join(__dirname, 'public', 'LocalSongs');
  fs.readdir(songsDir, (err, files) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to load songs' });
    }
    console.log('Files in LocalSongs:', files); // Debugging output
    const songs = files.filter(file => file.endsWith('.mp3'));
    console.log('Filtered songs:', songs); // Debugging output
    res.json(songs);
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
