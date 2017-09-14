"use strict";

class Painter {
    /**
     * @param {HTMLCanvasElement} canvas
     * @param {Field} field
     */
    constructor(canvas, field) {
        this.canvas = canvas;
        this.fieldMap = field;
        this.pointSize = this.calculatePointSize();
        this.setCanvasSize();

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
            for (const move of this.fieldMap.movesOnThisStep) {
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
        this.context = this.canvas.getContext("2d");

        if (this.canvas.width > window.innerWidth || this.canvas.height > window.innerHeight) {
            this.defaultY = 0;
            this.defaultX = 0;
        } else {
            this.defaultY = Math.floor((window.innerHeight - ((this.pointSize.y + 1) * this.fieldMap.fieldSize.rows)) / 2);
            this.defaultX = Math.floor((window.innerWidth - ((this.pointSize.x + 1) * this.fieldMap.fieldSize.cells)) / 2);
        }

        let yDraw = this.defaultY;

        for (let y = 0; y < this.fieldMap.fieldSize.rows; y++) {
            let xDraw = this.defaultX;
            const yMap = this.fieldMap.fieldMap.get(y);

            for (let x = 0; x < this.fieldMap.fieldSize.cells; x++) {
                if (yMap.get(x) === type.wall) {
                    this.drawWall(xDraw, yDraw);
                } else if (yMap.get(x) === type.tree) {
                    this.drawTree(xDraw, yDraw);
                } else if (yMap.get(x) === type.animal) {
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
        this.context.fillStyle = 'rgba(128, 128, 128, 0.35)';
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
        let xSize = Math.floor((window.innerHeight - this.fieldMap.fieldSize.cells) / (this.fieldMap.fieldSize.cells + 1));
        let ySize = Math.floor((window.innerWidth - this.fieldMap.fieldSize.rows ) / (this.fieldMap.fieldSize.rows + 1));

        let size = ySize > xSize ? xSize : ySize;
        if (size < 8) {
            size = 8;
        }
        if (size > 32) {
            size = 32;
        }

        return {y: size, x: size, margin: 1};
    }

    setCanvasSize() {
        let height = (this.pointSize.y + 1) * this.fieldMap.fieldSize.rows;
        let width = (this.pointSize.x + 1) * this.fieldMap.fieldSize.cells;

        if (height < window.innerHeight || width < window.innerWidth) {
            height = window.innerHeight;
            width = window.innerWidth;
            document.body.style.overflow = 'hidden';
        }

        this.canvas.height = height;
        this.canvas.width = width;
    }
}