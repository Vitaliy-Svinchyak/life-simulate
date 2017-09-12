/**
 * @property {Animal[]} animals    - all animals of the field
 */
class Field {

    /**
     * @param {[[Point]]} field
     */
    constructor(field) {
        let fieldArray = field;

        if (typeof field === 'string') {
            fieldArray = this.parseString(field);
        }

        this.field = fieldArray;
        this.textarea = document.querySelector('#field');
        this.colectiveMind = new CollectiveMind(this);
        this.cachedDrawResults = [];

        this.detectAnimals();
        this.draw();
    }

    getCoveragePercent(second) {
        let emptyFields = 0;
        let visitedFields = 0;

        for (let row of this.field) {
            for (let symbol of row) {
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
        console.log(`${percent}% - ${second} steps`);
    }

    // todo try split speed
    parseString(string) {
        const field = [[]];
        let row = 0;

        for (let symbol of string) {
            if (symbol === '\n') {
                row++;
                field[row] = [];
                continue;
            }

            field[row].push(symbol);
        }

        return field;
    }

    // todo try canvas draw, must be faster on big fields
    draw() {
        let text = '';
        let fieldLength = this.field.length;

        for (let i = 0; i < fieldLength; i++) {
            if (!this.cachedDrawResults[i] || this.changedRows[i]) {
                this.cachedDrawResults[i] = this.field[i].join('');
            }
            text += this.cachedDrawResults[i] + '\n';
        }

        this.textarea.value = text;
    }

    detectAnimals() {
        let id = 0;
        this.animals = [];
        let rowsCount = this.field.length;
        let cellsCount = this.field[0].length;

        for (let y = 0; y < rowsCount; y++) {
            for (let x = 0; x < cellsCount; x++) {
                if (this.field[y][x] === type.animal) {
                    this.animals.push(new Animal(y, x, this.colectiveMind, id));
                }
            }
        }
    }

    start() {
        let stepsCount = 0;
        let startInterval = setInterval(
            () => {
                stepsCount = this.makeSteps(stepsCount);
                this.draw();

                if (!this.hasEmptyFields()) {
                    clearInterval(startInterval);
                    console.log('STOP');
                }
            },
            stepSpeed
        );

        let infoInterval = setInterval(
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

        for (let animal of this.animals) {
            let changedRowsByAnimal = animal.step(this.field);
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
        let canGo = this.animals.filter(a => a.canGo());

        if (!canGo.length) {
            return false;
        }

        for (let row of this.field) {
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
        let coordinates = routeVariant.route.split('->');

        for (let coordinate of coordinates) {
            let c = coordinate.split(':');
            this.field[c[0]][c[1]] = type.route;
        }
    }

    /**
     * @param {Point} coordinate
     *
     * @returns {Animal|null}
     */
    detectAnimalByCoordinates(coordinate) {
        for (let animal of this.animals) {
            if (animal.y === coordinate.y && animal.x === coordinate.x) {
                return animal;
            }
        }

        return null;
    }
}