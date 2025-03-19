let pgn;
let fenPositions = [];

let boardSize = 800
let cellsNumber = 8;
let cellSize = boardSize/cellsNumber;

let board = [];
let pieces = [];

function preload() {
    loadStrings('data', selectGame);
    
}

function setup() {
    initializeBoard()
    findFenpositions();
    createCanvas(boardSize,boardSize)
  }
  

function mousePressed() {
    fenToBoard(fenPositions.shift());
}

function draw() {
    background(0);
    console.log(pieces)
    console.log(board)
    drawPieces();
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
    colorMode(HSL, 255, 255, 255);
    
    if (piece.type == "P") {
        if (piece.pieceColor == "W") {
            stroke(200,255,125);
        }
        else {
            stroke(30,255,125);
        }
        noFill();
        strokeWeight(1);
        if (piece.pieceColor == "W") {
            line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 1.5)*cellSize, (piece.pos.y - 0.5)*cellSize);
            line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 0.5)*cellSize, (piece.pos.y - 0.5)*cellSize);
        }
        else {
            line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 1.5)*cellSize, (piece.pos.y + 1.5)*cellSize);
            line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 0.5)*cellSize, (piece.pos.y + 1.5)*cellSize);
        }
    }
    else if (piece.type == "K") {
        if (piece.pieceColor == "W") {
            stroke(200,210,125);
        }
        else {
            stroke(30,210,125);
        }
        if (piece.pieceColor == "W") {fill(150,0,0);}
        else {fill(0,150,0);}
        rect((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, cellSize, cellSize);
        noFill();
        strokeWeight(1);
        rect((piece.pos.x )*cellSize, (piece.pos.y)*cellSize, 2*cellSize, 2*cellSize);
    }
    else if (piece.type == "Q") {
        if (piece.pieceColor == "W") {
            stroke(200,170,125);
        }
        else {
            stroke(30,170,125);
        }
        noFill();
        strokeWeight(1);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + 8.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y - 7.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 8.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 7.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 8.5)*cellSize, (piece.pos.y + 8.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 7.5)*cellSize, (piece.pos.y - 7.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 8.5)*cellSize, (piece.pos.y - 7.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 7.5)*cellSize, (piece.pos.y + 8.5)*cellSize);
    }
    else if (piece.type == "B") {
        if (piece.pieceColor == "W") {
            stroke(200,130,125);
        }
        else {
            stroke(30,130,125);
        }
        noFill();
        strokeWeight(1);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 8.5)*cellSize, (piece.pos.y + 8.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 7.5)*cellSize, (piece.pos.y - 7.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 8.5)*cellSize, (piece.pos.y - 7.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 7.5)*cellSize, (piece.pos.y + 8.5)*cellSize);
    }
    else if (piece.type == "R") {
        if (piece.pieceColor == "W") {
            stroke(200,90,125);
        }
        else {
            stroke(30,90,125);
        }
        noFill();
        strokeWeight(1);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y + 8.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 0.5)*cellSize, (piece.pos.y - 7.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x + 8.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
        line((piece.pos.x + 0.5)*cellSize, (piece.pos.y + 0.5)*cellSize, (piece.pos.x - 7.5)*cellSize, (piece.pos.y + 0.5)*cellSize);
    }
    else if (piece.type == "N") {
        if (piece.pieceColor == "W") {
            stroke(200,50,125);
        }
        else {
            stroke(30,50,125);
        }
        noFill();
        strokeWeight(1);
        ellipse((piece.pos.x + 1.5)*cellSize, (piece.pos.y - 1.5)*cellSize, cellSize/2, cellSize/2);
        ellipse((piece.pos.x - 0.5)*cellSize, (piece.pos.y - 1.5)*cellSize, cellSize/2, cellSize/2);
        ellipse((piece.pos.x + 1.5)*cellSize, (piece.pos.y + 2.5)*cellSize, cellSize/2, cellSize/2);
        ellipse((piece.pos.x - 0.5)*cellSize, (piece.pos.y + 2.5)*cellSize, cellSize/2, cellSize/2);
        ellipse((piece.pos.x + 2.5)*cellSize, (piece.pos.y + 1.5)*cellSize, cellSize/2, cellSize/2);
        ellipse((piece.pos.x + 2.5)*cellSize, (piece.pos.y - 0.5)*cellSize, cellSize/2, cellSize/2);
        ellipse((piece.pos.x - 1.5)*cellSize, (piece.pos.y + 1.5)*cellSize, cellSize/2, cellSize/2);
        ellipse((piece.pos.x - 1.5)*cellSize, (piece.pos.y - 0.5)*cellSize, cellSize/2, cellSize/2);
    }
}


function drawPieces() {
    for (piece of pieces) {
        drawPiece(piece);
    }
}
