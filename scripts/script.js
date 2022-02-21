//main parametrs
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');

let countRow;//8,14,20
let countColumn;//8,18,24	
//поле игры
var cells = [];
//текущий уровень игры
var level;

function _generationBombs(range, amount){
	
	let bombs = [];
		
	for(let i = 0; i < amount; i++)
	{ 
		bombs[i] = getRandomInt(range);
			for (let j = 0; j < amount; j++){
				if ((bombs[i] == bombs[j]) && (i!=j))
				{
					console.log("Replacement bombs[i] = " + bombs[i] + ", i = "+ i + " ; bombs[j] = " + bombs[j]+ ", j = "+ j);
					bombs[i] = getRandomInt(range);
					j = 0;
					console.log("on " + bombs[i]);
				}
			}
		_sort(bombs);
	}
	return bombs;
}

//инициализация поля, переписать initialization()
function drawGrid(level){
	
	let bombs = [];
	let range = countRow * countColumn;
	console.log("range = " + range + "; Level amountBombs = " + level.amountBombs);
	
	//генерация бомб
	bombs = _generationBombs(range, level.amountBombs);
	console.log("Rows : " + countRow + "; Columns:" + countColumn);
	 
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
	// 
	for (let i=0; i < countRow; i++)
	{
		for (let j=0; j < countColumn; j++)
		{			
			if (cells[i][j].isBomb)
			{
				//перенисать cell для хранения такого типа данных
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
	
	
	//draw empty cells in canvas 
	for (let i=0; i < countRow; i++){
		for (let j=0; j < countColumn; j++){
			cells[i][j].drawClose();												
		}
	}	
	
	//log empty cells in console
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

//РїРµСЂРµРїРёСЃР°С‚СЊ С„СѓРЅРєС†РёРѕРЅР°Р» 
//Р’СЃРїРѕРјРѕРіР°С‚РµР»СЊРЅРѕРµ - РєРѕРѕСЂРґРёРЅР°С‚С‹ РґРІРёР¶СѓС‰РµР№СЃСЏ РјС‹С€Рё
let mouse = {x: 0, y: 0};
$(document).ready(function(){
	//РљРѕРѕСЂРґРёРЅР°С‚С‹ РєСѓСЂСЃРѕСЂР° РѕС‚РЅРѕСЃРёС‚РµР»СЊРЅРѕ РІСЃРµРіРѕ РґРѕРєСѓРјРµРЅС‚Р°
	$(document).mousemove(function(event){
		var x = event.pageX;
		var y = event.pageY;
		$('#coordsdocument').html( 'РљРѕРѕСЂРґРёРЅР°С‚С‹ РєСѓСЂСЃРѕСЂР°: (' + x + '; ' + y + ')' );
	});
	// РљРѕРѕСЂРґРёРЅР°С‚С‹ РєСѓСЂСЃРѕСЂР° РѕС‚РЅРѕСЃРёС‚РµР»СЊРЅРѕ РѕС‚РґРµР»СЊРЅРѕРіРѕ Р±Р»РѕРєР°
	$(canvas).mousemove(function(event){
		var pos = $(this).offset();
		var elem_left = pos.left.toFixed(0);
		var elem_top = pos.top.toFixed(0);
		var x = event.pageX - elem_left;
		var y = event.pageY - elem_top;
		mouse.x = x; mouse.y = y;
		$('#coordscanvas').html( 'РљРѕРѕСЂРґРёРЅР°С‚С‹ РєСѓСЂСЃРѕСЂР°-С…РѕР»СЃС‚Р°: (' + x + '; ' + y + ')' );
	});
});
