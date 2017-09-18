"use strict";

class GameFieldGenerator {

    gameMap(rows, cells) {
        this.size = {y: rows, x: cells};
        this.fieldMap = mapGenerator.empty(rows, cells);
        let item;

        for (let y = 0; y <= rows; y++) {
            const yMap = this.fieldMap.get(y);
            for (let x = 0; x <= cells; x++) {
                if (y === 0 || y === rows || x === 0 || x === cells) {
                    item = type.rock;
                } else {
                    const rand = getRandomInt(0, 20);
                    switch (rand) {
                        case 3:
                            this.generateChain(y, x, type.rock);
                            break;
                        case 4:
                            this.generateChain(y, x, type.tree);
                            break;
                        default:
                            yMap.set(x, type.empty);
                            break;
                    }
                }
            }
        }
        this.fieldMap.get(1).set(1, type.human);
        this.fieldMap.get(1).set(this.fieldMap.get(0).size - 2, type.human);
        this.fieldMap.get(this.fieldMap.size - 2).set(this.fieldMap.get(0).size - 2, type.human);
        this.fieldMap.get(this.fieldMap.size - 2).set(1, type.human);

        return this.fieldMap;
    }

    generateChain(y, x, type) {
        let startY = y;
        let startX = x;

        for (let i = 0; i < 10; i++) {
            const variant = this.getRandomVariant(startY, startX);
            if (variant) {
                startY = variant.y;
                startX = variant.x;
                this.fieldMap.get(startY).set(startX, type);
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
            const yMap = this.fieldMap.get(y);

            for (let x = startX - 1; x <= startX + 1; x++) {
                if (!(y === 0 || y === this.size.y || x === 0 || x === this.size.x)
                    && solidObjects.indexOf(yMap.get(x)) === -1
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
            const yMap = this.fieldMap.get(y);

            for (let x = startX - 1; x <= startX + 1; x++) {
                if (solidObjects.indexOf(yMap.get(x)) !== -1) {
                    count++;
                }
            }
        }

        return count <= 2;
    }
}
const gameFieldGenerator = new GameFieldGenerator();