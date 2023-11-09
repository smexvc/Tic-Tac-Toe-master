document.addEventListener("DOMContentLoaded", () => {
    const cells = Array.from(document.querySelectorAll(".cell"));
    const resetButton = document.getElementById("resetButton");
    const difficultySelect = document.getElementById("difficultySelect");
    const toggleComputerButton = document.getElementById("toggleComputer");
    let currentPlayer = "X";
    let isComputerOpponent = false;
    let currentDifficulty = "normal";

    toggleComputerButton.addEventListener("click", () => {
        isComputerOpponent = !isComputerOpponent;
        toggleComputerButton.innerText = isComputerOpponent ? "Click to Play Against Opponent" : "Click to Play Against Computer";
        if (isComputerOpponent) {
            difficultySelect.style.display = "block";
        } else {
            difficultySelect.style.display = "none";
        }
        resetGame();
    });

    difficultySelect.addEventListener("change", () => {
        currentDifficulty = difficultySelect.value;
        resetGame();
    });

    const checkWinner = () => {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        for (const pattern of winPatterns) {
            const [a, b, c] = pattern;
            if (cells[a].innerText && cells[a].innerText === cells[b].innerText && cells[a].innerText === cells[c].innerText) {
                alert(`Player ${currentPlayer} wins!`);
                return true;
            }
        }

        if (cells.every(cell => cell.innerText.trim() !== "")) {
            alert("It's a draw!");
            return true;
        }

        return false;
    };

    const resetGame = () => {
        for (const cell of cells) {
            cell.innerText = "";
        }
        currentPlayer = "X";
        if (currentPlayer === "O" && isComputerOpponent) {
            makeComputerMove();
        }
    };

    const cellClickHandler = (e) => {
        const cell = e.target;
        if (cell.innerText.trim() !== "" || checkWinner()) {
            return;
        }
        cell.innerText = currentPlayer;
        if (!checkWinner()) {
            currentPlayer = currentPlayer === "X" ? "O" : "X";
            if (isComputerOpponent) {
                makeComputerMove();
            }
        }
    };

  const makeComputerMove = () => {
    if (isComputerOpponent && currentPlayer === "O") {
        if (currentDifficulty === "normal") {
            makeRandomMove();
        } else if (currentDifficulty === "hard") {
            const bestMoveIndex = findBestMove(cells.map(cell => cell.innerText), "O");
            cells[bestMoveIndex].innerText = "O";
            currentPlayer = "X";
        }
    }
};


    const makeRandomMove = () => {
        const emptyCells = cells
            .map((cell, index) => ({ cell, index }))
            .filter(item => item.cell.innerText.trim() === "");
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            emptyCells[randomIndex].cell.innerText = "O";
            if (!checkWinner()) {
                currentPlayer = "X";
            }
        }
    };

    const findBlockingMove = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (cells[i * 3 + j].innerText.trim() === "") {
                    const originalValue = cells[i * 3 + j].innerText;
                    cells[i * 3 + j].innerText = "X"; // Simulate opponent's move
                    const score = minimax(cells.map(cell => cell.innerText), 0, false);
                    cells[i * 3 + j].innerText = originalValue; // Reset the cell

                    if (score === -1) {
                        return [i, j];
                    }
                }
            }
        }
        return null;
    };

    const findWinningMove = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (cells[i * 3 + j].innerText.trim() === "") {
                    const originalValue = cells[i * 3 + j].innerText;
                    cells[i * 3 + j].innerText = "O"; // Simulate computer's move
                    if (checkWinner()) {
                        cells[i * 3 + j].innerText = originalValue; // Reset the cell
                        return [i, j];
                    }
                    cells[i * 3 + j].innerText = originalValue; // Reset the cell
                }
            }
        }
        return null;
    };

    const findBestMove = () => {
        // Implement your AI logic to find the best move here
        // This can be based on a minimax algorithm with heuristics and alpha-beta pruning
        // Replace this with your AI logic for hard difficulty
        // For simplicity, you can use the random move logic for now
        return getRandomEmptyCellIndex();
    };

    const getRandomEmptyCellIndex = () => {
        const emptyCells = cells
            .map((cell, index) => ({ cell, index }))
            .filter(item => item.cell.innerText.trim() === "");
        if (emptyCells.length > 0) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            return emptyCells[randomIndex].index;
        }
        return null;
    };

    const minimax = (board, depth, isMaximizing) => {
        const scores = {
            X: -1,
            O: 1,
            draw: 0
        };

        const result = checkWinner();
        if (result) {
            return scores[result];
        }

        if (isMaximizing) {
            let bestScore = -Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "O";
                    const score = minimax(board, depth + 1, false);
                    board[i] = "";
                    bestScore = Math.max(score, bestScore);
                }
            }
            return bestScore;
        } else {
            let bestScore = Infinity;
            for (let i = 0; i < 9; i++) {
                if (board[i] === "") {
                    board[i] = "X";
                    const score = minimax(board, depth + 1, true);
                    board[i] = "";
                    bestScore = Math.min(score, bestScore);
                }
            }
            return bestScore;
        }
    };

    cells.forEach(cell => cell.addEventListener("click", cellClickHandler));
    resetButton.addEventListener("click", resetGame);
});

