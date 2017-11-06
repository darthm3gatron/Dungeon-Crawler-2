import React from 'react';
import Tile from './Tile';
import { TILE_HEIGHT } from '../../Utility';
import PropTypes from 'prop-types';

const getVisibleTiles = (map, height, width, playerY, playerX) => {
    const halfRowsOnScreen = Math.floor((height / 30) / 2);
    const halfColsOnScreen = Math.floor((width / 30) / 2);
    const totalRows = map.length;
    const totalCols = map[0].length;
    const startRowIndex = playerY - halfRowsOnScreen;
    const endRowIndex = playerY + halfRowsOnScreen;
    const startColIndex = playerX - halfColsOnScreen;
    const endColIndex = playerX + halfColsOnScreen;

    return {
        startRowIndex: endRowIndex < totalRows ? startRowIndex : startRowIndex - (endRowIndex - totalRows),
        endRowIndex: startRowIndex >= 0 ? endRowIndex : endRowIndex + Math.abs(startRowIndex),
        startColIndex: endColIndex < totalCols ? startColIndex : startColIndex - (endColIndex - totalCols),
        endColIndex: startColIndex >= 0 ? endColIndex : endColIndex + Math.abs(startColIndex)
    };
};

const Map = ({map, player, height, width, mapOpacity}) => {
    const mapReduce = getVisibleTiles(map, height, width, player.row, player.col);
    let incrementor = 0;

    return (
        <div className="gameMap" style={{
            margin: 'auto',
            height: `${height}px`,
            width: `${width}px`,
            opacity: mapOpacity,
            transition: 'opacity ls ease-in', 
            transitionDelay: 'ls'
        }}>
            {map.reduce((result, row, index) => {
                if (index >= mapReduce.startRowIndex && index <= mapReduce.endRowIndex) {
                    const opacity = 1 / (Math.abs(index - player.row) || 1);
                    if (player.row === index) {
                        result.push(
                            <Row key={incrementor} row={row} mapReduce={mapReduce} player={player} opacity={opacity} playerCol={player.col} />
                        );
                    } else {
                        result.push(
                            <Row key={incrementor} row={row} mapReduce={mapReduce} opacity={opacity} playerCol={player.col} />
                        );
                    }
                    incrementor += 1;
                }
                return result;
            }, [])}
        </div>
    );
};

Map.propTypes = {
    map: PropTypes.arrayOf(PropTypes.array).isRequired,
    height: PropTypes.number.isRequired,
    width: PropTypes.number.isRequired,
    player: PropTypes.shape({
        row: PropTypes.number.isRequired,
        col: PropTypes.number.isRequired,
        getImage: PropTypes.func.isRequired        
    }).isRequired,
    mapOpacity: PropTypes.number.isRequired
};

const Row = ({row, player, mapReduce, opacity, playerCol}) => {
    let incrementor = 0;

    return (
        <div className="gameRow" style={{height: TILE_HEIGHT}}>
            {row.reduce((result, col, index) => {
                if (index >= mapReduce.startColIndex && index <= mapReduce.endColIndex) {
                    const tempOpacityVal = 1 / (Math.abs(index - playerCol) || 1);
                    let colOpacity = opacity;
                    if (tempOpacityVal < opacity) {
                        colOpacity = tempOpacityVal;
                    }
                    if (player && player.col === index) {
                        result.push(<Tile key={incrementor} col={col} player={player} opacity={colOpacity} />);
                    } else {
                        result.push(<Tile key={incrementor} col={col} opacity={colOpacity} />);
                    }
                    incrementor += 1;
                }
                return result;
            }, [])}
        </div>
    );
};

Row.propTypes = {
    opacity: PropTypes.number.isRequired,
    playerCol: PropTypes.number.isRequired,
    row:PropTypes.arrayOf(
        PropTypes.shape({
            type: PropTypes.string,
            image: PropTypes.string,
            name: PropTypes.string            
        },)
    ).isRequired,
    mapReduce: PropTypes.shape({
        startRowIndex: PropTypes.number.isRequired,
        endRowIndex: PropTypes.number.isRequired,
        startColIndex: PropTypes.number.isRequired,
        endColIndex: PropTypes.number.isRequired        
    }).isRequired,
    player: PropTypes.shape({
        row: PropTypes.number.isRequired,
        col: PropTypes.number.isRequired,
        getImage: PropTypes.func.isRequired
    })
};

Row.defaultProps = {
    player: undefined,
    row: [{
        type: null,
        image: null,
        name: null
    }],
};

export default Map;