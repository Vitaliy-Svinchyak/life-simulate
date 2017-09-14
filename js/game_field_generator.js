"use strict";

class GameFieldGenerator {

    gameMap(rows, cells) {
        this.size = {y: rows, x: cells};
        this.field = mapGenerator.empty(rows, cells);
        let item;

        for (let y = 0; y <= rows; y++) {
            for (let x = 0; x <= cells; x++) {
                if (y === 0 || y === rows || x === 0 || x === cells) {
                    item = type.wall;
                } else {
                    const rand = getRandomInt(0, 20);
                    switch (rand) {
                        case 3:
                            this.generateChain(y, x, type.wall);
                            break;
                        case 4:
                            this.generateChain(y, x, type.tree);
                            break;
                        default:
                            this.field[y][x] = type.empty;
                            break;
                    }
                    // const rand = getRandomInt(0, 6);
                    // switch (rand) {
                    //     case 3:
                    //         item = type.wall;
                    //         break;
                    //     case 4:
                    //         item = type.tree;
                    //         break;
                    //     default:
                    //         item = type.empty;
                    //         break;
                    // }
                }

                // this.field[y][x] = item;
            }
        }

        this.field[1][1] = type.animal;
        this.field[1][this.field[0].length - 2] = type.animal;
        this.field[this.field.length - 2][this.field[0].length - 2] = type.animal;
        this.field[this.field.length - 2][1] = type.animal;

        return this.field;
    }

    generateChain(y, x, type) {
        let startY = y;
        let startX = x;

        for (let i = 0; i < 10; i++) {
            const variant = this.getRandomVariant(startY, startX);
            if (variant) {
                startY = variant.y;
                startX = variant.x;
                this.field[startY][startX] = type;
            }
        }
    }

    getRandomVariant(y, x) {
        const variants = this.getPossiblePointsToGo(y, x);
        return variants[getRandomInt(0, variants.length - 1)]
    }

    getPossiblePointsToGo(startY, startX) {
        const variants = [];

        for (let y = startY - 1; y <= startY + 1; y++) {
            for (let x = startX - 1; x <= startX + 1; x++) {
                if (!(y === 0 || y === this.size.y || x === 0 || x === this.size.x)
                    && solidObjects.indexOf(this.field[y][x]) === -1
                    && this.nearIsEmpty(y, x)
                ) {
                    variants.push({x: x, y: y});
                }
            }
        }

        return variants;
    }

    nearIsEmpty(startY, startX) {
        let count = 0;
        for (let y = startY - 1; y <= startY + 1; y++) {
            for (let x = startX - 1; x <= startX + 1; x++) {
                if (solidObjects.indexOf(this.field[y][x]) !== -1) {
                    count++;
                }
            }
        }

        return count <= 2;
    }
}
const gameFieldGenerator = new GameFieldGenerator();