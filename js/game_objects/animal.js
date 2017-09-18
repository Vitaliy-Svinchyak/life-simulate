"use strict";

const animalStrategy = {
    RAND: 1,
    OWN_HISTORY: 2
};

/**
 * @property {int} strategy     - strategy of moving
 * @property {int} y            - current row number of human
 * @property {int} x            - current column number of human
 * @property {int} id           - for uniqueness
 * @property {boolean} cantGo   - if true human will skip all his steps
 * @property {int} paused       - how much steps need to wait until can go
 * @property {Target} target    - current target of human
 * @property {{}} previousSteps - history of steps
 */
class Animal extends Point {
    /**
     * @param {int} y                   - current row number of human
     * @param {int} x                   - current column number of human
     * @param {int} id                  - for uniqueness
     */
    constructor(y, x, id) {
        super(y, x);
        this.strategy = animalStrategy.RAND;
        this.id = id;
        this.cantGo = false;
        this.paused = 0;
        this.target = null;
        this.previousSteps = {};
        this.gameLogic = window.serviceLocator.get(GameLogic);
        this.init();
    }

    init() {
        this.type = type.animal;
    }

    /**
     * @param {Map} field
     *
     * @returns {{}|null}
     */
    step(field) {
        if (!this.canGo()) {
            return null;
        }

        const variantsToGo = this.getPossiblePointsToGo(field);

        if (variantsToGo.length) {
            const point = this.selectVariantTogo(variantsToGo);
            return this.goTo(point, field);
        }

        this.stop();

        return null;
    }

    /**
     * Leaves a trace on its current position and moves to a new one
     *
     * @param {Point} point
     * @param {Map} field
     *
     * @return {{}}
     */
    goTo(point, field) {
        if (!this.gameLogic.animalCanGoTo(this, point)) {
            return {};
        }

        const move = {
            from: {
                y: this.y,
                x: this.x
            },
            to: {
                y: point.y,
                x: point.x
            }
        };

        field.get(this.y).set(this.x, type.empty);
        this.x = point.x;
        this.y = point.y;
        field.get(this.y).set(this.x, type.human);
        return move;
    }

    /**
     * Selects one of the points based on current move strategy
     *
     * @param {Point[]} variantsToGo
     *
     * @returns {Point}
     */
    selectVariantTogo(variantsToGo) {
        let variant;
        let filteredVariants = this.filterVariantsBasedOnStrategy(variantsToGo);

        if (filteredVariants.length) {
            variant = filteredVariants[getRandomInt(0, filteredVariants.length - 1)];
            const stepKey = Point.getKeyExternally(this.y, this.x);

            switch (this.strategy) {
                case animalStrategy.OWN_HISTORY:
                    this.previousSteps[stepKey] = true;
                    break;
                default:
                    break;
            }
        }

        return variant;
    }

    /**
     * Filters points based on current move strategy
     *
     * @param {Point[]} variantsToGo
     *
     * @return {Point[]}
     */
    filterVariantsBasedOnStrategy(variantsToGo) {
        let filteredVariants = variantsToGo;

        switch (this.strategy) {
            case animalStrategy.RAND:
                break;
            case animalStrategy.OWN_HISTORY:
                if (variantsToGo.length > 1 && this.previousSteps) {
                    const variantsToGoWithoutOldSteps = variantsToGo.filter(v => !this.previousSteps[Point.getKeyExternally(v.y, v.x)]);

                    if (variantsToGoWithoutOldSteps.length) {
                        filteredVariants = variantsToGoWithoutOldSteps;
                    }
                }
                break;
            default:
                console.error('Unknown strategy');
                this.stop();
                break;
        }

        return filteredVariants;
    }

    //noinspection FunctionWithMultipleLoopsJS
    /**
     * Returns an array of nearby points(radius = 1) where the current human can go.
     * Animal can't go to the point if:
     *      - Point is a rock
     *      - Point is an human
     * Animal can't walk diagonally. Only left, right, up, down
     *
     * @param {Map} field
     *
     * @returns {Point[]}
     */
    getPossiblePointsToGo(field) {
        const variants = [];

        for (let y = this.y - 1; y <= this.y + 1; y++) {
            const yMap = field.get(y);
            for (let x = this.x - 1; x <= this.x + 1; x++) {
                if (solidObjects.indexOf(yMap.get(x)) === -1
                    && yMap.get(x) !== type.human
                    // can't walk diagonally
                    && (x !== this.x ^ y !== this.y)
                ) {
                    variants.push({x: x, y: y});
                }
            }
        }

        return variants;
    }

    /**
     * @returns {boolean}
     */
    canGo() {
        if (this.cantGo) {
            return false;
        }

        if (this.paused) {
            this.paused--;
            return false;
        }

        return true;
    }

    /**
     * Pause human on some count of steps
     *
     * @param {int} steps
     */
    pause(steps) {
        this.paused = steps;
    }

    /**
     * Stop current human for all future steps
     */
    stop() {
        this.cantGo = true;
    }

    /**
     * @returns {boolean}
     */
    isPaused() {
        return this.paused > 0;
    }
}