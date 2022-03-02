//текущий уровень игры
var level;
//поле игры
var field;
// номер бомбы на поле
let numberBomb = 9;

// при загрузке страницы скрыть всплывающее окно
$(window).ready(function(){
	initialization();
	PopUpHide();
});

function initialization(){	
	dropdowns[0].children[0].innerHTML = imgCheked + dropdowns[0].children[0].text;
	levels[0].cheked = true;
	levelStart(0);	
}

//set game options depending on the level
function levelStart(level_id = 0){			
	//set started of parametrs level
	level = levels[level_id];
	level.isOver = false;
	level.isLoser = false;
	
	//set count of bombs in menu
	document.getElementById("countFlags").childNodes[0].nodeValue = level.amountBombs;
	
	//set timer equals '000'
	resetTimer();
	
	//reset flag of first click of left of mouse-button
	firstLeftClick = true;
	
	//main parametrs canvas
	canvas.width = level.widthField;
	canvas.height = level.heightField;
	
	//draw menu-bar
	drawMenuBar();
		
	//create field 
	field = new Field(level);
}

 //закрытие PopUp по нажатию escape
$(document).keyup(function (e) {
	if(e.which == 27) 
		PopUpHide();
});

function PopUpShow(){
	// delay in 1 second
	setTimeout(function(){
		level.isOver = true;
		if (level.isLoser)
			$("#refresh")[0].innerHTML = "Попробуйте еще раз";
		else
			$("#refresh")[0].innerHTML = "Сыграйте снова";	
		$("#popup").show();
		
	}, 1150);    
}
function PopUpHide(){	
	if (level.isOver) 
		levelStart(level.id);	
	$("#popup").hide();		
}



