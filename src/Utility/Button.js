import React from 'react';
import PropTypes from 'prop-types';

const style = {

};

const Button = ({clickHandler, children}) => {
    <button style={style} onClick={clickHandler}>
        {children}
    </button>
};

Button.propTypes = {
    clickHandler: PropTypes.func,
    children: PropTypes.string
};

Button.defaultProps = {
    clickHandler: () => {},
    children: ''
};

export default Button;