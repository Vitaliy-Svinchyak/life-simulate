const animalStrategy = {
    RAND: 1,
    OWN_HISTORY: 2,
    COLLECTIVE_MIND_HISTORY: 3
};

class Animal {
    constructor(y, x, collectiveMind, id) {
        this.strategy = animalStrategy.COLLECTIVE_MIND_HISTORY;
        this.y = +y;
        this.x = +x;
        this.id = id;
        this.cantGo = false;
        this.paused = 0;
        this.target = null;
        this.energy = 20;
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
                console.log(JSON.stringify([this.y, this.x]), JSON.stringify([toGo.y, toGo.x]));
                console.log(JSON.stringify(this.target));
                console.log('WOW!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
                this.cantGo = true;
                field[this.y][this.x] = 'X';
                return;
            }

            field[this.y][this.x] = type.track;
            this.x = toGo.x;
            this.y = toGo.y;
            this.energy--;
            field[this.y][this.x] = type.animal;
        }
    }

    selectVariantTogo(variantsToGo) {
        let variant;

        switch (this.strategy) {
            case animalStrategy.RAND:
                break;
            case animalStrategy.OWN_HISTORY:
                if (variantsToGo.length > 1 && this.previousSteps) {
                    let variantsToGoWithoutOldSteps = variantsToGo.filter(v => !this.previousSteps[`${v.y}:${v.x}`]);

                    if (variantsToGoWithoutOldSteps.length) {
                        variantsToGo = variantsToGoWithoutOldSteps;
                    }
                }
                break;
            case animalStrategy.COLLECTIVE_MIND_HISTORY:
                variantsToGo = this.collectiveMind.getVariants(variantsToGo, this);

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
            }

            return variant;
        }
    }

    getVariantsToGo(field) {
        let variants = [];

        for (let y = this.y - 1; y <= this.y + 1; y++) {
            if (!field[y]) {
                continue;
            }

            for (let x = this.x - 1; x <= this.x + 1; x++) {
                if (
                    field[y][x]
                    && field[y][x] !== type.wall
                    && field[y][x] !== type.animal
                    && (x != this.x ^ y != this.y)
                ) {
                    variants.push({x: x, y: y});
                }
            }
        }

        return variants;
    }

    pause(steps) {
        this.paused = steps;
    }

    isPaused() {
        return this.paused > 0;
    }
}