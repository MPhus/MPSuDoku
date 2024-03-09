var CONSTANT = {
    UNASSIGNED: 0,
    GRID_SIZE: 9,
    BOX_SIZE: 3,
    NUMBERS: [1,2,3,4,5,6,7,8,9],
    LEVEL_NAME: [
        'Easy',
        'Medium',
        'Hard',
        'Very hard',
        'Insane',
        'Inhuman'
    ],
    LEVEL: [29, 38, 47, 56, 65, 74]
}
// Dark Mode
document.querySelector('.mode').addEventListener('click', () => {
	document.body.classList.toggle('dark')
	var isDark = document.body.classList.contains('dark')
	localStorage.setItem('darkMode', isDark)
	document.querySelector('meta[name="theme-color"').setAttribute('content', isDark ? '#12372A' : '#E1F0DA')
})

var getGameInfo = () => {
	return  localStorage.getItem('game');
}
// LEVEL
var levelIndex = 0;
var lengthLevel = CONSTANT.LEVEL.length;
var level = CONSTANT.LEVEL[levelIndex];
document.querySelector('.btn-level').addEventListener('click', (e) => {
	levelIndex = levelIndex + 1 > lengthLevel -1 ? 0 : levelIndex + 1;
	level = CONSTANT.LEVEL[levelIndex];
	e.target.innerHTML = CONSTANT.LEVEL_NAME[levelIndex] ;
})
//  CLick Play Button
var nameIput = document.querySelector('.input-name');
var btnPlay =document.querySelector('.btn-play');
btnPlay.addEventListener('click', () => {
	if(nameIput.value.trim().length > 0) {
		alert(level)
	}else {
		nameIput.classList.add('input-err');
		setTimeout(() => {
			nameIput.classList.remove('input-err');
			nameIput.focus();
		}, 500);
	}
	
})

var isDarkMode = JSON.parse(localStorage.getItem('darkMode')) ;
document.body.classList.add(isDarkMode ? 'dark' : 'light');
document.querySelector('meta[name="theme-color"').setAttribute('content', isDarkMode ? '#12372A' : '#E1F0DA')

var game = getGameInfo();
document.querySelector('.btn-continue').style.display = game ? 'block' : 'none'

