"use client";

import styles from "./NextList.module.css"

const TETROMINOS = {
    I: {
        shape: [
            ['I', 'I', 'I', 'I'],
        ],
        color: '80, 227, 230',
    },

    J: {
        shape: [
            ['J', 0, 0],
            ['J', 'J', 'J'],
        ],
        color: '36, 95, 223',
    },

    L: {
        shape: [
            [0, 0, 'L'],
            ['L', 'L', 'L'],
        ],
        color: '223, 173, 36',
    },

    O: {
        shape: [
            ['O', 'O'],
            ['O', 'O']],
        color: '223, 217, 36',
    },

    S: {
        shape: [
            [0, 'S', 'S'],
            ['S', 'S', 0],
        ],
        color: '48, 211, 56',
    },

    T: {
        shape: [
            [0, 'T', 0],
            ['T', 'T', 'T'],
        ],
        color: '132, 61, 198',
    },

    Z: {
        shape: [
            ['Z', 'Z', 0],
            [0, 'Z', 'Z'],
        ],
        color: '227, 78, 78',
    },
};

export default function NextList({ nextMino }) {
    if (nextMino === undefined || nextMino === null) return null;
    else return (
        <div className={styles.nextList}>
            {TETROMINOS[nextMino].shape.map((row, rowIndex) =>
                rowIndex >= 2 ? null : (
                    <div key={rowIndex} style={{ display: 'flex' }}>
                        {row.map((cell, columnIndex) => (
                            <div
                                className={styles.next}
                                key={`${rowIndex}-${columnIndex}`}
                                style={{
                                    backgroundColor: cell === 0 ? "transparent" : `rgb(${TETROMINOS[nextMino].color})`,
                                    border: `1px solid ${cell !== 0 ? '#ccc' : "transparent"}`,
                                }}
                            ></div>
                        ))}
                    </div>
                ))}
        </div>
    )
}
