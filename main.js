// CONSTANT_SUDOKU VALUE
var CONSTANT_SUDOKU = {
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
        'Baby hihi'
    ],
    LEVEL: [29, 38, 47, 56, 65, 9]
}

var checkE= true;
var cells = document.querySelectorAll('.game-cell');
// ----input
var nameIput = document.querySelector('.input-name');
var btnPlay =document.querySelector('.btn-play');
var btnLevel = document.querySelector('.btn-level')
var levelIndex = 0;
var lengthLevel = CONSTANT_SUDOKU.LEVEL.length;
var level = CONSTANT_SUDOKU.LEVEL[levelIndex];
var btnResume = document.querySelector('.btn-resume');
var btnNewGame = document.querySelector('.btn-new-game');
var btnNewGame2 = document.querySelector('.btn-new-game2');
var btnContinute = document.querySelector('.btn-continue');
var Pause = true;

// ----Screen
var startScreen = document.querySelector('.start-screen');
var gameScreen = document.querySelector('.game-screen');
var pauseScreen = document.querySelector('.pause-screen');
var winScreen = document.querySelector('.win-screen');
var winTime = document.querySelector('.win-time')
var winnName = document.querySelector('.win-name')

// ----game
var gameName = document.querySelector('.top-game-name');
var gameLevel = document.querySelector('.top-game-level');
var gameClock = document.querySelector('.game-clock');
var gamePause = document.querySelector('.game-pause');
var pauseTime =document.querySelector('.pause-time');
var deleteIput = document.querySelector('.delete');
var numberInput = document.querySelectorAll('.number-input');
// sudoku
var su = undefined;
var suAnswer = undefined;
var selectedCell = -1;

var newGrid = (size) => {
	var arr = new Array(size);

	for(var i = 0 ; i< size; i++) {
		arr[i] = new Array(size);
	}

	for(var i = 0 ; i < Math.pow(size,2); i++) {
		arr[Math.floor(i/size)][i%size] = CONSTANT_SUDOKU.UNASSIGNED;
	}

	return arr;
}

var isRowSafe = (grid, row, value) => {
	for(var col= 0; col <CONSTANT_SUDOKU.GRID_SIZE; col++) {
		if(grid[row][col] === value) return false
	}
	return true;
}

var isColSafe = (grid, col, value) => {
	for(var row= 0; row <CONSTANT_SUDOKU.GRID_SIZE; row++) {
		if(grid[row][col] === value) return false
	}
	return true;
}

var isBoxSafe = (grid, row_box, col_box, value) => {
	for(var row = 0; row<CONSTANT_SUDOKU.BOX_SIZE; row++){
		for(var col = 0; col<CONSTANT_SUDOKU.BOX_SIZE; col++){
			if(grid[row + row_box][col + col_box] === value) return false
		}
	}
	return true;
}

var isSafe = (grid, row, col, value) => {
	return isRowSafe(grid, row, value) && isColSafe(grid, col, value) && isBoxSafe(grid, row - row%3, col - col %3 , value) && value !==CONSTANT_SUDOKU.UNASSIGNED;
}

var findUnassignPos = (grid , pos) => {
	for(var row = 0; row <CONSTANT_SUDOKU.GRID_SIZE; row ++) {
		for(var col = 0; col <CONSTANT_SUDOKU.GRID_SIZE; col++) {
			if(grid[row][col] === CONSTANT_SUDOKU.UNASSIGNED ){
				pos.row = row;
				pos.col = col;
				return true;
			}
		}
	}
	return false;
}
var suffArr = (arr) => {
	var curr_index = arr.length;
	while(curr_index > 0){

		var rand_index = Math.floor(Math.random() * curr_index);

		curr_index-= 1;

		var temp = arr[rand_index];
		arr[rand_index] = arr[curr_index];
		arr[curr_index] = temp;
	}
	return arr;
}

var isFullGrid = (grid) => {
	return grid.every((row) => {
		return row.every(value => {
			return value !== CONSTANT_SUDOKU.UNASSIGNED;
		})
	})
}

var createSudoku = (grid) => {
	var unassignPos = {
		row: -1,
		col: -1
	}

	if(!findUnassignPos(grid, unassignPos)) return true;
	
	var numberList = suffArr([...CONSTANT_SUDOKU.NUMBERS]);
	var row = unassignPos.row;
	var col = unassignPos.col;


	numberList.forEach((num) => {
		if(isSafe(grid, row, col, num)){
			grid[row][col] = num;

			if (isFullGrid(grid)) {
                return true;
            }else {
				if(createSudoku(grid)) {
					return true;
				}
			}

			grid[row][col] = CONSTANT_SUDOKU.UNASSIGNED;
		}
	});
	return isFullGrid(grid);
}

// check

var removeGameInfo = () => {
    localStorage.removeItem('game');
   	btnContinute.style.display = 'none';
}

var showResult = () => {
    clearInterval(tiMer);
    gameScreen.classList.remove('active');
    winScreen.classList.add('active');
    winTime.innerHTML = showTime(seconds);
	winnName.innerHTML = nameIput.value.trim();
}

// ---

var rand = () =>  Math.floor(Math.random() * CONSTANT_SUDOKU.GRID_SIZE);

var removeCells = (grid, level) => {
	var arr = grid.map(row => row.slice());
	// var arr = [...grid]
	var index = level;
	while (index > 0) {
		var row = rand();
		var col = rand();
		while (arr[row][col] === CONSTANT_SUDOKU.UNASSIGNED) {
			row = rand();
			col = rand();
		}
		arr[row][col] = CONSTANT_SUDOKU.UNASSIGNED;
		index -- 
	}
	return arr;
}


var genSudoku = (level) => {
	var sudoku = newGrid(CONSTANT_SUDOKU.GRID_SIZE);
	var check = createSudoku(sudoku);
	if(check){
		var question = removeCells(sudoku, level);
		return	{
			original: sudoku,
			question: question
		}
	}
	return undefined
}
document.querySelector('.mode').addEventListener('click', () => {
	document.body.classList.toggle('dark')
	var isDark = document.body.classList.contains('dark')
	localStorage.setItem('darkMode', isDark)
	document.querySelector('meta[name="theme-color"').setAttribute('content', isDark ? '#12372A' : '#E1F0DA')
})

// Margin 9 Cell

var initGrid = () => {
	for(var i = 0; i < Math.pow(CONSTANT_SUDOKU.GRID_SIZE, 2); i++ ) {
		var rows = Math.floor(i/CONSTANT_SUDOKU.GRID_SIZE);
		var cols = i%CONSTANT_SUDOKU.GRID_SIZE;
		if(rows == 2 || rows == 5) cells[i].style.marginBottom = '8px'
		if(cols == 2 || cols == 5) cells[i].style.marginRight = '8px'
	}
}

// LEVEL
btnLevel.addEventListener('click', (e) => {
	levelIndex = levelIndex + 1 > lengthLevel -1 ? 0 : levelIndex + 1;
	level = CONSTANT_SUDOKU.LEVEL[levelIndex];
	e.target.innerHTML = CONSTANT_SUDOKU.LEVEL_NAME[levelIndex] ;
})

// Start game

var seconds = 0;
var showTime = (seconds) => new Date(seconds * 1000).toISOString().substring(14,19);
var continueGame = () => {
	startScreen.classList.remove('active');
	gameScreen.classList.add('active');
	gameName.innerHTML = nameIput.value.trim();
	setPlayerName(nameIput.value.trim());
	tiMer = setInterval(() => {
		if(Pause) {
			seconds+=1;
			gameClock.innerHTML = showTime(seconds);
			pauseTime.innerHTML = showTime(seconds);
		}
	}, 1000);
}
var startGame = () => {
	startScreen.classList.remove('active');
	gameScreen.classList.add('active');
	gameName.innerHTML = nameIput.value.trim();
	setPlayerName(nameIput.value.trim());
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
		initSudoku();
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
	gameScreen.classList.remove('active');
	winScreen.classList.remove('active')

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
	removeGameInfo()
})
btnNewGame2.addEventListener('click', () => {
	returnStartScreen()
})
btnContinute.addEventListener('click', () => {
	if(nameIput.value.trim().length > 0) {
		loadSudoku();
		continueGame();
	}else {
		nameIput.classList.add('input-err');
		setTimeout(() => {
			nameIput.classList.remove('input-err');
			nameIput.focus();
		}, 500);
	}
	
})
var setPlayerName = (name) => localStorage.setItem('player', name)
var getPlayerName = () => localStorage.getItem('player')
// var goHome = () => {
// 	startScreen.classList.add('active');
// 	gameScreen.classList.remove('active');
// 	clearInterval(tiMer);

// }
document.querySelector('.game-home').addEventListener('click', () => {
	window.location.reload();
})


var getGameInfo = () => JSON.parse(localStorage.getItem('game'));

var loadSudoku = () => {
	var game = getGameInfo();
	gameLevel.innerHTML  = CONSTANT_SUDOKU.LEVEL_NAME[game.levelIndex];
	seconds = game.seconds
	su = game.su;
	suAnswer = su.answer;
	gameClock.innerHTM = showTime(seconds);
	levelIndex = game.levelIndex;

	for( var i = 0; i< Math.pow(CONSTANT_SUDOKU.GRID_SIZE , 2); i++){
		var row = Math.floor(i/CONSTANT_SUDOKU.GRID_SIZE);
		var col = i%CONSTANT_SUDOKU.GRID_SIZE;

		cells[i].setAttribute('data', suAnswer[row][col])
		cells[i].innerHTML = suAnswer[row][col] !==0 ? suAnswer[row][col] : '';
		if(su.question[row][col] !== 0 ) {
			cells[i].classList.add('filled');
		}
	}
}


var sudokuClear = () => {
	for(var i = 0 ; i < Math.pow(CONSTANT_SUDOKU.GRID_SIZE,2); i++) {
		cells[i].innerHTML = ''
		cells[i].classList.remove('filled');
	}
}

var bgHover = (index) => {
	var row = Math.floor(index / CONSTANT_SUDOKU.GRID_SIZE);
	var col = index % CONSTANT_SUDOKU.GRID_SIZE;

	var box_start_row = row - row % CONSTANT_SUDOKU.BOX_SIZE;
	var box_start_col = col - col % CONSTANT_SUDOKU.BOX_SIZE;

	for(var i = 0; i<CONSTANT_SUDOKU.BOX_SIZE; i++) {
		for(var j = 0; j<CONSTANT_SUDOKU.BOX_SIZE; j++) {
			var cell = cells[9 * (box_start_row + i) + (box_start_col + j)];
			cell.classList.add('hover')
		}
	}
	var step = 9;
	while(index - step >=0) {
		cells[index - step].classList.add('hover')
		step+=9;
	}
	step =9;
	while(index + step < 81) {
		cells[index + step].classList.add('hover')
		step+=9;
	}
	step = 1;
	while(index - step >= 9 * row) {
		cells[index - step].classList.add('hover')
		step+=1;
	}
	step = 1;
	while(index + step < 9 * row + 9) {
		cells[index + step].classList.add('hover')
		step+=1;
	}

}
// resetBg
var removeBg = ()=> {
	cells.forEach((item,i) => {
		item.classList.remove('hover');
	}) 
}

var saveGameInfo = () => {
	var game = {
		levelIndex: levelIndex,
		seconds: seconds,
		su: {
			original: su.original,
			question: su.question,
			answer: suAnswer,
		}
	}
	localStorage.setItem('game', JSON.stringify(game));
}
var checkErr = (value) => {
	
	var addErr = (a) => {
		if(parseInt(a.getAttribute('data')) === value){
			a.classList.add('cell-err');
			a.classList.add('err');
			setTimeout(() => {
				a.classList.remove('cell-err');
			},500)
			checkE= false
		}
	}

	var index = selectedCell;
	var row = Math.floor(index / CONSTANT_SUDOKU.GRID_SIZE)
	var col = index % CONSTANT_SUDOKU.GRID_SIZE

	var box_row = row - row % CONSTANT_SUDOKU.BOX_SIZE;
	var box_col = col - col % CONSTANT_SUDOKU.BOX_SIZE;

	for(var i = 0; i< CONSTANT_SUDOKU.BOX_SIZE; i++){
		for(var j = 0; j< CONSTANT_SUDOKU.BOX_SIZE; j++) {
			var cell = cells[9 * (i +box_row )+ (j + box_col)]
			if(!cell.classList.contains('selected')) addErr(cell);
		}
	}
	var step = 9;
	while(index - step >= 0) {
		addErr( cells[index - step]);
		step+=9;
	}
	step = 9;
	while(index + step <  81) {
		addErr(cells[index + step]);
		step+=9;
	}
	step = 1;
	while(index - step >=  row *9) {
		addErr(cells[index - step]);
		step+=1;
	}
	step = 1;
	while(index + step <  row *9 + 9) {
		addErr(cells[index + step]);
		step+=1;
	}
	return checkE;
}
var removeErr = () => cells.forEach(item => item.classList.remove('err') )
var initCellsEvent = () => {
	cells.forEach((item,index) => {
		item.addEventListener('click', () => {
			if(!item.classList.contains('filled')) {
				cells.forEach(e => e.classList.remove('selected'));
				item.classList.add('selected');
				removeBg();
				cells[index].classList.add('err-temp');
				selectedCell = index;
				bgHover(index);
				// console.log(selectedCell);
			}
		})
	})
}
var initCellsEventKey = () => {
	cells.forEach((item,index) => {
		item.onkeyup = (e) => {
			var i = parseInt(e.key)
			if(i){
				if(!cells[selectedCell].classList.contains('filled')){
					checkE= true;
					removeErr();
					checkErr(i)
						cells[selectedCell].innerHTML = i ;
						cells[selectedCell].setAttribute('data', i );
		
						var row = Math.floor(selectedCell / CONSTANT_SUDOKU.GRID_SIZE)
						var col = selectedCell % CONSTANT_SUDOKU.GRID_SIZE
						suAnswer[row][col] = i;
		
						saveGameInfo();
						cells[selectedCell].classList.add('cell-animation');
						setTimeout(() => {
							cells[selectedCell].classList.remove('cell-animation');
						},500)
						console.log(checkErr(i));
		
					if (checkErr(i) && isFullGrid(suAnswer)) {
						removeGameInfo();
						showResult();
					}
				}
			}else {
				alert('hay nhap 1 so')
			}
		}
		
	})
}
var sudokuCheck = (grid) => {
    grid.forEach((row, i) => {
        row.forEach((num, j) => {
            if (isSafe(grid, i, j, num)) {  
                if (isFullGrid(grid)) {
                    return true;
                } 
            }
        })
    })
	return false
}
var initNumberInputEvent = () => {
	numberInput.forEach((item, i) => {
		item.addEventListener('click', () => {
			if(!cells[selectedCell].classList.contains('filled')){
				checkE= true;
				removeErr();
				checkErr(i + 1)
					cells[selectedCell].innerHTML = i + 1;
					cells[selectedCell].setAttribute('data', i + 1 );
	
					var row = Math.floor(selectedCell / CONSTANT_SUDOKU.GRID_SIZE)
					var col = selectedCell % CONSTANT_SUDOKU.GRID_SIZE
					suAnswer[row][col] = i + 1;
	
					saveGameInfo();
					cells[selectedCell].classList.add('cell-animation');
					setTimeout(() => {
						cells[selectedCell].classList.remove('cell-animation');
					},500)
					console.log(checkErr(i+1) );
	
				if (checkErr(i+1) && isFullGrid(suAnswer)) {
					removeGameInfo();
					showResult();
				}
			}
		})
	})
}
deleteIput.addEventListener('click', () => {
	cells[selectedCell].innerHTML = '';
	cells[selectedCell].setAttribute('data', 0);
	var row = Math.floor(selectedCell / CONSTANT_SUDOKU.GRID_SIZE);
	var col = selectedCell % CONSTANT_SUDOKU.GRID_SIZE;
	suAnswer[row][col] = 0;
	removeErr();
})

// initSudoku
var initSudoku = () => {
	sudokuClear();
	removeBg();
	removeErr();
	su = genSudoku(level);
	suAnswer =  su.question.map(row => [...row]);
	seconds = 0;
	saveGameInfo();
	for(var i = 0 ; i < Math.pow(CONSTANT_SUDOKU.GRID_SIZE,2); i++) {
		var row = Math.floor(i/CONSTANT_SUDOKU.GRID_SIZE);
		var col = i%CONSTANT_SUDOKU.GRID_SIZE;
		
		cells[i].setAttribute('data', su.question[row][col] );
		
		if(su.question[row][col] !== 0) {
			cells[i].innerHTML = su.question[row][col];
			cells[i].classList.add('filled')
		}
	}
	console.table(su.original)
}


// init
var init = () => {
	var isDarkMode = JSON.parse(localStorage.getItem('darkMode')) ;
	document.body.classList.add(isDarkMode ? 'dark' : 'light');
	document.querySelector('meta[name="theme-color"').setAttribute('content', isDarkMode ? '#12372A' : '#E1F0DA');

	var game = getGameInfo();
	// console.log(game);
	btnContinute.style.display = game ? 'block' : 'none'
	initGrid();
	initCellsEvent();
	initNumberInputEvent();
	initCellsEventKey()
	if(getPlayerName()) {
		nameIput.value = getPlayerName();
	}else {
		nameIput.focus();
	}
}
init();