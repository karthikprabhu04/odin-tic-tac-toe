// Set up the board
function Gameboard() {
    const board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = [];
        for (let j = 0; j < 3; j++) {
            board[i].push(Cell());
        }
    }

    const getBoard = () => board;

    const chooseCell = (y, x, symbol) => {
        board[y][x].addMove(symbol);
    }

    const printBoard = () => {
        const BoardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
        console.log(BoardWithCellValues)
    }

    return {getBoard, chooseCell, printBoard}
}

// Cell function
function Cell() {
    let value = "";

    const addMove = (symbol) => {
        value = symbol;
    }

    const getValue = () => value; 

    return {
        addMove,
        getValue
    }
}

// Control flow of the game
function GameController(
    playerOneName = "Player One",
    playerTwoName = "Player Two"
) {
    // Set up gameboard and players
    const board = Gameboard();

    const players = [{
        name: playerOneName,
        symbol: "X"
    },
    {
        name: playerTwoName,
        symbol: "O"
    }
    ];

    // Switch active player
    let activePlayer = players[0];

    const switchPlayerTurn = () => {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    };
    const getActivePlayer = () => activePlayer;

    const printNewRound = () => {
        board.printBoard();
        console.log(`${getActivePlayer().name}'s turn`);
    };

    // Check game over
    let gameOver = false;

    // Check win function
    const checkwin = (symbol, y, x) => {
        const rowWin = board.getBoard()[y].every(cell => cell.getValue() === symbol);
        const colWin = board.getBoard().every(row => row[x].getValue() === symbol);
        
        const mainDiagWin = y === x && board.getBoard().every((r, i) => r[i].getValue() === symbol);
        const antiDiagWin = parseInt(y) + parseInt(x) === 2 && board.getBoard().every((r, i) => r[2 - i].getValue() === symbol);
        
        return rowWin || colWin || mainDiagWin || antiDiagWin;
    };

    // Check tie function
    const checktie = () => {
        if (board.getBoard().every(row => row.every(cell => cell.getValue() !== "")) === true) {
            return true;
        }
    }

    // Play rounds
    const playRound = (y, x) => {
        if (gameOver) {
            console.log("Game is already over. No more moves allowed.");
            return;
        }
        
        if (board.getBoard()[y][x].getValue() !== "") {
            console.log("Invalid move")
            return;
        }

        board.chooseCell(y, x, getActivePlayer().symbol);

        // Check for Win or Tie
        if (checkwin(getActivePlayer().symbol, y, x) === true) {
            console.log("Game has finished")
            gameOver = "win";
            return;
        } else if (checktie() === true) {
            console.log("The Game is a Tie")
            gameOver = "tie";
            return;
        }

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    // Reset game

    const resetGame = () => {
        board.getBoard().forEach(row => row.forEach(cell => cell.addMove("")));
        activePlayer = players[0]
        gameOver = false;
        printNewRound();
    }

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard,
        isGameOver: () => gameOver,
        reset: resetGame
    };
}

// Display screen
function ScreenController(p1, p2) {
    const game = GameController(p1, p2);
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");
    const reset = document.querySelector(".reset");

    const updateScreen = () => {
        // Clear screen
        boardDiv.textContent = "";

        // Get newest version of board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        if (game.isGameOver() === false) {
            playerTurnDiv.textContent = `${activePlayer.name}'s turn...`;
        }
        else if (game.isGameOver() === "win") {
            playerTurnDiv.textContent = `${activePlayer.name} wins!`;
        } else {
            playerTurnDiv.textContent = "Tie!"
        }

        // Render board squares
        board.forEach((row, yValue) => {
            row.forEach((cell, xValue) => {
                const cellbutton = document.createElement("button");
                cellbutton.classList.add("cell");
                // Add dataset so can use AddEventListener
                cellbutton.dataset.x = xValue;
                cellbutton.dataset.y = yValue;
                cellbutton.textContent = cell.getValue();
                boardDiv.appendChild(cellbutton);
            })
        })
        
        reset.addEventListener("click", () => {
            game.reset()
            // Reset cells
            const cells = document.querySelectorAll(".cell");
            cells.forEach(cell => {
                cell.textContent = "";
            })
            // Reset player move
            playerTurnDiv.textContent = `${game.getActivePlayer().name}'s turn...`;
        });
    }
    
    // Add Event listener
    function clickHandlerBoard(e) {
        const SelectedCellX = e.target.dataset.x;
        const SelectedCellY = e.target.dataset.y;
        if (!SelectedCellX || !SelectedCellY) return;
        
        game.playRound(SelectedCellY, SelectedCellX);
        updateScreen();
    }
    boardDiv.addEventListener("click", clickHandlerBoard);
    
    // Reset button


    // Inital render
    updateScreen();
}

function Dialog() {
    const dialog = document.getElementById("playerDialog");
    const form = document.getElementById("playerForm")
    dialog.showModal();

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const playerOne = form.playerOne.value.trim() || "Player One";
        const playerTwo = form.playerTwo.value.trim() || "Player Two";

        ScreenController(playerOne, playerTwo);

        dialog.close()

    })
}

Dialog();