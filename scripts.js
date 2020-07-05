
class Game {
	constructor() {
		this.game = document.querySelector('.game');
		this.slots = document.querySelectorAll('.guess-slot');
		this.pegColors = ['red', 'green', 'blue', 'white', 'yellow', 'black'];

		this.setupSecret();

		this.setupControlsRow();
		this.setupGameBoard();

		this.dragColor = null;
		this.activeRow = 1;

		// Bound event listeners
		// https://stackoverflow.com/questions/11565471/removing-event-listener-which-was-added-with-bind
		this.boundDragStart = this.handleDragStart.bind(this);
		this.boundDragEnd = this.handleDragEnd.bind(this);

		this.boundDragOver = this.handleDragOver.bind(this);
		this.boundDragEneter = this.handleDragEnter.bind(this);
		this.boundDragLeave = this.handleDragLeave.bind(this);
		this.boundDrop = this.handleDrop.bind(this);

		this.setUpDraggables();
		this.enableRow('1'); // row 1

	}
	setupSecret() {
		this.secret = new Array();
		for (let i = 0; i <= 3; i++) {
			const randNumber = Math.floor(Math.random() * 6); // rand between 0 and 5
			this.secret.push(this.pegColors[randNumber]);
		}
		console.log('secret is', this.secret);
	}

	setUpDraggables() {
		this.draggables = document.querySelectorAll('.control');
		this.draggables.forEach((control)=>{
			control.addEventListener('dragstart', this.boundDragStart);
			control.addEventListener('dragend', this.boundDragEnd);
		});

	}

	enableRow(rowNumber) {
		const row = document.querySelector(`.guess-row--${rowNumber}`);
		row.classList.add('active');

		const dropzones = document.querySelectorAll(`.guess-slot--row-${rowNumber}`);
		dropzones.forEach((zone, i)=>{
			zone.setAttribute('data-guess', 'null');
			zone.addEventListener('dragover', this.boundDragOver);
			zone.addEventListener('dragenter', this.boundDragEnter);
			zone.addEventListener('dragleave', this.boundDragLeave);
			zone.addEventListener('drop', this.boundDrop);

		});
	}

	postDrop() {
		const cols = document.querySelectorAll(`.guess-slot--row-${this.activeRow}`);
		const colsComplete = [...cols].filter(item => (item.getAttribute('data-guess') !== 'null'));

		if (colsComplete.length == 4) {
			this.scoreRow(this.activeRow);
			this.disableRow(this.activeRow);

			if (this.activeRow < 10) {
				this.activeRow ++;
				this.enableRow(this.activeRow);
			}
		}
	}
	disableRow(rowNumber) {
		const row = document.querySelector(`.guess-row--${rowNumber}`);
		row.classList.add('complete');
		row.classList.remove('active');

		const dropzones = document.querySelectorAll(`.guess-slot--row-${rowNumber}`);
		// Remove classes and disable event listneres
		dropzones.forEach( zone =>{
			zone.removeEventListener('dragover', this.boundDragOver);
			zone.removeEventListener('dragenter', this.boundDragEnter);
			zone.removeEventListener('dragleave', this.boundDragLeave);
			zone.removeEventListener('drop', this.boundDrop);
		});

	}

	scoreRow(rowNumber) {
		const dropzones = document.querySelectorAll(`.guess-slot--row-${rowNumber}`);

		// Scores

		// Correct guesses: Count right color, right place
		let correctGuesses = new Array;

		[...dropzones].forEach( (zone, i) =>{
			const guessColor = zone.getAttribute('data-guess');
			const answerColor = this.secret[i];
			if (guessColor=== answerColor) {
				correctGuesses.push(i);
			};
		});

		// console.log('correct indexes are ', correctGuesses)
		// console.log('correct count', correctGuesses.length);

		// Close guesses: Of the remaining, count right color, wrong place
		const remainingSecret = this.secret.filter((guess, i)=> {
			return ! (correctGuesses.includes(i));
		})

		let closeGuesses = new Array;
		 [...dropzones].forEach( (zone, i) =>{
			const guessColor = zone.getAttribute('data-guess');
			if (! correctGuesses.includes(i) && remainingSecret.includes(guessColor)) {
					closeGuesses.push(i);
				}
		});

		// console.log('close indexes are ', closeGuesses)
		// console.log('close count', closeGuesses.length);

		// Add classes to score pins
		for (let p =1; p <= 4; p++) {
			let className ='';
			if (p <= correctGuesses.length) {
				className = 'correct';
			} else if (p <=correctGuesses.length + closeGuesses.length) {
				className = 'close';
			} else {
				className = 'incorrect';
			}
			const pin = document.querySelector(`.row-score__pin--row-${rowNumber}-pin-${p}`);
			pin.classList.add(`row-score__pin--${className}`);
		}

		//
		if (correctGuesses.length == 4) {
			alert("You have won!");
		}


	}

	handleDragStart(e) {
		// console.log('dragging', e.target);
		// console.log('drag color', this.dragColor);
		this.dragColor = e.target.getAttribute('data-color')
	}

	handleDragEnd(e) {
	}

	handleDragEnter(e){
		e.preventDefault();
		// console.log('drag enter', e.target);
		e.target.classList.add('hovered');

	}
	handleDragOver(e) {
		// console.log('drag over', e.target)
	    e.preventDefault(); // Necessary. Allows us to drop.
	}

	handleDragLeave(e) {
		// console.log('drag leave');
		e.target.classList.remove('hovered');  // this / e.target is previous target element.
	}

	handleDrop(e) {
		// console.log('handle drop on', e.target);
		if (e.stopPropagation) {
			e.stopPropagation(); // stops the browser from redirecting.
		}
		e.target.classList.remove('hovered');
		e.target.style.backgroundColor = this.dragColor;
		e.target.setAttribute('data-guess', this.dragColor);

		this.postDrop();

	}


	setupGameBoard() {
		const gameBoard = document.createElement('div');
		gameBoard.classList.add('game-board');
		this.game.appendChild(gameBoard);

		for (let i = 1; i<=10;i++) {
			const guessRow = document.createElement('div');
			guessRow.classList.add('guess-row', `guess-row--${i}`);

			// Guess slots
			for (let j = 1; j<=4; j++) {
				const guessSlot =  document.createElement('span');
				guessSlot.classList.add('guess-slot', `guess-slot--row-${i}`, `guess-slot--col-${j}`);
				guessSlot.id = `guess-slot-row-${i}-col-${j}`;
				guessRow.appendChild(guessSlot);
			}
			// Score pins
			const scoreWrap = document.createElement('div');
			scoreWrap.classList.add('row-score', `row-score--${i}`);
			scoreWrap.id =`row-score-${i}'`;

			for (let k = 1; k<=4; k++) {
				const scorePin =  document.createElement('span');
				scorePin.classList.add('row-score__pin', `row-score__pin--row-${i}-pin-${k}`);
				scoreWrap.appendChild(scorePin);
			}
			guessRow.appendChild(scoreWrap);

			gameBoard.appendChild(guessRow);
		}

	}

	setupControlsRow() {

		const controlsRow = document.createElement('div');
		controlsRow.classList.add('controls-row');

		this.pegColors.forEach((color=>{
			const control = document.createElement('span');
			control.setAttribute('draggable', 'true');
			control.setAttribute('data-color', color);
			control.classList.add('control', `control--${color}`);
			control.style.backgroundColor = color;
			controlsRow.appendChild(control);
		}));

		this.game.appendChild(controlsRow);

	}
}

new Game();
