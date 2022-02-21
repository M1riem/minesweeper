//main parametrs
let level;


let countRow;//8,14,20
let countColumn;//8,18,24	

let amountBombsInMenu;
let numberBomb = 9;
let cells = [];//игровое поле
let font_size;// font_size in cells

//начальные параметры при входе на сайт
//initial game settings
let widthCell;
let heightCell;
drawImgFlagMenu();
dropdowns[0].children[0].innerHTML = imgTick + dropdowns[0].children[0].text;
levels[0].flag = true;
init();

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