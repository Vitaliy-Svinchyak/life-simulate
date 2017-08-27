class Field {

    constructor(field) {
        if (typeof field === 'string') {
            field = this.parseString(field);
        }

        // field[1][field[0].length - 2] = type.empty;
        // field[field.length - 2][field[0].length - 2] = type.empty;
        // field[field.length - 2][1] = type.empty;

        this.field = field;
        this.textarea = document.querySelector('#field');
        this.colectiveMind = new CollectiveMind(this);
        this.cachedDrawResults = [];

        this.detectAnimals();
        this.draw();
    }

    getCoveragePercent(second) {
        return;
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

    draw() {
        console.time('draw');
        let text = '';
        let fieldLength = this.field.length;

        for (let i = 0; i < fieldLength; i++) {
            if (!this.cachedDrawResults[i]) {
                this.cachedDrawResults[i] = this.field[i].join('');
            } else if (this.changedRows[i]) {
                this.cachedDrawResults[i] = this.field[i].join('');
            }

            text += this.cachedDrawResults[i] + '\n';
        }

        this.textarea.value = text;
        console.timeEnd('draw');
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
        let i = 0;
        let startInterval = setInterval(() => {
                this.changedRows = {};
                for (let animal of this.animals) {
                    let changedRowsByAnimal = animal.step(this.field);
                    this.changedRows = Object.assign(this.changedRows, changedRowsByAnimal);
                }

                this.draw();
                i++;

                if (!this.hasEmptyFields()) {
                    clearInterval(startInterval);
                    console.log('STOP');
                }
            },
            speed);

        let infoInterval = setInterval(() => {
                this.getCoveragePercent(i);

                if (!this.hasEmptyFields()) {
                    clearInterval(infoInterval);
                }
            },
            1000);
    }

    hasEmptyFields() {
        let canGo = this.animals.filter(a => !a.cantGo);
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

    drawRoute(routeVariant) {
        let coordinates = routeVariant.route.split('->');
        for (let coordinate of coordinates) {
            let c = coordinate.split(':');
            this.field[c[0]][c[1]] = type.route;
        }
    }

    detectAnimalByCoordinates(coordinate) {
        for (let animal of this.animals) {
            if (animal.y === coordinate.y && animal.x === coordinate.x) {
                return animal;
            }
        }
    }
}