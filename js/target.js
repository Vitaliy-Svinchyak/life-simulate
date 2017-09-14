"use strict";

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
     * @param {Target|Point|{x,y}} parent   - target from which current is built
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
     * @returns {Point[]}
     */
    getRouteArray() {
        const points = this.route.split('->');

        return points.map(p => new Point(p[0], p[1]));
    }

    /**
     * @returns {Point}
     */
    getNextStep() {
        const points = this.route.split('->');
        const nextStep = points[0].split(':');

        return new Point(+nextStep[0], +nextStep[1]);
    }

    /**
     * @returns {boolean}
     */
    isPenultimateRun() {
        return this.route
                .substr(this.route.indexOf('->'))
                .indexOf('->') === -1;
    }

    /**
     * Need to delete first point from current route
     */
    afterStep() {
        const foundedDivider = this.route.indexOf('->');

        // delete our next step from our route
        if (foundedDivider > -1) {
            this.route = this.route.substr(foundedDivider + 2);
        }
    }
}
