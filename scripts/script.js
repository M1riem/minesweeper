var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

//Вспомогательное - координаты движущейся мыши
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


let levels = [];

for(let i = 0; i < dropdowns[0].childElementCount; i++){				
	levels[i] = new Level(dropdowns[0].children[i].id, i);
}

function _generationBombs(range, amount){
	
	let bombs = [];
	
	console.log("Генерация бомб:");
	
	for(let i = 0; i < amount; i++)
	{ 
		bombs[i] = getRandomInt(range);
			for (let j = 0; j < amount; j++){
				if ((bombs[i] == bombs[j]) && (i!=j))
				{
					console.log(" Замена bombs[i] = " + bombs[i] + ", i = "+ i + " ; bombs[j] = " + bombs[j]+ ", j = "+ j);
					bombs[i] = getRandomInt(range);
					j = 0;
					console.log("на " + bombs[i]);
				}
			}
		_sort(bombs);
	}
	return bombs;
}


//в дальнейшем общую функцию назвать initialization()
function _drawGrid(level){
	
	let bombs = [];
	let range = countRow * countColumn;
	console.log("range = " + range + "; Level amountBombs = " + level.amountBombs);
	
	//генерация бомб
	bombs = _generationBombs(range, level.amountBombs);
	console.log("количество бомб : " + level.amountBombs + ".\nМеста, на которых находятся бомбы = " + bombs );
	console.log("строк : " + countRow + "; столбцов:" + countColumn);
	
	// отрисовка поля
	// занесение бомб в сетку
	for (let i=0; i < countRow; i++)
	{
		cells[i] = [];
		for (let j=0; j < countColumn; j++)
		{
			cells[i][j] = new Cell(widthCell*j, heightCell*i, 0);
			
			if ((bombs.length!=0) && ((i + (i * (countColumn-1)) + j) == bombs[0] ))
			{
				let k = i + (i * (countColumn-1)) + j;
				console.log("(i(" + i + ")" + "* countRow("+countRow+")) + j("+j+")){ " + k + " } == bombs[0]{ " + bombs[0] +" }");
				cells[i][j].isBomb = true;
				cells[i][j].countNeighbors = numberBomb;
				bombs = bombs.slice(1);										
			}			
			
		}
	}
	// вычисление бомб для других клеток в сетке(номера на клетках)
	for (let i=0; i < countRow; i++)
	{
		for (let j=0; j < countColumn; j++)
		{			
			if (cells[i][j].isBomb)
			{
				//учет ботбы для соседних клеток
				//(i-1,j-1); (i-1,j); (i-1,j+1)
				//(i,j -1) ;  bomb	  (i,j+1)
				//(i+1,j-1); (i+1,j); (i+1,j+1)
				if (i > 0){
					cells[i-1][j].countNeighbors = 
					(cells[i-1][j].isBomb) ? numberBomb : ++cells[i-1][j].countNeighbors;
					
					if (j > 0)
					{
						cells[i-1][j-1].countNeighbors = cells[i-1][j-1].isBomb ? numberBomb : ++cells[i-1][j-1].countNeighbors;
					}	
					if(j < countColumn-1)
					{
						cells[i-1][j+1].countNeighbors = cells[i-1][j+1].isBomb ? numberBomb : ++cells[i-1][j+1].countNeighbors;
					}
				}
				if (i < (countRow-1))
				{					
					cells[i+1][j].countNeighbors = cells[i+1][j].isBomb ? 9 : ++cells[i+1][j].countNeighbors;
					if (j > 0)
					{
						cells[i+1][j-1].countNeighbors = cells[i+1][j-1].isBomb ? numberBomb : ++cells[i+1][j-1].countNeighbors;
					}
					if(j < countColumn-1)
					{
						cells[i+1][j+1].countNeighbors = cells[i+1][j+1].isBomb ? numberBomb : ++cells[i+1][j+1].countNeighbors;
					}
				}
				if (j > 0){
					cells[i][j-1].countNeighbors = cells[i][j-1].isBomb ? numberBomb : ++cells[i][j-1].countNeighbors;							
				}
				if (j < countColumn-1){
					cells[i][j+1].countNeighbors = cells[i][j+1].isBomb ? numberBomb : ++cells[i][j+1].countNeighbors;	
				}				
			}
		}
	}
	
	
	//отрисовка сетки на canvas 
	for (let i=0; i < countRow; i++){
		for (let j=0; j < countColumn; j++){
			cells[i][j].drawClose();												
		}
	}	
	
	//вывод в консоль нахождения пустых клеток
	let _text = "";
	for (let i=0; i < countRow; i++){
		for (let j=0; j < countColumn; j++)			
			if (cells[i][j].countNeighbors == 0) _text += "(" + i + ", " + j + "); ";						
		if (_text!="") console.log("Empty : " + _text);
		_text = "";
	}	
	
}

	

//или переименовать функцию (Same = Empty) или добавить третий коэффециент - number
//cжедать один проход на бумаге
function _openNearSameCells(i,j)
{
	//console.log("enter in : " + "(" + i + ", " + j + "); ");
	if (cells[i][j].isOpen)
	{	
		//console.log("(" + i + "," + j + ") - this open = return");
		return;
	}
	
	cells[i][j].drawOpen( );
	//открытие чисел рядом с пустыми клетками, но не бомб
	_openNearNumbers(i,j);
	//console.log("(" + i + "," + j + ") - drawOpen");
	
	
	//console.log("(" + i + "," + j + ")" + " top=>");	
	if ( (i > 0) && (cells[i-1][j].countNeighbors == 0)  ){
	
		_openNearSameCells(i-1,j);
		//console.log("top out of: " + "(" + (i-1) + ", " + j + "); in " + "(" + (i) + ", " + j + ") ");
	}
	
	//console.log("(" + i + "," + j + ")" + " left=>");	
	if ( (j > 0) && (cells[i][j-1].countNeighbors == 0) ){
		_openNearSameCells(i,j-1);
		//console.log("left out of: " + "(" + i + ", " + (j-1) + "); in " + "(" + (i) + ", " + j + ") ");
	}
	//console.log("(" + i + "," + j + ")" +" right=>");
	if ( (j < countColumn-1) && (cells[i][j+1].countNeighbors == 0)  ){
		_openNearSameCells(i,j+1);
		//console.log("right out of: " + "(" + i + ", " + (j+1) + "); in " + "(" + (i) + ", " + j + ") ");
	}
	
	//console.log("(" + i + "," + j + ")" + " down=>");
	if ( (i < countRow-1) && (cells[i+1][j].countNeighbors == 0)){
		_openNearSameCells(i+1,j);
		//console.log("down out of: " + "(" + (i+1) + ", " + j + "); in " + "(" + (i) + ", " + j + ") ");
	}
	
	//console.log("( exit: " + i + "," + j + ")" );
	return;		
}

//сделать тестовый прогон
function _openNearNumbers(i,j)
{
	if (i > 0)
	{
		if ((!cells[i-1][j].isBomb) && (cells[i-1][j].countNeighbors!=0))
			cells[i-1][j].drawOpen( ); 

		if ( (j > 0) && (!cells[i-1][j-1].isBomb) && (cells[i-1][j-1].countNeighbors!=0)  )
			cells[i-1][j-1].drawOpen( ); 
	
		if( (j < countColumn-1) && (!cells[i-1][j+1].isBomb) && (cells[i-1][j+1].countNeighbors!=0) )
			cells[i-1][j+1].drawOpen( ); 		
	}
	if (i < (countRow-1))
	{
		
		if ( (!cells[i+1][j].isBomb) && (cells[i+1][j].countNeighbors!=0)  )
			cells[i+1][j].drawOpen( ); 
		
		if ( (j > 0) && (!cells[i+1][j-1].isBomb) && (cells[i+1][j-1].countNeighbors!=0)  )
			cells[i+1][j-1].drawOpen( ); 
	
		if( (j < countColumn-1) && (!cells[i+1][j+1].isBomb) && (cells[i+1][j+1].countNeighbors!=0) )
			cells[i+1][j+1].drawOpen( ); 
	}

	if ( (j > 0) && (!cells[i][j-1].isBomb) && (cells[i][j-1].countNeighbors!=0) )
		cells[i][j-1].drawOpen( ); 

	if( (j < countColumn-1) && (!cells[i][j+1].isBomb) && (cells[i][j+1].countNeighbors!=0) )
		cells[i][j+1].drawOpen( );									
}

//блокировка контекстного меню для canvas
canvas.oncontextmenu = function(e){
	return false;
}

//вешаем на cells обработчики события нажатия кнопок			
canvas.addEventListener('mousedown', mouseDown, false);

let firstLeftClick = 1;

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
							switch(cell.countNeighbors){
								case 0: _openNearSameCells(i,j); break;
								case numberBomb : _openAllSameCells(numberBomb); break;
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

function _test(){
}

/* When the user clicks on the button,
toggle between hiding and showing the dropdown content */
// function myFunction() {
    // document.getElementById("myDropdown").classList.toggle("show");
// }
			


// var menu = document.getElementById('menu');
//блокировка контекстного меню menu
// menu.oncontextmenu = function(e){
	// return false;
// }
// menu.onmousedown = function(event) {
	// if (event.which == 1) {
		// alert('Нажата левая кнопка мыши!');
	// }
	// if (event.which == 3) {		
		// return;
	// }
// };

function exit(){
	 p.blah();
}

// cells.forEach(function(row, i, cells) {
		// cells[i].forEach(function(cell, j, cells) {
//открыть все ячейки c указанным номером (в будующем открыть все бомбы)
function _openAllSameCells(number)
{
	for (let i=0; i < countRow; i++)
	{
		for (let j=0; j < countColumn; j++)
		{
			if (i > 0){
				if(cells[i-1][j].countNeighbors == number) 
					cells[i-1][j].drawOpen( ); 
				if ((j > 0) && (cells[i-1][j-1].countNeighbors == number)) 
					cells[i-1][j-1].drawOpen( ); 
				if ((j < countColumn-1) && (cells[i-1][j+1].countNeighbors == number)) 
					cells[i-1][j+1].drawOpen( );				
			}
			if (i < (countRow-1)){
				if(cells[i+1][j].countNeighbors == number) 
					cells[i+1][j].drawOpen( ); 
				if ((j > 0) && (cells[i+1][j-1].countNeighbors == number)) 
					cells[i+1][j-1].drawOpen( ); 
				if ((j < countColumn-1) && (cells[i+1][j+1].countNeighbors == number)) 
					cells[i+1][j+1].drawOpen( );				
			}
			if ((j > 0) && (cells[i][j-1].countNeighbors == number)){
				cells[i][j-1].drawOpen( );											
			}
			if ((j < countColumn-1) && (cells[i][j+1].countNeighbors == number)){
				cells[i][j+1].drawOpen( );
			}		
		}
	}
}

// import * as MyMenu from 'menu.js';
//import  'menu.js';

//function _calculationGrid()
//function _generateField()]
//this.drawBackround("#C37C54");