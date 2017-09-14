class GameFieldGenerator {

    gameMap(rows, cells) {
        const field = mapGenerator.empty(rows, cells);
        let item;

        for (let y = 0; y <= rows; y++) {
            field[y] = [];

            for (let x = 0; x <= cells; x++) {
                if (y === 0 || y === rows || x === 0 || x === cells) {
                    item = type.wall;
                } else {
                    const rand = getRandomInt(0, 6);
                    switch (rand) {
                        case 3:
                            item = type.wall;
                            break;
                        case 4:
                            item = type.tree;
                            break;
                        default:
                            item = type.empty;
                            break;
                    }
                }

                field[y][x] = item;
            }
        }

        field[1][1] = type.animal;
        field[1][field[0].length - 2] = type.animal;
        field[field.length - 2][field[0].length - 2] = type.animal;
        field[field.length - 2][1] = type.animal;

        return field;
    }
}
const gameFieldGenerator = new GameFieldGenerator();