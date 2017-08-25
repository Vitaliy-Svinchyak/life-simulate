class CollectiveMind {
    constructor(field) {
        this.field = field;
        this.stepsHistory = {};
        this.deadFields = {};
        this.usedFields = {};
        this.parseHistory();
    }

    parseHistory() {
        for (let rowI in this.field) {
            for (let cellI in this.field[rowI]) {
                if (this.field[rowI][cellI] === track) {
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

        // if have empty fields nearby
        if (filteredVariants.length) {
            variants = filteredVariants;
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

        let founded = false;
        let routeVariant;
        let currentPositions = variants;
        currentPositions = currentPositions.map(p => {
            p.route = `${p.y}:${p.x}`;
            p.parent = {x: this.animal.x, y: this.animal.y};

            return p;
        });
        let nextPositions = [];
        let bestRoute;
        let t = this.animal.target;

        if (!t || this.field[t.y][t.x] !== empty) {
            this.usedFields = {};
            while (founded !== true) {
                for (let currPos of currentPositions) {
                    let nextPositionsForCurrent = this.getVariantsToGo(currPos);

                    nextPositionsForCurrent = nextPositionsForCurrent.map(p => {
                        p.route = `${currPos.route}->${p.y}:${p.x}`;
                        p.parent = currPos;
                        return p;
                    });

                    let goodPositions = nextPositionsForCurrent.filter(p => {
                        return this.field[p.y][p.x] === empty;
                    });

                    if (goodPositions.length) {
                        routeVariant = goodPositions[0];
                        founded = true;
                        break;
                    }

                    nextPositions = nextPositions.concat(nextPositionsForCurrent);
                }

                if (!nextPositions.length && !routeVariant) {
                    this.animal.cantGo = true;
                    return [];
                }

                currentPositions = nextPositions;
                nextPositions = [];
            }

            if (routeVariant) {
                this.animal.target = routeVariant;
                bestRoute = routeVariant.route.split('->')[0];
            }
        } else {
            routeVariant = this.animal.target;
            let clonedRoute = JSON.parse(JSON.stringify(routeVariant));
            const foundedDivider = clonedRoute.route.indexOf('->');

            if (foundedDivider > -1) {
                clonedRoute.route = clonedRoute.route.substr(foundedDivider + 2);
                this.animal.target = clonedRoute;

                bestRoute = routeVariant.route.split('->')[0];

                if (clonedRoute.route.substr(clonedRoute.route.indexOf('->')).indexOf('->') === -1) {
                    delete this.animal.target;
                }
            }
        }

        if (!bestRoute) {
            return [];
        }

        bestRoute = bestRoute.split(':');
        return [
            {
                x: +bestRoute[1],
                y: +bestRoute[0],
            }
        ];
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
                    && this.field[y][x] !== wall
                    && (x != position.x ^ y != position.y)
                ) {
                    variants.push({x: x, y: y});
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
        this.deadFields[`${a.y}:${a.x}`] = {x: a.x, y: a.y};
    }
}