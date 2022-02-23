function logNumbers(arr, columns){
	let _text = "[";
	for(let i = 0; i < arr.length; i++){
		if (i % columns == 0) _text+="\n";
		_text+= arr[i] + "," 
	}
	_text+="\n]";
	console.log(_text);
}

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
		this.cells = [];
		this.init();
	}

	addNumbers(){
		let arr = [].fill.call( {length: this.rows * this.columns}, 0);
		//изменить код fillSquareAroundTarget
		for (let i = 0; i < this.bombs.length; i++){
			arr[this.bombs[i]] = numberBomb;  
			arr = fillSquareAroundTarget(div(this.bombs[i], this.columns), (this.bombs[i] % this.columns), arr, this.rows, this.columns);
		}
		this.numbers = arr;
	}
	
	init(){		
		console.log(this.bombs);
		this.addNumbers();
		logNumbers(this.numbers, this.columns);
		//this.isClosed = false;
		this.draw();
		
	}

	draw()
	{
		if( this.isClosed )
		{
			for (let i = 0; i < this.rows; i++)
			{
				for (let j = 0; j < this.columns; j++){
					this.cells[i*this.columns + j] = new Cell(this.widthCell*j, this.heightCell*i, this.numbers[i*this.columns + j]);
					this.cells[i*this.columns + j].drawClose();
				}
			}
		}
		else
		{
			for (let i = 0; i < this.rows; i++)
			{
				for (let j = 0; j < this.columns; j++){
					new Cell(this.widthCell*j, this.heightCell*i, this.numbers[i*this.columns + j]).drawOpen();
				}
			}
		}
	}
	
	findCell(x,y){
		//доделать
		//let cell = 
		let cell = cells.find(_find);
		console.log("cell = " + cell);
		return cell;
	}
	
	_find(elem){
		elem._find()
	}
}