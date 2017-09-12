/**
 * @property {int} y        - target row
 * @property {int} x        - target column
 * @property {string} route - format is x:y->x:y-> etc...
 * @property {Target} parent
 */
class Target {
    constructor(y, x, route, parent) {
        this.y = y;
        this.x = x;
        this.route = route;
        this.parent = parent;
    }
}
