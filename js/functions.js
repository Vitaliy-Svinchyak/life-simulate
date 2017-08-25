const wall = '■';
const animal = '֍';
const plant = '֏';
const empty = ' ';
const track = 'o';
const speed = 100;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function generateField(rows, cells) {
    let animals = rows * cells / 2000;
    let cellsCount = 0;
    let field = [];
    let item;
    for (let y = 0; y <= rows; y++) {
        field[y] = [];
        for (let x = 0; x <= cells; x++) {
            if (y === 0 || y === rows || x === 0 || x === cells) {
                item = wall;
//                } else if (getRandomInt(0, 100) < animals) {
//                    item = animal;
            } else {
                item = getRandomInt(0, 3) ? empty : wall;
            }

            field[y][x] = item;
            cellsCount++;
        }
    }
    field[1][1] = animal;
    field[1][2] = animal;
    field[2][1] = animal;
    field[2][2] = animal;

    return field;
}
