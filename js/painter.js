class Painter {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Field} field
     */
    constructor(canvas, field) {
        this.canvas = canvas;
        this.canvas.height = window.innerHeight;
        this.canvas.width = window.innerWidth;
        this.field = field;
        this.wallImg = new Image();
        this.wallImg.src = 'images/wall.png';
        this.treeImg = new Image();
        this.treeImg.src = 'images/tree.png';
        this.humanImg = new Image();
        this.humanImg.src = 'images/human.png';
    }

    draw() {
        if (!this.fieldReady) {
            this.drawCanvasField();
        } else {
            for (const move of this.field.movesOnThisStep) {
                const formYDraw = this.defaultY + (move.from.y * this.pointSize.y) + move.from.y;
                const formXDraw = this.defaultX + (move.from.x * this.pointSize.x) + move.from.x;
                this.drawTrack(formXDraw, formYDraw);

                const yDraw = this.defaultY + (move.to.y * this.pointSize.y) + move.to.y;
                const xDraw = this.defaultX + (move.to.x * this.pointSize.x) + move.to.x;
                this.drawHuman(xDraw, yDraw);
            }
        }
    }

    /**
     * For first draw
     */
    drawCanvasField() {
        this.fieldReady = true;
        this.pointSize = this.calculatePointSize();
        this.context = this.canvas.getContext("2d");

        this.defaultY = Math.floor((window.innerHeight - ((this.pointSize.y + 1) * this.field.fieldSize.rows)) / 2);
        this.defaultX = Math.floor((window.innerWidth - ((this.pointSize.x + 1) * this.field.fieldSize.cells)) / 2);

        let yDraw = this.defaultY;

        for (let y = 0; y < this.field.fieldSize.rows; y++) {
            let xDraw = this.defaultX;

            for (let x = 0; x < this.field.fieldSize.cells; x++) {
                if (this.field.field[y][x] === type.wall) {
                    this.drawWall(xDraw, yDraw);
                } else if (this.field.field[y][x] === type.tree) {
                    this.drawTree(xDraw, yDraw);
                } else if (this.field.field[y][x] === type.animal) {
                    this.drawHuman(xDraw, yDraw);
                }
                xDraw += this.pointSize.x + this.pointSize.margin;
            }
            yDraw += this.pointSize.y + this.pointSize.margin;
        }
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawWall(xDraw, yDraw) {
        this.context.drawImage(this.wallImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawHuman(xDraw, yDraw) {
        this.context.drawImage(this.humanImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawTree(xDraw, yDraw) {
        this.context.drawImage(this.treeImg, xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    drawTrack(xDraw, yDraw) {
        this.clearRect(xDraw, yDraw);
        this.context.fillStyle = 'rgba(128, 128, 128, 0.25)';
        this.context.fillRect(xDraw, yDraw, this.pointSize.x, this.pointSize.y);
        this.context.fill();
    }

    /**
     * @param {int} xDraw
     * @param {int} yDraw
     */
    clearRect(xDraw, yDraw) {
        this.context.clearRect(xDraw, yDraw, this.pointSize.x, this.pointSize.y);
    }

    calculatePointSize() {
        let xSize = Math.floor((window.innerHeight - this.field.fieldSize.cells) / (this.field.fieldSize.cells + 1));
        let ySize = Math.floor((window.innerWidth - this.field.fieldSize.rows ) / (this.field.fieldSize.rows + 1));
        // uncomment for full screen (but with blur)
        // xSize = parseFloat(((window.innerHeight - this.field.fieldSize.cells) / (this.field.fieldSize.cells + 1)).toFixed(1));
        // ySize = parseFloat(((window.innerWidth - this.field.fieldSize.rows ) / (this.field.fieldSize.rows + 1)).toFixed(1));

        let size = ySize > xSize ? xSize : ySize;
        if (size < 2) {
            size = 2;
        }

        return {y: size, x: size, margin: 1};
    }
}