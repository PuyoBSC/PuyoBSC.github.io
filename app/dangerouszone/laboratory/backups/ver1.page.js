"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import { createBag, makeNewLine, createField, rotateMino, rotateMinoCounter } from "./implements/functions.js";
import { FIELD_HEIGHT, FIELD_WIDTH, TETROMINOS, SRS } from './implements/constants.js';

export default function Lab() {
    const [field, setField] = useState(createField);
    const [player, setPlayer] = useState({
        mino: null,
        pos: { x: 0, y: 0 },
        rot: 0,
        shape: null,
    });
    const [next, setNext] = useState([]);
    const [hold, setHold] = useState({
        flag: false,
        mino: null,
    });
    // const [score, setScore] = useState(0);
    // const [level, setLevel] = useState(1);HH
    const [test, setTest] = useState(0);

    const playerRef = useRef(player);

    const updatePlayer = (updates) => {
        setPlayer(prev => ({
            ...prev,
            ...updates,
        }));
    }

    const updateHold = (updates) => {
        setHold(prev => ({
            ...prev,
            ...updates,
        }));
    }

    const getNewMino = () => {
        const [newMino, ...rest] = next;
        updatePlayer({
            mino: newMino,
            pos: { x: (newMino === 'O' ? 6 : 5), y: 0 },
            rot: 0,
            shape: TETROMINOS[newMino].shape,
        });
        setNext(rest);
    }

    const getHoldMino = () => {
        const newHold = player.mino;
        updatePlayer({
            mino: hold.mino,
            pos: { x: (hold.mino === 'O' ? 6 : 5), y: 0 },
            rot: 0,
            shape: TETROMINOS[hold.mino].shape,
        });
        updateHold({
            flag: true,
            mino: newHold,
        });
    }

    const updateCell = (row, col, val) => {
        setField(prev => {
            const newfield = prev.map((r, i) =>
                i === row ? [...r.slice(0, col), val, ...r.slice(col + 1)] : r
            );
            return newfield;
        });
    };

    const movePlayer = (dirx, diry, shape) => {
        const newX = playerRef.current.pos.x + dirx;
        const newY = playerRef.current.pos.y + diry;
        const minoSize = shape.length;

        // Check if the new position is within bounds
        if (newX < 2 || newX + minoSize + 2 > FIELD_WIDTH || newY < 0 || newY + minoSize + 2 > FIELD_HEIGHT) {
            // /fordebug/ console.log("Player out of bounds: ", newX, newY);
            return; // Prevent moving out of bounds
        }
        setPlayer(prev => ({
            ...prev,
            pos: {
                x: prev.pos.x + dirx,
                y: prev.pos.y + diry,
            }
        }));
    }

    const handleKeyPress = (event) => {
        // /fordebug/ console.log("Key pressed: ", event.key);
        const cur = playerRef.current;
        switch (event.key) {
            case "a":
            case "ArrowLeft":
                movePlayer(-1, 0, cur.shape);
                console.log("left -> ", cur.pos.x, cur.pos.y);
                break;
            case "d":
            case "ArrowRight":
                movePlayer(1, 0, cur.shape);
                console.log("right -> ", cur.pos.x, cur.pos.y);
                break;
            case "s":
            case "ArrowDown":
                movePlayer(0, 1, cur.shape);
                console.log("down -> ", cur.pos.x, cur.pos.y + 1);
                break;
            case "w":
            case "ArrowUp":
            case "x":
                updatePlayer({
                    rot: (player.rot + 1) % 4,
                    shape: rotateMino(player.shape),
                });
                // /fordebug/ console.log("rotate ", player.mino);
                break;
            case "z":
                updatePlayer({
                    rot: (player.rot + 3) % 4,
                    shape: rotateMinoCounter(player.shape),
                });
                // /fordebug/ console.log("rotate counter ", player.mino);
                break;
            case "c":
                if (hold.flag) {
                    // /fordebug/ console.log("hold already used");
                    break;
                }
                if (hold.mino === null) {
                    updateHold({
                        flag: true,
                        mino: player.mino,
                    });
                    getNewMino();
                } else {
                    getHoldMino();
                }
                break;
            case " ":
                getNewMino();
                updateHold({
                    flag: false,
                });
                break;
            case "t":
                const randX = Math.floor(Math.random() * 10 + 2);
                const randY = Math.floor(Math.random() * 20 + 2);
                const randColor = Math.floor(Math.random() * 256).toString(10) + "," + Math.floor(Math.random() * 256).toString(10) + "," + Math.floor(Math.random() * 256).toString(10);
                console.log(randColor);
                updateCell(randY, randX, randColor);
                // /fordebug/ console.log("Test cell updated at: ", randX, randY, " with color: ", randColor);
                break;
            default:
                // /fordebug/ console.log("Invalid key");
                break;
        }
    };

    useEffect(() => {
        playerRef.current = player;
    }, [player]);

    useEffect(() => {
        const preventKeyList = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "x", "z", "c", "w", "a", "s", "d", " "];
        const handleKeyDown = (event) => {
            if (preventKeyList.includes(event.key)) {
                event.preventDefault();
                // /fordebug/ console.log("Prevented key: ", event.key);
            }
            handleKeyPress(event);
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [player]);

    useEffect(() => {
        const interval = setInterval(() => {
            const cur = playerRef.current;
            movePlayer(0, 1, cur.shape);
        }, 555);

        return () => clearInterval(interval);
    }, [next, hold]);


    useEffect(() => {
        // /fordebug/ console.log(next);
        if (next.length <= 7) {
            const newBag = createBag();
            setNext(prev => [...prev, ...newBag]);
        }
    }, [next]);

    useEffect(() => {
        if (player.mino === null && next.length > 0) {
            const [newMino, ...rest] = next;
            getNewMino();
            setNext(rest);
        }
    }, [next]);

    // update field when player position changes
    useEffect(() => {
        if (player.mino !== null) {
            const { x, y } = player.pos;
            const shape = player.shape;
            for (let i = 0; i < shape.length; i++) {
                for (let j = 0; j < shape[i].length; j++) {
                    if (shape[i][j] !== 0) {
                        const fieldX = x + j;
                        const fieldY = y + i;
                        if (fieldY >= 0 && fieldY < FIELD_HEIGHT && fieldX >= 0 && fieldX < FIELD_WIDTH) {
                            updateCell(fieldY, fieldX, TETROMINOS[player.mino].color);
                        }
                    }
                }
            }
        }
    }, [player]);


    return (
        <div className={styles.lab}>
            <h1>lab</h1>
            <div> 현재 미노: {player.mino}</div>
            <div> hold 미노: {hold.mino === null ? "none" : hold.mino} </div>
            <div> 현재 미노 shape:
                {player.shape === null ? "none" : (
                    <div style={{ lineHeight: "1.2" }}>
                        {player.shape.map((row, i) => (
                            <div key={i}>
                                {row.map((cell, j) => (
                                    <span key={j} style={{ display: "inline-block", width: "1em", textAlign: "center" }}>
                                        {cell}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div> next 미노: {next.join(", ")}</div>
            <div> 위치: {`(${player.pos.x}, ${player.pos.y})`}</div>
            <div className={styles.grid}>
                {field.map((row, y) => {
                    return row.map((cell, x) => {
                        return (
                            <div
                                key={`${x}-${y}`}
                                className={`${styles.cell} ${styles.empty}`}
                                style={{backgroundColor: `rgb(${cell})`}}
                            >
                            </div>
                        );
                    })
                })}
                
                {/*
                {field.map((row, y) => {
                    return row.map((cell, x) => {
                        if (cell === -1) return null;
                        if (y < 2) {
                            if (cell === 0) return null;
                        }
                        return (
                            <div
                                key={`${x}-${y}`}
                                className={`${styles.cell} ${styles.empty}`}
                                style={{backgroundColor: `rgb(${cell})`}}
                            >
                            </div>
                        );
                    })
                })}
                    */}
            </div>
        </div>
    );
}
