/**
 * @property {Animal[]} animals                 - all animals of the field
 * @property {CollectiveMind} colectiveMind
 * @property {HTMLTextAreaElement} textarea     - where we draw everything
 * @property {[]} cachedDrawResults
 * @property {[[Point]]} field
 */
class Field {

    /**
     * @param {[[Point]]|string} field
     */
    constructor(field) {
        let fieldArray = field;

        if (typeof field === 'string') {
            fieldArray = this.parseString(field);
        }

        this.field = fieldArray;
        this.textarea = document.querySelector('#field');
        this.cachedDrawResults = [];

        this.detectFieldSize();
        this.colectiveMind = new CollectiveMind(this);
        this.detectAnimals();
        this.draw();
    }

    getCoveragePercent(steps) {
        let emptyFields = 0;
        let visitedFields = 0;

        for (const row of this.field) {
            for (const symbol of row) {
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
     * Parses string representation of field (for simulating purposes)
     *
     * @param {string} string
     *
     * @returns {[*]}
     */
    parseString(string) {
        const rows = string.split('\n');

        return rows.map(s => s.split(''));
    }

    // todo try canvas draw, must be faster on big fields
    draw() {
        let text = '';

        for (let i = 0; i < this.fieldSize.rows; i++) {
            if (!this.cachedDrawResults[i] || this.changedRows[i]) {
                this.cachedDrawResults[i] = this.field[i].join('');
            }
            text += this.cachedDrawResults[i] + '\n';
        }

        this.textarea.value = text;
    }

    /**
     * Find all animals on the field and create objects for them
     */
    detectAnimals() {
        let id = 0;
        this.animals = [];

        for (let y = 0; y < this.fieldSize.rows; y++) {
            for (let x = 0; x < this.fieldSize.cells; x++) {
                if (this.field[y][x] === type.animal) {
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
        this.changedRows = {};

        for (const animal of this.animals) {
            const changedRowsByAnimal = animal.step(this.field);

            if (changedRowsByAnimal) {
                stepsCount++;
            }
            this.changedRows = Object.assign(this.changedRows, changedRowsByAnimal);
        }

        return stepsCount;
    }

    /**
     * @return {boolean}
     */
    hasEmptyFields() {
        const canGo = this.animals.filter(a => a.canGo());

        if (!canGo.length) {
            return false;
        }

        for (const row of this.field) {
            if (~row.indexOf(type.empty)) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param {Target} routeVariant
     */
    drawRoute(routeVariant) {
        const points = routeVariant.getRouteArray();

        for (const point of points) {
            this.field[point.y][point.x] = type.route;
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
            rows: this.field.length,
            cells: this.field[0].length,
        };
    }
}