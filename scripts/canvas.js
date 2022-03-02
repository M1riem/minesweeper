//main parametrs
var canvas = document.getElementById('game');
var context = canvas.getContext('2d');
//первое нажатие на поле
let firstLeftClick = true;

//блокировка контекстного меню для canvas
canvas.oncontextmenu = function(e){
	return false;
}

//нажатие мыши
$(document).ready(function(){
	//Нажатия мыши на canvas
	$(canvas).mousedown(function(event){
		//проверка на конец игры
		if (level.isOver) return;
		
		//вычисление позиции мыши на canvas
		let position = $(this).offset();
		//координаты левого верхнего угла canvas
		let elem_left = position.left.toFixed(0);
		let elem_top = position.top.toFixed(0);
		//смещение по canvas - задание новых координат посредством координат страницы 
		let x = event.pageX - elem_left;	
		let y = event.pageY - elem_top;
		//определить клетку по координатам
		let cell = field.findCell(x, y);
		
		// если нажата левая кнопка мыши
		if ( (event.which == 1) && (!cell.isFlag) ){	
		//console.log("нажата левая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
			if (firstLeftClick) { startTimer();  firstLeftClick = false; }
			switch(cell.number){
				case 0: field.drawNearEmptyCells(cell); break;
				//loser case
				case numberBomb : 
					field.drawAllBombs(); 
					stopTimer();					level.isOver = true;
					level.isLoser = true;
					PopUpShow();
					break;
				default : cell.drawOpen( ); break;								
			}							
		}
		// если нажата правая кнопка мыши
		if(event.which == 3){		
			//console.log("нажата правая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
			cell.drawFlag();
			//win case
			if (field.winCheck()) PopUpShow();
		}
	});
	//двойное нажатие на canvas
	$(canvas).dblclick(function(event){
		if (level.isOver) return; 
		let x = event.pageX - $(this).offset().left.toFixed(0);	
		let y = event.pageY - $(this).offset().top.toFixed(0);
		let cell = field.findCell(x, y);
		if (cell.isFlag) return;
		cell.listNeighbors.forEach((neighbor) => 
		{ 
			neighbor.drawOpen();  
			if (neighbor.isBomb) 
			{ 	
				level.isOver = true; 
				level.isLoser = true;
				PopUpShow();	
			}	
		});
	});
});


