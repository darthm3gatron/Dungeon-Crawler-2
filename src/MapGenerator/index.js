import NewDungeon from 'random-dungeon-generator';
import {weapon, shield, monster, healthPotion, boss, wall, floor} from '../Utility';

const getHealthPotions = (level) => {
    const numHealthPotions = 12 - (level * 3);
    const potionArray = Array(numHealthPotions);
    const potion = Object.create(healthPotion);
    potion.init(level * 40);
    potionArray.fill(potion);

    return potionArray;
};

const addMonstersOfLevel = (num, name, level, health, attack, exp) => {
    const monsterArray = [];
    for (let i = 0; i < num; i += 1) {
        const m = Object.create(monster);
        m.init(name, level, health, attack, exp);
        monsterArray.push(m);
    }
    return monsterArray;
};

const getMonsters = (level) => {
    const monstersArray = [];
    switch (level) {
        case 1:
            monstersArray.push(...addMonstersOfLevel(10, 'grimer', 1, 15, 10, 15));
            monstersArray.push(...addMonstersOfLevel(5, 'mini grim', 2, 18, 15, 25));
            break;
        case 2:
            monstersArray.push(...addMonstersOfLevel(15, 'mini grim', 2, 18, 15, 25));
            monstersArray.push(...addMonstersOfLevel(10, 'vampire bat', 5, 44, 21, 80));
            break;
        case 3:
            monstersArray.push(...addMonstersOfLevel(20, 'vampire bat', 5, 44, 21, 80));
            monstersArray.push(...addMonstersOfLevel(10, 'evil elf', 7, 100, 38, 100));
            monstersArray.push(...addMonstersOfLevel(5, 'crazed devil bat', 8, 120, 33, 250));
            break;
        default:
    }
    return monstersArray;
};

const createWeapon = (name, attackValue) => {
    const newWeapon = Object.create(weapon);
    newWeapon.init(name, attackValue);
    return newWeapon;
};

const createShield = (name, defenseValue) => {
    const newShield = Object.create(shield);
    newShield.init(name, defenseValue);
    return newShield;
};

const getWeapons = (level) => {
    switch (level) {
        case 1:
            return [createWeapon('Wooden Sword', 3)];
        case 2:
            return [createWeapon('Hammer', 8)];
        case 3:
            return [createWeapon('Double Axe', 15)];
        default:
            return [];
    }
};

const getShields = (level) => {
    switch (level) {
        case 1:
            return [createShield('Small Shield', 3)];
        case 2:
            return [createShield('Large Shield', 6)];
        case 3:
            return [createShield('Epic Shield', 10)];
        default:
            return [];
    }
};

const getBoss = (level) => {
    const newBoss = Object.create(boss);
    switch (level) {
        case 1:
            newBoss.init('Giant Fish', 5, 80, 22, 50);
            break;
        case 2:
            newBoss.init('Giant Snake', 7, 144, 36, 600);
            break;
        case 3:
            newBoss.init('Giant Phoenix', 12, 175, 70, 2000);
            break;
        default:
    }
    return newBoss;
};

const getLevelItems = (level) => {
    const mapItems = [];
    mapItems.push(...getHealthPotions(level));
    mapItems.push(...getMonsters(level));
    mapItems.push(...getWeapons(level));
    mapItems.push(...getShields(level));
    mapItems.push(getBoss(level));
    return mapItems;
};

const randomIndexBetweenValues = (min, max) => {
    Math.floor((Math.random() * ((max - min) + 1)) + min);
};

const generateLevel = (map, level) => {
  const mapItems = getLevelItems(level);
  const dungeonLevel = Array(...map);

  while (mapItems.length > 0) {
    const randomRow = randomIndexBetweenValues(1, dungeonLevel.length - 2);
    const randomCol = randomIndexBetweenValues(1, dungeonLevel[0].length - 2);
    console.log('dungeonLevel[' + randomRow + '][' + randomCol + '] = ' + dungeonLevel[randomRow][randomCol]);
    if (dungeonLevel[randomRow][randomCol] > 1) {
      dungeonLevel[randomRow][randomCol] = mapItems.pop();
    }
  }

  return dungeonLevel;
};

const generateDungeon = (level) => {
    const genericMap = NewDungeon({maxRoomSize: 15});
    const mapWithItemsAndMonsters = generateLevel(genericMap, level);
    const dungeonWall = Object.create(wall);
    dungeonWall.init(level);

    return mapWithItemsAndMonsters.map(row => row.map((col) => {
        if (col === 1) {
            return dungeonWall;
        } else if (typeof col === 'number') {
            return floor;
        }
        return col;
    }));
};

export default generateDungeon;