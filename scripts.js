
class Game {
	constructor() {
		this.game = document.querySelector('.game');
		this.slots = document.querySelectorAll('.guess-slot');
		this.setupControlsRow();
		this.setupGameBoard();

		this.dragColor = null;
		this.activeRow = 1;

		// bound event listeners
		this.boundDragOver = this.handleDragOver.bind(this);
		this.boundDragEneter = this.handleDragEnter.bind(this);
		this.boundDragLeave = this.handleDragLeave.bind(this);
		this.boundDrop = this.handleDrop.bind(this);

		this.setUpDraggables();
		this.enableRow('1'); // row 1

	}

	setUpDraggables() {
		this.draggables = document.querySelectorAll('.control');
		this.draggables.forEach((control)=>{
			control.addEventListener('dragstart', this.handleDragStart.bind(this));
			control.addEventListener('dragend', this.handleDragEnd.bind(this));
		})

	}

	enableRow(rowNumber) {
		const dropzones = document.querySelectorAll(`.guess-slot--row-${rowNumber}`);

		dropzones.forEach((zone, i)=>{
			zone.classList.add('ready');
			zone.setAttribute('data-guess', 'null');

			zone.addEventListener('dragover', this.boundDragOver);
			zone.addEventListener('dragenter', this.boundDragEnter);
			zone.addEventListener('dragleave', this.boundDragLeave);
			zone.addEventListener('drop', this.boundDrop);

		});
	}

	postDrop() {
		const cols = document .querySelectorAll(`.guess-slot--row-${this.activeRow}`);
		const colsComplete = [...cols].filter(item => (item.getAttribute('data-guess') !== 'null'));

		if (colsComplete.length == 4) {
			this.completeRow(this.activeRow);
			if (this.activeRow < 10) {
				this.activeRow ++;
				this.enableRow(this.activeRow);
			}
		}
	}

	completeRow(rowNumber) {
		const dropzones = document.querySelectorAll(`.guess-slot--row-${rowNumber}`);
		dropzones.forEach((zone)=>{
			zone.classList.remove('ready');
			zone.classList.add('complete');
			zone.removeEventListener('dragover', this.boundDragOver);
			zone.removeEventListener('dragenter', this.boundDragEnter);
			zone.removeEventListener('dragleave', this.boundDragLeave);
			zone.removeEventListener('drop', this.boundDrop);
		});
	}

	handleDragStart(e) {
		console.log('Drag Start');
		console.log('dragging', e.target);
		console.log('drag color', this.dragColor);
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

			for (let j = 1; j<=4; j++) {
				const guessSlot =  document.createElement('span');
				guessSlot.classList.add('guess-slot', `guess-slot--row-${i}`, `guess-slot--col-${j}`);
				guessSlot.id = `guess-slot-row-${i}-col-${j}`;
				guessRow.appendChild(guessSlot);
			}
			gameBoard.appendChild(guessRow);
		}

	}

	setupControlsRow() {

		const colors = ['red', 'green', 'blue', 'white', 'yellow', 'black'];
		const controlsRow = document.createElement('div');
		controlsRow.classList.add('controls-row');

		colors.forEach((color=>{
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
