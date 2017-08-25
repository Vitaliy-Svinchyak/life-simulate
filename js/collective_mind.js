class CollectiveMind {
    constructor(field) {
        this.field = field.field;
        this.fieldClass = field;
        this.deadFields = {};
        this.usedFields = {};
        this.parseHistory();
    }

    parseHistory() {
        this.stepsHistory = {};
        return;

        for (let rowI in this.field) {
            for (let cellI in this.field[rowI]) {
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
     * @param {[]} variants
     * @param {Animal}animal
     * @returns {[]}
     */
    getVariants(variants, animal) {
        this.animal = animal;
        let filteredVariants = variants.filter(v => !this.stepsHistory[`${v.y}:${v.x}`]);

        // if have nearby empty fields
        if (filteredVariants.length) {
            variants = filteredVariants;
            delete this.animal.target;
        } else {
            variants = this.filterVariantsByNearbyEmptyFields(variants);
        }

        return variants;
    }

    /**
     * Finds empty fields in bigger range and decides how to go there
     * @param {[]}variants
     * @returns {[]}
     */
    filterVariantsByNearbyEmptyFields(variants) {
        if (variants.length === 1) {
            this.rememberCurrentPositionAsDead();
        }

        let selectedVariants = this.filterVariantsByDeadFields(variants);

        return this.buildRouteToNearbyField(selectedVariants);
    }

    filterVariantsByDeadFields(variants) {
        let variantsWithoutDeadFields = variants.filter(v => !this.deadFields[`${v.y}:${v.x}`]);

        if (variantsWithoutDeadFields.length <= 1) {
            this.rememberCurrentPositionAsDead();
        }

        return variantsWithoutDeadFields;
    }

    buildRouteToNearbyField(variants) {
        if (!variants.length) {
            return [];
        }

        let routeVariant;
        let currentPositions = variants;

        currentPositions = currentPositions.map(p => {
            p.route = `${p.y}:${p.x}`;
            p.parent = {x: this.animal.x, y: this.animal.y};

            return p;
        });
        let bestRoute;

        this.createTargetForAnimal(currentPositions);

        if (this.animal.target) {
            routeVariant = this.animal.target;
            bestRoute = routeVariant.route.split('->')[0];
        } else {
            return [];
        }

        let clonedRouteVariant = JSON.parse(JSON.stringify(routeVariant));
        const foundedDivider = clonedRouteVariant.route.indexOf('->');

        if (foundedDivider > -1) {
            clonedRouteVariant.route = clonedRouteVariant.route.substr(foundedDivider + 2);
            this.animal.target = clonedRouteVariant;

            if (clonedRouteVariant.route.substr(clonedRouteVariant.route.indexOf('->')).indexOf('->') === -1) {
                delete this.animal.target;
            }
        }
        // this.fieldClass.drawRoute(routeVariant);

        bestRoute = bestRoute.split(':');
        return [
            {
                x: +bestRoute[1],
                y: +bestRoute[0],
            }
        ];
    }

    createTargetForAnimal(currentPositions) {
        let founded = false;
        let routeVariant;
        let nextPositions = [];
        let t = this.animal.target;

        if (t && this.field[t.y][t.x] === type.empty) {
            return;
        }

        delete this.animal.target;
        this.usedFields = {};

        while (founded !== true) {
            for (let currentPosition of currentPositions) {
                let nextPositionsForCurrent = this.getVariantsToGo(currentPosition);
                let goodPositions = nextPositionsForCurrent.filter(p => this.field[p.y][p.x] === type.empty);

                if (goodPositions.length) {
                    routeVariant = goodPositions[0];
                    founded = true;
                    break;
                }

                nextPositions = nextPositions.concat(nextPositionsForCurrent);
            }

            if (!nextPositions.length && !routeVariant) {
                console.log('cant');
                this.animal.cantGo = true;
                return [];
            }

            currentPositions = nextPositions;
            nextPositions = [];
        }

        if (routeVariant) {
            delete routeVariant.parent;
            this.animal.target = routeVariant;
        }
    }

    getVariantsToGo(position) {
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
                    variants.push({
                        x: x,
                        y: y,
                        parent: position,
                        route: `${position.route}->${y}:${x}`
                    });
                }
            }
        }

        variants = variants.filter(v => !this.usedFields[`${v.y}:${v.x}`]);

        for (let variant of variants) {
            this.usedFields[`${variant.y}:${variant.x}`] = true;
        }

        return variants;
    }

    rememberCurrentPositionAsDead() {
        const a = this.animal;
        this.deadFields[`${a.y}:${a.x}`] = true;
    }
}