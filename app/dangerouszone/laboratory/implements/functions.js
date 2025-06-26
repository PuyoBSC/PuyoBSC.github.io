import { FIELD_HEIGHT, FIELD_WIDTH, TETROMINOS, SRS } from './constants.js';

export function createBag() {
    const bag = [];
    const minos = Object.keys(TETROMINOS);
    for (let i = 0; i < minos.length; i++) {
        bag.push(minos[i]);
    }
    for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    return bag; // 7-bag
}

export function makeNewLine() {
    const newLine = [];
    newLine.push("170, 170, 170");
    newLine.push("170, 170, 170");
    for (let i = 0; i < FIELD_WIDTH - 4; i++) {
        newLine.push(0);
    }
    newLine.push("170, 170, 170");
    newLine.push("170, 170, 170");
    return newLine; // 새로운 줄
}

export function createField() {
    const field = [];
    for (let y = 0; y < FIELD_HEIGHT; y++) {
        const row = [];
        for (let x = 0; x < FIELD_WIDTH; x++) {
            if (x < 2 || x >= FIELD_WIDTH - 2 || y >= FIELD_HEIGHT - 2) {
                row.push("170, 170, 170"); // 벽
            } else {
                row.push(0);
            }
        }
        field.push(row);
    }
    return field; // 필드
}

//TODO:
//but srs already implemented
export function superRotationSystem(block) {
    return block;
}

//TODO:
export function checkTSpin() {
    return false;
}

export function rotateMino(shape) {
    const N = shape.length
    return shape[0].map((_, i) =>
        shape.map(row => row[i]).reverse()
    );
}

export function rotateMinoCounter(shape) {
    const N = shape.length;
    return shape[0].map((_, i) =>
        shape.map(row => row[N - 1 - i])
    );
}

export const isCollision = (field, shape, posX, posY) => {
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] !== 0) {
                const x = posX + j;
                const y = posY + i;
                if (
                    y >= FIELD_HEIGHT || // 바닥 넘침
                    x < 0 || x >= FIELD_WIDTH || // 좌우 벽 넘침
                    (y >= 0 && field[y][x] !== 0) // 이미 채워진 셀
                ) {
                    return true;
                }
            }
        }
    }
    return false;
};

export const getGhostY = (field, shape, x, y) => {
    let ghostY = y;
    while (!isCollision(field, shape, x, ghostY + 1)) {
        ghostY++;
    }
    return ghostY;
};

export const fixMinoToField = (field, shape, posX, posY) => {
    const newField = field.map(row => row.slice()); // 깊은 복사
    console.log("fixMinoToField", shape, posX, posY);
    for (let i = 0; i < shape.length; i++) {
        for (let j = 0; j < shape[i].length; j++) {
            if (shape[i][j] !== 0) {
                const x = posX + j;
                const y = posY + i;
                if (y >= 0 && y < FIELD_HEIGHT && x >= 0 && x < FIELD_WIDTH) {
                    newField[y][x] = shape[i][j];
                }
            }
        }
    }
    return newField;
}

export const checkGameOver = (field) => {
    for (let x = 2; x < FIELD_WIDTH - 2; x++) {
        if (field[0][x] !== 0 || field[1][x] !== 0) {
            return true; // 게임 오버
        }
    }
    return false; // 게임 계속
}