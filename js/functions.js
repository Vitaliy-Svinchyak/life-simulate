const type = {
    wall: '■',
    animal: '֍',
    plant: '֏',
    empty: ' ',
    track: 'o'
};

const speed = 30;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateField(rows, cells) {
    let cellsCount = 0;
    let field = [];
    let item;

    for (let y = 0; y <= rows; y++) {
        field[y] = [];

        for (let x = 0; x <= cells; x++) {
            if (y === 0 || y === rows || x === 0 || x === cells) {
                item = type.wall;
            } else {
                item = getRandomInt(0, 3) ? type.empty : type.wall;
            }

            field[y][x] = item;
            cellsCount++;
        }
    }

    field[1][1] = type.animal;

    return field;
}
