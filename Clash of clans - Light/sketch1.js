let pgn;
let fenPositions = [];

let boardSize = 800
let cellsNumber = 8;
let cellSize = boardSize/cellsNumber;

let board = [];
let pieces = [];

let inc = 0;

function preload() {
    loadStrings('data', selectGame);
    
}

function setup() {
    colorMode(HSL, 240, 240, 240);
    initializeBoard()
    findFenpositions();
    createCanvas(boardSize,boardSize)
  }
  

function mousePressed() {
    nextMove();
    loop();
}

function nextMove() {
    if (inc==fenPositions.length) {
        inc = 1;
        fenPositions.reverse()
    }
    fenToBoard(fenPositions[inc]);
    inc += 1;
    
}

function draw() {
    noLoop();
    background(10); 
    drawPieces();
    for(let i=0;i<cellsNumber;i++){
        for(let j=0; j<cellsNumber;j++) {
            fill(117,212,118);
            noStroke();
            circle((i + 0.5)*cellSize, (j + 0.5)*cellSize, boardSize/100);
        }
    }
    
}









function initializeBoard() {
    pieces = [];
    for (let i = 0; i < cellsNumber; i++) {
        board[i] = [];  
        for (let j = 0; j < cellsNumber; j++) {
            board[i][j] = null; 
        }
    }
}

function fenToBoard(fen) {
    initializeBoard()
    let rows = fen.split(" ")[0].split("/");
    let pieceMap = {
        'p': 'P', 'r': 'R', 'n': 'N', 'b': 'B', 'q': 'Q', 'k': 'K'
    };
    
    for (let y = 0; y < cellsNumber; y++) {
        let x = 0;
        for (let char of rows[y]) {
            if (!isNaN(char)) {
                x += parseInt(char); 
            }
            else {
                let color = char === char.toUpperCase() ? 'W' : 'B'; 
                let type = pieceMap[char.toLowerCase()]; 
                let piece = new Piece(y, x, type, color)
                pieces.push(piece)
                board[y][x] = piece;
                x++;
            }
        }
    }
}






function findFenpositions() {
    const chess = new Chess();
    chess.load_pgn(pgn);
    let moves = chess.history();
    chess.reset();

    fenPositions.push(chess.fen());
    for (let move of moves) {
        chess.move(move); 
        fenPositions.push(chess.fen());
    }
}

function selectGame(lines) {
    let randomLine = floor(random(lines.length)); 
    pgn = lines[randomLine]
}

function drawPiece(piece) {
    if (piece.pieceColor == "W") {stroke(200,217,80)}
    else {stroke(33,217,113)}

    

    let x = piece.pos.x;
    let y = piece.pos.y;
        
    if (piece.type == "P") {
        drawPawn(piece);
    }
    if (piece.type == "K") {
        
    }
    if (piece.type == "Q") {
        drawQueen(piece);
    }
    else if (piece.type == "B") {
        drawBishop(piece);
    }
    if (piece.type == "R") {
        drawRock(piece);
    }
    else if (piece.type == "N") {
        drawKnight(piece);
    }
}


function drawPieces() {
    for (piece of pieces) {
        drawPiece(piece);
    }
}


function drawRock(piece) {
    let x = piece.pos.x;
    let y = piece.pos.y;
    let up = 0;
    let right = 0;
    let down = 0;
    let left = 0;

    let endUp = false;
    let endRight = false;
    let endDown = false;
    let endLeft= false;

    for (let i=1; i < cellsNumber; i++) {
        if (x+i < cellsNumber) {
            if (board[y][x+i] == null && !endRight) {
                right += 1;
            }
            else {endRight = true}
        } 
        if (x-i >= 0) {
            if (board[y][x-i] == null && !endLeft) {
                left -= 1;
            }
            else {endLeft = true}
        } 
        if (y+i < cellsNumber) {
            if (board[y+i][x] == null && !endDown) {
                down += 1;
            }
            else {endDown = true}
        } 
        if (y-i >= 0) {
            if (board[y-i][x] == null && !endUp) {
                up -= 1;
            }
            else {endUp = true}
        } 
    }
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + right + 1.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + left - 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + up - 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + down + 1.5)*cellSize);
}

function drawQueen(piece) {
    let x = piece.pos.x;
    let y = piece.pos.y;
    let up = 0;
    let upRight = 0;
    let right = 0;
    let rightDown = 0;
    let down = 0;
    let downLeft = 0;
    let left = 0;
    let leftUp = 0;

    let endUp = false;
    let endRight = false;
    let endDown = false;
    let endLeft = false;
    let endUpRight = false;
    let endRightDown = false;
    let endDownLeft = false;
    let endLeftUp = false;

    for (let i=1; i < cellsNumber; i++) {
        if (x+i < cellsNumber) {
            if (board[y][x+i] == null && !endRight) {
                right += 1;
            }
            else {endRight = true}
        } 
        if (x-i >= 0) {
            if (board[y][x-i] == null && !endLeft) {
                left -= 1;
            }
            else {endLeft = true}
        } 
        if (y+i < cellsNumber) {
            if (board[y+i][x] == null && !endDown) {
                down += 1;
            }
            else {endDown = true}
        } 
        if (y-i >= 0) {
            if (board[y-i][x] == null && !endUp) {
                up -= 1;
            }
            else {endUp = true}
        } 
        if (x+i < cellsNumber && y+i < cellsNumber) {
            if (board[y+i][x+i] == null && !endRightDown) {
                rightDown += 1;
            }
            else {endRightDown = true}
        } 
        if (x-i >= 0 && y-i >= 0) {
            if (board[y-i][x-i] == null && !endLeftUp) {
                leftUp -= 1;
            }
            else {endLeftUp = true}
        } 
        if (y+i < cellsNumber && x-i >=0) {
            if (board[y+i][x-i] == null && !endDownLeft) {
                downLeft += 1;
            }
            else {endDownLeft = true}
        } 
        if (y-i >= 0 && x+i < cellsNumber) {
            if (board[y-i][x+i] == null && !endUpRight) {
                upRight -= 1;
            }
            else {endUpRight = true}
        } 
    }
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + right + 1.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + left - 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + up - 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + down + 1.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - upRight + 1.5)*cellSize, (piece.pos.y + upRight -   0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - downLeft - 0.5)*cellSize, (piece.pos.y + downLeft + 1.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + leftUp - 0.5)*cellSize, (piece.pos.y + leftUp - 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + rightDown + 1.5)*cellSize, (piece.pos.y + rightDown + 1.5)*cellSize);
}


function drawBishop(piece) {
    let x = piece.pos.x;
    let y = piece.pos.y;
    let upRight = 0;
    let rightDown = 0;
    let downLeft = 0;
    let leftUp = 0;

    let endUpRight = false;
    let endRightDown = false;
    let endDownLeft = false;
    let endLeftUp = false;

    for (let i=1; i < cellsNumber; i++) {
        if (x+i < cellsNumber && y+i < cellsNumber) {
            if (board[y+i][x+i] == null && !endRightDown) {
                rightDown += 1;
            }
            else {endRightDown = true}
        } 
        if (x-i >= 0 && y-i >= 0) {
            if (board[y-i][x-i] == null && !endLeftUp) {
                leftUp -= 1;
            }
            else {endLeftUp = true}
        } 
        if (y+i < cellsNumber && x-i >=0) {
            if (board[y+i][x-i] == null && !endDownLeft) {
                downLeft += 1;
            }
            else {endDownLeft = true}
        } 
        if (y-i >= 0 && x+i < cellsNumber) {
            if (board[y-i][x+i] == null && !endUpRight) {
                upRight -= 1;
            }
            else {endUpRight = true}
        } 
    }
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - upRight + 1.5)*cellSize, (piece.pos.y + upRight -   0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - downLeft - 0.5)*cellSize, (piece.pos.y + downLeft + 1.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + leftUp - 0.5)*cellSize, (piece.pos.y + leftUp - 0.5)*cellSize);
    line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + rightDown + 1.5)*cellSize, (piece.pos.y + rightDown + 1.5)*cellSize);
}

function drawKnight(piece) {
    let x = piece.pos.x;
    let y = piece.pos.y;
    
    noFill();
    
    ellipse((piece.pos.x + 1.5)*cellSize, (piece.pos.y - 1.5)*cellSize, cellSize/2, cellSize/2);
    ellipse((piece.pos.x - 0.5)*cellSize, (piece.pos.y - 1.5)*cellSize, cellSize/2, cellSize/2);
    ellipse((piece.pos.x + 1.5)*cellSize, (piece.pos.y + 2.5)*cellSize, cellSize/2, cellSize/2);
    ellipse((piece.pos.x - 0.5)*cellSize, (piece.pos.y + 2.5)*cellSize, cellSize/2, cellSize/2);
    ellipse((piece.pos.x + 2.5)*cellSize, (piece.pos.y + 1.5)*cellSize, cellSize/2, cellSize/2);
    ellipse((piece.pos.x + 2.5)*cellSize, (piece.pos.y - 0.5)*cellSize, cellSize/2, cellSize/2);
    ellipse((piece.pos.x - 1.5)*cellSize, (piece.pos.y + 1.5)*cellSize, cellSize/2, cellSize/2);
    ellipse((piece.pos.x - 1.5)*cellSize, (piece.pos.y - 0.5)*cellSize, cellSize/2, cellSize/2);
}

function drawKing(piece) {
    rect((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, cellSize, cellSize);
    noFill();
    strokeWeight(1);
    rect((piece.pos.x )*cellSize, (piece.pos.y)*cellSize, 2*cellSize, 2*cellSize);
}

function drawPawn(piece) {
    if (piece.pieceColor == "W") {
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 1.5)*cellSize, (piece.pos.y - 0.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 0.5)*cellSize, (piece.pos.y - 0.5)*cellSize);
    }
    else {
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 1.5)*cellSize, (piece.pos.y + 1.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 0.5)*cellSize, (piece.pos.y + 1.5)*cellSize);
    }
}