class Field {

    constructor(field) {
        if (typeof field === 'string') {
            field = this.parseString(field);
        }

        // field[field.length - 2][field[0].length - 2] = type.empty;
        this.field = field;
        this.textarea = document.querySelector('#field');
        this.colectiveMind = new CollectiveMind(this);

        this.detectAnimals();
        this.draw();
    }

    getCoveragePercent(second) {
        // return;
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
        this.textarea.value = this.field.map(v => v.join('')).join('\n');
    }

    detectAnimals() {
        let id = 0;
        this.animals = [];

        for (let y in this.field) {
            for (let x in this.field[y]) {
                if (this.field[y][x] === type.animal) {
                    this.animals.push(new Animal(y, x, this.colectiveMind, id));
                }
            }
        }
    }

    start() {
        let i = 0;
        let startInterval = setInterval(() => {
                for (let animal of this.animals) {
                    animal.step(this.field);
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
        console.log(coordinates.length);
        for (let coor of coordinates) {
            let c = coor.split(':');
            this.field[c[0]][c[1]] = type.route;
        }
    }
}