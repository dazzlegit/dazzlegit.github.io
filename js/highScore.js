window.WOOD_PUZZLE = window.WOOD_PUZZLE || {};
WOOD_PUZZLE.HIGH_SCORE = {

  value : parseInt( localStorage.highScore ) || 0,

  $elem : $('.high-score'),

  update : function() {
    this.$elem.html(`High score: ${ this.value }`);
  },

  isNewHighScore : function() {
    return this.value < WOOD_PUZZLE.SCORE.value;
  },

  save : function() {
    this.value = WOOD_PUZZLE.SCORE.value;
    localStorage.highScore = this.value;
  }

};