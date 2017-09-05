window.WOOD_PUZZLE = window.WOOD_PUZZLE || {};
WOOD_PUZZLE.SCORE = {

  value : 0,

  $elem : $('.score'),

  update : function( value ) {
    this.value += value;
    this.$elem.html(`Score: ${ this.value }`);
  }

};