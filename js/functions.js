const type = {
    wall: '■',
    // animal: '֍',
    animal: 'o',
    plant: '֏',
    empty: ' ',
    track: 'x',
    route: 'w'
};

const speed = 10;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
