const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');

const apiRouter = require('./api');

const app = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, '..', 'client', 'build')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', 'client', 'build', 'index.html'));
});

app.use('*', (req, res) => {
  res.status(404).end();
});

module.exports = app;
