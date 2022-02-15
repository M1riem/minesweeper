var menu = document.getElementById('menu');
menu.onmousedown = function(event) {
	if (event.which == 1) {
		alert('Нажата левая кнопка мыши!');
	}
	if (event.which == 3) {
		
		alert('Нажата правая кнопка мыши!');
	}
};