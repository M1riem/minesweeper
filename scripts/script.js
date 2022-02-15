const scripts = document.getElementsByTagName('script');
const scriptName = scripts[scripts.length-1].src;

var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
var widthCanvas = 400;//400,600,800
var heightCanvas = 400;//400, 500, 600

canvas.width = widthCanvas;
canvas.height = heightCanvas;

let countRow = 8;//8,14,20
let countColumn = 8;//8,18,24	
let amountBombs = 10;//10, 40, 99
let numberBomb = 9;
let cells = [];//игровое поле
let font_size;// основной шрифт

switch(amountBombs){
	case 10: font_size = "36px"; break;
	case 40: font_size = "20px"; break;
	case 99: font_size = "14px"; break;
}

let widthCell = widthCanvas/countColumn;
let heightCell = heightCanvas/countRow;
console.log("size cell = ("+ widthCell + " ," + heightCell +")");
if (!isFinite(widthCell) || !isFinite(heightCell))
{
	console.log("Error!!! " + scriptName + " Ошибка в " + heightCell.name + "или " + widthCell.name + " Переменная имеет неверный формат.");
	exit();
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

class Cell{
	//нажатие правой кнопки мыши
	isPressedRightButtonMouse;
	constructor(x , y, countNeighbors = 0, isBomb = false, isOpen = false){
		this.x = x;
		this.y = y;
		this.countNeighbors = countNeighbors;
		this.isBomb = isBomb;
		this.isOpen = isOpen;
		this.isPressedRightButtonMouse = false;
	}
	
	drawClose(){
		//if (this.isOpen ) return;		
		this.drawBackround("#C0C0C0");
		this.drawBorders("1");
	}
	
	drawOpen(font_size){
		//проверка на выставленный флаг
		if (this.isPressedRightButtonMouse) return;
		// //если клетка была уже открыта
		//if (this.isOpen) return;
		
		this.isOpen = true;		
		this.drawBackround("#E5E4E2");				
		this.drawBorders("2");
		
		if (this.isBomb) {
			//поменять на imgBomb
			this.drawBackround("#CE8F00");		
		}

		//отрисовка номеров
		context.fillStyle = "#000";
		context.font = font_size + " serif";
		if (this.countNeighbors != 0)
			context.fillText(this.countNeighbors, this.x + widthCell/3, this.y + heightCell*0.75 );	
	}
	
	drawFlag(){
		if (this.isOpen ) return;
		if (this.isPressedRightButtonMouse){			
			this.isPressedRightButtonMouse = false;
			this.drawClose();	
		}
		else{
			//поменять на imgFlag
			this.isPressedRightButtonMouse = true;
			this.drawBackround("#C37C54");
			this.drawBorders("3");
		}
	}
	
	//рисование фона 
	drawBackround(color){
		context.fillStyle = color;
		context.fillRect(this.x, this.y, widthCell, heightCell);
	}
	
	//рисование рамки 
	drawBorders(lineWidth){
		context.beginPath();
		context.lineWidth = lineWidth;
		context.strokeStyle = "#8B8B8A";//"darkgoldenrod";
		context.rect(this.x, this.y, widthCell, heightCell);	
		context.closePath();
		context.stroke();
	}
	
	//печать текста
	drawText(){
		
	}
}



_drawGrid();

//untils
function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
//untils
function _sort(arr){
	for(let i=0; i < arr.length; i++){ 
		for(let j=0; j < arr.length; j++){ 
			if (arr[i] <= arr[j]){
				let c = arr[i];
				arr[i] = arr[j];
				arr[j] = c;						
			}
		}	
	}
}


function _generationBombs(range, amount){
	
	let bombs = [];
	
	console.log("Генерация бомб:" );
	
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
function _drawGrid(){
	let bombs = [];
	let range = countRow * countColumn;
	
	//генерация бомб
	bombs = _generationBombs(range, amountBombs);
	console.log("количество бомб : " + amountBombs + ".\nМеста, на которых находятся бомбы = " + bombs );
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
	// вычисление бомб для других клеток в сетке
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
}

	

//или переименовать функцию (Same = Empty) или добавить третий коэффециент - number
//cжедать один проход на бумаге
function _openNearSameCells(i,j)
{
	cells[i][j].drawOpen(font_size);
	_openNearNumbers(i,j);
	
	if ( (i > 0) && (cells[i-1][j].countNeighbors == 0) && (!cells[i-1][j].isOpen) ){
		_openNearSameCells(i-1,j);
	}
	
	if ( (j > 0) && (cells[i][j-1].countNeighbors == 0) && (!cells[i][j-1].isOpen) ){
		_openNearSameCells(i,j-1);
	}
	
	if ( (j < countColumn-1) && (cells[i][j+1].countNeighbors == 0) && (!cells[i][j+1].isOpen) ){
		_openNearSameCells(i,j+1);
	}
	
	if ( (i < countRow-1) && (cells[i+1][j].countNeighbors == 0) && (!cells[i+1][j].isOpen)){
		_openNearSameCells(i+1,j);
	}	
	
	return;
}
//сделать тестовый прогон
function _openNearNumbers(i,j)
{
	if (i > 0)
	{	
		if ((!cells[i-1][j].isBomb) && (!(cells[i-1][j].countNeighbors!=0)) )
			cells[i-1][j].drawOpen(font_size); 
		
		if ( (j > 0) && (!cells[i-1][j-1].isBomb) && (!(cells[i-1][j-1].countNeighbors!=0)) )
			cells[i-1][j-1].drawOpen(font_size); 
	
		if( (j < countColumn-1) && (!cells[i-1][j+1].isBomb) && (!(cells[i-1][j+1].countNeighbors!=0)) )
			cells[i-1][j+1].drawOpen(font_size); 
	}
	if (i < (countRow-1))
	{
		if ( (!cells[i+1][j].isBomb) && (!(cells[i+1][j].countNeighbors!=0)) )
			cells[i+1][j].drawOpen(font_size); 
		
		if ( (j > 0) && (!cells[i+1][j-1].isBomb) && (!(cells[i+1][j-1].countNeighbors!=0)) )
			cells[i+1][j-1].drawOpen(font_size); 
	
		if( (j < countColumn-1) && (!cells[i+1][j+1].isBomb) && (!(cells[i+1][j+1].countNeighbors!=0)) )
			cells[i+1][j+1].drawOpen(font_size); 
	}
	
	if ( (j > 0) && (!cells[i][j-1].isBomb) && (!(cells[i][j-1].countNeighbors!=0)) )
			cells[i][j-1].drawOpen(font_size); 

	if( (j < countColumn-1) && (!cells[i][j+1].isBomb) && (!(cells[i][j+1].countNeighbors!=0)) )
			cells[i][j+1].drawOpen(font_size);										
	
	return;
}

//блокировка контекстного меню для canvas
canvas.oncontextmenu = function(e){
	return false;
}
//вешаем на cells обработчики события нажатия кнопок			
canvas.addEventListener('mousedown', mouseDown, false);

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
							console.log("нажата левая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
							switch(cell.countNeighbors){
								case 0: _openNearSameCells(i,j); break;
								case numberBomb : _openAllSameCells(numberBomb); break;
								default : cell.drawOpen(font_size); break;								
							}							
							break;
						}										
						case 3: 
						{
							console.log("нажата правая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
							cell.drawFlag();	
							console.log("нажатие: " + cell.isPressedRightButtonMouse);							
							break;							
						}
						default : break;
					} 					
				}
		  })
		});					
	}
}


// в дальнейшем количество мин должно зависеть от уровня сложности
function _calculationGrid(){
	console.log("canvasWidth = " + canvas.clientWidth);
	console.log("canvasHeight = " + canvas.clientHeight);
	var cellWidth = Math.sqrt(canvas.clientWidth);
	var cellHeight = Math.sqrt(canvas.clientHeight);
	
	var sideCell = (cellWidth <= cellHeight) ? cellWidth : cellHeight;  
	return sideCell;
}

//_generateField(10);
function _generateField(countMine){

}
function _test(){
}

// import * as MyMenu from 'menu.js';
//import  'menu.js';

var menu = document.getElementById('menu');
menu.onmousedown = function(event) {
	if (event.which == 1) {
		alert('Нажата левая кнопка мыши!');
	}
	if (event.which == 3) {
		
		alert('Нажата правая кнопка мыши!');
	}
};

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
					cells[i-1][j].drawOpen(font_size); 
				if ((j > 0) && (cells[i-1][j-1].countNeighbors == number)) 
					cells[i-1][j-1].drawOpen(font_size); 
				if ((j < countColumn-1) && (cells[i-1][j+1].countNeighbors == number)) 
					cells[i-1][j+1].drawOpen(font_size);				
			}
			if (i < (countRow-1)){
				if(cells[i+1][j].countNeighbors == number) 
					cells[i+1][j].drawOpen(font_size); 
				if ((j > 0) && (cells[i+1][j-1].countNeighbors == number)) 
					cells[i+1][j-1].drawOpen(font_size); 
				if ((j < countColumn-1) && (cells[i+1][j+1].countNeighbors == number)) 
					cells[i+1][j+1].drawOpen(font_size);				
			}
			if ((j > 0) && (cells[i][j-1].countNeighbors == number)){
				cells[i][j-1].drawOpen(font_size);											
			}
			if ((j < countColumn-1) && (cells[i][j+1].countNeighbors == number)){
				cells[i][j+1].drawOpen(font_size);
			}		
		}
	}
}