//ширина €чейки
let widthCell;
//высота €чейки
let heightCell;
// номер бомбы на поле
let numberBomb = 9;
//шрифт €чейки
let font_size;

//клетка пол€
class Cell{
	//нажатие правой кнопки мыши
	isPressedRightButtonMouse;
	//мина помечена верно
	isRigthMark;
	
	//добавить ширину €чейки и высоту €чейки в конструктор
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
			//помен€ть на imgBomb
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
		// ѕрив€зываем функцию к событию onload
		// Ёто указывает браузеру, что делать, когда изображение загружено
		flag.onload = function() {
			context.drawImage(flag, x + dx, y + dy, width, height );
		};
		flag.src = sorce;
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