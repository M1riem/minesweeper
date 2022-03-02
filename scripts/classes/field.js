class Field{
	constructor(level){
		this.width = level.widthField;
		this.height = level.heightField;		
		this.rows = level.countRow;	
		this.columns = level.countColumn;		
		this.amountBombs = level.amountBombs;	
		
		this.widthCell = this.width/this.columns;		
		this.heightCell = this.height/this.rows;		
		if (isNotFiniteSizeCell(this.widthCell, this.heightCell)) return;
		
		this.bombs = createArrayRandom(this.rows * this.columns, this.amountBombs);
		this.map = new Map();
		
		this.create();
		this.draw();
	}

	create(){
		let x,y;
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++){
				x = this.widthCell*j ; 		y = this.heightCell*i;
				if (this.bombs[0] == i*this.columns + j){
					this.map.set(j + ", " + i , new Cell(x, y, this.widthCell, this.heightCell, true));
					this.bombs = this.bombs.slice(1);
				}
				else
					this.map.set(j + ", " + i , new Cell(x, y, this.widthCell, this.heightCell));
			}
		}
		//добавление массива listNeighbors в каждую cell, определение номеров соседей бомб
		this.map.forEach((value, key) => {value.listNeighbors = this.addNeighbors(value, key);}, this);
	}
	
	/* Квадрат вокруг бомбы - 8 значений
	//(i-1,j-1); (i-1,j); (i-1,j+1)
	//(i,j -1) ;  target	  (i,j+1)
	//(i+1,j-1); (i+1,j); (i+1,j+1)
*/
	addNeighbors(cell, key){
		let listNeighbor = [];
		let keys = key.split(", "); 		
		let column = Number(keys[0]), row = Number(keys[1]); 
		
		for (let i = row-1; i <= row+1; i++)
			if ((i >= 0) && (i < this.rows)) 
				for (let j = column -1; j <= column + 1; j++)
					if ((j >= 0) && (j < this.columns) && !(( j==column)&&(i==row))) {
						let neighbor = this.map.get(j + ", " + i);
						if ((cell.isBomb) && (!neighbor.isBomb))  neighbor.number++;
						listNeighbor.push(neighbor);
					}						
		return listNeighbor;		
	}
	
	draw(){	this.map.forEach( (cell) => { cell.drawClose(); }, this);	}

	drawAllBombs(){		this.map.forEach((cell) => { if(cell.isBomb) cell.drawOpen(); } );		}

	drawNearEmptyCells(cell){
		if (cell.isOpen)	return;
		cell.drawOpen();		
		cell.listNeighbors.forEach(function(neighbor){
			//отрисовка  номеров рядом с путой ячейкой
			if ( (neighbor.number != 0) && (!neighbor.isBomb) )
			{	neighbor.drawOpen();	}
			if (  (neighbor.number == 0) && ( (cell.x == neighbor.x) || (cell.y == neighbor.y) )  )
			{	this.drawNearEmptyCells(neighbor);	}
		}, this// указываю контекст вызова - объект в котором сейчас нахожсь
		);
	}	
	
	findCell(x,y){	
		let i = (div(y, this.heightCell) == this.rows) ? this.rows-1 : div(y, this.heightCell);
		let j = (div(x, this.widthCell) == this.columns) ? this.columns-1 : div(x, this.widthCell);
		return this.map.get(j + ", " + i);
	}
	
	winCheck(){
		this.checkBomb = 0;
		this.map.forEach((cell) => { if (cell.isBomb && cell.isRigthMark)	this.checkBomb++;	}, this);
		if ( (this.checkBomb == this.amountBombs) && (document.getElementById("countFlags").childNodes[0].nodeValue == 0) ) 
			return true;
		return false;
	}
	//log empty cells in console
	logEmptyCells(){
		let _text = "";
		for (let i=0; i < this.rows; i++){
			for (let j=0; j < this.columns; j++)
				if (this.map.get(j + ", " + i).number == 0) _text += "(" + j + ", " + i + "); ";						
			if (_text!="") console.log("Empty : " + _text);
			_text = "";
		}	
	}
}