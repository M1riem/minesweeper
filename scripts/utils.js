function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function div(val, by){
	return (val - val % by) / by;
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

//utils 
function createArrayRandom(range, count){	
	let arr = [];	
	for(let i = 0; i < count; i++)
	{ 
		arr[i] = getRandomInt(range);
		for (let j = 0; j < arr.length; j++){
			//console.log("j = " + j);
			if ((arr[i] == arr[j]) && (i!=j))
			{	
				//console.log("Replacement arr["+i+"] = " + arr[i] +" ; arr["+j+"] = " + arr[j]);
				arr[i] = getRandomInt(range);
				j = -1;
				//console.log("on " + arr[i]);
			}
		}
		//console.log("arr[" + i + "] = " + arr[i]);
		
	}
	_sort(arr);
	//console.log(arr);
	return arr;
}