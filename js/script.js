

// script.js

class Player { // Clase base para los jugadores
    constructor(name, symbol) {
        this.name = name;
        this.symbol = symbol;
        this.wins = 0;
        this.losses = 0;
    }
}

class MachinePlayer extends Player { // Clase para la máquina
    constructor(name, symbol) {
        super(name, symbol);
    }

    makeMove(board) { // Devuelve un índice aleatorio de una celda vacía
        const availableIndices = board.map((cell, index) => cell === null ? index : null).filter(index => index !== null); // Filtra los índices de las celdas vacías
        const randomIndex = availableIndices[Math.floor(Math.random() * availableIndices.length)]; // Elige un índice aleatorio de las celdas vacías
        return randomIndex; // Devuelve el índice aleatorio
    }
}


class Game {
    constructor(player1, player2) {
        this.board = Array(9).fill(null); 
        this.currentPlayer = player1;
        this.player1 = player1;
        this.player2 = player2;
        this.isGameActive = true;
        this.gamesPlayed = [];
    }

    start() {
        this.renderBoard();
        this.updateStatus();
    }

    renderBoard() { // Renderiza el tablero y agrega un evento de clic a cada celda
        const boardElement = document.getElementById('board');
        boardElement.classList.add('visible') // Muestra el tablero
        this.getScores();
        const cells = boardElement.querySelectorAll('.cell');
        cells.forEach((cell, index) => { // Agrega un evento de clic a cada celda (cell, index) son los argumentos de la función de flecha
            cell.textContent = this.board[index]; // Establece el contenido de la celda en el valor de la celda en el tablero
            cell.addEventListener('click', () => this.makeMove(index));
        });
    }

    makeMove(index) { // Realiza un movimiento en el tablero y verifica si hay un ganador, el movimiento lo realiza el jugador actual
        if (!this.isGameActive || this.board[index]) { // Si el juego no está activo o la celda ya está ocupada, 
            return; // no hagas nada
        }

        this.board[index] = this.currentPlayer.symbol; // index es el índice de la celda que se hizo clic
        this.renderBoard(); // Renderiza el tablero

        if (this.checkWinner()) { // Verifica si hay un ganador
            this.endGame(`${this.currentPlayer.name} gana!`);
            this.currentPlayer.wins++;
            this.getOpponent().losses++;
        } else if (this.board.every(cell => cell)) {
            this.endGame("Es un empate!");
        } else {
            this.switchPlayer(); // Cambia el jugador actual
            if (this.currentPlayer instanceof MachinePlayer) { // Si el jugador actual es la máquina, realiza un movimiento, isntance of es un operador que verifica si un objeto es una instancia de una clase
                const machineMove = this.currentPlayer.makeMove(this.board);
                this.makeMove(machineMove);
            } else {
                this.updateStatus();
            }
        }
    }

    checkWinner() {
        const winningConditions = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winningConditions.some(condition => { // Verifica si alguna de las condiciones de victoria se cumple
            return condition.every(index => this.board[index] === this.currentPlayer.symbol); // Verifica si el jugador actual ganó
        });

        // El método some() verifica si al menos un elemento en un array pasa una prueba (proporcionada como una función)
        // condition => condition.every(index => this.board[index] === this.currentPlayer.symbol) es una función de flecha
        // que verifica si el jugador actual ganó

        // El método every() verifica si todos los elementos en un array pasan una prueba (proporcionada como una función)
        // index => this.board[index] === this.currentPlayer.symbol es una función de flecha que verifica si el jugador actual
        // tiene el mismo símbolo en todas las celdas de la condición de victoria


    }

    switchPlayer() {
        this.currentPlayer = this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    endGame(message) {
        this.isGameActive = false; // El juego termina
        this.gamesPlayed.push({
            winner: this.currentPlayer.name,
            loser: this.getOpponent().name,
            draw: this.board.every(cell => cell) && !this.checkWinner() // Verifica si el juego terminó en empate
            // Si todas las celdas están ocupadas y no hay un ganador, el juego termina en empate

            // El método every() verifica si todos los elementos en un array pasan una prueba (proporcionada como una función)
            // cell => cell es una función de flecha que verifica si la celda no está vacía
        });
        this.updateStatus(message);
    }

    updateStatus(message = `Es el turno de ${this.currentPlayer.name}`) {
        const statusElement = document.getElementById('status');
        statusElement.classList.remove('hidden');
        statusElement.textContent = message;
    }

    getOpponent() {
        return this.currentPlayer === this.player1 ? this.player2 : this.player1;
    }

    reset() {
        this.board = Array(9).fill(null);
        this.isGameActive = true;
        this.start();

        if (this.currentPlayer instanceof MachinePlayer) { // Si el jugador actual es la máquina, realiza un movimiento
            // instance of es un operador que verifica si un objeto es una instancia de una clase
            const machineMove = this.currentPlayer.makeMove(this.board); // La máquina realiza un movimiento
            this.makeMove(machineMove); // Realiza el movimiento en el tablero
        }

    }

    returnToMenu() {
        setTimeout(() => {
            // mostrar una tabla con los resultados de los juegos
            //document.getElementById('menu').classList.remove('hidden');
            document.getElementById('title').innerHTML = 'Resultados';
            document.getElementById('board').classList.remove('visible');
            document.getElementById('status').classList.add('hidden');
            document.getElementById('scoreBoard').classList.add('hidden');
            document.getElementById('reset').classList.add('hidden');
            document.getElementById('endGame').classList.add('hidden');
            renderTable(this.gamesPlayed);
        }, 700);

        function renderTable(gamesPlayed) {
            const table = document.getElementById('table');
            table.classList.remove('hidden');
            const tableBody = table.querySelector('tbody');
            tableBody.innerHTML = '';

            const players = {}; // Objeto para almacenar los puntajes de los jugadores

            gamesPlayed.forEach(game => {
                const winner = game.winner;
                const loser = game.loser;
                const draw = game.draw;

                // Actualiza los puntajes de los jugadores en el objeto players
                if (players[winner]) { 
                    players[winner].wins++;
                } else {
                    players[winner] = { wins: 0, losses: 0 }; // Si el jugador no está en el objeto players, inicializa el puntaje del jugador
                }

                if (players[loser]) {
                    players[loser].losses++;
                } else {
                    players[loser] = { wins: 0, losses: 0 };
                }

                if (draw) { // Si el juego terminó en empate, actualiza el puntaje de empates
                    if (players['Empates']) { 
                        players['Empates'].draws++;
                    } else {
                        players['Empates'] = { draws: 1 };
                    }
                }
            });

            // Crea una fila para cada jugador en la tabla
            Object.entries(players).forEach(([player, score]) => { // Object.entries() devuelve una matriz de pares clave/valor de una propiedad de un objeto
                // este es el formato de la matriz: [clave, valor]
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${player}</td>
                    <td>${score.wins}</td>
                    <td>${score.losses}</td>
                    <td>${score.draws ? score.draws : 0}</td> `; // si hay empates, muestra el número de empates, de lo contrario, muestra 0
                tableBody.appendChild(row); // Agrega la fila a la tabla
            });
            setTimeout(() => {
                document.getElementById('menu').classList.remove('hidden');
                document.getElementById('title').innerHTML = 'Galactic TRIKI';
                document.getElementById('table').classList.add('hidden');
            }, 3500);

        }
    }

    getScores() {
        const scoreBoard = document.getElementById('scoreBoard');
        scoreBoard.classList.remove('hidden');
        scoreBoard.innerHTML = `
            <p class="score-items" >${this.player1.name}: ${this.player1.wins}</p>
            <p class="score-items score-items-2">${this.player2.name}: ${this.player2.wins}</p>
            <p class="score-items score-items-3">Empates: ${this.gamesPlayed.filter(game => game.draw).length}</p>`; // Filtra los juegos que terminaron en empate
    }
}





document.addEventListener('DOMContentLoaded', () => {
    const playerVsPlayerButton = document.getElementById('playerVsPlayer');
    const playerVsMachineButton = document.getElementById('playerVsMachine');
    const resetButton = document.getElementById('reset');
    const endGameButton = document.getElementById('endGame');
    let game;

    playerVsPlayerButton.addEventListener('click', () => {
        const player1 = new Player('Jugador 1', 'X');
        const player2 = new Player('Jugador 2', 'O');
        game = new Game(player1, player2);
        game.start();
        document.getElementById('menu').classList.add('hidden');
        resetButton.classList.remove('hidden');
        endGameButton.classList.remove('hidden');
    });

    playerVsMachineButton.addEventListener('click', () => {
        const player1 = new Player('Jugador', 'X');
        const machine = new MachinePlayer('Máquina', 'O');
        game = new Game(player1, machine);
        game.start();
        document.getElementById('menu').classList.add('hidden');
        resetButton.classList.remove('hidden');
        endGameButton.classList.remove('hidden');
    });

    resetButton.addEventListener('click', () => {
        if (game) {
            game.getScores();
            game.reset();
        }
    });

    endGameButton.addEventListener('click', () => {
        if (game) {
            game.endGame('El juego ha sido terminado');
            game.returnToMenu();

        }
    });
});




