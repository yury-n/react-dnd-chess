let piecePositions = [
    {'type': 'rook', x: 0, y: 7},
    {'type': 'knight', x: 1, y: 7},
    {'type': 'bishop', x: 2, y: 7},
    {'type': 'king', x: 3, y: 7},
    {'type': 'queen', x: 4, y: 7},
    {'type': 'bishop', x: 5, y: 7},
    {'type': 'knight', x: 6, y: 7},
    {'type': 'rook', x: 7, y: 7}
];

for (let i = 0; i < 8; i++) {
    piecePositions.push({'type': 'pawn', x: i, y: 6});
}

let observer = null;

function emitChange() {
    observer(piecePositions);
}

export function observe(o) {
    if (observer) {
        throw new Error('Multiple observers not implemented.');
    }
    observer = o;
    emitChange();
}

function isSquareTaken(x, y) {

    var squareTaken = false;

    piecePositions.forEach(piecePosition => {
        if (x == piecePosition.x && y == piecePosition.y) {
            squareTaken = true;
            return;
        }
    });

    return squareTaken;
}

function doesRouteCrossOtherPieces(checkRouteSquares) {
    var routeCrossesOtherPieces = false;
    checkRouteSquares.forEach(checkSquare => {
        if (isSquareTaken(checkSquare.x, checkSquare.y)) {
            routeCrossesOtherPieces = true;
            return;
        }
    });

    return routeCrossesOtherPieces;
}

export function canMovePiece(itemid, toX, toY) {

    if (isSquareTaken(toX, toY)) {
        return false;
    }

    const {x: pieceX, y: pieceY, type: pieceType} = piecePositions[itemid];

    const dx = toX - pieceX;
    const dy = toY - pieceY;

    if (pieceType == 'knight') {
        return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
               (Math.abs(dx) === 1 && Math.abs(dy) === 2);
    } else if (pieceType == 'pawn') {
        return (dy === -1 && pieceX === toX) || (pieceY === 6 && toY == 4 && pieceX === toX);
    } else if (pieceType == 'rook') {
        return canMoveRook(itemid, toX, toY);
    } else if (pieceType == 'king') {
        return (Math.abs(dx) <= 1 && Math.abs(dy) <= 1);
    } else if (pieceType == 'bishop') {
        return canMoveBishop(itemid, toX, toY);
    } else if (pieceType == 'queen') {
        return canMoveRook(itemid, toX, toY) || canMoveBishop(itemid, toX, toY);
    }
}

function canMoveBishop(itemid, toX, toY) {
    const {x: pieceX, y: pieceY} = piecePositions[itemid];

    const dx = toX - pieceX;
    const dy = toY - pieceY;

    if (Math.abs(dx) !== Math.abs(dy)) {
        return false;
    }

    const checkRouteSquares = [];

    for (let checkX = pieceX + (dx > 0 ? 1: -1),
             checkY = pieceY + (dy > 0 ? 1: -1);
         checkX !== toX;
         (dx > 0 ? checkX++ : checkX--) &&
         (dy > 0 ? checkY++ : checkY--)) {

        checkRouteSquares.push({x: checkX, y: checkY});
    }

    return !doesRouteCrossOtherPieces(checkRouteSquares);
}

function canMoveRook(itemid, toX, toY) {

    const {x: pieceX, y: pieceY} = piecePositions[itemid];

    const dx = toX - pieceX;
    const dy = toY - pieceY;

    const onTheSameLine = (dx === 0 || dy === 0);
    if (!onTheSameLine) {
        return false;
    }

    const checkRouteSquares = [];

    if (dx === 0 && dy !== 0) {

        for (let checkY = pieceY + (dy > 0 ? 1: -1);
             checkY != toY;
             dy > 0 ? checkY++ : checkY--) {

            checkRouteSquares.push({x: toX, y: checkY});
        }
    } else if (dx !== 0 && dy === 0) {

        for (let checkX = pieceX + (dx > 0 ? 1: -1);
             checkX != toX;
             dx > 0 ? checkX++ : checkX--) {

            checkRouteSquares.push({x: checkX, y: toY});
        }
    }

    return !doesRouteCrossOtherPieces(checkRouteSquares);
}

export function movePiece(itemid, toX, toY) {
    piecePositions[itemid]['x'] = toX;
    piecePositions[itemid]['y'] = toY;
    emitChange();
}