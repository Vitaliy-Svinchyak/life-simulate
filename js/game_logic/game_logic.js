class GameLogic {

    /**
     * @param {Field} fieldClass
     */
    constructor(fieldClass) {
        this.fieldMap = fieldClass.fieldMap;
    }

    /**
     * @param {Animal} animal
     * @param {Point} point
     */
    animalCanGoTo(animal, point) {
        if (!point) {
            return false;
        }

        if (this.fieldMap.get(point.y).get(point.x) !== type.empty) {
            console.error(JSON.stringify([animal.y, animal.x]), JSON.stringify([point.y, point.x]));
            throw 'Can\'t go there! It is a solid object';
        }

        if (Math.abs(animal.y + animal.x - point.y - point.x) > 1) {
            console.error(JSON.stringify([animal.y, animal.x]), JSON.stringify([point.y, point.x]));
            throw 'Can\'t go there!';

            return false;
        }

        return true;
    }
}
