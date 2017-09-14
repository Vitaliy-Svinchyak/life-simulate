"use strict";

/**
 * @property {Animal[]} animals                 - all animals of the fieldMap
 * @property {CollectiveMind} collectiveMind
 * @property {HTMLTextAreaElement} textarea     - where we draw everything
 * @property {[[Point]]} fieldMap
 */
class Field {

    /**
     * @param {[[Point]]|string} field
     */
    constructor(field) {
        let fieldMap = field;

        if (typeof field === 'string') {
            fieldMap = this.parseString(field);
        }

        this.fieldMap = fieldMap;
        this.detectFieldSize();
        this.painter = new Painter(document.querySelector('#canvas-field'), this);
        this.colectiveMind = new CollectiveMind(this);
        this.detectAnimals();
        this.draw();
    }

    getCoveragePercent(steps) {
        let emptyFields = 0;
        let visitedFields = 0;

        for (const [key, row] of this.fieldMap) {
            for (const [key, symbol] of row) {
                if (symbol === type.empty) {
                    emptyFields++;
                }

                if (~[type.track, type.animal].indexOf(symbol)) {
                    visitedFields++;
                }
            }
        }

        const totalCount = emptyFields + visitedFields;
        const percent = Math.floor(visitedFields / totalCount * 100);

        console.info(`${percent}% - ${steps} steps`);
    }

    /**
     * Parses string representation of fieldMap (for simulating purposes)
     *
     * @param {string} string
     *
     * @returns {[*]}
     */
    parseString(string) {
        const rows = string.split('\n');

        return rows.map(s => s.split(''));
    }

    draw() {
        this.painter.draw();
    }

    /**
     * Find all animals on the fieldMap and create objects for them
     */
    detectAnimals() {
        let id = 0;
        this.animals = [];

        for (let y = 0; y < this.fieldSize.rows; y++) {
            const yMap = this.fieldMap.get(y);

            for (let x = 0; x < this.fieldSize.cells; x++) {
                if (yMap.get(x) === type.animal) {
                    this.animals.push(new Animal(y, x, this.colectiveMind, id));
                    id++;
                }
            }
        }
    }

    /**
     * Start the game and statistic Interval
     */
    start() {
        let stepsCount = 0;
        const startInterval = setInterval(
            () => {
                stepsCount = this.makeSteps(stepsCount);
                this.draw();

                if (!this.hasEmptyFields()) {
                    clearInterval(startInterval);
                    console.info('STOP');
                }
            },
            stepSpeed
        );

        const infoInterval = setInterval(
            () => {
                this.getCoveragePercent(stepsCount);

                if (!this.hasEmptyFields()) {
                    clearInterval(infoInterval);
                }
            },
            statisticSpeed
        );
    }

    /**
     * Make step for all animals
     *
     * @param {int} stepsCount
     *
     * @return {int}
     */
    makeSteps(stepsCount) {
        this.movesOnThisStep = [];

        for (const animal of this.animals) {
            const animalStep = animal.step(this.fieldMap);

            if (animalStep) {
                stepsCount++;
                this.movesOnThisStep.push(animalStep);
            }
        }

        return stepsCount;
    }

    /**
     * @return {boolean}
     */
    hasEmptyFields() {
        return this.animals.filter(a => a.canGo()).length > 0;
    }

    /**
     * @param {Target} routeVariant
     */
    drawRoute(routeVariant) {
        const points = routeVariant.getRouteArray();

        for (const point of points) {
            this.fieldMap.get(point.y).set(point.x, type.route);
        }
    }

    /**
     * @param {Point} coordinate
     *
     * @returns {Animal|null}
     */
    detectAnimalByCoordinates(coordinate) {
        for (const animal of this.animals) {
            if (animal.y === coordinate.y && animal.x === coordinate.x) {
                return animal;
            }
        }

        return null;
    }

    detectFieldSize() {
        this.fieldSize = {
            rows: this.fieldMap.size,
            cells: this.fieldMap.get(0).size,
        };
    }
}