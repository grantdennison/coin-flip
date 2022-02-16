const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { error } = require("console");

const app = express();
const port = 3000;

const winsInRow = 3;

let results = {
  numGuessesRemaining: winsInRow,
  guessHistory: [],
  gameStatus: 0,
};

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World, from express app");
});

app.post("/play", (req, res) => {
  let headTails = req.body.choice;
  if (results.gameStatus !== 0) reset();
  if (!validate(headTails)) {
    res.send(400);
    return;
  }
  coinFlip(headTails);
  res.send(results);
});

app.listen(port, () =>
  console.log(`Hello world app listening on port ${port}!`)
);

const validate = function (value) {
  if (value === 1 || value === 0) {
    return true;
  } else {
    return false;
  }
};

const coinFlip = function (value) {
  let coin = Math.round(Math.random());
  if (value === coin) {
    results.numGuessesRemaining -= 1;
    results.guessHistory.push(value);
  } else {
    results.gameStatus = 2;
  }
  if (results.numGuessesRemaining === 0) {
    results.gameStatus = 1;
  }
};

const reset = function () {
  results.numGuessesRemaining = winsInRow;
  results.guessHistory = [];
  results.gameStatus = 0;
};
