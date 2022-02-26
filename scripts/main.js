//текущий уровень игры
var level;
//поле игры
var field;

//main parametrs
window.onload = start;
    
function start(){	
    // console.log('page loaded');
	dropdowns[0].children[0].innerHTML = imgTick + dropdowns[0].children[0].text;
	levels[0].flag = true;
	init(0);	
}

//set game options depending on the level
function init(level_id = 0){			
	level = levels[level_id];
	
	//set count of bombs in menu
	document.getElementById("countFlags").childNodes[0].nodeValue = level.amountBombs;
	
	//main parametrs canvas
	canvas.width = level.widthField;
	canvas.height = level.widthField;
	
	//width of menu-bar
	menu.setAttribute("style","width:" + level.widthField + "px");
	
	//draw flag in menu
	drawImgFlagMenu();
	//main parametrs for field
	font_size = level.fontSizeCell;	
	
	//main parametrs for field
	widthCell = canvas.width/level.countColumn;
	heightCell = canvas.height/ level.countRow;
	if (isNotFiniteSizeCell(widthCell, heightCell)) return;
	field = new Field(level);
	// console.log(field);
}

  



