window.WOOD_PUZZLE = window.WOOD_PUZZLE || {};
WOOD_PUZZLE.PLACE_ELEMENT = {

  $elem : null,

  figure : null,  

  $figureElem : null,

  update : function() {
    this.figure = this._getRandomFigure();
    this.$figureElem = this._getFigureHTML( this.figure );
    this.$elem.html( this.$figureElem );
    this._setDraggable();
  },

  reset : function() {
    this.figure = null;
    this.$figureElem.remove();
    this.$figureElem = null;
    this.$elem.html( this.$figureElem );    
  },

  isFigureSet : function() {
    return !!this.figure;
  },

  canBeAdded : function() {
    if ( !this.isFigureSet() ) return false;
    for ( let figureOffsetY = 0; figureOffsetY < this.figure.SHAPE.length; figureOffsetY++ ) {
      for ( let figureOffsetX = 0; figureOffsetX < this.figure.SHAPE[0].length; figureOffsetX++ ) {
        for ( let cellY = 0; cellY < WOOD_PUZZLE.BOARD.data.length; cellY++ ) {
          for ( let cellX = 0; cellX < WOOD_PUZZLE.BOARD.data[0].length; cellX++ ) {
            if ( WOOD_PUZZLE.BOARD.canCellBeDroppable( cellY, cellX, figureOffsetY, figureOffsetX, this.figure ) ) {
              return true;
            }
          }
        }
      }
    } 
    return false;       
  },

  _getRandomFigure : function() {
    return WOOD_PUZZLE.FIGURES[ Math.floor( Math.random() * WOOD_PUZZLE.FIGURES.length ) ];
  },

  _getFigureHTML : function( figure ) {    
    const $figure = $('<div>').addClass('figure');
    for ( let y = 0; y < WOOD_PUZZLE.BOARD.FIGURE_H; y++ ) {
      const $row = $('<div>').addClass('figure-row');
      for ( let x = 0; x < WOOD_PUZZLE.BOARD.FIGURE_W; x++ ) {
        const $cell = $('<div>')
          .addClass('figure-row-cell')          
          .attr('data-y', y)
          .attr('data-x', x);
        if ( figure.SHAPE[y][x] ) {
          $cell.addClass('figure-row-cell-wood');
        }
        $row.append( $cell );
      }
      $figure.append( $row );
    }
    return $figure;
  },

  _setDraggable : function() {
    const that = this;
    this.$figureElem.draggable({
      start: function( event, ui ) {        
        const [ figureOffsetY, figureOffsetX ] = [ parseInt( $( event.toElement ).attr('data-y') ), parseInt( $( event.toElement ).attr('data-x') ) ]; //figure cell coordinates with mouse pointer on
        WOOD_PUZZLE.BOARD.destroyAllDroppableCells();
        WOOD_PUZZLE.BOARD.data.forEach( ( row, cellY ) => {
          row.forEach( ( value, cellX ) => {                    
            if ( WOOD_PUZZLE.BOARD.canCellBeDroppable( cellY, cellX, figureOffsetY, figureOffsetX, that.figure ) ) {
              WOOD_PUZZLE.BOARD.setCellDroppable( cellY, cellX, figureOffsetY, figureOffsetX, that );
            }
          });
        });
      },
      revert : 'invalid'
    });
  }

}