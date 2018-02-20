window.game.exportGame = () => {
    const textarea = document.createElement('textarea');

    textarea.value = JSON.stringify({
        map: window.game.gameField.exportMap(),
        history: window.game.gameField.exportHistory()
    });
    document.getElementById('canvas-field').style.display = 'none';
    document.querySelector('#modal').style.display = 'block';

    document.getElementById('modal').appendChild(textarea);
};

window.game.importGame = (game) => {
    const map = new Map();

    let x = 0;
    for (let row of game.map) {
        const submap = new Map();

        for (let y in row) {
            submap.set(+y, row[y]);
        }

        map.set(x, submap);
        x++;
    }

    window.game.gameField = new Field(map);

    document.getElementById('canvas-field').style.display = '';
    document.querySelector('#modal').style.display = '';

    for (let historyNumber in game.history) {
        window.game.gameField.collectiveMind.humans[historyNumber].setHistoryToReproduce(game.history[historyNumber]);
    }
};