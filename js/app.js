document.addEventListener('DOMContentLoaded', function () {

    function GameOfLife(boardWidth, boardHeight) {

        this.width = boardWidth;
        this.height = boardHeight;

        this.board = document.querySelector('.board');

        this.cells = [];

        this.createBoard = function () {
            this.board.style.height = this.height*10 + 'px';
            this.board.style.width = this.width*10 + 'px';
            this.board.style.display = 'block';

            this.cellsNumber = this.height * this.width;

            for ( var i = 0; i < this.cellsNumber; i++ ) {
                var cell = document.createElement('div');
                cell.addEventListener('click', function () {
                    this.classList.toggle('live')
                });
                this.board.appendChild(cell);
                this.cells.push(cell);
            }
        };
        
        this.findIndex = function (x, y) {
            return y * this.width + x;
        };
        this.setCellState = function (x, y, state) {
            var cell = this.cells[this.findIndex(x,y)];
            state === 'live' ? cell.classList.add('live') :
                               cell.classList.remove('live');
        };
        this.computeCellNextState = function (x, y) {
            var liveCells = 0;

            function isAlive(e) {
                if(!e) return 0;
                return e.className.indexOf('live') === -1 ? 0 : 1;
            }

            for (var i = x - 1; i <= x + 1; i++) {
                for (var j = y - 1; j <= y + 1; j++){
                    if (i === x && j === y) continue;
                    liveCells += isAlive(this.cells[this.findIndex(i,j)])
                }
            }

            if(isAlive(this.cells[this.findIndex(x,y)])) {
                return (liveCells < 2 || liveCells > 3) ? 0 : 1;
            } else {
                if (liveCells === 3) return 1;
                return 0;
            }
        };
        this.computeNextGeneration = function () {
            this.nextGeneration = [];
            for (var i = 0; i < this.height; i++) {
                for (var j = 0; j < this.width; j++){
                    this.nextGeneration.push(this.computeCellNextState(i, j))
                }
            }
        };
        this.printNextGeneration = function () {
            for(var i = 0, l = this.cells.length; i < l; i++) {
                if(this.nextGeneration[i]) {
                    this.cells[i].classList.add('live');
                } else {
                    this.cells[i].classList.remove('live');
                }
            }
        };
        this.killAll = function () {
            this.cells.forEach(function (cell) {
                cell.classList.remove('live');
            })
        }
    }


    var play = document.querySelector('#play');
    var pause = document.querySelector('#pause');
    var set = document.querySelector('#set');
    var reset = document.querySelector('#reset');

    play.disabled = true;
    pause.disabled = true;

    set.addEventListener('click', function () {
        var width = document.querySelector('#board-width').value || 10;
        var height = document.querySelector('#board-height').value || 10;
        var game = new GameOfLife(width,height);

        document.querySelector('.board').innerHTML = '';
        game.createBoard();

        play.disabled = false;

        play.addEventListener('click', function () {
            var gameInterval = window.setInterval(function () {
                game.computeNextGeneration();
                game.printNextGeneration();
            }, 250);

            play.disabled = true;
            pause.disabled = false;

            pause.addEventListener('click', function () {
                window.clearInterval(gameInterval);
                play.disabled = false;
                pause.disabled = true;
            });
        });

        reset.addEventListener('click', function () {
            game.killAll();
        })

    })

});