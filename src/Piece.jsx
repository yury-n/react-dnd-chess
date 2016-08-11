import React, { Component, PropTypes } from 'react';
import { ItemTypes } from './Constants';
import { DragSource } from 'react-dnd';
import { getEmptyImage } from 'react-dnd-html5-backend';

class Piece extends Component {

    render() {
        let utf8symbol = null;
        switch (this.props.type) {
            case 'knight': utf8symbol = '♞'; break;
            case 'pawn': utf8symbol = '♟'; break;
            case 'bishop': utf8symbol = '♝'; break;
            case 'rook': utf8symbol = '♜'; break;
            case 'queen': utf8symbol = '♛'; break;
            case 'king': utf8symbol = '♚'; break;
        }
        return (
            <div style={{
                width: '57px',
                height: '57px',
                fontSize: 38,
                textAlign: 'center',
                fontWeight: 'bold',
                cursor: 'move'
            }}>
                {utf8symbol}
            </div>
        );
    }
}
Piece.propTypes = {
    id: PropTypes.number,
    type: PropTypes.string.isRequired
};

class DraggablePiece extends Component {

    componentDidMount() {
        // Use empty image as a drag preview so browsers don't draw it
        // and we can draw whatever we want on the custom drag layer instead.
        this.props.connectDragPreview(getEmptyImage(), {
            // IE fallback: specify that we'd rather screenshot the node
            // when it already knows it's being dragged so we can hide it with CSS.
            captureDraggingState: true
        });
    }

    render() {
        const { connectDragSource, isDragging, ...other } = this.props;
        return connectDragSource(
            <div style={{opacity: isDragging ? 0.5 : 1}}>
                <Piece {...other} />
            </div>
        );
    }
}
DraggablePiece.propTypes = {...Piece.propTypes, ...{
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired
}};

const sourceSpecs = {
    beginDrag(props) {
        const item = { id: props.id, type: props.type };
        return item;
    }
};

function collect(connect, monitor) {
    return {
        connectDragSource: connect.dragSource(),
        connectDragPreview: connect.dragPreview(),
        isDragging: monitor.isDragging()
    }
}

const DraggablePieceDnD = DragSource(ItemTypes.PIECE, sourceSpecs, collect)(DraggablePiece);

export {
    Piece,
    DraggablePieceDnD as DraggablePiece
}
