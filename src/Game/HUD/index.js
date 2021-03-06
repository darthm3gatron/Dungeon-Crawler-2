import React from 'react';
import './index.css';
import { CONTAINER_WIDTH, IMAGE_PATH, LEVEL_UP_SEQUENCE_LENGTH } from '../../Utility';
import EquipmentSlot from './EquipmentSlot';
import Bar from './Bar';
import PropTypes from 'prop-types';

const removeInterval = (interval) => {
    if (interval) {
        clearInterval(interval);
    }
};

class HUD extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            playerLevel: this.props.player.level,
            levelUpSequence: undefined,
        };
        this.levelUpSequence = this.levelUpSequence.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.props.tick, 500);
    }

    componentWillReceiveProps() {
        if (this.state.playerLevel !== this.props.player.level) {
            this.setState({
                playerLevel: this.props.player.level,
                levelUpSequence: 1,
                levelUpInterval: setInterval(this.levelUpSequence, 500)
            });
        } else if (this.state.levelUpSequence > LEVEL_UP_SEQUENCE_LENGTH && this.state.levelUpInterval) {
            removeInterval(this.state.levelUpInterval);
            this.setState({
                levelUpSequence: undefined,
                levelUpInterval: undefined
            });
        }
    }

    componentWillUnmount() {
        removeInterval(this.interval);
    }

    getHeroImage() {
        if (this.props.player.isDead()) {
            removeInterval(this.interval);
            return `${IMAGE_PATH}/tombstone.gif`;
        }
        if (this.state.levelUpSequence) {
            return `${IMAGE_PATH}/hero/hero1-hui-levelup${this.state.levelUpSequence % 2}.gif`;
        }
        return `${IMAGE_PATH}/hero/hero1-hui${this.props.heroImage}.gif`;
    }

    levelUpSequence() {
        this.setState(prevProps => ({
            levelUpSequence: this.state.levelUpSequence < LEVEL_UP_SEQUENCE_LENGTH ? prevProps.levelUpSequence + 1 : undefined
        }));
    }

    render() {
        const { player } = this.props;
        const heroImage = this.getHeroImage();
        const HUD_WIDTH = CONTAINER_WIDTH + 50;
        const totalAttack = player.baseAttack + player.weapon.attack;
        const totalDefense = player.baseDefense + player.shield.defense;

        return (
            <div id="container" style={{
                width: HUD_WIDTH,
                margin: '10px auto',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
                flexDirection: 'column'
            }}>
                <div id="playerStatus" style={{
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'space-around',
                    width: 160
                }}>
                    <EquipmentSlot id="weaponSquare" width={40} height={40} image={player.weapon.image} altText="weapon">
                        <p>Name: {player.weapon.name}</p>
                        <p>Attack: {player.weapon.attack}</p>
                    </EquipmentSlot>
                    <EquipmentSlot id="playerSquare" width={70} height={70} image={heroImage} altText="hero">
                        <p>Level: {player.level}</p>
                        <p>Health: {player.currHealth} / {player.maxHealth}</p>
                        <p>Attack: {totalAttack} ({player.baseAttack} + {player.weapon.attack})</p>
                        <p>Defense: {totalDefense} ({player.baseDefense} + {player.shield.defense})</p>
                        <p>EXP: {player.currExp} / {player.nextLevelExp}</p>
                    </EquipmentSlot>
                    <EquipmentSlot id="shieldSquare" width={40} height={40} image={player.shield.image} altText="shield">
                        <p>Name: {player.shield.name}</p>
                        <p>Defense: {player.shield.defense}</p>
                    </EquipmentSlot>
                </div>
                <div style={{ marginTop: 10 }}>
                    <Bar 
                        color="linear-gradient(#64DD17, #1B5E20)"
                        height={20}
                        width={HUD_WIDTH}
                        maxVal={player.maxHealth}
                        currVal={player.currHealth} 
                    />
                    <Bar
                        color="linear-gradient(#FFCA28, #FF6F00)"
                        height={10}
                        width={HUD_WIDTH}
                        maxVal={player.nextLevelExp}
                        currVal={player.currExp} 
                    />
                    {this.state.levelUpSequence && <h3 style={{color: '#FFCA28'}}>LEVEL UP!</h3>}
                </div>
            </div>
        );
    }
}

HUD.propTypes = {
    player: PropTypes.shape({
        currHealth: PropTypes.number.isRequired,
        maxHealth: PropTypes.number.isRequired,
        level: PropTypes.number.isRequired,
        currExp: PropTypes.number.isRequired,
        nextLevelExp: PropTypes.number.isRequired,
        baseAttack: PropTypes.number.isRequired,
        baseDefense: PropTypes.number.isRequired,
        weapon: PropTypes.shape({
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            attack: PropTypes.number.isRequired,
        }).isRequired,
        shield: PropTypes.shape({
            type: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            defense: PropTypes.number.isRequired,
        }).isRequired,
        isDead: PropTypes.func.isRequired,
    }).isRequired,
    heroImage: PropTypes.number.isRequired,
    tick: PropTypes.func.isRequired
};

export default HUD;