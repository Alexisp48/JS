class Player {
    constructor(name) {
      this.name = name;
      this.frames = Array(10).fill(null).map(() => ({ rolls: [], score: 0 }));
      this.totalScore = 0;
    }
  }
  
  module.exports = Player;
  