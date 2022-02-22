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
	let imgFlagMenu = document.getElementById('flag_menu');
	let dropbtn = document.getElementsByClassName("dropbtn")[0];
	imgFlagMenu.height = dropbtn.clientHeight - 2*padding;
	imgFlagMenu.width = dropbtn.clientHeight;
}
//turn off context-menu for menu-bar
document.getElementsByClassName("menu")[0].oncontextmenu = function(e){
	return false;
}