//main parametrs
var canvas = document.getElementById('game');
var menu = document.getElementsByClassName('menu')[0];
var context = canvas.getContext('2d');

//блокировка контекстного меню для canvas
canvas.oncontextmenu = function(e){
	return false;
}

//вешаем на field обработчики события нажатия кнопок			
canvas.addEventListener('mousedown', mouseDown, false);

let firstLeftClick = 1;

function mouseDown( event ){	
	let cell = field.findCell(mouse.x, mouse.y);
	if (event.which == 1){	
		console.log("нажата левая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
		switch(cell.number){
			case 0: field.drawNearEmptyCells(cell); break;
			case numberBomb : field.drawAllBombs(); break;
			default : cell.drawOpen( ); break;								
		}							
	}
		
	if(event.which == 3){		
		console.log("нажата правая кнопка мыши: " + "x = " + mouse.x + ", y = " + mouse.y);
		cell.drawFlag();
		console.log("проверка правого флага: " + cell.isPressedRightButtonMouse);
	}			
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
