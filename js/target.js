/**
 * @property {int} y        - target row
 * @property {int} x        - target column
 * @property {string} route - format is x:y->x:y-> etc...
 * @property {Target} parent
 */
class Target extends Point {
    /**
     * @param {int} y           - target row
     * @param {int} x           - target column
     * @param {Target} parent   - target from which current is built
     */
    constructor(y, x, parent) {
        super(y, x);
        this.parent = parent;

        this.fillRoute();
    }

    fillRoute() {
        const route = `${this.y}:${this.x}`;

        if (this.parent && this.parent.route) {
            this.route = `${this.parent.route}->${route}`;
        } else {
            this.route = route;
        }
    }

    /**
     * @param {int} y - target row
     * @param {int} x - target column
     */
    parentHasCoordinates(y, x) {
        return this.parent && this.parent.x === x && this.parent.y === y;
    }
}
