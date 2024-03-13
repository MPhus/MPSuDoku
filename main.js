// CONSTANT VALUE

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
// SUDOKU 


// ----
var cells = document.querySelectorAll('.game-cell');
// ----input
var nameIput = document.querySelector('.input-name');
var btnPlay =document.querySelector('.btn-play');
var btnLevel = document.querySelector('.btn-level')
var levelIndex = 0;
var lengthLevel = CONSTANT.LEVEL.length;
var level = CONSTANT.LEVEL[levelIndex];
var btnResume = document.querySelector('.btn-resume');
var btnNewGame = document.querySelector('.btn-new-game');
var Pause = true;

// ----Screen
var startScreen = document.querySelector('.start-screen');
var gameScreen = document.querySelector('.game-screen');
var pauseScreen = document.querySelector('.pause-screen');


// ----game
var gameName = document.querySelector('.top-game-name');
var gameLevel = document.querySelector('.top-game-level');
var gameClock = document.querySelector('.game-clock');
var gamePause = document.querySelector('.game-pause');
var pauseTime =document.querySelector('.pause-time');
// Dark Mode
document.querySelector('.mode').addEventListener('click', () => {
	document.body.classList.toggle('dark')
	var isDark = document.body.classList.contains('dark')
	localStorage.setItem('darkMode', isDark)
	document.querySelector('meta[name="theme-color"').setAttribute('content', isDark ? '#12372A' : '#E1F0DA')
})

// Margin 9 Cell

var initGrid = () => {
	for(var i = 0; i < Math.pow(CONSTANT.GRID_SIZE, 2); i++ ) {
		var rows = Math.floor(i/CONSTANT.GRID_SIZE);
		var cols = i%CONSTANT.GRID_SIZE;
		if(rows == 2 || rows == 5) cells[i].style.marginBottom = '8px'
		if(cols == 2 || cols == 5) cells[i].style.marginRight = '8px'
	}
}

// LEVEL
btnLevel.addEventListener('click', (e) => {
	levelIndex = levelIndex + 1 > lengthLevel -1 ? 0 : levelIndex + 1;
	level = CONSTANT.LEVEL[levelIndex];
	e.target.innerHTML = CONSTANT.LEVEL_NAME[levelIndex] ;
})

// Start game
var seconds = 0;
var showTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14,19);
var startGame = () => {
	startScreen.classList.remove('active');
	gameScreen.classList.add('active');
	gameName.innerHTML = nameIput.value.trim();
	gameLevel.innerHTML = btnLevel.innerHTML;
	tiMer = setInterval(() => {
		if(Pause) {
			seconds+=1;
			gameClock.innerHTML = showTime(seconds);
			pauseTime.innerHTML = showTime(seconds);
		}
	}, 1000);

}
btnPlay.addEventListener('click', () => {
	if(nameIput.value.trim().length > 0) {
		startGame();
	}else {
		nameIput.classList.add('input-err');
		setTimeout(() => {
			nameIput.classList.remove('input-err');
			nameIput.focus();
		}, 500);
	}
	
})
	
// Pause game
var returnStartScreen = () => {
	clearInterval(tiMer);
	seconds = 0;
	Pause = true;
	startScreen.classList.add('active');
	pauseScreen.classList.remove('active');
}
gamePause.addEventListener('click', () => {
	gameScreen.classList.remove('active');
	pauseScreen.classList.add('active');
	Pause = false;
})
btnResume.addEventListener('click', () => {
	gameScreen.classList.add('active');
	pauseScreen.classList.remove('active');
	Pause = true;
})
btnNewGame.addEventListener('click', () => {
	returnStartScreen()
})
// Pause Screen



// goHome 
var goHome = () => {
	startScreen.classList.add('active');
	gameScreen.classList.remove('active');
	clearInterval(tiMer);

}
document.querySelector('.game-home').addEventListener('click', () => {
	goHome();
})


var getGameInfo = () => {
	return  localStorage.getItem('game');
}

// init
var init = () => {
	var isDarkMode = JSON.parse(localStorage.getItem('darkMode')) ;
	document.body.classList.add(isDarkMode ? 'dark' : 'light');
	document.querySelector('meta[name="theme-color"').setAttribute('content', isDarkMode ? '#12372A' : '#E1F0DA')
	
	var game = getGameInfo();
	document.querySelector('.btn-continue').style.display = game ? 'block' : 'none'
	initGrid();

}
init();

