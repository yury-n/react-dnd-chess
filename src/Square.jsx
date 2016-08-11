import React, { Component, PropTypes } from 'react'

export default class Square extends Component {
    render() {
        const { black } = this.props;
        const fill = black ? '#aaa' : 'white';

        return (
            <div style={{
                backgroundColor: fill,
                width: '100%',
                height: '100%'
            }}>
                {this.props.children}
            </div>
        );
    }
}
Square.propTypes = {
    black: PropTypes.bool
};