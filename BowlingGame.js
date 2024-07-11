const readline = require('readline');
const Player = require('./Player');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

class BowlingGame {
  constructor() {
    this.players = [];
    this.currentFrame = 0;
    this.currentRoll = 0;
  }

  addPlayer(name) {
    this.players.push(new Player(name));
  }

  startGame() {
    rl.question('Entrez le nombre de joueurs: ', (numPlayers) => {
      numPlayers = parseInt(numPlayers);
      this.addPlayers(numPlayers);
    });
  }

  addPlayers(numPlayers) {
    const addPlayer = (index) => {
      if (index < numPlayers) {
        rl.question(`Entrez le nom du joueur ${index + 1}: `, (name) => {
          this.addPlayer(name);
          addPlayer(index + 1);
        });
      } else {
        this.playFrame(0);
      }
    };
    addPlayer(0);
  }

  playFrame(frameIndex) {
    if (frameIndex < 10) {
      this.currentFrame = frameIndex;
      this.currentRoll = 0;
      this.playRoll();
    } else {
      this.endGame();
    }
  }

  playRoll() {
    const currentPlayer = this.players[this.currentRoll % this.players.length];
    const frame = currentPlayer.frames[this.currentFrame];
    rl.question(`Frame ${this.currentFrame + 1}, lancer ${frame.rolls.length + 1}. ${currentPlayer.name}, combien de quilles avez-vous renversé ? `, (pins) => {
      pins = parseInt(pins);
      frame.rolls.push(pins);
      if (frame.rolls.length === 2 || pins === 10) {
        this.calculateScore(currentPlayer);
        this.currentRoll++;
        if (this.currentRoll % this.players.length === 0) {
          this.playFrame(this.currentFrame + 1);
        } else {
          this.playRoll();
        }
      } else {
        this.playRoll();
      }
    });
  }

  calculateScore(player) {
    let score = 0;
    for (let i = 0; i <= this.currentFrame; i++) {
      const frame = player.frames[i];
      if (i === 9) {
        // Special handling for the 10th frame
        score += frame.rolls.reduce((a, b) => a + b, 0);
      } else if (frame.rolls[0] === 10) {
        // Strike
        score += 10 + this.getNextTwoRolls(player, i);
      } else if (frame.rolls[0] + frame.rolls[1] === 10) {
        // Spare
        score += 10 + this.getNextRoll(player, i);
      } else {
        score += frame.rolls.reduce((a, b) => a + b, 0);
      }
      frame.score = score;
    }
    player.totalScore = score;
  }

  getNextTwoRolls(player, frameIndex) {
    if (frameIndex + 1 < 10) {
      const nextFrame = player.frames[frameIndex + 1];
      if (nextFrame.rolls[0] === 10 && frameIndex + 2 < 10) {
        return 10 + player.frames[frameIndex + 2].rolls[0];
      } else {
        return nextFrame.rolls[0] + (nextFrame.rolls[1] !== undefined ? nextFrame.rolls[1] : 0);
      }
    }
    return 0;
  }

  getNextRoll(player, frameIndex) {
    if (frameIndex + 1 < 10) {
      return player.frames[frameIndex + 1].rolls[0];
    }
    return 0;
  }

  endGame() {
    console.log("\nScore final:");
    let maxScore = 0;
    let winners = [];
    this.players.forEach(player => {
      console.log(`${player.name}: ${player.totalScore}`);
      if (player.totalScore > maxScore) {
        maxScore = player.totalScore;
        winners = [player.name];
      } else if (player.totalScore === maxScore) {
        winners.push(player.name);
      }
    });
    console.log(`\n${winners.join(' et ')} est/sont le(s) gagnant(s) !`);
    rl.close();
  }
}

module.exports = BowlingGame;
