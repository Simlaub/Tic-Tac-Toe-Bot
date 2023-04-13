const board = document.getElementsByClassName("Board")[0];
const cells = document.getElementsByClassName("Cell");
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

const botHardCodeConditions = [
    { board:"_X__O___X", badPositions: [7]},
    { board:"___XO___X", badPositions: [5]},
    { board:"__X_O__X_", badPositions: [1]},
    { board:"__XXO____", badPositions: [5]},
    { board:"X___O__X_", badPositions: [1]},
    { board:"X___OX___", badPositions: [3]},
    { board:"_X__O_X__", badPositions: [7]},
    { board:"____OXX__", badPositions: [3]},

    { board:"__X_O_X__", badPositions: [0, 8]},
    { board:"X___O___X", badPositions: [2, 6]}
]

const botPlayer = "O";
let currentBotMove = 0;
let currentPlayer = "X";

window.onload = () =>{
    startGame()
}

function startGame() {
    hideMessage();

    // Reset Bot
    currentBotMove = 0;

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

async function onGridCellClick(e) {
    let cell = e.target;
    
    cell.classList.add(currentPlayer);

    let gameResult = checkGameResult();

    if (gameResult.draw)
    {
        showMessage("Unentschieden!");
        return;
    }

    if (gameResult.winner)
    {
        showMessage(gameResult.winner + " gewinnt!");
        return;
    }

    changePlayer()

    if (currentPlayer == botPlayer)
    {
        await botMove();
        changePlayer();

        let gameResult = checkGameResult();

        if (gameResult.draw)
        {
            showMessage("Unentschieden!");
            return;
        }
    
        if (gameResult.winner)
        {
            showMessage(gameResult.winner + " gewinnt!");
            return;
        }
    }


}

function changePlayer() {
    board.classList.remove(currentPlayer);

    currentPlayer = currentPlayer=='X'?'O':'X';

    if (currentPlayer != botPlayer)
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

// Lernszenario ins impressum

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
        if (isCellFilled(i))
            filledCount++;
    }

    return filledCount==9
}

function getWinningMoves() {   
    let xFilledCells = [];
    let oFilledCells = [];

    for (let i = 0; i < cells.length; i++) {
        if (cells[i].classList.contains("X"))
            xFilledCells.push(i);

        if (cells[i].classList.contains("O"))
            oFilledCells.push(i);
    }

    let xWinningMoves = [];
    let oWinningMoves = [];

    for (let i = 0; i < winningConditions.length; i++) {
        let xConditionCount = 0;
        let oConditionCount = 0;

        let xWinningMove = null;
        let oWinningMove = null;

        
        for (let j = 0; j < winningConditions[i].length; j++)
        {
            if (xFilledCells.includes(winningConditions[i][j]))
                xConditionCount++;
            else
                xWinningMove = winningConditions[i][j];

            if (oFilledCells.includes(winningConditions[i][j]))
                oConditionCount++;
            else
                oWinningMove = winningConditions[i][j];
        }

        if (xConditionCount == 2)
        {
            if (!cells[xWinningMove].classList.contains("O"))
                xWinningMoves.push(xWinningMove);
        }

        if (oConditionCount == 2)
        {
            if (!cells[oWinningMove].classList.contains("X"))
                oWinningMoves.push(oWinningMove);
        }

    }

    return { X: xWinningMoves, O: oWinningMoves };
}

function showMessage(msg) {
    message.innerHTML = msg;
    restartButton.style.display = "inline"
}

function hideMessage() {
    message.innerHTML = " ";
    restartButton.style.display = "none";
}

function getFreeCells()
{
    let freeCells = [];

    for (let i = 0; i < cells.length; i++)
    {
        if (!isCellFilled(i))
            freeCells.push(i);
    }

    return freeCells;
}

function getCellValue(index)
{
    if (cells[index].classList.contains("X"))
        return "X";
    
    if (cells[index].classList.contains("O"))
        return "O";

    return "_";
}

function getBoardValues()
{
    let boardValues = ""
    for (let i = 0; i < cells.length; i++)
    {
        boardValues += getCellValue(i);
    }

    return boardValues;
}

function isCellFilled(index) {
    return cells[index].classList.contains("X") || cells[index].classList.contains("O");
}

function fillCell(index, player) {
    cells[index].classList.add(player);
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function botMove() {
    await sleep(500);

    currentBotMove++;

    let winningMoves = getWinningMoves();

    if (botPlayer == "O")
    {
        if (winningMoves.O.length > 0)
        {
            fillCell(winningMoves.O[0], botPlayer);
            console.log("Chose Winning Move");
            return;
        }

        if (winningMoves.X.length > 0)
        {
            fillCell(winningMoves.X[0], botPlayer);
            console.log("Blocked Opponents Winning Move");
            return;
        }
    }

    if (botPlayer == "X")
    {
        if (winningMoves.X.length > 0)
        {
            fillCell(winningMoves.X[0], botPlayer);
            console.log("Chose Winning Move");
            return;
        }
        
        if (winningMoves.O.length > 0)
        {
            fillCell(winningMoves.O[0], botPlayer);
            console.log("Blocked Opponents Winning Move");
            return;
        }
    }

    if (currentBotMove == 1)
    {
        if (isCellFilled(4)) {
            let possibleChoices = [0, 2, 6, 8];

            fillCell(possibleChoices[Math.floor(Math.random() * (possibleChoices.length - 1))], botPlayer);
            console.log("Chose Randomly from possible Hardcoded First Moves");
            return;
        }

        fillCell(4, botPlayer);
        console.log("Chose Hardcoded First Move");
        return;
    }

    let freeCells = getFreeCells();

    let boardValues = getBoardValues();

    for (let i = 0; i < botHardCodeConditions.length; i++)
    {
        if (botHardCodeConditions[i].board == boardValues)
        {
            console.log("Ran into hard-code condition!");

            for (let j = 0; j < botHardCodeConditions[i].badPositions.length; j++)
            {
                let index = freeCells.indexOf(botHardCodeConditions[i].badPositions[j]);

                if (index > -1)
                {
                    freeCells.splice(index, 1);
                    console.log("Removed Bad Position from Random Choice");
                }
            }
        }

    }

    fillCell(freeCells[Math.floor(Math.random() * (freeCells.length - 1))], botPlayer);
    console.log("Made Random Choice")
   
    return;
}
