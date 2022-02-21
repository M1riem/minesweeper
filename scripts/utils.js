function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function _sort(arr){
	for(let i=0; i < arr.length; i++){ 
		for(let j=0; j < arr.length; j++){ 
			if (arr[i] <= arr[j]){
				let c = arr[i];
				arr[i] = arr[j];
				arr[j] = c;						
			}
		}	
	}
}

function isFiniteSizeCell(){
	if (!isFinite(widthCell) || !isFinite(heightCell))
	{
		let scripts = document.getElementsByTagName('script');
		let scriptName = scripts[scripts.length-1].src;
		console.log("Error!!! " + scriptName + " Ошибка в " + heightCell.name + "или " + widthCell.name + " Переменная имеет неверный формат.");
		return true;
	}
	return false;
}