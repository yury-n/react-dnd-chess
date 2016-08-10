import React, { Component, PropTypes } from 'react';
import Square from './Square';
import { canMovePiece, movePiece } from './Game';
import { ItemTypes } from './Constants';
import { DropTarget } from 'react-dnd';

class BoardSquare extends Component {

    renderFrame(color) {
        return (
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                height: '100%',
                width: '100%',
                zIndex: 100,
                border: `3px ${color} solid`,
                boxSizing: 'border-box'
            }} />
        );
    }

    render() {
        const { x, y, connectDropTarget, isOver, canDrop } = this.props;
        const black = (x + y) % 2 === 1;

        return connectDropTarget(
            <div style={{
                position: 'relative',
                width: '100%',
                height: '100%'
            }}>
                <Square black={black}>
                    {this.props.children}
                </Square>
                {isOver && !canDrop && this.renderFrame('red')}
                {!isOver && canDrop && this.renderFrame('yellow')}
                {isOver && canDrop && this.renderFrame('#5fff5f')}
            </div>
        );
    }
}

BoardSquare.propTypes = {
    x: PropTypes.number.isRequired,
    y: PropTypes.number.isRequired,
    isOver: PropTypes.bool.isRequired
};

const targetSpecs = {
    canDrop(props, monitor) {
        const item = monitor.getItem();
        return canMovePiece(item.id, props.x, props.y);
    },
    drop(props, monitor) {
        const item = monitor.getItem();
        movePiece(item.id, props.x, props.y);
    }
};

function collect(connect, monitor) {
    return {
        connectDropTarget: connect.dropTarget(),
        isOver: monitor.isOver(),
        canDrop: monitor.canDrop()
    };
}

export default DropTarget(ItemTypes.PIECE, targetSpecs, collect)(BoardSquare);