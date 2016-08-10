import React from 'react';
import ReactDOM from 'react-dom';
import Board from './Board';
import { observe } from './Game';

const rootEl = document.getElementById('root');

observe(piecePositions =>
    ReactDOM.render(
        <Board piecePositions={piecePositions} />,
        rootEl
    )
);
