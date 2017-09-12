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
 * @property {int} paused       - how much steps need to wait untill can go
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

    step(field) {
        if (this.cantGo) {
            return;
        }

        if (this.paused) {
            this.paused--;
            return;
        }

        const variantsToGo = this.getVariantsToGo(field);

        if (variantsToGo.length) {
            const toGo = this.selectVariantTogo(variantsToGo);

            if (!toGo) {
                return;
            }

            if (Math.abs(this.y + this.x - toGo.y - toGo.x) > 1) {
                console.error(JSON.stringify([this.y, this.x]), JSON.stringify([toGo.y, toGo.x]));
                console.error(JSON.stringify(this.target));
                console.error('WOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                this.stop();
                field[this.y][this.x] = 'X';
                return;
            }
            const changed = {};
            changed[this.y] = true;
            changed[toGo.y] = true;

            field[this.y][this.x] = type.track;
            this.x = toGo.x;
            this.y = toGo.y;
            field[this.y][this.x] = type.animal;
            return changed;
        }
    }

    selectVariantTogo(variantsToGo) {
        let variant;

        switch (this.strategy) {
            case animalStrategy.RAND:
                break;
            case animalStrategy.OWN_HISTORY:
                if (variantsToGo.length > 1 && this.previousSteps) {
                    const variantsToGoWithoutOldSteps = variantsToGo.filter(v => !this.previousSteps[`${v.y}:${v.x}`]);

                    if (variantsToGoWithoutOldSteps.length) {
                        variantsToGo = variantsToGoWithoutOldSteps;
                    }
                }
                break;
            case animalStrategy.COLLECTIVE_MIND_HISTORY:
                variantsToGo = this.collectiveMind.getVariants(variantsToGo, this);
                break;
            default:
                console.error('Unknown strategy');
                this.stop();
                break;
        }

        if (variantsToGo.length) {
            variant = variantsToGo[getRandomInt(0, variantsToGo.length - 1)];
            const stepKey = `${this.y}:${this.x}`;

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

            return variant;
        }
    }

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
    getVariantsToGo(field) {
        const variants = [];

        for (let y = this.y - 1; y <= this.y + 1; y++) {
            if (!field[y]) {
                continue;
            }

            for (let x = this.x - 1; x <= this.x + 1; x++) {
                if (
                    field[y][x]
                    && field[y][x] !== type.wall
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
     * Pause animal on some count of steps
     * @param {int} steps
     */
    pause(steps) {
        this.paused = steps;
    }

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