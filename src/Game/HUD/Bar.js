import React from 'react';
import PropTypes from 'prop-types';

const Bar = ({color, height, width, maxVal, currVal}) => {
    const widthCurrVal = (currVal / maxVal) * width;

    return (
        <div style={{margin: 'auto', width, height, background: 'linear-gradient(#424242, #212121)'}}>
            <div style={{transition: 'width 0.5s', margin: 'left', width: widthCurrVal, height, background: color}}></div>
        </div>
    );
};

Bar.propTypes = {
    color: PropTypes.string.isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    maxVal: PropTypes.number.isRequired,
    currVal: PropTypes.number.isRequired,
}

export default Bar;