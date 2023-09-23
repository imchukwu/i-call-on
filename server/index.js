// server/index.js
const express = require("express");
const http = require("http");
const socketIO = require("socket.io");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const MAX_ATTEMPTS = 10; // Maximum number of attempts

let actualNumber; // The random number for the current game

const PORT = process.env.PORT || 3000;

// Set up the static files directory (for serving the HTML file)
const staticPath = path.join(__dirname, "../"); // Assuming 'client' is the directory with your frontend files
app.use(express.static(staticPath));

// Store player information
const players = {};

let gameInProgress = false; // Track game state

// Function to start a new game
function startNewGame() {
  actualNumber = Math.floor(Math.random() * 20) + 1;
  console.log(`New game started. Actual number: ${actualNumber}`);
  gameInProgress = true; // Set game state to "in progress"
}
// Start a new game when the server starts
startNewGame();

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  // Handle new player joining
  socket.on("join", (username) => {
    players[socket.id] = {
      id: socket.id,
      username,
      score: 20, // Initial score
      groupHighScore: 0,
      attempts: 0, // Track the number of attempts
    };

    // Broadcast player list to all clients
    io.emit("updatePlayerList", Object.values(players));

    // Notify the player of the start of a new game (if one is in progress)
    if (gameInProgress) {
      socket.emit("newGame", actualNumber);
    }
  });

  // Handle guesses
  socket.on("guess", (guess) => {
    const player = players[socket.id];

    if (player.attempts < MAX_ATTEMPTS && gameInProgress) {
      const difference = Math.abs(guess - actualNumber);
      player.score -= difference;
      player.attempts++;

      if (difference === 0) {
        // Correct guess, update group high score
        if (player.score > player.groupHighScore) {
          player.groupHighScore = player.score;
        }
        // Start a new game
        startNewGame();
        // Emit "gameOver" event to all clients
        io.emit("gameOver");
      }

      // Emit the updated player information to the player who made the guess
      socket.emit("updatePlayer", player);

      // Broadcast updated player list to all clients
      io.emit("updatePlayerList", Object.values(players));
    } else if (!gameInProgress) {
      // Handle guesses when the game is over
      socket.emit("gameOver"); // Inform the player that the game is over
    }
  });

  // Handle disconnect
  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    delete players[socket.id];
    io.emit("updatePlayerList", Object.values(players));
  });
});

server.listen(PORT, () => {
  console.log("Server is running on port 3000");
});
