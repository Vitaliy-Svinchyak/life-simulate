"use strict";

/**
 * @property {Map} fieldMap
 * @property {Human[]} humans
 */
class CollectiveMind {
    constructor(field) {
        this.fieldMap = field.fieldMap;
        this.resourcesRegister = window.serviceLocator.get(ResourcesRegister);
        this.fieldClass = field;
        this.usedFields = new Map();
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
     * @param {Human} human
     *
     * @returns {Task[]}
     */
    getTasks(human) {
        const target = this.getTarget(human, type.tree);

        return [new GoTo(target)];
    }

    /**
     * @param {Human} human
     * @param {string} type
     *
     * @returns {Target}
     */
    getTarget(human, type) {
        this.human = human;

        return this.createTargetForHuman([new Point(human.y, human.x)], type);
    }

    /**
     * Finds and builds route to the nearest not booked empty fieldMap
     *
     * @param {Target[]|Point[]} currentPositions
     * @param {string} typeOfField
     *
     * @returns {Target|null}
     */
    createTargetForHuman(currentPositions, typeOfField) {
        let founded = false;
        let routeVariant;
        let nextPositions = [];
        let buildRouteWithHumanDetection = false;
        this.usedFields = new Map();

        while (founded !== true) {
            // Checks all variants of all variants to go
            for (const currentPosition of currentPositions) {
                let nextPositionsForCurrentPosition = this.getPossibleTargetsToGo(currentPosition, buildRouteWithHumanDetection);
                let goodPositions = nextPositionsForCurrentPosition
                    .filter(p => this.fieldMap.get(p.y).get(p.x) === typeOfField); // filter by target type

                if (!goodPositions.length) {
                    nextPositionsForCurrentPosition = nextPositionsForCurrentPosition
                        .filter(p => this.fieldMap.get(p.y).get(p.x) === type.empty);
                } else {
                    routeVariant = goodPositions[0];
                    founded = true;
                    break;
                }

                nextPositions = nextPositions.concat(nextPositionsForCurrentPosition);
            }

            // if no empty fields
            if (!nextPositions.length && !routeVariant) {
                this.human.stop();
                return null;
            }

            currentPositions = nextPositions;
            nextPositions = [];
        }

        if (routeVariant) {
            // Because there is a big tree of hierarchy here, we don't want this useless object to use our memory
            delete routeVariant.parent;

            return routeVariant;
        }
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
                    // A big optimization, we don't want to go where there was already one of our routes
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
}