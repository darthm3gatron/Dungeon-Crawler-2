import React, {Component} from 'react';
import './App.css';
import Map from './Game/Map';
import HUD from './Game/HUD';
import generateDungeon from './MapGenerator';
import {floor, stairwell, GAME_STATE_PLAYING, GAME_STATE_START_MENU, GAME_STATE_WIN, GAME_STATE_DEATH, CONTAINER_WIDTH, CONTAINER_HEIGHT, LEFT, RIGHT, UP, DOWN, TYPES} from './Utility';
import getNewPlayer from './Utility/player';
import NewGameScreen from './Game/Models/NewGame';
import DeathScreen from './Game/Models/Death';

function checkTileAndMove(tile, state, newCoords) {
  const newState = Object.assign({}, state);
  const newRow = newCoords[0];
  const newCol = newCoords[1];

  switch (tile.type) {
    case TYPES.HEALTH_POTION:
      newState.dungeon[newRow][newCol] = floor;
      newState.player.consumeHealthPotion(tile);
      break;
    case TYPES.WEAPON:
    case TYPES.SHIELD:
      newState.dungeon[newRow][newCol] = floor;
      newState.player.equipItem(tile);
      break;
    case TYPES.BOSS:
      newState.player.fight(tile);
      if(tile.isDead()) {
        newState.dungeon[newRow][newCol] = stairwell;
      }
      if(newState.player.isDead()) {
        newState.gameState = GAME_STATE_DEATH;
      }
      return newState;
    case TYPES.MONSTER:
      newState.player.fight(tile);
      if(tile.isDead()) {
        newState.dungeon[newRow][newCol] = floor;
      }
      if(newState.player.isDead()) {
        newState.gameState = GAME_STATE_DEATH;
      }
      return newState;
    default:
  }
  newState.player.row = newRow;
  newState.player.col = newCol;

  return newState;
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      gameState: GAME_STATE_START_MENU,
      gameProperties: {
        mapOpacity: 1,
        startMenuTop: 0,
        deathScreenTop: -700
      },
      level: 1,
      dungeon: generateDungeon(1),
      hudPlayerImage: 1,
      player: getNewPlayer()
    };
    this.tick = this.tick.bind(this);
    this.startGame = this.startGame.bind(this);
    this.initiateMenuScreen = this.initiateMenuScreen.bind(this);
  }

  setPlayerPosition(direction) {
    const newState = Object.assign({}, this.state);
    newState.player.currentDirection = direction;
    this.setState({
      newState
    });
  }

  initiateDeathScreen() {
    this.setState({
      gameState: GAME_STATE_DEATH,
      gameProperties: {
        mapOpacity: 0,
        startMenuTop: -700,
        deathScreenTop: 0
      }
    });
  }

  initiateMenuScreen() {
    this.setState({
      gameState: GAME_STATE_START_MENU,
      gameProperties: {
        mapOpacity: 0,
        startMenuTop: 0,
        deathScreenTop: -700
      }
    });
  }

  startGame() {
    const startLevel = 1;
    document.addEventListener('keydown', this.keyPressEvents);
    this.setState({
      level: startLevel,
      dungeon: generateDungeon(startLevel),
      player: getNewPlayer(),
      gameState: GAME_STATE_PLAYING,
      gameProperties: {
        mapOpacity: 1,
        startMenuTop: -700,
        deathScreenTop: -700
      }
    });
  }

  tick() {
    this.setState(prevState => ({
      hudPlayerImage: prevState.hudPlayerImage === 1 ? 2 : 1
    }));
  }

  movePlayerPosition(relRow, relCol) {
    const moveToRow = this.state.player.row + relRow;
    const moveToCol = this.state.player.col + relCol;

    if(this.state.dungeon[moveToRow][moveToCol].type === TYPES.WALL) {
      return;
    }

    if(this.state.dungeon[moveToRow][moveToCol].type === TYPES.STAIRWELL) {
      if (this.state.level + 1 > 3) {
        this.setState({
          gameState: GAME_STATE_WIN
        });
      } else {
        const newPlayerState = Object.assign({}, this.state.player);
        newPlayerState.row = 1;
        newPlayerState.col = 1;
        this.setState(prevState => ({
          level: prevState.level + 1,
          dungeon: generateDungeon(prevState.level + 1),
          player: newPlayerState
        }));
        return;
      }
    }

    const tile = this.state.dungeon[moveToRow][moveToCol];
    const newState = checkTileAndMove(tile, this.state, [moveToRow, moveToCol]);

    this.setState({
      newState
    });

    if(newState.player.isDead()) {
      document.removeEventListener('keydown', this.keyPressEvents);
      this.initiateDeathScreen();
    }
  }

  keyPressEvents = (e) => {
    switch (e.keyCode) {
      case 65:
      case 37:
        this.setPlayerPosition(LEFT);
        this.movePlayerPosition(0, -1);
        break;
      case 68:
      case 39:
        this.setPlayerPosition(RIGHT);
        this.movePlayerPosition(0, 1);
        break;
      case 87:
      case 38:
        this.setPlayerPosition(UP);
        this.movePlayerPosition(-1, 0);
        break;
      case 83:
      case 40:
        this.setPlayerPosition(DOWN);
        this.movePlayerPosition(1, 0);
        break;
      default:
    }
  };

  render() {
    return (
      <div className="App" style={{position: 'relative'}}>
        <div className="App-header">
          <h2>The Kitchen</h2>
          <h4>Level {this.state.level}</h4>
        </div>
        <Map 
          map={this.state.dungeon}
          player={this.state.player}
          width={CONTAINER_WIDTH}
          height={CONTAINER_HEIGHT}
          mapOpacity={this.state.gameProperties.mapOpacity}
        />
        <HUD 
          player={this.state.player}
          heroImage={this.state.hudPlayerImage}
          tick={this.tick} 
        />
        <DeathScreen 
          startGame={this.startGame}
          mainMenu={this.initiateMenuScreen}
          top={this.state.gameProperties.deathScreenTop}
        />
        <NewGameScreen 
          gameState={this.state.gameState}
          startGame={this.startGame}
          top={this.state.gameProperties.startMenuTop}
        />
      </div>
    );
  }
}

export default App;