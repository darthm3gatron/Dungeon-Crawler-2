import React from 'react';
import PropTypes from 'prop-types';

const EquipmentSlot = ({id, width, height, image, altText, children}) => 
    <div id={id} className="iconSquare" style={{
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        width,
        height,
        background: 'radial-gradient(#424242, #212121)',
        borderRadius: 10
    }}>
        <IconHover title={altText}>
            {children}
        </IconHover>
        <img src={image} alt={altText} />
    </div>
;

EquipmentSlot.propTypes = {
    id: PropTypes.string.isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    image: PropTypes.string.isRequired,
    altText: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape)
};

EquipmentSlot.defaultProps = {
    children: null
};

const IconHover = ({ title, children }) =>
    <div className="iconInfo" style={{ position: 'absolute', backgroundColor: '#000', opacity: 0.6, fontSize: '0.5em', top: '-200px', width: 200 }}>
        <div style={{ margin: 20, textAlign: 'left', fontSize: '2em' }}>
            <p style={{ fontSize: '1.2em', textDecoration: 'underline' }}>{title}</p>
            {children}
        </div>
    </div>;

IconHover.propTypes = {
    title: PropTypes.string.isRequired,
    children: PropTypes.arrayOf(PropTypes.shape)
};

IconHover.defaultProps = {
    children: null
};

export default EquipmentSlot;
