require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url')

// Basic Configuration
const port = process.env.PORT || 3000;
const urlPattern = /^(https?:\/\/)(www\.)?[a-z0-9\-]+\.[a-z]{2,}([\/\w\.-]*)*\/?$/i;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

let urlCount = 1; // Use let to allow incrementing
const urlDatabase = {};


app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  if (!originalUrl || !validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = urlCount++;
  urlDatabase[shortUrl] = originalUrl;

  res.status(200).json({ original_url: originalUrl, short_url: shortUrl });
});


app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  try {
    new URL(originalUrl);
  } catch (err) {
    return res.json({ error: 'invalid url' });
  }

  const shortUrl = urlCount++;
  urlDatabase[shortUrl] = originalUrl;

  res.status(200).json({ original_url: originalUrl, short_url: shortUrl });
});


app.get('/api/shorturl/:shortUrl', (req, res) => {
  const urlId = req.params.shortUrl;
  const originalUrl = urlDatabase[urlId];

  if (originalUrl) {
    res.redirect(originalUrl);
  } else {
    res.status(404).send('No url found');
  }
});

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
