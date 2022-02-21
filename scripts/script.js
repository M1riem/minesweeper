//main parametrs
let level;
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

let countRow;//8,14,20
let countColumn;//8,18,24	


let amountBombsInMenu;
let numberBomb = 9;
let cells = [];//игровое поле
let font_size;// font_size in cells

//коэффициент размера поля
const size = 100;
//уровень сложности игры
class Level{

	amountBombs;//10, 40, 99
	fontSizeCell;
	countColumn;//8,18,24	

	constructor(name, id, flag = false){
		this.name = name;
		this.id = id;
		this.flag = flag;
		
		this.number = id+1;
		this.widthField = size*2*2 + 2*this.id*size;//400,600,800
		this.heightField = size*2*2 + this.id*size;//400, 500, 600
		this.countRow = 10*this.number - 2*this.number - 2*this.id;//8,14,20
		// this.countColumn = 10*this.number - 2*this.number;// придумать новую формулу
		
		this.setCountColumn();
		this.setAmountBombs();
		this.setFontSizeCells();
		console.log("level: amountBombs = " + this.amountBombs + " fontSizeCell = "+ this.fontSizeCell );
	}
	
	setCountColumn(){
		switch(this.id){
			case 0: { this.countColumn = 8; break; }
			case 1: { this.countColumn = 18; break; }
			case 2: { this.countColumn = 24; break; }
			default: {this.countColumn = 10; break;}
		}
	}
	
	setAmountBombs(){
		switch(this.id){
			case 0: { this.amountBombs = 10; break; }// 10 / 64 = 15.6%
			case 1: { this.amountBombs = 40; break; }// 40 / 252 = 15.87%
			case 2: { this.amountBombs = 99; break; }// 99 / 480 = 20.6%
			default: {this.amountBombs = 10; break;}
		}
	}
	
	setFontSizeCells(){
		switch(this.amountBombs){
			case 10: this.fontSizeCell = "36px"; break;
			case 40: this.fontSizeCell = "30px"; break;
			case 99: this.fontSizeCell = "30px"; break;
			default: this.fontSizeCell = "26px"; break;
		}
	}
}

//клетка поля
class Cell{
	//нажатие правой кнопки мыши
	isPressedRightButtonMouse;
	//мина помечена верно
	isRigthMark;
	
	//добавить ширину ячейки и высоту ячейки в конструктор
	constructor(x , y, countNeighbors = 0, isBomb = false, isOpen = false){
		this.x = x;
		this.y = y;
		this.countNeighbors = countNeighbors;
		this.isBomb = isBomb;
		this.isOpen = isOpen;
		this.isPressedRightButtonMouse = false;
		this.isRigthMark = false;
	}
	
	drawClose(){	
		this.drawBackround("#C0C0C0");
		this.drawBorders("1");
	}
	
	drawOpen(){
		
		// если клетка была уже открыта
		if (this.isOpen){
			//console.log("(" + this.x + "," + this.y + ") - this open");
			return;
		} 
		//проверка на выставленный флаг
		if (this.isPressedRightButtonMouse) return;
		
		this.isOpen = true;		
		//отрисовка
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
			this.isRigthMark = false;
			this.drawClose();	
			//изменение количества флагов в меню
			document.getElementById("countFlags").childNodes[0].nodeValue++;
		}
		else{
			this.isPressedRightButtonMouse = true;
			this.drawImage("images/flag_canvas.jpg", this.x, this.y, widthCell/6, heightCell/6, 2*widthCell/3, 2*heightCell/3);
			//изменение количества флагов в меню
			document.getElementById("countFlags").childNodes[0].nodeValue--;
			if (this.isBomb) this.isRigthMark = true; 
		}
	}
	
	drawImage(sorce, x ,y, dx, dy, width, height){
		let flag = new Image();
		// Привязываем функцию к событию onload
		// Это указывает браузеру, что делать, когда изображение загружено
		flag.onload = function() {
			context.drawImage(flag, x + dx, y + dy, width, height );
		};
		flag.src = sorce;
		console.log(flag);
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

//menu
//tick of Menu
let imgTick = "<img src='images/tick.png' width='15' height='15' style='margin: 0px 10px 0px 0px;'/>";
let dropdowns = document.getElementsByClassName("dropdown-content"); 
let levels = [];			

// counter of flags
let padding = 5; 
let imgFlagMenu = document.getElementById('flag');
imgFlagMenu.height = document.getElementsByClassName("dropbtn")[0].clientHeight - 2*padding;
imgFlagMenu.width = document.getElementsByClassName("dropbtn")[0].clientHeight;
console.log(document.getElementsByClassName("flag-block")[0]);


for(let i = 0; i < dropdowns[0].childElementCount; i++){				
	levels[i] = new Level(dropdowns[0].children[i].id, i);
}

//начальные параметры при входе на сайт
//initial game settings
let widthCell;
let heightCell;
dropdowns[0].children[0].innerHTML = imgTick + dropdowns[0].children[0].text;
levels[0].flag = true;
init();

//set imgTick in dropdowns.children when level is selected
[...dropdowns[0].children].forEach((target, i) => {
	target.addEventListener('click', function(){
		[...dropdowns[0].children].forEach((level, j) => {
			if (target.id == level.id){
				level.innerHTML = imgTick + level.text;
				levels[j].flag = true;	
				init(levels[j].id);
			}
			else{
				level.innerHTML = level.text;
				levels[j].flag = false;
			}						
		});
	});	
	console.log(dropdowns[0].children);
});

//if press dropbtn of Menu		
//выпадает list если нажата кнопка меню
function clickMenu(){
	// console.log("Нажата кнопка меню");
	document.getElementById("menuDropdown").classList.toggle("show");	
}
// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		let dropdowns = document.getElementsByClassName("dropdown-content");
		let i;
		for (i = 0; i < dropdowns.length; i++){
			let openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}
//end menu


//set game options depending on the level
function init(level_id = 0){			
	level =  levels[level_id];
	
	//set count of bombs in menu
	document.getElementById("countFlags").childNodes[0].nodeValue = level.amountBombs;
	//console.log("amountBombsInMenu = " + amountBombsInMenu);
	
	//main parametrs canvas
	canvas.width = level.widthField;
	canvas.height = level.widthField;
	
	//main parametrs for field
	countRow = level.countRow;
	countColumn = level.countColumn;
	font_size = level.fontSizeCell;	
	
	//main parametrs for cells
	widthCell = canvas.width/countColumn;
	heightCell = canvas.height/countRow;
	if (isFiniteSizeCell()) return;
	

	_drawGrid(level);
}
	// console.log("level_id = " + level_id);
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