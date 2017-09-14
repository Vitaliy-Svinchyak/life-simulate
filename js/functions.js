const type = {
    wall: '■',
    animal: 'o',
    tree: '֏',
    empty: ' ',
    track: 'x',
    route: 'w'
};

const solidObjects = [type.wall, type.tree];

const stepSpeed = 0;
const statisticSpeed = 1000;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
