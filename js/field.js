"use strict";

/**
 * @property {Human[]} humans                 - all humans of the fieldMap
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
    }

    init() {
        this.detectFieldSize();
        this.painter = window.serviceLocator.get(Painter);
        this.collectiveMind = window.serviceLocator.get(CollectiveMind);
        this.detectHumans();
        this.draw();
        this.collectiveMind.setHumans(this.humans);
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
     * Find all humans on the fieldMap and create objects for them
     */
    detectHumans() {
        let id = 0;
        this.humans = [];

        for (let y = 0; y < this.fieldSize.rows; y++) {
            const yMap = this.fieldMap.get(y);

            for (let x = 0; x < this.fieldSize.cells; x++) {
                if (yMap.get(x) === type.human) {
                    const human = window.serviceLocator.create('Human', [y, x, id]);
                    this.humans.push(human);
                    id++;
                }
            }
        }
    }

    /**
     * Start the game and statistic Interval
     */
    start() {
        const startInterval = setInterval(
            () => {
                this.makeSteps();
                this.draw();

                if (!this.hasEmptyFields()) {
                    clearInterval(startInterval);
                    console.info('STOP');
                }
            },
            stepSpeed
        );
    }

    /**
     * Make step for all humans
     */
    makeSteps() {
        this.movesOnThisStep = this.collectiveMind.step();
    }

    /**
     * @return {boolean}
     */
    hasEmptyFields() {
        return this.humans.filter(a => a.canGo()).length > 0;
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
     * @returns {Human|null}
     */
    detectHumanByCoordinates(coordinate) {
        for (const human of this.humans) {
            if (human.y === coordinate.y && human.x === coordinate.x) {
                return human;
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