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
		//переделать размеры поля в зависимости от размера экрана
		this.widthField = size*2*2 + 2*this.id*size;//400,600,800
		this.heightField = size*2*2 + this.id*size;//400, 500, 600
		this.countRow = 10*this.number - 2*this.number - 2*this.id;//8,14,20
		// this.countColumn = 10*this.number - 2*this.number;// придумать новую формулу
		
		this.setCountColumn();
		this.setAmountBombs();
		this.setFontSizeCells();
		// console.log("level: amountBombs = " + this.amountBombs + " fontSizeCell = "+ this.fontSizeCell );
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
			case 40: this.fontSizeCell = "26px"; break;
			case 99: this.fontSizeCell = "24px"; break;
			default: this.fontSizeCell = "26px"; break;
		}
	}
}