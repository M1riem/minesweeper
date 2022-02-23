//поле игры
var cells = [];
//текущий уровень игры
var level;

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
	
	//draw flag in menu
	drawImgFlagMenu();
	//main parametrs for field
	countRow = level.countRow;
	countColumn = level.countColumn;
	font_size = level.fontSizeCell;	
	
	//main parametrs for cells
	widthCell = canvas.width/countColumn;
	heightCell = canvas.height/countRow;
	if (isNotFiniteSizeCell(widthCell, heightCell)) return;
	drawGrid(level);
}

  



