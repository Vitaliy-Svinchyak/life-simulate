class GoTo extends Task {
    /**
     * @param {Target} target
     */
    constructor(target) {
        super();
        this.target = target;
        this.finished = false;
    }

    /**
     * @param {Human} human
     */
    execute(human) {
        let nextStep = this.target.getNextStep();

        if (this.target.isPenultimateRun()) {
            this.finished = true;
            return false;
        }

        if (nextStep) {
            const change = human.goTo(nextStep, human.collectiveMind.fieldMap);
            this.target.afterStep();

            return change;
        }

        return false;
    }

    isFinished() {
        return this.finished;
    }
}