import React from 'react';
import {IMAGE_PATH} from '../../Utility';
import Button from '../../Utility/Button';
import PropTypes from 'prop-types';

const NewGameScreen = ({startGame, top}) => 
    <div key="menu" className="menu" style={{
        position: 'absolute',
        backgroundColor: '#000',
        top, width: '100%',
        height: '100%',
        transition: 'top 0.5s cubic-bezier(1.000, -0.530, 0.405, 1.425)'
    }}>
        <div style={{margin: '20px auto', maxWidth: 500}}>
            <h1>Welcome to the Dungeon</h1>
            <p></p>
            <img src={`${IMAGE_PATH}/hero/hero1-hui1.gif`} alt="hero" />
            <p>Use:</p>
            <p>
                <img src={`${IMAGE_PATH}/wasd_pad.gif`} alt="wasd_pad" />
                or
                <img src={`${IMAGE_PATH}/directional_pad.gif`} alt="directional_pad" />
            </p>
            <p>

            </p>
            <p></p>
            <br />
            <Button clickHandler={startGame}>Start Game</Button>
        </div>
    </div>
;

NewGameScreen.propTypes = {
    startGame: PropTypes.func.isRequired,
    top: PropTypes.number.isRequired
};

export default NewGameScreen;