const animalStrategy = {
    RAND: 1,
    OWN_HISTORY: 2,
    COLLECTIVE_MIND_HISTORY: 3
};

/**
 * @property {int} strategy     - strategy of moving
 * @property {int} y            - current row number of animal
 * @property {int} x            - current column number of animal
 * @property {int} id           - for uniqueness
 * @property {boolean} cantGo   - if true animal will skip all his steps
 * @property {int} paused       - how much steps need to wait until can go
 * @property {Target} target    - current target of animal
 * @property {{}} previousSteps - history of steps
 * @property {CollectiveMind} collectiveMind
 */
class Animal {
    /**
     * @param {int} y                   - current row number of animal
     * @param {int} x                   - current column number of animal
     * @param {CollectiveMind} collectiveMind
     * @param {int} id                  - for uniqueness
     */
    constructor(y, x, collectiveMind, id) {
        this.strategy = animalStrategy.COLLECTIVE_MIND_HISTORY;
        this.y = +y;
        this.x = +x;
        this.id = id;
        this.cantGo = false;
        this.paused = 0;
        this.target = null;
        this.previousSteps = {};
        this.collectiveMind = collectiveMind;
    }

    /**
     * @param {Field} field
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

            if (this.isValidPoint(point)) {
                return this.goTo(point, field);
            }
        }
        this.stop();

        return null;
    }

    /**
     * Leaves a trace on its current position and moves to a new one
     *
     * @param {Point} point
     * @param {Field} field
     *
     * @return {{}}
     */
    goTo(point, field) {
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

        field[this.y][this.x] = type.track;
        this.x = point.x;
        this.y = point.y;
        field[this.y][this.x] = type.animal;

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
                case animalStrategy.COLLECTIVE_MIND_HISTORY:
                    this.collectiveMind.addStepToHistory(stepKey);
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
            case animalStrategy.COLLECTIVE_MIND_HISTORY:
                filteredVariants = this.collectiveMind.getVariants(variantsToGo, this);
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
     * Returns an array of nearby points(radius = 1) where the current animal can go.
     * Animal can't go to the point if:
     *      - Point is a wall
     *      - Point is an animal
     * Animal can't walk diagonally. Only left, right, up, down
     *
     * @param {Field} field
     *
     * @returns {Point[]}
     */
    getPossiblePointsToGo(field) {
        const variants = [];

        for (let y = this.y - 1; y <= this.y + 1; y++) {
            for (let x = this.x - 1; x <= this.x + 1; x++) {
                if (field[y][x] !== type.wall
                    && field[y][x] !== type.animal
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
     * Pause animal on some count of steps
     *
     * @param {int} steps
     */
    pause(steps) {
        this.paused = steps;
    }

    /**
     * Stop current animal for all future steps
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

    /**
     * Checks if point exists and is not a teleport (in reach)
     *
     * @param {Point} point
     *
     * @returns {boolean}
     */
    isValidPoint(point) {
        if (!point) {
            return false;
        }

        if (Math.abs(this.y + this.x - point.y - point.x) > 1) {
            console.error(JSON.stringify([this.y, this.x]), JSON.stringify([point.y, point.x]));
            console.error(JSON.stringify(this.target));
            console.error('WOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');

            return false;
        }

        return true;
    }

    clearTarget() {
        this.target = null;
    }
}