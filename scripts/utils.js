function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function div(val, by){	
	return (val - val % by) / by;	
}

function _sort(arr){
	for(let i=0; i < arr.length; i++)
		for(let j=0; j < arr.length; j++)
			if (arr[i] <= arr[j]){
				let c = arr[i];
				arr[i] = arr[j];
				arr[j] = c;						
			}
	return arr;
}

function isNotFiniteSizeCell(width, height){
	if (!isFinite(width) || !isFinite(height) || isNaN(width) || isNaN(height))
	{
		let scripts = document.getElementsByTagName('script');
		let scriptName = scripts[scripts.length-1].src;
		console.log("Error!!! " + scriptName + " Ошибка в " + height.name + " или " + width.name + ". Переменная имеет неверный формат.");
		return true;
	}
	return false;
}

function createArrayRandom(range, count){	
	let arr = [];	
	for(let i = 0; i < count; i++)
	{ 
		arr[i] = getRandomInt(range);
		for (let j = 0; j < arr.length; j++)
			if ((arr[i] == arr[j]) && (i!=j))
			{	
				arr[i] = getRandomInt(range);
				j = -1;
			}		
	}
	return _sort(arr);
}