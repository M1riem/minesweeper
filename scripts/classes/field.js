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
		this.addBombs();		
		console.log(this.map);
		//this.isClosed = false;
		this.draw();	
	}
	
	create(){
		let x,y;
		//создать поле
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++){
				x = this.widthCell*j ; 		y = this.heightCell*i;
				this.map.set(x + ", " + y , new Cell(x, y) );
			}
		}
		//переписать на foreach
		//добавление listNeighbors в каждую cell
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++){
				x = this.widthCell*j ; 		y = this.heightCell*i;
				this.map.get(x + ", " + y).listNeighbors = this.addNeighbors(this.map.get(x + ", " + y));
			}
		}
	}
	//переделать на foreach
	addBombs(){
		let x,y;
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++){
				x = this.widthCell*j ; 		y = this.heightCell*i;
				if (this.bombs[0] ==  i*this.columns + j) {
					//console.log("this.bombs[0] =" + this.bombs[0] + " == (" + x + ", " + y + ")");
					let target = this.map.get(x + ", " + y);
					target.isBomb = true;
					target.number = numberBomb;
					
					// заполнение номерами
					for (let k = 0; k < target.listNeighbors.length; k++ )
						if (!target.listNeighbors[k].isBomb)  
							target.listNeighbors[k].number++;
																
					this.bombs = this.bombs.slice(1);
				}	
			}
		}
	}
	//переписать на foreach
	addNeighbors(cell){
		let list = [];
		let row = cell.y/heightCell;
		let column = cell.x/widthCell;
		let x,y;
		
		for (let i = row-1; i <= row+1; i++){
			if ((i >= 0) && (i < this.rows)) {
				for (let j = column -1; j <= column + 1; j++){
					if ((j >= 0) && (j < this.columns) && !(( j==column)&&(i==row))) {
						x = j*widthCell; y = i*heightCell;
						list.push(this.map.get(x + ", " + y));
					}
				}
			}
		}
		return list;		
	}
	//переписать на foreach
	draw()
	{
		let x,y;
		for (let i = 0; i < this.rows; i++)
		{
			for (let j = 0; j < this.columns; j++){
				x = this.widthCell*j ; 		y = this.heightCell*i;				
				if( this.isClosed )
					this.map.get(x + ", " + y).drawClose();
				else 
					this.map.get(x + ", " + y).drawOpen();
			}
		}
	}
	
	findCell(x,y){
		//доделать
		//let cell = 
		//let cell = cells.find(_find);
		//console.log("cell = " + cell);
		//return cell;
		return null;
	}
}