"use strict";

/**
 * @property {Map} fieldMap
 * @property {Human[]} humans
 */
class CollectiveMind {
    constructor(field) {
        this.fieldMap = field.fieldMap;
        this.fieldClass = field;
        this.deadFields = {};
        this.usedFields = new Map();
        this.bookedFields = {};
        this.stepsHistory = new Map();
        this.parseHistory();
    }

    /**
     * @param {Human[]} humans
     */
    setHumans(humans) {
        this.humans = humans;
    }

    step() {
        const movesOnThisStep = [];

        for (const human of this.humans) {
            const humanStep = human.step(this.fieldMap);

            if (humanStep) {
                movesOnThisStep.push(humanStep);
            }
        }

        return movesOnThisStep;
    }

    /**
     * For test purposes
     */
    parseHistory() {
        for (let rowI = 0; rowI < this.fieldClass.fieldSize.rows; rowI++) {
            const yMap = this.fieldMap.get(rowI);

            for (let cellI = 0; cellI < this.fieldClass.fieldSize.cells; cellI++) {
                if (yMap.get(cellI) === type.track) {
                    this.stepsHistory.set(Point.getKeyExternally(rowI, cellI), true);
                }
            }
        }
    }

    /**
     * @param {string} step
     */
    addStepToHistory(step) {
        this.stepsHistory.set(step, true);
    }

    /**
     * @param {Point[]} variants
     * @param {Human} human
     * @returns {Point[]}
     */
    getVariants(variants, human) {
        this.human = human;
        const filteredVariants = variants.filter(v => !this.stepsHistory.has(Point.getKeyExternally(v.y, v.x)));
        let resultVariants;

        // if have nearby empty fields
        if (filteredVariants.length) {
            resultVariants = filteredVariants;
            // delete current target to avoid teleportation
            this.clearHumanTarget();
        } else {
            resultVariants = this.filterVariantsByNearbyEmptyFields(variants);
        }

        return resultVariants;
    }

    /**
     * Finds empty fields in bigger range and decides how to go there
     * @param {Point[]}variants
     * @returns {Point[]}
     */
    filterVariantsByNearbyEmptyFields(variants) {
        const selectedVariants = this.filterVariantsByDeadFields(variants);

        if (selectedVariants.length) {
            return this.buildRouteToNearbyField(selectedVariants);
        }

        // humans can be freezed when several of them are in tunnel, this fixed it
        return this.buildRouteToNearbyField(variants);
    }

    /**
     *  If from the current position there is only one exit - current position is dead.
     *  If after filtering all exits from current position there is only one exit - current position is dead.
     *
     * @param {Point[]} variants
     * @returns {Point[]}
     */
    filterVariantsByDeadFields(variants) {
        if (variants.length === 1) {
            this.rememberCurrentPositionAsDead();
        }

        const variantsWithoutDeadFields = variants.filter(v => !this.deadFields[Point.getKeyExternally(v.y, v.x)]);

        if (variantsWithoutDeadFields.length <= 1) {
            this.rememberCurrentPositionAsDead();
        }

        return variantsWithoutDeadFields;
    }

    /**
     * Returns a best variant to go, which will lead to the nearest empty fieldMap
     * @param {Point[]} variants
     * @returns {*} next variant to go
     */
    buildRouteToNearbyField(variants) {
        if (!variants.length) {
            return [];
        }

        let nextStep;
        let routeVariant;
        let currentPositions = variants;

        // Generating route history for current variants
        currentPositions = currentPositions.map(p => new Target(p.y, p.x, {x: this.human.x, y: this.human.y}));
        this.createTargetForHuman(currentPositions);

        if (this.human.target) {
            routeVariant = this.human.target;
            nextStep = this.human.target.getNextStep();
        } else {
            return [];
        }

        routeVariant.afterStep();

        if (routeVariant.isPenultimateRun()) {
            this.clearHumanTarget();
        }

        return [nextStep];
    }

    /**
     * Finds and builds route to the nearest not booked empty fieldMap
     *
     * @param {Target[]|Point[]} currentPositions
     *
     * @returns {void}
     */
    createTargetForHuman(currentPositions) {
        let founded = false;
        let routeVariant;
        let nextPositions = [];
        const humanTarget = this.human.target;
        let buildRouteWithHumanDetection = false;

        // Check already built route in cache
        if (humanTarget && this.fieldMap.get(humanTarget.y).get(humanTarget.x) === type.empty) {
            // Check if some human obstructs the passage
            buildRouteWithHumanDetection = this.isConflict();

            if (!buildRouteWithHumanDetection) {
                return;
            }
        }

        this.clearHumanTarget();
        this.usedFields = new Map();

        while (founded !== true) {
            // Checks all variants of all variants to go
            for (const currentPosition of currentPositions) {
                const nextPositionsForCurrentPosition = this.getPossibleTargetsToGo(currentPosition, buildRouteWithHumanDetection);
                const goodPositions = nextPositionsForCurrentPosition
                    .filter(p => this.fieldMap.get(p.y).get(p.x) === type.empty); // filter by emptiness

                // filter by booking
                const goodPositionsWithoutBooked = goodPositions.filter(p => !this.bookedFields[Point.getKeyExternally(p.y, p.x)]);

                const rebookedRoute = this.pickUpFieldToTheNearestHuman(goodPositionsWithoutBooked, goodPositions);
                if (rebookedRoute) {
                    routeVariant = rebookedRoute;
                    founded = true;
                    break;
                }

                // just taking first variant (in most cases it will be just 1 here)
                if (goodPositionsWithoutBooked.length) {
                    routeVariant = goodPositionsWithoutBooked[0];
                    founded = true;
                    break;
                }

                nextPositions = nextPositions.concat(nextPositionsForCurrentPosition);
            }

            // if no empty fields
            if (!nextPositions.length && !routeVariant) {
                this.human.stop();
                return;
            }

            currentPositions = nextPositions;
            nextPositions = [];
        }

        if (routeVariant) {
            // Because there is a big tree of hierarchy here, we don't want this useless object to use our memory
            delete routeVariant.parent;

            this.bookedFields[Point.getKeyExternally(routeVariant.y, routeVariant.x)] = this.human;
            this.human.target = routeVariant;
        }
    }

    pickUpFieldToTheNearestHuman(goodPositionsWithoutBooked, goodPositions) {
        if (goodPositionsWithoutBooked.length === goodPositions.length) {
            return false;
        }

        let bookedFields = [];

        for (const route of goodPositions) {
            if (this.bookedFields[Point.getKeyExternally(route.y, route.x)]) {
                bookedFields.push(route);
            }
        }

        if (!bookedFields.length) {
            return false;
        }

        for (const bookedField of bookedFields) {
            const currentHumanRouteLength = bookedField.route.split('->').length;
            bookedField.owner = this.bookedFields[Point.getKeyExternally(bookedField.y, bookedField.x)];
            const ownerRouteLength = bookedField.owner.target.route.split('->').length;
            bookedField.gain = ownerRouteLength - currentHumanRouteLength;
        }

        bookedFields = bookedFields.sort((a, b) => b.gain - a.gain);

        if (bookedFields[0].gain > 0) {
            delete bookedFields[0].owner.target;
            delete bookedFields[0].owner;

            return bookedFields[0];
        }

        return false;
    }

    /**
     * @param {Target} target
     * @param {boolean} detectHumans
     *
     * @returns {Target[]}
     */
    getPossibleTargetsToGo(target, detectHumans) {
        /** @type Target[] */
        let targets = [];
        this.usedFields.set(Point.getKeyExternally(target.y, target.x), true);

        for (let y = target.y - 1; y <= target.y + 1; y++) {
            for (let x = target.x - 1; x <= target.x + 1; x++) {
                if (
                    (x !== target.x ^ y !== target.y)
                    && solidObjects.indexOf(this.fieldMap.get(y).get(x)) === -1
                    // A big optimization, we don't want to go where there was already one of our routes
                    // && !this.usedFields[Point.getKeyExternally(y, x)]
                    && !this.usedFields.has(Point.getKeyExternally(y, x))
                ) {
                    // If we are rebuilding route because of conflict with some human
                    if (detectHumans && this.fieldMap.get(y).get(x) === type.human) {
                        continue;
                    }

                    targets.push(new Target(y, x, target));
                    this.usedFields.set(Point.getKeyExternally(y, x), true);
                }
            }
        }

        return targets;
    }

    /**
     * Checks if somebody is on our next step
     *
     * @returns {boolean}
     */
    isConflict() {
        const nextStep = this.human.target.getNextStep();

        // checking if somebody is on our next step
        if (this.fieldMap.get(nextStep.y).get(nextStep.x) === type.human) {
            const adversary = this.fieldClass.detectHumanByCoordinates(nextStep);

            // if yes, then pause it on 1 step and say that we need to recalculate route
            if (adversary && !adversary.isPaused()) {
                adversary.pause(1);
                return true;
            }
        }

        return false;
    }

    clearHumanTarget() {
        const humanTarget = this.human.target;

        if (humanTarget) {
            this.bookedFields[Point.getKeyExternally(humanTarget.y, humanTarget.x)] = false;
            this.human.clearTarget();
        }
    }

    rememberCurrentPositionAsDead() {
        this.deadFields[Point.getKeyExternally(this.human.y, this.human.x)] = true;
    }
}