window.WOOD_PUZZLE = window.WOOD_PUZZLE || {};
WOOD_PUZZLE.GAME = {

  init: function() {

    WOOD_PUZZLE.HIGH_SCORE.update();
    WOOD_PUZZLE.SCORE.update(0);

    WOOD_PUZZLE.BOARD.initData();
    WOOD_PUZZLE.BOARD.redraw();

    WOOD_PUZZLE.FIRST = Object.assign( {}, WOOD_PUZZLE.PLACE_ELEMENT, { $elem : $('.first') } );
    WOOD_PUZZLE.SECOND = Object.assign( {}, WOOD_PUZZLE.PLACE_ELEMENT, { $elem : $('.second') } );
    WOOD_PUZZLE.THIRD = Object.assign( {}, WOOD_PUZZLE.PLACE_ELEMENT, { $elem : $('.third') } );

    [ WOOD_PUZZLE.FIRST, WOOD_PUZZLE.SECOND, WOOD_PUZZLE.THIRD ].forEach( element => element.update() );

  },

  update: function( turnPts ) {

    WOOD_PUZZLE.SCORE.update( turnPts );
    if ( WOOD_PUZZLE.HIGH_SCORE.isNewHighScore() ) {
      WOOD_PUZZLE.HIGH_SCORE.save();
      WOOD_PUZZLE.HIGH_SCORE.update();
    }

    WOOD_PUZZLE.BOARD.redraw();

    const placeElements = [ WOOD_PUZZLE.FIRST, WOOD_PUZZLE.SECOND, WOOD_PUZZLE.THIRD ];

    if ( placeElements.every( element => !element.figure ) ) {
      placeElements.forEach( element => element.update() );
    }

    if ( placeElements.every( element => !element.canBeAdded() ) ) {
      placeElements.forEach( element => {
        if ( element.isFigureSet() ) {
          element.reset();
        }
      });  
      this.setGameOver();          
    }

  },

  setGameOver: function() {
    WOOD_PUZZLE.BOARD.initGameOverData();
    WOOD_PUZZLE.BOARD.redraw( true );
  }

};