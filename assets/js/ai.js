document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const message = document.getElementById('message');
    const fireworks = document.getElementById('fireworks');
    let currentPlayer = 'X';
    let gameActive = true;
    const winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    let gameState = ['', '', '', '', '', '', '', '', ''];

    cells.forEach(cell => {
        cell.addEventListener('click', () => handleCellClick(cell));
    });

    function handleCellClick(cell) {
        const cellIndex = cell.getAttribute('data-index');
        if (gameState[cellIndex] !== '' || !gameActive) return;
        gameState[cellIndex] = currentPlayer;
        cell.textContent = currentPlayer;
        if (checkWin()) {
            gameActive = false;
            handleWin();
        } else if (isDraw()) {
            gameActive = false;
            handleDraw();
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            if (currentPlayer === 'O') {
                setTimeout(aiMove, 500);
            }
        }
    }

    function aiMove() {
        let availableCells = [];
        gameState.forEach((cell, index) => {
            if (cell === '') availableCells.push(index);
        });

        // Harder AI move with some randomization to ensure user can still win
        let move = findBestMove();
        if (move === -1) {
            move = availableCells[Math.floor(Math.random() * availableCells.length)];
        }

        gameState[move] = 'O';
        cells[move].textContent = 'O';
        if (checkWin()) {
            gameActive = false;
            handleLoss();
        } else if (isDraw()) {
            gameActive = false;
            handleDraw();
        } else {
            currentPlayer = 'X';
        }
    }

    function findBestMove() {
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'O';
                if (checkWin()) {
                    gameState[i] = '';
                    return i;
                }
                gameState[i] = '';
            }
        }
        for (let i = 0; i < gameState.length; i++) {
            if (gameState[i] === '') {
                gameState[i] = 'X';
                if (checkWin()) {
                    gameState[i] = '';
                    return i;
                }
                gameState[i] = '';
            }
        }
        return -1;
    }

    function checkWin() {
        return winningCombinations.some(combination => {
            return combination.every(index => gameState[index] === currentPlayer);
        });
    }

    function isDraw() {
        return gameState.every(cell => cell !== '');
    }

    function handleWin() {
        message.textContent = 'You win! Redirecting you to next page.';
        winningCombinations.forEach(combination => {
            if (combination.every(index => gameState[index] === currentPlayer)) {
                combination.forEach(index => {
                    cells[index].classList.add('strike');
                });
            }
        });
        fireworks.classList.remove('hidden');
        setTimeout(() => {
            window.location.href = 'whack-mole.html';  
        }, 3000);
    }

    function handleLoss() {
        message.textContent = 'You lost! Try again to win and proceed.';
        setTimeout(resetGame, 1000);
    }

    function handleDraw() {
        message.textContent = 'It\'s a draw! Try again to win and proceed.';
        setTimeout(resetGame, 1000);
    }

    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('strike');
        });
        currentPlayer = 'X';
        gameActive = true;
        message.textContent = '';
    }
});
