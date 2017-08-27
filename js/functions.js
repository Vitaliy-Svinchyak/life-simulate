const type = {
    wall: '■',
    animal: '֍',
    // animal: 'o',
    plant: '֏',
    empty: ' ',
    track: 'x',
    route: 'w'
};

const speed = 100;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateField(rows, cells) {
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
        }
    }

    field[1][1] = type.animal;
    // field[1][2] = type.animal;
    // field[1][3] = type.animal;
    field[1][field[0].length - 2] = type.animal;
    field[field.length - 2][field[0].length - 2] = type.animal;
    field[field.length - 2][1] = type.animal;

    return field;
}
