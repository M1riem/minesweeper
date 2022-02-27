//if press dropbtn of Menu -> set toggle "show" in style.js
function clickMenu(){
	document.getElementById("menuDropdown").classList.toggle("show");	
}

// Close the dropdown menu if the user clicks outside of it
window.onclick = function(event) {
	if (!event.target.matches('.dropbtn')) {
		let dropdowns = document.getElementsByClassName("dropdown-content");
		for (let i = 0; i < dropdowns.length; i++){
			let openDropdown = dropdowns[i];
			if (openDropdown.classList.contains('show')) {
				openDropdown.classList.remove('show');
			}
		}
	}
}

//уровни игры
let levels = [];

let dropdowns = document.getElementsByClassName("dropdown-content");  

for(let i = 0; i < dropdowns[0].childElementCount; i++){				
	levels[i] = new Level(dropdowns[0].children[i].id, i);
}

//image-tick of drop-down menu
let imgTick = "<img src='images/tick.png' width='15' height='15' style='margin: 0px 10px 0px 0px;'/>";
	
//set imgTick in dropdowns.children when level is selected
[...dropdowns[0].children].forEach((target, i) => {
	target.addEventListener('click', function(){
		[...dropdowns[0].children].forEach((level, j) => {
			if (target.id == level.id){
				level.innerHTML = imgTick + level.text;
				levels[j].flag = true;	
				init(levels[j].id);
			}
			else{
				level.innerHTML = level.text;
				levels[j].flag = false;
			}						
		});
	});	
});


// set image of flag in menu - переделать и убрать в html
function drawImgFlagMenu(){
	let padding = 5; 
	let dropbtn = document.getElementsByClassName("dropbtn")[0];
	let imgFlagMenu = document.getElementById('flag_img');
	let imgTimerMenu = document.getElementById('timer_img');
	//вычисление размера картинки flag_img
	imgFlagMenu.height = dropbtn.clientHeight - 2*padding;
	imgFlagMenu.width = dropbtn.clientHeight - 2*padding;
	//вычисление размера картинки timer_img
	imgTimerMenu.height = dropbtn.clientHeight - 2*padding;
	imgTimerMenu.width = dropbtn.clientHeight - 2*padding;
	//центрирование flag_img и timer_img
	let offset = 1.5 * padding * (1-level.id );
	let padding_left = ( (level.number)*( imgFlagMenu.width + imgTimerMenu.width) - offset);
	imgFlagMenu.setAttribute("style","padding-left:" +  padding_left + "px");
}
//turn off context-menu for menu-bar
document.getElementsByClassName("menu")[0].oncontextmenu = function(e){
	return false;
}