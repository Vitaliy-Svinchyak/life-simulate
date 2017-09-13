class CollectiveMind {
    constructor(field) {
        this.field = field.field;
        this.fieldClass = field;
        this.deadFields = {};
        this.usedFields = {};
        this.bookedFields = {};
        this.parseHistory();
    }

    /**
     * For test purposes
     */
    parseHistory() {
        this.stepsHistory = {};

        for (let rowI = 0; rowI < this.fieldClass.fieldSize.rows; rowI++) {
            for (let cellI = 0; cellI < this.fieldClass.fieldSize.cells; cellI++) {
                if (this.field[rowI][cellI] === type.track) {
                    this.stepsHistory[Point.getKeyExternally(rowI, cellI)] = true;
                }
            }
        }
    }

    /**
     * @param {string} step
     */
    addStepToHistory(step) {
        this.stepsHistory[step] = true;
    }

    /**
     * @param {Point[]} variants
     * @param {Animal} animal
     * @returns {Point[]}
     */
    getVariants(variants, animal) {
        this.animal = animal;
        const filteredVariants = variants.filter(v => !this.stepsHistory[Point.getKeyExternally(v.y, v.x)]);

        // if have nearby empty fields
        if (filteredVariants.length) {
            variants = filteredVariants;
            // delete current target to avoid teleportation
            this.clearAnimalTarget();
        } else {
            variants = this.filterVariantsByNearbyEmptyFields(variants);
        }

        return variants;
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

        // animals can be freezed when several of them are in tunnel, this fixed it
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
     * Returns a best variant to go, which will lead to the nearest empty field
     * @param {Point[]} variants
     * @returns {*} next variant to go
     */
    buildRouteToNearbyField(variants) {
        if (!variants.length) {
            return [];
        }

        let bestRoute;
        let routeVariant;
        let currentPositions = variants;

        // Generating route history for current variants
        currentPositions = currentPositions.map(p => new Target(p.y, p.x, {x: this.animal.x, y: this.animal.y}));

        this.createTargetForAnimal(currentPositions);

        if (this.animal.target) {
            routeVariant = this.animal.target;
            bestRoute = routeVariant.route.split('->')[0];
            bestRoute = bestRoute.split(':');
        } else {
            return [];
        }

        const clonedRouteVariant = JSON.parse(JSON.stringify(routeVariant));
        const foundedDivider = clonedRouteVariant.route.indexOf('->');

        // delete our next step from our route
        if (foundedDivider > -1) {
            clonedRouteVariant.route = clonedRouteVariant.route.substr(foundedDivider + 2);
            this.animal.target = clonedRouteVariant;

            if (clonedRouteVariant.route.substr(clonedRouteVariant.route.indexOf('->')).indexOf('->') === -1) {
                this.clearAnimalTarget();
            }
        }
        // this.fieldClass.drawRoute(routeVariant);

        return [
            {
                x: +bestRoute[1],
                y: +bestRoute[0],
            }
        ];
    }

    /**
     * Finds and builds route to the nearest not booked empty field
     *
     * @param {Target[]} currentPositions
     *
     * @returns {void}
     */
    createTargetForAnimal(currentPositions) {
        let founded = false;
        let routeVariant;
        let nextPositions = [];
        const animalTarget = this.animal.target;
        let buildRouteWithAnimalDetection = false;

        // Check already built route in cache
        if (animalTarget && this.field[animalTarget.y][animalTarget.x] === type.empty) {
            // Check if some animal obstructs the passage
            buildRouteWithAnimalDetection = this.isConflict();

            if (!buildRouteWithAnimalDetection) {
                return;
            }
        }

        this.clearAnimalTarget();
        this.usedFields = {};

        while (founded !== true) {
            // Checks all variants of all variants to go
            for (const currentPosition of currentPositions) {
                const nextPositionsForCurrentPosition = this.getPossibleTargetsToGo(currentPosition, buildRouteWithAnimalDetection);
                const goodPositions = nextPositionsForCurrentPosition
                    .filter(p => this.field[p.y][p.x] === type.empty); // filter by emptiness

                // filter by booking
                const goodPositionsWithoutBooked = goodPositions.filter(p => !this.bookedFields[Point.getKeyExternally(p.y, p.x)]);

                const rebookedRoute = this.pickUpFieldToTheNearestAnimal(goodPositionsWithoutBooked, goodPositions);
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
                this.animal.stop();
                return;
            }

            currentPositions = nextPositions;
            nextPositions = [];
        }

        if (routeVariant) {
            // Because there is a big tree of hierarchy here, we don't want this useless object to use our memory
            delete routeVariant.parent;

            this.bookedFields[Point.getKeyExternally(routeVariant.y, routeVariant.x)] = this.animal;
            this.animal.target = routeVariant;
        }
    }

    pickUpFieldToTheNearestAnimal(goodPositionsWithoutBooked, goodPositions) {
        if (goodPositionsWithoutBooked.length === goodPositions.length) {
            return false;
        }

        let bookedFields = [];

        for (const route of goodPositions) {
            if (this.bookedFields[Point.getKeyExternally(route.y, route.x)]) {
                bookedFields.push(route);
            }
        }

        for (const bookedField of bookedFields) {
            const currentAnimalRouteLength = bookedField.route.split('->').length;
            bookedField.owner = this.bookedFields[Point.getKeyExternally(bookedField.y, bookedField.x)];
            const ownerRouteLength = bookedField.owner.target.route.split('->').length;
            bookedField.gain = ownerRouteLength - currentAnimalRouteLength;
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
     * @param {boolean} detectAnimals
     *
     * @returns {Target[]}
     */
    getPossibleTargetsToGo(target, detectAnimals) {
        let targets = [];
        this.usedFields[Point.getKeyExternally(target.y, target.x)] = true;

        for (let y = target.y - 1; y <= target.y + 1; y++) {
            for (let x = target.x - 1; x <= target.x + 1; x++) {
                if (target.parentHasCoordinates(y, x)) {
                    continue;
                }

                if ((x !== target.x ^ y !== target.y)
                    && this.field[y][x] !== type.wall
                ) {
                    // If we are rebuilding route because of conflict with some animal
                    if (detectAnimals && this.field[y][x] === type.animal) {
                        continue;
                    }

                    targets.push(new Target(y, x, target));
                }
            }
        }

        // A big optimization, we don't want to go where there was already one of our routes
        targets = targets.filter(v => !this.usedFields[Point.getKeyExternally(v.y, v.x)]);

        for (const variant of targets) {
            this.usedFields[Point.getKeyExternally(variant.y, variant.x)] = true;
        }

        return targets;
    }

    /**
     * Checks if somebody is on our next step
     *
     * @returns {boolean}
     */
    isConflict() {
        const routeVariant = this.animal.target;
        let bestRoute = routeVariant.route.split('->')[0];
        bestRoute = bestRoute.split(':');
        bestRoute = {y: +bestRoute[0], x: +bestRoute[1]};

        // checking if somebody is on our next step
        if (this.field[bestRoute.y][bestRoute.x] === type.animal) {
            const adversary = this.fieldClass.detectAnimalByCoordinates(bestRoute);

            // if yes, then pause it on 1 step and say that we need to recalculate route
            if (adversary && !adversary.isPaused()) {
                adversary.pause(1);
                return true;
            }
        }

        return false;
    }

    clearAnimalTarget() {
        const animalTarget = this.animal.target;

        if (animalTarget) {
            this.bookedFields[Point.getKeyExternally(animalTarget.y, animalTarget.x)] = false;
            this.animal.clearTarget();
        }
    }

    rememberCurrentPositionAsDead() {
        this.deadFields[Point.getKeyExternally(this.animal.y, this.animal.x)] = true;
    }
}