class Field {
    constructor(field) {
        if (typeof field === 'string') {
            field = this.parseString(field);
        }
        field[field.length - 2][field[0].length - 2] = empty;

        this.field = field;
        this.textarea = document.querySelector('#field');
        this.colectiveMind = new CollectiveMind(field);
        this.detectAnimals();
        this.draw();
    }

    getCoveragePercent(second) {
        let emptyFields = 0;
        let visitedFields = 0;

        for (let row of this.field) {
            for (let symbol of row) {
                if (symbol === empty) {
                    emptyFields++;
                }
                if (~[track, animal].indexOf(symbol)) {
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
        this.textarea.value = this.field.map(v => v.join('')).join('\n');
    }

    detectAnimals() {
        let id = 0;
        this.animals = [];
        for (let y in this.field) {
            for (let x in this.field[y]) {
                if (this.field[y][x] === animal) {
                    this.animals.push(new Animal(y, x, this.colectiveMind, id));
                }
            }
        }
    }

    start() {
        let i = 0;
        let startInterval = setInterval(() => {
                this.animals.map(a => a.step(this.field));

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
            if (~row.indexOf(empty)) {
                return true;
            }
        }

        return false;
    }
}