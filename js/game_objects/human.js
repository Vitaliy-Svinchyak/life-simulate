class Human extends Animal {

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
            this.collectiveMind.addStepToHistory(stepKey);
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
        return this.collectiveMind.getVariants(variantsToGo, this);
    }
}
