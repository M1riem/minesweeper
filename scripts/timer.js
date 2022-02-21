function _getTextTimer(sec){
	hundreds = div(sec, 100);
	tens = (div(sec, 10)) % 10;
	units = sec % 10;
	return (hundreds +''+ tens +''+ units);
}

function startTimer()
{
	sec = 0;
	timer = setInterval(tick, 1000);
}

function stopTimer(){
	clearInterval(timer);
}

function tick()
{
	sec++;
	_text = _getTextTimer(sec);
	document.getElementById("timer").childNodes[1].nodeValue = _text;			
	if (sec >= 999) stopTimer();			
}


