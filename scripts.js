class Game {
	constructor() {
		this.game = document.querySelector('.game');
		this.setupControlsRow();
		this.setupGameBoard();

		this.dragColor = 'purple';
		this.draggables = document.querySelectorAll('.control');
		this.dropzones = document.querySelectorAll('.guess-slot');
		this.setupDragAndDrop();

	}

	setupDragAndDrop() {

		this.draggables.forEach((control)=>{
			control.addEventListener('dragstart', this.handleDragStart.bind(this));
			control.addEventListener('dragend', this.handleDragEnd.bind(this));
		})
		this.dropzones.forEach((zone)=>{
			zone.addEventListener('dragover', this.handleDragOver.bind(this));
			zone.addEventListener('dragenter', this.handleDragEnter.bind(this));
			zone.addEventListener('dragleave', this.handleDragLeave.bind(this));
			zone.addEventListener('drop', this.handleDrop.bind(this));
		});
	}

	handleDragStart(e) {
		console.log('Drag Start');
		console.log('dragging', e.target);
		console.log('drag color', this.dragColor);
		this.dragColor = e.target.getAttribute('data-color')
	}

	handleDragEnd(e) {
		e.target.classList.add('fill');
	}

	handleDragEnter(e){
		e.preventDefault();
		console.log('drag enter', e.target);
		e.target.classList.add('hovered');

	}
	handleDragOver(e) {
		// console.log('drag over', e.target)
	    e.preventDefault(); // Necessary. Allows us to drop.
	}

		handleDragLeave(e) {
			console.log('drag leave');
			e.target.classList.remove('hovered');  // this / e.target is previous target element.
		}

		handleDrop(e) {
			// this / e.target is current target element.
			console.log('handle drop on', e.target);
			if (e.stopPropagation) {
				e.stopPropagation(); // stops the browser from redirecting.
			}

			e.target.style.backgroundColor = this.dragColor;

			return false;
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
