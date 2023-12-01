const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');
const fs = require('fs');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

const db = new sqlite3.Database('message_board.sqlite');

const initScriptPath = path.join(__dirname, 'init.sql');
const initScript = fs.readFileSync(initScriptPath, 'utf-8');

db.serialize(() => {
  db.run(initScript, (err) => {
    if (err) {
      console.error('Error executing init script:', err);
    } else {
      console.log('Database, roles, and table created/started successfully.');
    }
  });
});

app.get('/', (req, res) => {
  db.all('SELECT * FROM messages', (err, messages) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else {
      res.render('index', { messages });
    }
  });
});

app.post('/messages', (req, res) => {
    const { message } = req.body;
    db.run('INSERT INTO messages (text) VALUES (?)', [message], function (err) {
      if (err) {
        console.error(err);
        res.status(500).send('Internal Server Error');
      } else {
        console.log('Message sent successfully');
        res.redirect('/');
      }
    });
  });  

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
