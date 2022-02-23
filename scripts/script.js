//main parametrs
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

let countRow;//8,14,20
let countColumn;//8,18,24	

function logNumbers(arr, columns){
	let _text = "[";
	for(let i = 0; i < arr.length; i++){
		if (i % columns == 0) _text+="\n";
		_text+= arr[i] + "," 
	}
	_text+="\n]";
	console.log(_text);
}

/* Квадрат вокруг цели - 8 значений
	//(i-1,j-1); (i-1,j); (i-1,j+1)
	//(i,j -1) ;  target	  (i,j+1)
	//(i+1,j-1); (i+1,j); (i+1,j+1)
*/
function fillSquareAroundTarget(row, column, array, maxRow, maxColumn){	
	for(let i = row-1; i <= row + 1 ; i++)
	{
		if ((i >= 0) && (i < maxRow))
		{
			for(let j = column-1; j <= column + 1; j++)
			{					
				if ((j >= 0) && (j < maxColumn) && !((j==column)&&(i==row)) && ( array[ i*maxColumn + j ] != numberBomb )) {
					array[ i*maxColumn + j ]++;
				}
			}
		}

	}
	return array;
}

//инициализация поля, переписать initialization()
let field;
function drawGrid(level){
	field = new Field(level);
	
	/*//создание поля
	//cells = addField(cells, level.countRow, level.countColumn, level.amountBombs);
	// console.log(arr);
	// logCells(cells);

	//draw cells on canvas 
	//drawFieldClosed(level.countRow, level.countColumn);
	
	//log empty cells in console
	//logEmptyCells(level);
	*/
	
}

function initField(rows, columns, cells){	
	for (let i = 0; i < rows; i++)
	{	
		cells[i] = [];
		for (let j = 0; j < columns; j++)
		{
			cells[i][j] = new Cell(widthCell*j, heightCell*i);
		}
	}
	return cells;
}

function addNumbers(row, column, cells, maxRow, maxColumn){
	//перенисать cell для хранения такого типа данных
	//(i-1,j-1); (i-1,j); (i-1,j+1)
	//(i,j -1) ;  bomb	  (i,j+1)
	//(i+1,j-1); (i+1,j); (i+1,j+1)
		
	for(let i = row-1; i <= row + 1 ; i++)
	{
		if ((i >= 0) && (i < maxRow))
		{
			for(let j = column-1; j <= column + 1; j++)
			{					
				if ((j >= 0) && (j < maxColumn) && (!cells[i][j].isBomb)){
					cells[i][j].number++;
					// console.log("number : cells[" + i + "," + j + "]= "+ cells[i][j].number);
				}
			}
		}

	}
}

function addField(cells, rows, columns, amountBombs ){	
	
	//инициализация поля
	cells = initField(rows, columns, cells);
	
	//генерация бомб
	let range = rows * columns;
	console.log("range = " + range + "; amount bombs = " + amountBombs);
	let bombs = createArrayRandom(range, amountBombs);
	
	//заполнение поля
	cells.forEach(function(row, i){
		cells[i].forEach(function(cell, j){
			if ((bombs.length!=0) && ((i * columns + j) == bombs[0] ))
			{
				let k = (i * columns + j);
				console.log("(row(" + i + ")" + "* columns("+columns+")) + column("+j+")){ " + k + " } == bombs[0]{ " + bombs[0] +" }");
				cell.isBomb = true;
				cell.number = numberBomb;
				addNumbers(i, j, cells, rows, columns);
				bombs = bombs.slice(1);										
			}		
		})
	});

	return cells;
}

function drawFieldClosed(rows, columns){
	for (let i=0; i < rows; i++){
		for (let j=0; j < columns; j++){
			cells[i][j].drawClose();												
		}
	}
}

//log empty cells in console
function logEmptyCells(level){
	let _text = "";
	for (let i=0; i < level.countRow; i++){
		for (let j=0; j < level.countColumn; j++)			
			if (cells[i][j].number == 0) _text += "(" + i + ", " + j + "); ";						
		if (_text!="") console.log("Empty : " + _text);
		_text = "";
	}	
}

function logCells(cells){
	cells.forEach(function(row, i, cells){
		cells[i].forEach(function(cell, j, cells){
			console.log("cell.x = " + cell.x + ", cell.y = " + cell.y + ",cell.number = " + cell.number );
		});	
	});
}

//или переименовать функцию (Same = Empty) или добавить третий коэффециент - number
//cжедать один проход на бумаге
//сделать 
function _openNearEmptyCells( row, column, maxRow = level.countRow, maxColumn = level.countColumn )
{
	console.log("enter in : " + "(" + row + ", " + column + ");" );
	if (cells[row][column].isOpen)
	{	
		console.log("(" + row + "," + column + ") - this open = return");
		return;
	}
	
	cells[row][column].drawOpen( );
	console.log("(" + row + "," + column + ") - drawOpen");
	//открытие чисел рядом с пустыми клетками
	_openNearNumbers(row, column);
	
	
	for(let i = row-1; i <= row + 1 ; i++)
	{
		if ((i >= 0) && (i < maxRow))
		{	
			for(let j = column-1; j <= column + 1; j++)
			{	
				if ( (j >= 0) && (j < maxColumn) && (cells[i][j].number == 0) && 
					!((j==column)&&(i==row))&&
					((j==column)||(i==row))
					)
				{
					console.log("(" + i + "," + j + ")" + "=>");	
					_openNearEmptyCells(i, j);
					console.log("left out of: " + "(" + i + ", " + j + " )");
				}
			}
			
		}

	}		
	console.log("( exit: " + row + "," + column + ")" );
	return;		
}

function _openNearNumbers(row, column, maxRow = level.countRow, maxColumn = level.countColumn)
{	
	for(let i = row-1; i <= row + 1 ; i++)
	{
		if ((i >= 0) && (i < maxRow))
		{
			for(let j = column-1; j <= column + 1; j++)
			{	
	
				if ( (j >= 0) && (j < maxColumn) && (!cells[i][j].isBomb) && (cells[i][j].number!=0) )
				{	
					console.log("(" + i + "," + j + ") - _openNearNumbers");
					cells[i][j].drawOpen();
				}
			}
		}

	}								
}

//блокировка контекстного меню для canvas
canvas.oncontextmenu = function(e){
	return false;
}

//вешаем на cells обработчики события нажатия кнопок			
canvas.addEventListener('mousedown', mouseDown, false);

let firstLeftClick = 1;

function mouseDown( event ){	
	if (event.which == 1){	
		
		let target = field.findCell(mouse.x, mouse.y);
		console.log("нажата левая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
		switch(field.findCell(mouse.x, mouse.y).number){
			case 0: _openNearEmptyCells(i,j); break;
			case numberBomb : openAllSameCells(numberBomb); break;
			default : cell.drawOpen( ); break;								
		}							
	}
		
	if(event.which == 3){		
		console.log("нажата правая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
		cell.drawFlag();	
		console.log("проверка правого флага: " + cell.isPressedRightButtonMouse);
	}			
}
/* старый mouseDown( event )
function mouseDown( event ){	
	if ((event.which == 1)||(event.which == 3)){		
		
		cells.forEach(function(row, i, cells) {
			cells[i].forEach(function(cell, j, cells) {
				if 	(
						( cell.x < mouse.x) && (cell.y < mouse.y) && 
						( cell.x + widthCell >= mouse.x) && (cell.y + heightCell >= mouse.y)
					)
				{
					switch(event.which){
						case 1: 
						{
							// if (firstLeftClick == 1) { startTimer(); firstLeftClick++;}
							console.log("нажата левая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
							switch(cell.number){
								case 0: _openNearEmptyCells(i,j); break;
								case numberBomb : openAllSameCells(numberBomb); break;
								default : cell.drawOpen( ); break;								
							}							
							break;
						}										
						case 3: 
						{
							console.log("нажата правая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
							cell.drawFlag();	
							console.log("проверка правого флага: " + cell.isPressedRightButtonMouse);	
							
							break;							
						}
						default : break;
					} 					
				}
		  })
		});					
	}
}
*/

//открыть все ячейки c указанным номером (в будующем открыть все бомбы)
function openAllSameCells(number)
{
	cells.forEach(function(row, i){
		cells[i].forEach(function(cell){
			if(cell.number == number) 
				cell.drawOpen();
		});
			
	});
}


let mouse = {x: 0, y: 0};
$(document).ready(function(){
	//Координаты курсора относительно всего документа
	$(document).mousemove(function(event){
		var x = event.pageX;
		var y = event.pageY;
		$('#coordsdocument').html( 'Координаты курсора: (' + x + '; ' + y + ')' );
	});
	// Координаты курсора относительно отдельного блока
	$(canvas).mousemove(function(event){
		var pos = $(this).offset();
		var elem_left = pos.left.toFixed(0);
		var elem_top = pos.top.toFixed(0);
		var x = event.pageX - elem_left;
		var y = event.pageY - elem_top;
		mouse.x = x; mouse.y = y;
		$('#coordscanvas').html( 'Координаты курсора-холста: (' + x + '; ' + y + ')' );
	});
});


function test(){
	var sayings = new Map();
	sayings.set("dog", "woof");
	sayings.set("cat", "meow").set("elephant", "toot");
	//вызов функции .set возвращает Map, поэтому set можно объединять в цепочки

	sayings.set("dog", "гав-гав"); // заменить значение по ключу

	sayings.size; // 3
	sayings.get("fox"); // undefined
	sayings.has("bird"); // false
	sayings.delete("dog");

	for (var [key, value] of sayings) {
	  console.log(key + " goes " + value);
	}
}