class Task {
    init() {

    }

    /**
     * @param {Human} human
     */
    execute(human) {
        throw 'Class must implement interface function "execute"';
    }

    isFinished() {
        throw 'Class must implement interface function "isFinished"';
    }
}