class Field{
	constructor(level){
		this.isClosed = true;
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
		this.init();
	}
	
	init(){	
		this.create();
		console.log(this.bombs);
		console.log(this.map);
		this.addBombs();				
		//this.isClosed = false;
		this.draw();
		//this.logEmptyCells();		
	}
	
	//переписать без x,y
	create(){
		let x,y;
		//создать поле - переписать без x,y
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++){
				x = this.widthCell*j ; 		y = this.heightCell*i;
				this.map.set(j + ", " + i , new Cell(x, y) );
			}
		}
		//добавление массива listNeighbors в каждую cell
		this.map.forEach((value, key) => {value.listNeighbors = this.addNeighbors(value, key);}, this);
	}
	
	addBombs(){		
		this.map.forEach(function (cell, key)
		{	
			let keys = key.split(", "); 		
			let j = Number(keys[0]), i = Number(keys[1]); 
			//console.log(key + "= (" + (i*this.columns + j) + ")");
			if (this.bombs[0] == i*this.columns + j) {
				cell.isBomb = true;
				cell.number = numberBomb;
				cell.listNeighbors.forEach(neighbor => {if (!neighbor.isBomb) neighbor.number++;} );	
				this.bombs = this.bombs.slice(1);				
			}		
		}, this);
	}
	
	/* Квадрат вокруг цели - 8 значений
	//(i-1,j-1); (i-1,j); (i-1,j+1)
	//(i,j -1) ;  target	  (i,j+1)
	//(i+1,j-1); (i+1,j); (i+1,j+1)
*/
	addNeighbors(cell, key){
		let list = [];
		let keys = key.split(", "); 		
		let column = Number(keys[0]), row = Number(keys[1]); 
		//console.log(key + " = (" + column + ", " + row + ")");
		
		for (let i = row-1; i <= row+1; i++)
			if ((i >= 0) && (i < this.rows)) 
				for (let j = column -1; j <= column + 1; j++)
					if ((j >= 0) && (j < this.columns) && !(( j==column)&&(i==row))) 
						list.push(this.map.get(j + ", " + i));
		return list;		
	}
	
	draw(){		
		this.map.forEach( (cell) => { this.isClosed ? cell.drawClose() : cell.drawOpen(); }, this);	
	}

	drawAllBombs(){
		this.map.forEach((cell) => { if(cell.isBomb) cell.drawOpen(); } );		
	}

	drawNearEmptyCells(cell){
		// console.log("enter in : " + "(" + cell.x + ", " + cell.y + ");" );
		if (cell.isOpen)
		{	
			// console.log("(" + cell.x + "," + cell.y + ") - this open = return");
			return;
		}
		cell.drawOpen();		
		//console.log(cell.listNeighbors);
		cell.listNeighbors.forEach(function(value){
			//отрисовка  номеров рядом с путой ячейкой
			if ( (value.number != 0) && (!value.isBomb) )
			{
				//console.log( "drawOpen(" + value.x + "," + value.y + ").number = " + value.number);
				value.drawOpen();
			}
			if ( (value.number == 0) && ((cell.x == value.x) || (cell.y == value.y)) )
			{
				// console.log("(" + value.x + "," + value.y + ") =>");
				this.drawNearEmptyCells(value);
				// console.log("(" + value.x + "," + value.y + ") <=");	
			}
		}, this// указываю контекст вызова - объект в котором сейчас нахожсь
		);

		// console.log("exit: " + "(" + cell.x + ", " + cell.y + ");" );
	}	
	//переписать
	findCell(x,y){
		
		let i = (div(y, heightCell) == this.rows) ? this.rows-1 : div(y, heightCell);
		let j = (div(x, widthCell) == this.columns) ? this.columns-1 : div(x, widthCell);
				// console.log("(" + x + " ," + y + ") = {" + i*heightCell + ", " + j*widthCell + "}" );
		//console.log("(" + x + " ," + y + ") = {" + j + ", " + i + "}" );
		return this.map.get(j + ", " + i);
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