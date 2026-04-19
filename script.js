let players = [
    { name: "Player 1", score: 0, side: 'right'},
    { name: "Player 2", score: 0, side: 'left'}
];
let board = [null, null, null, null, null, null, null, null, null];
let CurrentMove = 0

const params = new URLSearchParams(window.location.search);
players[0].name = params.get('name1') || "Player 1";
players[1].name = params.get('name2') || "Player 2";

updateHeadings();

function checkVictory(board, lastMove) {
    const target = lastMove;
    const rows = [[0,1,2],[3,4,5],[6,7,8]];
    const cols = [[0,3,6],[1,4,7],[2,5,8]];
    const diags = [[0,4,8],[2,4,6]];
    const lines = [...rows, ...cols, ...diags];

    for (const line of lines) {
        if (line.every(i => board[i] === target)) {
            declareVictory(lastMove, line);
            return true;
        }
    }

    return false;
}

function checkDraw() {
    if (board.every(cell => cell !== null)) {
        setTimeout(() => clearBoard(), 3000);
    }
}

function declareVictory(lastMove, winningCells) {
    players[lastMove].score += 1;

    flash(winningCells, 'success');
    CurrentMove = 0
    players = [players[1], players[0]];

    updateHeadings();
    disableBoard();
    setTimeout(() => {
        clearBoard();
        enableBoard();
    }, 3000);
}


function handleClick(index) {
    if (board[index] !== null) {
        flash(index, 'error');
        return;
    }

    let lastMove = CurrentMove;
    board[index] = lastMove;
    
    paintCell(index, lastMove);
    if (checkVictory(board, lastMove)) return;
    checkDraw();

    if(CurrentMove === 0){
        CurrentMove = 1}
    else{
        CurrentMove = 0
    }
}

function flash(indices, color) {
    const cells = document.querySelectorAll('.cell');
    indices.forEach(index => cells[index].classList.add(color));
    setTimeout(() => {
        indices.forEach(index => cells[index].classList.remove(color));
    }, 1200);
}

function highlightCurrentPlayer(currentMove) {
    const panel1 = document.querySelectorAll('.side-panel')[0];
    const panel2 = document.querySelectorAll('.side-panel')[1];
    if (currentMove === 0) {
        panel1.style.backgroundColor = '';
        panel2.style.backgroundColor = '#2ecc71';
    } else {
        panel2.style.backgroundColor = '';
        panel1.style.backgroundColor = '#2ecc71';
    }
}

function updateHeadings() {
    const player1 = players.find(p => p.side === "right");
    const player2 = players.find(p => p.side === "left");

    document.getElementById('player1-heading').textContent = 
        `${player1.name} (${player1.score})`;
    document.getElementById('player2-heading').textContent = 
        `${player2.name} (${player2.score})`;

    document.getElementById('player1-symbol').textContent = players.indexOf(player1) === 0 ? 'X' : 'O';
    document.getElementById('player2-symbol').textContent = players.indexOf(player2) === 0 ? 'X' : 'O';
}

function paintCell(index, currentMove) {
    const cells = document.querySelectorAll('.btn');
    cells[index].textContent = currentMove === 0 ? 'X' : 'O';
    cells[index].classList.add(currentMove === 0 ? 'cross' : 'nought');
}

function clearBoard() {
    board = [null, null, null, null, null, null, null, null, null];
    
    const cells = document.querySelectorAll('.btn');
    cells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('cross', 'nought');
    });
}

function disableBoard() {
    document.querySelectorAll('.btn').forEach(btn => btn.disabled = true);
}

function enableBoard() {
    document.querySelectorAll('.btn').forEach(btn => btn.disabled = false);
}

function goToGame() {
    const name1 = document.getElementById('name1-input').value || "Player 1";
    const name2 = document.getElementById('name2-input').value || "Player 2";
    window.location.href = `game.html?name1=${name1}&name2=${name2}`;
}