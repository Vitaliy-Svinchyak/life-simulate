"use strict";

/**
 * @property {int} y    - point row
 * @property {int} x    - point column
 */
class Point {
    /**
     * @param {int} y
     * @param {int} x
     */
    constructor(y, x) {
        this.y = y;
        this.x = x;
    }

    /**
     * @param {int} x
     * @param {int} y
     *
     * @returns {string}
     */
    static getKeyExternally(y, x) {
        return `${y}:${x}`;
    }
}
