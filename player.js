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
  