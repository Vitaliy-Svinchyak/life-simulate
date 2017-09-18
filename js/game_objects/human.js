/**
 * @property {CollectiveMind} collectiveMind
 * @property {string} type
 * @property {Task} task
 */
class Human extends Animal {

    constructor(y, x, id, collectiveMind) {
        super(y, x, id);
        this.collectiveMind = collectiveMind;
    }

    init() {
        this.type = type.human;
        this.inHands = null;
        this.task = null;
    }

    /**
     * @param {Task} task
     */
    setTask(task) {
        this.task = task;
    }

    /**
     * @param {Map} field
     */
    step(field) {
        if (!this.task) {
            this.task = this.collectiveMind.getTask(this);
        }

        return this.task.execute(this);
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
