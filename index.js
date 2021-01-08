const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
//const keep_alive = require('./keep_alive.js')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Express api is awake.  Use /api/');
});
app.get('/api/addanswer/:question/:answer/', (req, res) => {
  fs.readFile("questions_and_answers.json", 'utf8', function (err, data) {
    if (err) return console.log(err);
    var datajson=JSON.parse(data);
    datajson[req.params.question]=req.params.answer;
    var dataupdated=JSON.stringify(datajson);
    fs.writeFile("questions_and_answers.json", dataupdated, function (err) {
      if (err) return console.log(err);
      res.send("added question: " + req.params.question+"\nwith answer: "+req.params.answer);
    });
  });
});
app.get('/api/getanswer/', (req, res) => {
  fs.readFile("questions_and_answers.json", 'utf8', function (err, data) {
    if (err) return console.log(err);
    res.send(data);
    console.log(data);
  });
});
app.get('/api/test', (req, res) => {
    res.send("hello world!");
});

app.listen(3000, () => console.log('server started'));
