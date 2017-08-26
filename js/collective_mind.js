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
        // return;
        let rowsCount = this.field.length;
        let cellsCount = this.field[0].length;

        for (let rowI = 0; rowI < rowsCount; rowI++) {
            for (let cellI = 0; cellI < cellsCount; cellI++) {
                if (this.field[rowI][cellI] === type.track) {
                    this.stepsHistory[`${rowI}:${cellI}`] = true;
                }
            }
        }
    }

    addStepToHistory(step) {
        this.stepsHistory[step] = true;
    }

    /**
     * @param {Array.<{y,x}>} variants
     * @param {Animal}animal
     * @returns {Array.<{y,x}>}
     */
    getVariants(variants, animal) {
        this.animal = animal;
        let filteredVariants = variants.filter(v => !this.stepsHistory[`${v.y}:${v.x}`]);

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
     * @param {Array.<{y,x}>}variants
     * @returns {Array.<{y,x}>}
     */
    filterVariantsByNearbyEmptyFields(variants) {
        let selectedVariants = this.filterVariantsByDeadFields(variants);

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
     * @param {Array.<{y,x}>} variants
     * @returns {Array.<{y,x}>}
     */
    filterVariantsByDeadFields(variants) {
        if (variants.length === 1) {
            this.rememberCurrentPositionAsDead();
        }

        let variantsWithoutDeadFields = variants.filter(v => !this.deadFields[`${v.y}:${v.x}`]);

        if (variantsWithoutDeadFields.length <= 1) {
            this.rememberCurrentPositionAsDead();
        }

        return variantsWithoutDeadFields;
    }

    /**
     * Returns a best variant to go, which will lead to the nearest empty field
     * @param {Array.<{y,x}>} variants
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
        currentPositions = currentPositions.map(p => {
            p.route = `${p.y}:${p.x}`;
            p.parent = {x: this.animal.x, y: this.animal.y};

            return p;
        });

        this.createTargetForAnimal(currentPositions);

        if (this.animal.target) {
            routeVariant = this.animal.target;
            bestRoute = routeVariant.route.split('->')[0];
            bestRoute = bestRoute.split(':');
        } else {
            return [];
        }

        let clonedRouteVariant = JSON.parse(JSON.stringify(routeVariant));
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
     * @param {Array.<{y,x}>} currentPositions
     * @returns {void}
     */
    createTargetForAnimal(currentPositions) {
        let founded = false;
        let routeVariant;
        let nextPositions = [];
        let t = this.animal.target;
        let buildRouteWithAnimalDetection = false;

        // Check already built route in cache
        if (t && this.field[t.y][t.x] === type.empty) {
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
            for (let currentPosition of currentPositions) {
                let nextPositionsForCurrentPosition = this.getVariantsToGo(currentPosition, buildRouteWithAnimalDetection);
                let goodPositions = nextPositionsForCurrentPosition
                    .filter(p => this.field[p.y][p.x] === type.empty) // filter by emptiness
                    .filter(p => !this.bookedFields[`${p.y}:${p.x}`]); // filter by booking

                // just taking first variant (in most cases it will be just 1 here)
                if (goodPositions.length) {
                    routeVariant = goodPositions[0];
                    founded = true;
                    break;
                }

                nextPositions = nextPositions.concat(nextPositionsForCurrentPosition);
            }

            // if no empty fields
            if (!nextPositions.length && !routeVariant) {
                this.animal.cantGo = true;
                return;
            }

            currentPositions = nextPositions;
            nextPositions = [];
        }

        if (routeVariant) {
            // Because there is a big tree of hierarchy here, we don't want this useless object to use our memory
            delete routeVariant.parent;

            this.bookedFields[`${routeVariant.y}:${routeVariant.x}`] = true;
            this.animal.target = routeVariant;
        }
    }


    /**
     * @param {{y,x, parent, route}} position
     * @param {boolean} detectAnimals
     * @returns {Array.<{y,x, parent, route}>}
     */
    getVariantsToGo(position, detectAnimals) {
        let variants = [];
        this.usedFields[`${position.y}:${position.x}`] = true;

        for (let y = position.y - 1; y <= position.y + 1; y++) {
            if (!this.field[y]) {
                continue;
            }

            for (let x = position.x - 1; x <= position.x + 1; x++) {
                if (position.parent && position.parent.x === x && position.parent.y === y) {
                    continue;
                }

                if (
                    this.field[y][x]
                    && (x !== position.x ^ y !== position.y)
                    && this.field[y][x] !== type.wall
                ) {
                    // If we are rebuilding route because of conflict with some animal
                    if (detectAnimals && this.field[y][x] === type.animal) {
                        continue;
                    }

                    variants.push({
                        x: x,
                        y: y,
                        parent: position,
                        route: `${position.route}->${y}:${x}`
                    });
                }
            }
        }

        // A big optimization, we don't want to go where there was already one of our routes
        variants = variants.filter(v => !this.usedFields[`${v.y}:${v.x}`]);

        for (let variant of variants) {
            this.usedFields[`${variant.y}:${variant.x}`] = true;
        }

        return variants;
    }

    /**
     * Checks if somebody is on our next step
     * @returns {boolean}
     */
    isConflict() {
        let routeVariant = this.animal.target;
        let bestRoute = routeVariant.route.split('->')[0];
        bestRoute = bestRoute.split(':');
        bestRoute = {y: +bestRoute[0], x: +bestRoute[1]};

        // checking if somebody is on our next step
        if (this.field[bestRoute.y][bestRoute.x] === type.animal) {
            let adversary = this.fieldClass.detectAnimalByCoordinates(bestRoute);

            // if yes, then pause it on 1 step and say that we need to recalculate route
            if (!adversary.isPaused()) {
                adversary.pause(1);
                return true;
            }
        }

        return false;
    }

    clearAnimalTarget() {
        let t = this.animal.target;

        if (t) {
            this.bookedFields[`${t.y}:${t.x}`] = false;
            delete this.animal.target;
        }
    }

    rememberCurrentPositionAsDead() {
        const a = this.animal;
        this.deadFields[`${a.y}:${a.x}`] = true;
    }
}