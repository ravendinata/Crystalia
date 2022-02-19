require('dotenv').config();

const fs = require('fs');
const nl2br = require('nl2br');

const express = require('express');
const port = process.env.PORT || 3000;

const app = express();
app.set('view engine', 'ejs');

// Call ESM
app.use(require('express-status-monitor')());

// Home Router
app.get('/', (req, res) => 
{
  res.render(__dirname + '/views/pages/index');
});

// Log Router
app.get('/log', (req, res) =>
{
  var data = fs.readFileSync('./logs/log.log');
  res.render(__dirname + '/views/pages/log', { data: data });
});

app.listen(port, () => console.log(`\nSystem Monitor Initialized on Port ${port}!\n`));