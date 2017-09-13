/**
 * @property {Animal[]} animals                 - all animals of the field
 * @property {CollectiveMind} collectiveMind
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
        this.canvas = document.querySelector('#canvas-field');
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
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

    draw() {
        if (!this.fieldReady) {
            this.drawCanvasField();
        } else {
            for (let move of this.movesOnThisStep) {
                let formYDraw = this.defaultY + (move.from.y * this.pointSize.y) + move.from.y;
                let formXDraw = this.defaultX + (move.from.x * this.pointSize.x) + move.from.x;
                this.drawTrack(formXDraw, formYDraw);

                let yDraw = this.defaultY + (move.to.y * this.pointSize.y) + move.to.y;
                let xDraw = this.defaultX + (move.to.x * this.pointSize.x) + move.to.x;
                this.drawAnimal(xDraw, yDraw);
            }
        }
    }

    drawCanvasField() {
        this.fieldReady = true;
        this.pointSize = this.calculatePointSize();
        this.context = this.canvas.getContext("2d");

        this.defaultY = Math.floor((window.innerHeight - ((this.pointSize.y + 1) * this.fieldSize.rows)) / 2);
        this.defaultX = Math.floor((window.innerWidth - ((this.pointSize.x + 1) * this.fieldSize.cells)) / 2);

        let yDraw = this.defaultY;

        for (let y = 0; y < this.fieldSize.rows; y++) {
            let xDraw = this.defaultX;

            for (let x = 0; x < this.fieldSize.cells; x++) {
                this.context.fillStyle = "black";
                if (this.field[y][x] === type.wall) {
                    this.context.fillRect(xDraw, yDraw, this.pointSize.x, this.pointSize.y);
                } else if (this.field[y][x] === type.animal) {
                    this.drawAnimal(xDraw, yDraw);
                }
                xDraw += this.pointSize.x + this.pointSize.margin;
            }
            yDraw += this.pointSize.y + this.pointSize.margin;
        }
    }

    drawAnimal(xDraw, yDraw) {
        this.clearRect(xDraw, yDraw);
        let x = Math.floor(xDraw + this.pointSize.x / 2);
        let y = Math.floor(yDraw + this.pointSize.y / 2);
        let radius = Math.floor(this.pointSize.y / 2) - 2;

        this.context.beginPath();
        this.context.fillStyle = 'red';
        this.context.strokeStyle = 'red';
        this.context.arc(x, y, radius, 0, 2 * Math.PI);
        this.context.fill();
        this.context.stroke();
    }

    drawTrack(xDraw, yDraw) {
        this.clearRect(xDraw, yDraw);

        this.context.beginPath();
        this.context.moveTo(xDraw, yDraw);
        this.context.lineTo(xDraw + this.pointSize.x, yDraw + this.pointSize.y);
        this.context.stroke();

        this.context.beginPath();
        this.context.moveTo(xDraw + this.pointSize.x, yDraw);
        this.context.lineTo(xDraw, yDraw + this.pointSize.y);
        this.context.stroke();
    }

    clearRect(xDraw, yDraw) {
        this.context.fillStyle = 'white';
        this.context.strokeStyle = 'black';
        this.context.fillRect(xDraw, yDraw, this.pointSize.x, this.pointSize.y);
        this.context.fillStyle = 'black';
    }

    calculatePointSize() {
        let xSize = Math.floor((window.innerHeight - this.fieldSize.cells) / (this.fieldSize.cells + 1));
        let ySize = Math.floor((window.innerWidth - this.fieldSize.rows ) / (this.fieldSize.rows + 1));
        // uncomment for full screen (but with blur)
        // xSize = parseFloat(((window.innerHeight - this.fieldSize.cells) / (this.fieldSize.cells + 1)).toFixed(1));
        // ySize = parseFloat(((window.innerWidth - this.fieldSize.rows ) / (this.fieldSize.rows + 1)).toFixed(1));

        let size = ySize > xSize ? xSize : ySize;
        if (size < 2) {
            size = 2;
        }

        return {y: size, x: size, margin: 1};
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
        this.movesOnThisStep = [];

        for (const animal of this.animals) {
            const animalStep = animal.step(this.field);

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