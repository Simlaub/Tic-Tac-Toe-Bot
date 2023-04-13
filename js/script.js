const board = document.getElementsByClassName("Board")[0];
const cells = document.getElementsByClassName("Cell");
const messageBoard = document.getElementsByClassName("MessageBoard")[0]
const message = document.getElementsByClassName("Message")[0];
const restartButton = document.getElementsByClassName("RestartButton")[0];

const winningConditions = [
    // Horizontal
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],

    // Vertical
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],

    // Diagonal
    [2, 4, 6],
    [0, 4, 8]
]

let currentPlayer = "X"

window.onload = () =>{
    startGame()
}

function startGame() {
    hideMessage();

    // Add Event Listener for Restart Button
    restartButton.addEventListener("click", startGame);

    // Set X to be the starting Player
    board.classList.remove("O");
    board.classList.remove("X");
    board.classList.add("X");
    currentPlayer = "X"

    for (let i = 0; i < cells.length; i++) {
        // Remove marks from each cell
        cells[i].classList.remove("X");
        cells[i].classList.remove("O");

        // Remove old Event Listeners from each cell
        cells[i].removeEventListener("click", onGridCellClick);

        // Add Event Listeners to each cell
        cells[i].addEventListener("click", onGridCellClick, { once: true });
    }
}

function onGridCellClick(e) {
    let cell = e.target;

    cell.classList.remove("X");
    cell.classList.remove("O");
    
    cell.classList.add(currentPlayer);

    let gameResult = checkGameResult()

    if (gameResult.draw)
        showMessage("Unentschieden!");

    if (gameResult.winner)
        showMessage(gameResult.winner + " gewinnt!");

    changePlayer()
}

function changePlayer() {
    board.classList.remove(currentPlayer);

    currentPlayer = currentPlayer=='X'?'O':'X';

    board.classList.add(currentPlayer);
}

function checkGameResult()
{
    let winner = checkWinner();

    let draw;

    if (winner)
        draw = false;
    else
        draw = checkDraw();

    return { winner: winner, draw: draw };
}

function checkWinner()
{
    let xFilledCells = [];
    let oFilledCells = [];

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains("X"))
            xFilledCells.push(i);

        if (cells[i].classList.contains("O"))
            oFilledCells.push(i);
    }

    for (let i = 0; i < winningConditions.length; i++) {
        let xConditionMet = true;
        let oConditionMet = true;

        for (let j = 0; j < winningConditions[i].length; j++)
        {
            if (!xFilledCells.includes(winningConditions[i][j]))
                xConditionMet = false;

            if (!oFilledCells.includes(winningConditions[i][j]))
                oConditionMet = false;
        }

        if (xConditionMet)
            return "X";

        if (oConditionMet)
            return "O";
    }

    return null;
}

function checkDraw()
{
    let filledCount = 0;
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains("X") || cells[i].classList.contains("O")) {
            filledCount++;
        }
    }

    return filledCount==9
}

function showMessage(msg) {
    message.innerHTML = msg;
    messageBoard.style.display = "flex";
}

function hideMessage() {
    message.innerHTML = "";
    messageBoard.style.display = "none";
}