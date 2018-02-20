"use strict";
const type = {
    rock: '■',
    human: 'o',
    tree: '֏',
    empty: ' ',
    track: 'x',
    route: 'w'
};

const solidObjects = [type.rock, type.tree];

const stepSpeed = 100;
const statisticSpeed = 1000;
const debugMode = true;

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getFullScreenSize() {
    return {
        x: Math.floor(window.innerWidth / 9) - 2,
        y: Math.floor(window.innerHeight / 9) - 2,
    };
}

/**
 *
 * @param {int} x
 * @param {int} min
 * @param {int} max
 * @returns {boolean}
 */
function inRange(x, min, max) {
    return x >= min && x <= max;
}