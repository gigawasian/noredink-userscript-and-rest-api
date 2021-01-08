const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
//const keep_alive = require('./keep_alive.js')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Express api is awake.  Usage: /api/addanswer/(id)/(question)/(answer)/ or /api/getanswer/');
});
app.get('/api/addanswer/:Id/:question/:answer/', (req, res) => {
  fs.readFile("questions_and_answers.json", 'utf8', function (err, data) {
    if (err) return console.log(err);
    var datajson=JSON.parse(data);
    if (!(typeof datajson[req.params.Id] === 'object' && datajson[req.params.Id] !== null)) {//adds id if doesnt already exist as object
      datajson[req.params.Id]={};
    }
    datajson[req.params.Id][req.params.question]=req.params.answer;
    var dataupdated=JSON.stringify(datajson);
    fs.writeFile("questions_and_answers.json", dataupdated, function (err) {
      if (err) return console.log(err);
      res.send("id: "+req.params.Id+"\nadded question: " + req.params.question+"\nwith answer: "+req.params.answer);
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
const port = process.env.PORT || 3000;
app.listen(port, () => console.log('server started'));
