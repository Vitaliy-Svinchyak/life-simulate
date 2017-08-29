class MapGenerator {

    constructor() {
        this.createdRooms = [];
        this.generated = false;
        this.minYOnRow = -1;
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
        this.minRoomSize = {x: 5, y: 5};
        this.maxRoomSize = {x: 9, y: 9};
        this.field = this.empty(rows, cells);
        this.fieldSize = {maxY: rows, maxX: cells};
        console.time('rooms');
        this.drawRooms();
        // this.clearFatWalls();
        console.timeEnd('rooms');
        return this.field;
    }

    clearIt(field) {
        this.field = field;
        this.clearFatWalls();
        return this.field;
    }

    clearFatWalls() {
        for (let y = 1; y < this.fieldSize.maxY; y++) {
            xFor: for (let x = 1; x < this.fieldSize.maxX; x++) {
                if (this.field[y][x] !== type.wall) {
                    continue xFor;
                }

                if (this.canDelete(y, x)) {
                    this.field[y][x] = type.animal;
                }

                // if (
                //     this.isSideWall(y, x)
                //     && this.isSideWall(y, x + 1)
                //     && !this.isTopOrBottomWall(y, x)
                //     && !this.isTopOrBottomWall(y, x + 1)
                //     && this.field[y][x + 1] === type.wall) {
                //     this.field[y][x] = type.animal;
                // }
                //
                // if (this.isTopOrBottomWall(y, x)
                //     && this.isTopOrBottomWall(y + 1, x)
                //     && !this.isSideWall(y, x)
                //     && !this.isSideWall(y + 1, x )
                //     && this.field[y + 1][x] === type.wall) {
                //     this.field[y][x] = type.empty;
                // }
            }
        }
    }

    test() {
        const falsevariants = [
            // 3-conner
            `010
           011
           010`,
            `000
           111
           010`,
            `010
           110
           010`,
            `010
           111
           000`,
            // full-3-conner
            `011
           011
           000`,
            `110
           110
           000`,
            `000
           110
           110`,
            `000
           011
           011`,
            // 2-conner
            `010
           011
           000`,
            `000
           011
           010`,
            `000
           110
           010`,
            `010
           110
           000`,
            // 4-conner
            `010
           111
           010`,
        ];

        const trueVariants = [
            // half-wall
            `011
            011
            011`,
            `111
            111
            000`,
            `110
            110
            110`,
            `000
            111
            111`,
            // chair-wall
            `011
            011
            001`,
            `001
            011
            011`,
            `110
            110
            100`,
            `100
            110
            110`,
            `100
            111
            111`,
            `111
            111
            100`,
            `100
            111
            111`,
            `111
            111
            001`,
            // tetris
            `011
            111
            011`,
            `111
            111
            010`,
            `110
            111
            110`,
            `010
            111
            111`,
            //boot
            `011
            011
            011`,
            `111
            111
            000`,
            `110
            110
            110`,
            `000
            111
            111`,
            // full
            `111
            111
            111`,
        ];
    }

    canDelete(y, x) {
        return this.getMap(y, x) > 3;
    }

    getMap(y, x) {
        let map = '';

        for (let yCheck = y - 1; yCheck <= y + 1; yCheck++) {
            for (let xCheck = x - 1; xCheck <= x + 1; xCheck++) {
                if (this.field[yCheck][xCheck] === type.wall) {
                    map += '1';
                } else {
                    map += '0';
                }
            }
        }

        return map;
    }

    isSideWall(y, x) {
        for (let room of this.createdRooms) {
            if ((room.start.x === x || room.end.x === x) && room.start.y < y && room.end.y > y) {
                return true;
            }
        }
        return false;
    }

    isTopOrBottomWall(y, x) {
        for (let room of this.createdRooms) {
            if ((room.start.y === y || room.end.y === y) && room.start.x < x && room.end.x > x) {
                return true;
            }
        }
        return false;
    }

    drawRooms() {
        this.cursorRectangle = {x: 0, y: 0};
        this.rawStart = {x: 0, y: 0};

        while (!this.generated) {
            const room = this.getRandomRoomSize();
            this.cursorRectangle = this.drawRoom(this.cursorRectangle, room);

            if (this.cursorRectangle.x === this.fieldSize.maxX) {
                this.moveCursorToTheNewRow();
                this.minYOnRow = -1;
            }
        }
    }

    moveCursorToTheNewRow() {
        if (this.rawStart.y === this.fieldSize.maxY) {
            this.generated = true;
        }

        let roomWithMaxY = this.createdRooms[0];

        for (const room of this.createdRooms) {
            if (room.start.x === 0 && room.end.y >= roomWithMaxY.end.y) {
                roomWithMaxY = room;
            }
        }

        this.cursorRectangle = {x: 0, y: roomWithMaxY.end.y};
        this.rawStart = JSON.parse(JSON.stringify(this.cursorRectangle));
    }

    drawRoom(cursorRectangle, room) {
        const roomEndX = cursorRectangle.x + room.x;
        const startY = this.getStartRowForRoom(this.cursorRectangle.x, roomEndX);
        let roomEndY = startY + room.y;

        if (roomEndY > this.fieldSize.maxY) {
            roomEndY = this.fieldSize.maxY;
        }

        if (roomEndY + 1 === this.fieldSize.maxY) {
            roomEndY = this.fieldSize.maxY;
        }

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

        if (this.minYOnRow > roomEndY || this.minYOnRow === -1) {
            this.minYOnRow = roomEndY;
        }


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

    getStartRowForRoom(startX, roomEndX) {
        let startY = this.cursorRectangle.y;
        this.crossedRooms = [];

        if (this.rawStart.y !== 0) {
            let wallsInRange = [];
            let targetCoating = roomEndX - startX;

            // We must cling to the "lowest" room in our range
            for (const room of this.createdRooms.reverse()) {
                if ((room.start.x >= startX && room.start.x <= roomEndX) || (room.end.x >= startX && room.end.x <= roomEndX)) {
                    wallsInRange = wallsInRange.concat(this.getWallsInRange(room, this.cursorRectangle.x, roomEndX));
                }

                // if (wallsInRange.length >= targetCoating) {
                //     break;
                // }
            }

            wallsInRange = this.deleteDuplications(wallsInRange);
            startY = this.findMinY(wallsInRange);

            for (const room of this.createdRooms) {
                if ((room.end.x >= this.cursorRectangle.x || room.start.x <= roomEndX) && room.end.y >= startY) {
                    this.crossedRooms.push(room);
                }
            }
        }

        return startY;
    }

    deleteDuplications(wallsInRange) {
        const filtered = [];

        for (const wall of wallsInRange) {
            let deleteIt = false;
            const wallCoordinates = wall.split(':');

            for (const wallToCompare of wallsInRange) {
                const wallToCompareCoordinates = wallToCompare.split(':');
                if (+wallCoordinates[1] === +wallToCompareCoordinates[1] && +wallCoordinates[0] < +wallToCompareCoordinates[0]) {
                    deleteIt = true;
                }
            }

            if (!deleteIt) {
                filtered.push(wall);
            }
        }

        return filtered;
    }

    findMinY(wallsInRange) {
        let minY = +wallsInRange[0].split(':')[0];

        for (const wall of wallsInRange) {
            const wallCoordinates = wall.split(':');

            if (+wallCoordinates[0] < minY) {
                minY = +wallCoordinates[0];
            }
        }

        return minY;
    }

    getWallsInRange(room, startX, endX) {
        const keys = Object.keys(room.occupiedCells);

        const allCells = keys.filter(v => {
            const xCoordinate = +v.split(':')[1];
            return xCoordinate >= startX && xCoordinate <= endX;
        });

        return allCells.filter(v => {
            const coordinates = v.split(':');
            return allCells.indexOf((+coordinates[0] + 1) + ':' + coordinates[1]) === -1;
        });
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

        return {
            x: x,
            y: y
        }
    }
}

const mapGenerator = new MapGenerator();