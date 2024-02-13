const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 20;

const board = [];
const bgm = document.createElement("audio");
const breakSound = document.createElement("audio");
const drop = document.createElement("audio");
let rotatedShape;

bgm.setAttribute("src", "./assets/bgm.mp3");
bgm.muted = true;

breakSound.setAttribute("src", "./assets/break.mp3");
breakSound.muted = true;

drop.setAttribute("src", "./assets/drop.mp3");
drop.muted = true;

for(let row = 0; row < BOARD_HEIGHT; row++) {
    board[row]= [];
    for(let col =0; col < BOARD_WIDTH; col++) {
     board[row][col] = 0;   
    }
}

const tetrominoes = [
    {
        shape : [
            [1,1],
            [1,1]
        ],
        color: '#13ee13'
    },
    {
        shape : [
            [0,2,0],
            [2,2,2]
        ],
        color: "#08dae0"  
    },
    {
        shape : [
            [0,3,3],
            [3,3,0]
        ],
        color: 'orange'
    },
    {
        shape : [
            [4,4,0],
            [0,4,4,]
        ],
        color: '#d60856'
    }, {
        shape : [
            [5,0,0],
            [5,5,5]
        ],
        color: "#ff6400"
    },
    {
        shape : [
            [0,0,6],
            [6,6,6]
        ],
        color: "#a508f9"
    },
    {
        shape : [[7,7,7,7,7]],
        color: "#0622eb"
    },

    {
        shape : [
            [0,8,0],
            [8,8,8],
            [0,8,0]
        ],
        color: "#e7f908"
    },

    {
        shape : [[9,9,9]],
        color: "#eb98e4"
    },
    {
        shape : [[10,10]],
        color: "#aa5618"
    },

    {
        shape : [[11]],
        color: "#e40303"
    },

    {
        shape : [
            [12,12],
            [0, 12]
    ],
        color: "#ebe9e9"
    },

    {
        shape : [
            [13, 13,13],
            [13, 0, 13]
    ],
        color: "#0ac947"
    },

    {
        shape : [
            [14,14,0],
            [0,14, 0],
            [0,14, 14]
    ],
        color: "#7e432c"
    },
    {
        shape : [
            [0,15, 15],
            [0,15, 15],
            [0,15, 0]
    ],
        color: "#1ba121"
    },

    {
        shape : [
            [0,16, 16],
            [0,16, 16],
            [0, 0, 16]
    ],
        color: "#810ecc"
    },

];

function randomTetromino() {
    const index = Math.floor(Math.random() * tetrominoes.length);
    const tetromino = tetrominoes[index];
    return {
        shape : tetromino.shape,
        color: tetromino.color,
        row: 0,
        col : Math.floor(Math.random() * (BOARD_WIDTH - tetromino.shape[0].length +1))
    };
}

let currentTetromino = randomTetromino();
let currentGhostTetromino;

function drawTetromino() {
    const shape =  currentTetromino.shape;
    const color =  currentTetromino.color;
    const row =  currentTetromino.row;
    const col =  currentTetromino.col;

    for(let r = 0; r < shape.length; r++) {
        for(let c= 0; c < shape[r].length; c++){
            if(shape[r][c]) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.backgroundColor = color;
                block.style.top = (row+r) *24 + 'px';
                block.style.left = (col + c) *24 + 'px';
                block.setAttribute('id', `block-${row + r}-${col + c}`);
                document.getElementById('game_board').appendChild(block);
            }
        }
    }

    moveGhostTetromino();
}

//erase tetromino from board
function eraseTetromino() {
    for(let i = 0; i < currentTetromino.shape.length; i++){
        for(let j = 0; j < currentTetromino.shape[i].length; j++) {
            if(currentTetromino.shape[i][j] !== 0 ){
                let row = currentTetromino.row + i;
                let col = currentTetromino.col + j;
                let block = document.getElementById(`block-${row}-${col}`);

                if(block)
                    document.getElementById('game_board').removeChild(block);{
                }
            }
        }
    }
}

function canTetrominoMove(row0ffset, col0ffset) {
    for(let i = 0; i< currentTetromino.shape.length; i++) {
        for(let j = 0; j< currentTetromino.shape[i].length; j++){
            if(currentTetromino.shape[i][j] !== 0){
                let row = currentTetromino.row + i + row0ffset;
                let col = currentTetromino.col + j + col0ffset;

                if(row >= BOARD_HEIGHT || col < 0 || col >=BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
                    return  false;
                }
            }

        }
    }

    return true;
}

function canTetrominoRotate() {
    for(let i = 0; i < rotatedShape.length; i++) {
        for(let j = 0; j < rotatedShape[i].length; j++) {
            if(rotatedShape[i][j] !== 0) {
                let row = currentTetromino.row +i;
                let col = currentTetromino.col + j;

                if(row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col]!==0 )) {
                    return false;
                }
            }
        }
    }
    return true;
}

var score = 0;

function lockTetromino () {
    for(let i = 0; i < currentTetromino.shape.length; i++){
        for(let j = 0; j < currentTetromino.shape[i].length; j++){
            if(currentTetromino.shape[i][j] !== 0) {
                let row = currentTetromino.row + i;
                let col = currentTetromino.col + j;

                if(row < 0 || row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH) {
                    return;
                }

                board[row][col] = currentTetromino.color;
            }
        }
    }

    //Clear row
    let rowsCleared = clearRows();
    if(rowsCleared > 0){
        // update Score
        score += rowsCleared * 100;
        document.querySelector("#score").innerHTML = score;
        
    }

    

    currentTetromino = randomTetromino();
}

function clearRows() {
    let rowsCleared = 0;

    for (let y = BOARD_HEIGHT - 1; y >= 0; y--) {
        let rowFilled = true;

        for (let x = 0; x < BOARD_WIDTH; x++) {
            if (board[y][x] === 0) {
                rowFilled = false;
                break;
            }
        }

        if (rowFilled) {
            breakSound.muted = false;
            breakSound.play();
            rowsCleared++;

            // Shift rows down
            for (let yy = y; yy > 0; yy--) {
                for (let x = 0; x < BOARD_WIDTH; x++) {
                    board[yy][x] = board[yy - 1][x];
                }
            }
            for (let x = 0; x < BOARD_WIDTH; x++) {
                board[0][x] = 0;
            }
        }
    }

    // Update the game board
    updateGameBoard();

    return rowsCleared;
}

function updateGameBoard() {
    document.getElementById('game_board').innerHTML = "";

    for (let row = 0; row < BOARD_HEIGHT; row++) {
        for (let col = 0; col < BOARD_WIDTH; col++) {
            if (board[row][col]) {
                const block = document.createElement('div');
                block.classList.add('block');
                block.style.backgroundColor = board[row][col];
                block.style.top = row * 24 + 'px';
                block.style.left = col * 24 + 'px';
                block.setAttribute('id', `block-${row}-${col}`);
                document.getElementById('game_board').appendChild(block);
            }
        }
    }
}


function rotateTetromino() {
    rotatedShape = [];
    for(let i = 0; i < currentTetromino.shape[0].length; i++) {
        let row = [];
        for(let j = currentTetromino.shape.length -1; j >=0; j--) {
            row.push(currentTetromino.shape[j][i]);
        }
        rotatedShape.push(row);
    }
    if(canTetrominoRotate()) {
        eraseTetromino();
        currentTetromino.shape = rotatedShape; 
        drawTetromino();
    }
}

function moveDown() {
    eraseTetromino();
    let row = currentTetromino.row;
    row++;
    currentTetromino.row = row;
    drawTetromino();
}

function moveTetromino(direction) {
    let row = currentTetromino.row;
    let col = currentTetromino.col;


    if(direction === "left") {
        if(canTetrominoMove(0,-1)){
            eraseTetromino();
            col -= 1;
            currentTetromino.col = col;
            currentTetromino.row = row;
            drawTetromino();
        }

    } else if (direction === "right") {
        if(canTetrominoMove(0, 1)) {
            eraseTetromino();
            col += 1;
            currentTetromino.col = col;
            currentTetromino.row = row;
            drawTetromino();
        }
    } else {

        if(canTetrominoMove(1,0)) {
        //down
        eraseTetromino();
        row++;
        currentTetromino.col = col;
        currentTetromino.row = row;
        drawTetromino();
        } else {
            lockTetromino();
        }

    }

    moveGhostTetromino();
}

drawTetromino();
setInterval(moveTetromino, 500);

// draw Ghost

function drawGhostTetromino() {
    const shape = currentGhostTetromino.shape;
    const color = 'rgba(255,255,255,0.5)';
    const row = currentGhostTetromino.row;
    const col = currentGhostTetromino.col;

    for (let r = 0; r < shape.length; r++) {
        for (let c = 0; c < shape[r].length; c++) {
            if (shape[r][c]) {
                const block = document.createElement('div');
                block.classList.add('ghost');
                block.style.backgroundColor = color;
                block.style.top = (row + r) * 24 + 'px';
                block.style.left = (col + c) * 24 + 'px';
                block.setAttribute('id', `ghost-${row + r}-${col + c}`);
                document.getElementById('game_board').appendChild(block);
            }
        }
    }
}


function eraseGhostTetromino() {
    const ghosts = document.querySelectorAll('.ghost');
    ghosts.forEach((ghost) => {
        ghost.remove();
    });
}

function canGhostTeromino(row0ffset,col0ffset ) {
    for(let i = 0; i < currentGhostTetromino.shape.length; i++) {
        for(let j = 0; j < currentGhostTetromino.shape[i].length; j++ ) {
            if(currentGhostTetromino.shape[i][j] !== 0) {
                let row = currentGhostTetromino.row + i + row0ffset;
                let col = currentGhostTetromino.col + j + col0ffset;

                if(row >= BOARD_HEIGHT || col < 0 || col >= BOARD_WIDTH || (row >= 0 && board[row][col] !== 0)) {
                    return false;
                }
            }
        }
    }

    return true;
}

function moveGhostTetromino() {
    eraseGhostTetromino();

    currentGhostTetromino = {...currentTetromino};

    while(canGhostTeromino(1,0)) {
        currentGhostTetromino.row ++;

    }

    drawGhostTetromino();
}


document.body.addEventListener("click",() => {
    bgm.play();
    bgm.muted = false;
    drop.muted = false;
});

function dropTetromino() {
    let row = currentTetromino.row;
    let col = currentTetromino.col;

    drop.muted = false;
    drop.play();

    while(canTetrominoMove(1, 0)) {
        eraseTetromino();
        row++;
        currentTetromino.col = col;
        currentTetromino.row = row;
        drawTetromino();
    }

    lockTetromino();
}
document.addEventListener("keydown", handleKeyPress);

    function handleKeyPress(event) {
    switch(event.keyCode) {
        case 37 : //Left arrow
            moveTetromino('left');
            break;
        case 39 : //right arrow
            moveTetromino('right');
            break;
        case 40 : //down arrow
            moveTetromino('down');
            break;
        case 38 : //up arrow
            //rotate
            rotateTetromino();
            break;
        case 32 : //space bar
            //drop
            dropTetromino();
            break;
        
    }
} 