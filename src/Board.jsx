import React, { Component, PropTypes } from 'react';
import CustomDragLayer from './CustomDragLayer';
import BoardSquare from './BoardSquare';
import Piece from './Piece';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

class Board extends Component {

    renderSquare(i) {

        const x = i % 8;
        const y = Math.floor(i / 8);

        return (
            <div key={i}
                 style={{ width: '12.5%', height: '12.5%' }}>
                <BoardSquare x={x}
                             y={y}>
                    {this.renderPiece(x, y)}
                </BoardSquare>
            </div>
        );
    }

    renderPiece(squareX, squareY) {

        let pieceToRender = null;
        this.props.piecePositions.forEach((piecePosition, index) => {
            const { x: pieceX, y: pieceY, type: pieceType } = piecePosition;
            if (squareX == pieceX && squareY == pieceY) {
                pieceToRender = <Piece id={index} type={pieceType} />;
                return; // stop iterating, only one piece can sit on a square
            }
        });

        return pieceToRender;
    }

    render() {
        const squares = [];
        for (let i = 0; i < 64; i++) {
            squares.push(this.renderSquare(i));
        }

        return (
            <div style={{
                width: '450px',
                height: '450px',
                display: 'flex',
                flexWrap: 'wrap',
                position: 'relative'
            }}>
                {squares}
                <CustomDragLayer />
            </div>
        )
    }
}

Board.propTypes = {
    piecePositions: PropTypes.arrayOf(PropTypes.object.isRequired).isRequired
};

export default DragDropContext(HTML5Backend)(Board);