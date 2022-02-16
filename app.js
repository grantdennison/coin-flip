const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { error } = require("console");

const app = express();
const port = 3000;

const winsInRow = 3;

const GAME_STATUS = {
  Ready: 0,
  Won: 1,
  Lost: 2,
};

let sessions = {};

app.use(cors());

// Configuring body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.get("/", (req, res) => {
  res.send("Hello World, from express app");
});

app.post("/startgame", (req, res) => {
  if (!req.body.username) {
    res.send(400);
    return;
  }

  let id = createGuid();
  sessions[id] = {
    numGuessesRemaining: winsInRow,
    guessHistory: [],
    gameStatus: GAME_STATUS.Ready,
    username: req.body.username,
  };

  res.send(id);
});

app.post("/play", (req, res) => {
  // Check if session exists
  const sessionId = req.headers["x-sessionid"];
  if (!sessionId || !sessions[sessionId]) {
    res.send(403);
    return;
  }

  // const state = sessions[sessionId];

  let headTails = req.body.choice;

  if (!validate(headTails)) {
    res.send(400);
    return;
  }

  const isWin = coinFlip(headTails);
  const game = sessions[sessionId];

  game.guessHistory.push(headTails);
  game.numGuessesRemaining--;
  game.gameStatus = !isWin ? 2 : game.numGuessesRemaining === 0 ? 1 : 0;
  res.send(sessions[sessionId]);

  if (game.gameStatus === 1 || game.gameStatus === 2) {
    delete sessions[sessionId];
  }
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
  return value === coin;
};

function createGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return (
    s4() +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    "-" +
    s4() +
    s4() +
    s4()
  );
}
