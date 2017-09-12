const type = {
    wall: '■',
    // animal: '֍',
    animal: 'o',
    plant: '֏',
    empty: ' ',
    track: 'x',
    route: 'w'
};

const stepSpeed = 10;
const statisticSpeed = 1000;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
