window.WOOD_PUZZLE = window.WOOD_PUZZLE || {};
WOOD_PUZZLE.BOARD = {

  H : 10,

  W : 10,

  FIGURE_H : 5,

  FIGURE_W : 5,

  data : [],

  $elem : $('.board'),

  initData : function() {
    for ( let y = 0; y < this.H; y++ ) {
      this.data[y] = [];
      for ( let x = 0; x < this.W; x++ ) {
        this.data[y][x] = 0;
      }
    }
  },

  initGameOverData : function() {
    this.data = this._getGameOverData();
  },

  redraw : function( isGameOver ) {
    this.$elem.html(null);
    for ( let y = 0; y < this.data.length; y++ ) {
      const $row = $('<div>').addClass( isGameOver ? 'board-row-game-over' : 'board-row' );      
      for ( let x = 0; x < this.data[y].length; x++ ) {
        const $cell = $('<div>')
          .addClass('board-row-cell')
          .attr('data-y', y)
          .attr('data-x', x);         
        if ( this.data[y][x] ) {
          $cell.addClass('board-row-cell-wood');
        }
        $row.append( $cell );
      }
      this.$elem.append( $row );
    }    
  },

  addFigure : function( cellY, cellX, figureOffsetY, figureOffsetX, figure ) {
    for ( let y = cellY - figureOffsetY; y < cellY - figureOffsetY + this.FIGURE_H; y++ ) {
      const shapeOffsetY = y + figureOffsetY - cellY;
      for ( let x = cellX - figureOffsetX; x < cellX - figureOffsetX + this.FIGURE_W; x++ ) {   
        const shapeOffsetX = x + figureOffsetX - cellX;    
        if ( figure.SHAPE[shapeOffsetY][shapeOffsetX] ) {
          this.data[y][x] = 1;
        }
      }
    }    
  },

  checkFullLines : function() {
    let fullLinesPts = 0;
    //calculate > pts
    fullLinesPts += this.data.filter( row => row.every( cell => cell === 1 ) ).length * this.W;
    //calculate ^ pts
    for ( let x = 0; x < this.W; x++ ) {
      if ( this.data.map( row => row[x] ).every( cell => cell === 1 ) ) {
        fullLinesPts += this.H;
      }
    }
    //remove wooden cells (can't do it with pts calculating, because of possible cross situations)
    for ( let y = 0; y < this.H; y++ ) {
      if ( this.data[y].every( cell => cell === 1 ) ) {
        for ( let x = 0; x < this.W; x++ ) {
          this.data[y][x] = 0;
        }
      }
    }
    for ( let x = 0; x < this.W; x++ ) {
      if ( this.data.map( row => row[x] ).every( cell => cell === 1 ) ) {
        for ( let y = 0; y < this.H; y++ ) {
          this.data[y][x] = 0;
        }
      }
    }
    return fullLinesPts;
  },

  canCellBeDroppable : function( cellY, cellX, figureOffsetY, figureOffsetX, figure ) {
    for ( let y = cellY - figureOffsetY; y < cellY - figureOffsetY + this.FIGURE_H; y++ ) {
      const shapeOffsetY = y + figureOffsetY - cellY;
      for ( let x = cellX - figureOffsetX; x < cellX - figureOffsetX + this.FIGURE_W; x++ ) {   
        const shapeOffsetX = x + figureOffsetX - cellX;    
        if ( figure.SHAPE[shapeOffsetY][shapeOffsetX] ) {
          if ( y < 0 || y >= this.H || x < 0 || x >= this.W || this.data[y][x] ) {
            return false;
          }
        }
      }
    }   
    return true; 
  },

  setCellDroppable : function( cellY, cellX, figureOffsetY, figureOffsetX, placeElement ) {
    const that = this;
    $(`.board-row-cell[data-y=${ cellY }][data-x=${ cellX }]`).droppable({
      tolerance : 'pointer',
      drop: function() {        
        //add figure to board
        that.addFigure( cellY, cellX, figureOffsetY, figureOffsetX, placeElement.figure );        
        //check for full lines
        const fullLinesPts = that.checkFullLines(); 
        //sum turn points
        const turnPts = placeElement.figure.PTS + fullLinesPts;
        //reset placeElement
        placeElement.reset();
        //ok
        WOOD_PUZZLE.GAME.update( turnPts );
      }
    });
  },

  destroyAllDroppableCells : function() {
    $('.board-row-cell').each( function() {
      if ( $(this).is('.ui-droppable') ) {
        $(this).droppable('destroy');
      }
    });
  },

  _getGameOverData : function() {
    return [
      [ 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 1, 1, ],
      [ 1, 0, 0, 0, 0, 1, 0, 1, 0, 0, 1, 0, 1, 0, 1, 0, 1, 0, 0, ],
      [ 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, ],
      [ 1, 0, 1, 0, 1, 1, 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, ],
      [ 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, ],
      [ 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, ],
      [ 1, 1, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, ],
      [ 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 0, 0, ],
      [ 1, 0, 1, 0, 1, 0, 0, 0, 1, 0, 1, 1, 1, 0, 1, 1, 1, 0, 0, ],
      [ 1, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 0, ],
      [ 1, 1, 1, 0, 0, 0, 1, 0, 0, 0, 1, 1, 1, 0, 1, 0, 1, 0, 0, ]      
    ];
  }

};