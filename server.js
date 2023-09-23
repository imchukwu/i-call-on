const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const PORT = process.env.PORT || 3000;

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, 'public')));

let connectedPlayer = [];

// Define a Player class or constructor function
class Player {
    constructor(socketId, name) {
      this.socketId = socketId;
      this.name = name;
      this.currentScore = 0;
      this.highScore = 0;
      this.groupHighScore = 0;
    }
  
    // Methods to update scores
    updateCurrentScore(score) {
      this.currentScore = score;
    }
  
    updateHighScore() {
      if (this.currentScore > this.highScore) {
        this.highScore = this.currentScore;
      }
    }
  
    updateGroupHighScore(groupScore) {
      if (groupScore > this.groupHighScore) {
        this.groupHighScore = groupScore;
      }
    }
  }
  
  // Create instances of Player objects
  const player1 = new Player('socketId1', 'Player1');
  const player2 = new Player('socketId2', 'Player2');
  
  // Update scores for players
  player1.updateCurrentScore(10); // Update current score
  player1.updateHighScore(); // Update high score if current score is higher
  player1.updateGroupHighScore(50); // Update group high score
  
  player2.updateCurrentScore(15);
  player2.updateHighScore();
  player2.updateGroupHighScore(60);
  
  // Access player information
  console.log(player1);
  console.log(player2);
  

io.on('connection', (socket) => {
  // Handle player connections
//   console.log(`Player connected with ID: ${socket.id}`);
    connectedPlayer.push(socket.id);
    console.log(connectedPlayer)

    
  // Send a welcome message to the player
//   socket.emit('message', 'Welcome to the multiplayer game!');

  // Broadcast to all players when a new player joins
//   socket.broadcast.emit('message', `Player ${socket.id} has joined the game.`);

  // Handle player disconnect
  socket.on('disconnect', () => {
    // console.log(`Player disconnected with ID: ${socket.id}`);
    
    connectedPlayer.pop(socket.id);
    // Broadcast to all players when a player disconnects
    // socket.broadcast.emit('message', `Player ${socket.id} has left the game.`);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
//   console.log(connectedPlayer);
});
