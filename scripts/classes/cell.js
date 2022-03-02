//клетка пол€
class Cell{
	//флаг на клетке
	isFlag;
	//мина помечена верно
	isRigthMark;

	//добавить ширину €чейки и высоту €чейки в конструктор
	constructor(x , y, width, height,isBomb = false, number = 0, isOpen = false){
		this.x = x;
		this.y = y;
		this.width = width;
		this.height = height;
		this.isBomb = isBomb;		
		this.number = (this.isBomb) ? numberBomb : number;
		this.isOpen = isOpen;
		this.isFlag = false;
		this.isRigthMark = false;
		this.listNeighbors = [];
	}
	
	drawClose(){	this.drawBackround("#C0C0C0");		}
	
	drawOpen(){		
		// если клетка была уже открыта
		if (this.isOpen)  return;
		//проверка на флаг
		if (this.isFlag)  return;
		//если клетка была закрыта
		this.isOpen = true;		
		
		//отрисовка бомб
		if (this.isBomb) this.drawBomb(); 
		else this.drawNumber();	
	}
	
	drawBomb(){
		this.drawBackround("#C0C0C0");	
		this.drawImage("images/bomb.jpg", this.x, this.y, this.width/12,  this.height/12, 5*this.width/6, 5*this.height/6);
	}
	
	drawNumber(){
		//отрисовка фона и границ
		this.drawBackround("#E5E4E2");						
		//отрисовка номеров
		if (this.number != 0) this.drawText();	
	}

	drawFlag(){
		if (this.isOpen ) return;
		//если флаг уже установлен - снять флаг
		if (this.isFlag){			
			this.isFlag = false;
			this.isRigthMark = false;
			this.drawClose();	
			//изменение количества флагов в меню
			document.getElementById("countFlags").childNodes[0].nodeValue++;
		}
		else{
			//флаг установлен
			this.isFlag = true;
			//отрисовка картинки
			this.drawImage("images/flag_canvas.jpg", this.x, this.y, this.width/6, this.height/6, 2*this.width/3, 2*this.height/3);
			//изменение количества флагов в меню
			document.getElementById("countFlags").childNodes[0].nodeValue--;
			//условие для победы
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
		context.fillRect(this.x, this.y, this.width, this.height);	
		this.drawBorders("2");
	}
	
	//рисование рамки 
	drawBorders(lineWidth){
		context.beginPath();
		context.lineWidth = lineWidth;
		context.strokeStyle = "#8B8B8A";//"darkgoldenrod";
		context.rect(this.x, this.y, this.width, this.height);	
		context.closePath();
		context.stroke();
	}
	
	//печать текста
	drawText(){
		context.fillStyle = "#000";
		context.font = level.fontSizeCell + " serif";
		context.fillText(this.number, this.x + this.width/3, this.y + this.height*0.75 );	
	}

}