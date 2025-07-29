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

    // Check win function
    const checkwin = (symbol, y, x) => {
        
        const rowWin = board.getBoard()[y].every(cell => cell.getValue() === symbol);
        const colWin = board.getBoard().every(row => row[x].getValue() === symbol);
        
        const mainDiagWin = y === x && board.getBoard().every((r, i) => r[i].getValue() === symbol);
        const antiDiagWin = y + x === 2 && board.getBoard().every((r, i) => r[2 - i].getValue() === symbol);
        
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
        if (board.getBoard()[y][x].getValue() !== "") {
            console.log("Invalid move")
            return;
        }
        board.chooseCell(y, x, getActivePlayer().symbol);

        // Check for Win or Tie
        if (checkwin(getActivePlayer().symbol, y, x) === true) {
            console.log("Game has finished")
            return;
        } else if (checktie() === true) {
            console.log("The Game is a Tie")
            return;
        }

        switchPlayerTurn();
        printNewRound();
    }

    printNewRound();

    return {
        playRound,
        getActivePlayer,
        getBoard: board.getBoard
    };
}

// Display screen
function ScreenController() {
    const game = GameController();
    const playerTurnDiv = document.querySelector(".turn");
    const boardDiv = document.querySelector(".board");

    const updateScreen = () => {
        // Clear screen
        boardDiv.textContent = "";

        // Get newest version of board and player turn
        const board = game.getBoard();
        const activePlayer = game.getActivePlayer();

        // Display player's turn
        playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

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


    // Inital render
    updateScreen();
}

ScreenController();
