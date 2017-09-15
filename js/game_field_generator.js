"use strict";

class GameFieldGenerator {

    gameMap(rows, cells) {
        this.size = {y: rows, x: cells};
        this.fieldMap = mapGenerator.empty(rows, cells);

        for (let y = 0; y <= rows; y++) {
            const yMap = this.fieldMap.get(y);
            for (let x = 0; x <= cells; x++) {
                if (!(y === 0 || y === rows || x === 0 || x === cells)) {
                    const chance = getRandomInt(0, 100);

                    switch (true) {
                        case inRange(chance, 97, 98):
                            this.generateChain(y, x, type.wall);
                            break;
                        case inRange(chance, 100, 100):
                            this.generateMassif(y, x, type.tree);
                            break;
                        default:
                            if (!yMap.has(x)) {
                                yMap.set(x, type.empty);
                            }
                            break;
                    }
                }
            }
        }

        this.fieldMap.get(1).set(1, type.animal);
        this.fieldMap.get(1).set(2, type.animal);
        this.fieldMap.get(2).set(1, type.animal);
        this.fieldMap.get(2).set(2, type.animal);
        // this.fieldMap.get(1).set(this.fieldMap.get(0).size - 2, type.animal);
        // this.fieldMap.get(this.fieldMap.size - 2).set(this.fieldMap.get(0).size - 2, type.animal);
        // this.fieldMap.get(this.fieldMap.size - 2).set(1, type.animal);

        return this.fieldMap;
    }

    /**
     * @param {int} startY
     * @param {int} startX
     * @param {string} fieldType
     */
    generateMassif(startY, startX, fieldType) {
        const sizeX = getRandomInt(2, Math.floor(this.size.x / 25));
        const sizeY = getRandomInt(2, Math.floor(this.size.y / 25));
        const endX = startX + sizeX;
        const endY = startY + sizeY;

        for (let y = 0; y <= sizeY; y++) {
            const yMap = this.fieldMap.get(y + startY);
            if (!yMap || y + startY === this.size.y) {
                continue;
            }

            for (let x = 0; x <= sizeX; x++) {
                if (x + startX === this.size.x) {
                    continue;
                }

                let newType = fieldType;
                if (
                    (x + startX === endX || x + startX === startX)
                    ^ (y + startY === endY || y + startY === startY)
                ) {
                    newType = getRandomInt(0, 1) ? type.empty : fieldType;
                }

                yMap.set(x + startX, newType);
            }

        }
    }

    /**
     * @param {int} y
     * @param {int} x
     * @param {string} fieldType
     */
    generateChain(y, x, fieldType) {
        let startY = y;
        let startX = x;
        let length = this.size.y / 10;

        for (let i = 0; i < length; i++) {
            const variant = this.getRandomVariant(startY, startX);
            if (variant) {
                startY = variant.y;
                startX = variant.x;
                this.fieldMap.get(startY).set(startX, fieldType);
            }
        }
    }

    /**
     * @param {int} y
     * @param {int} x
     * @returns {Point}
     */
    getRandomVariant(y, x) {
        const variants = this.getPossiblePointsToGo(y, x);
        return variants[getRandomInt(0, variants.length - 1)]
    }

    /**
     * @param {int} startY
     * @param {int} startX
     * @returns {Array}
     */
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

    /**
     * @param {int} startY
     * @param {int} startX
     * @returns {boolean}
     */
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
