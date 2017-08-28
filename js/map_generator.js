class MapGenerator {

    constructor() {
        this.createdRooms = [];
        this.generated = false;
    }

    empty(rows, cells) {
        let field = [];
        let item;

        for (let y = 0; y <= rows; y++) {
            field[y] = [];

            for (let x = 0; x <= cells; x++) {
                if (y === 0 || y === rows || x === 0 || x === cells) {
                    item = type.wall;
                } else {
                    item = type.empty;
                }

                field[y][x] = item;
            }
        }

        return field;
    }

    rand(rows, cells) {
        let field = this.empty(rows, cells);
        let item;

        for (let y = 0; y <= rows; y++) {
            field[y] = [];

            for (let x = 0; x <= cells; x++) {
                if (y === 0 || y === rows || x === 0 || x === cells) {
                    item = type.wall;
                } else {
                    item = getRandomInt(0, 3) ? type.empty : type.wall;
                }

                field[y][x] = item;
            }
        }

        field[1][1] = type.animal;
        // field[1][2] = type.animal;
        // field[1][3] = type.animal;
        field[1][field[0].length - 2] = type.animal;
        field[field.length - 2][field[0].length - 2] = type.animal;
        field[field.length - 2][1] = type.animal;

        return field;
    }

    rooms(rows, cells) {
        this.minRoomSize = {x: 4, y: 4};
        this.maxRoomSize = {x: 10, y: 10};
        // this.field = this.empty(rows, cells);
        this.field = this.empty(rows, cells);
        this.fieldSize = {maxY: rows, maxX: cells};
        this.drawRooms();

        return this.field;
    }

    drawRooms() {
        this.cursorRectangle = {x: 0, y: 0};
        this.rawStart = {x: 0, y: 0};

        let i = 0;
        while (i < 150) {
            let room = this.getRandomRoomSize();
            this.cursorRectangle = this.drawRoom(this.cursorRectangle, room);

            if (this.cursorRectangle.x === this.fieldSize.maxX) {
                this.moveCursorToTheNewRow();
            }
            i++;
        }
    }

    moveCursorToTheNewRow() {
        let roomWithMaxY = this.createdRooms[0];

        for (let room of this.createdRooms) {
            if (room.start.x === 0 && room.end.y >= roomWithMaxY.end.y) {
                roomWithMaxY = room;
            }
        }

        this.cursorRectangle = {x: 0, y: roomWithMaxY.end.y};
        this.rawStart = JSON.parse(JSON.stringify(this.cursorRectangle));
    }

    drawRoom(cursorRectangle, room) {
        const roomEndX = cursorRectangle.x + room.x;
        const startY = this.getStartRowForRoom(roomEndX);
        const roomEndY = startY + room.y;
        const occupiedCells = {};

        for (let y = startY; y <= roomEndY; y++) {
            for (let x = cursorRectangle.x; x <= roomEndX; x++) {
                occupiedCells[`${y}:${x}`] = true;
            }
        }

        for (let y = startY; y <= roomEndY; y++) {
            if (!this.wallsIntersect(y, cursorRectangle.x)) {
                this.field[y][cursorRectangle.x] = type.wall;
            }

            if (!this.wallsIntersect(y, roomEndX)) {
                this.field[y][roomEndX] = type.wall;
            }
        }

        for (let x = cursorRectangle.x; x <= roomEndX; x++) {
            if (!this.wallsIntersect(startY, x)) {
                this.field[startY][x] = type.wall;
            }

            if (!this.wallsIntersect(roomEndY, x)) {
                this.field[roomEndY][x] = type.wall;
            }
        }

        this.createdRooms.push({
            start: {x: cursorRectangle.x, y: startY},
            end: {x: roomEndX, y: roomEndY},
            occupiedCells: occupiedCells
        });

        return {y: startY, x: roomEndX};
    }

    wallsIntersect(y, x) {
        for (const crossedRoom of this.crossedRooms) {
            if (crossedRoom.occupiedCells[`${y}:${x}`]) {
                return true;
            }
        }

        return false;
    }

    getStartRowForRoom(roomEndX) {
        let startY = this.cursorRectangle.y;
        this.crossedRooms = [];

        if (this.rawStart.y !== 0) {
            let coatingOfX = [];
            // We must cling to the "lowest" room in our range
            for (const room of this.createdRooms) {
                if (
                    !((room.end.x >= this.cursorRectangle.x && coatingOfX[room.end.x])
                    || (room.start.x <= roomEndX && coatingOfX[room.start.x]))
                ) {
                    continue;
                }

                coatingOfX = this.coatX(coatingOfX, room);

                if (room.end.y < startY) {
                    startY = room.end.y;
                }
            }

            for (const room of this.createdRooms) {
                if ((room.end.x >= this.cursorRectangle.x || room.start.x <= roomEndX) && room.end.y >= startY) {
                    this.crossedRooms.push(room);
                }
            }
        }

        return startY;
    }

    coatX(coatingOfX, room) {
        for (let x = this.cursorRectangle.x; x <= room.end.x; x++) {
            coatingOfX[x] = true;
        }

        return coatingOfX;
    }

    getRandomRoomSize() {
        let x = getRandomInt(this.minRoomSize.x, this.maxRoomSize.x);
        let y = getRandomInt(this.minRoomSize.y, this.maxRoomSize.y);

        if (this.cursorRectangle.x + x > this.fieldSize.maxX) {
            x = this.fieldSize.maxX - this.cursorRectangle.x;
        }

        if (this.cursorRectangle.y + y > this.fieldSize.maxY) {
            y = this.fieldSize.maxY - this.cursorRectangle.y;
        }

        if (this.cursorRectangle.x + x === this.fieldSize.maxX - 1) {
            x++;
        }

        if (this.cursorRectangle.y + y === this.fieldSize.maxY - 1) {
            y++;
        }

        if (this.cursorRectangle.x + x === this.maxRoomSize.x && this.cursorRectangle.y + y === this.maxRoomSize.y) {
            this.generated = true;
        }

        return {
            x: x,
            y: y
        }
    }
}

const mapGenerator = new MapGenerator();