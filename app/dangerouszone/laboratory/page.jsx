"use client";

import React, { useState, useEffect, useRef } from "react";
import styles from "./page.module.css";
import {
    createBag,
    makeNewLine,
    createField,
    rotateMino,
    rotateMinoCounter,
    isCollision,
    getGhostY,
    fixMinoToField
} from "./implements/functions.js";
import {
    FIELD_HEIGHT,
    FIELD_WIDTH,
    SRS,
    TETROMINOS,
} from "./implements/constants.js";

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
    const [intervalTrigger, setIntervalTrigger] = useState(0);

    const playerRef = useRef(player);
    const fieldRef = useRef(field);

    const initializeGame = () => {
        setField(createField);
        setNext([]);
        updatePlayer({mino: null, shape: null});
        updateHold({mino: null,});
    }

    const updatePlayer = (updates) => {
        setPlayer((prev) => ({ ...prev, ...updates }));
    };

    const updateHold = (updates) => {
        setHold((prev) => ({ ...prev, ...updates }));
    };

    const getNewMino = () => {
        let queue = [...next];

        if (queue.length === 0) {
            queue = createBag();
        } else if (queue.length < 7) {
            queue = [...queue, ...createBag()];
        }

        const [newMino, ...rest] = queue;
        updatePlayer({
            mino: newMino,
            pos: { x: newMino === "O" ? 6 : 5, y: 0 },
            rot: 0,
            shape: TETROMINOS[newMino].shape,
        });
        setNext(rest);
    };

    const getHoldMino = () => {
        const newHold = player.mino;
        updatePlayer({
            mino: hold.mino,
            pos: { x: hold.mino === "O" ? 6 : 5, y: 0 },
            rot: 0,
            shape: TETROMINOS[hold.mino].shape,
        });
        updateHold({ flag: true, mino: newHold });
    };

    const movePlayer = (dirx, diry, shape) => {
        const newX = playerRef.current.pos.x + dirx;
        const newY = playerRef.current.pos.y + diry;
        if (isCollision(field, shape, newX, newY)) {
            if (diry > 0)
                fixPlayer();
            return;
        }
        updatePlayer({
            pos: { x: newX, y: newY },
        });
    };

    const fixPlayer = () => {
        const cur = playerRef.current;
        const ghostY = getGhostY(field, cur.shape, cur.pos.x, cur.pos.y);
        const newField = fixMinoToField(field, cur.shape, cur.pos.x, ghostY);
        setField(newField);
        lineCheck(newField);
        getNewMino();
        updateHold({ flag: false });
    }

    const rotatePlayer = (direction) => {
        const cur = playerRef.current;
        let srsType = 'normal';
        switch (player.mino) {
            case 'I':
                srsType = 'I';
                break;
            case 'O':
                return; // O 미노는 회전이 불가능
            default:
                srsType = 'normal';
                break;
        }
        const newShape = direction === "clockwise"
            ? rotateMino(player.shape)
            : rotateMinoCounter(player.shape);
        const rotFrom = cur.rot;
        const rotTo = (rotFrom + (direction === "clockwise" ? 1 : 3) + 4) % 4;
        let srsDir = [0, 0];
        for (let i = 0; i < 5; i++) {
            console.log(rotFrom, " to ", rotTo, " SRS ", SRS[srsType][rotFrom][rotTo][i]);
            srsDir = SRS[srsType][rotFrom][rotTo][i];
            const newX = cur.pos.x + srsDir[0];
            const newY = cur.pos.y - srsDir[1]; // srs 테이블은 좌하단이 [0, 0], 내코드는 좌상단이 [0, 0]
            if (!isCollision(field, newShape, newX, newY)) {
                updatePlayer({
                    shape: newShape,
                    pos: { x: newX, y: newY },
                    rot: rotTo,
                });
                setIntervalTrigger((prev) => prev + 1);
                return;
            }
        }
    };

    //TODO: implement line check
    const lineCheck = (field) => {
        const tempField = [...field];
        for (let y = 2; y < FIELD_HEIGHT - 2; y++) {
            if (tempField[y].every(cell => cell !== 0)) {
                tempField.splice(y, 1);
                tempField.unshift(makeNewLine());
                console.log("line cleared at row:", y);
            }
        }
        setField(tempField);
    }

    const handleKeyPress = (event) => {
        const cur = playerRef.current;
        switch (event.key) {
            case "a":
            case "ArrowLeft":
                movePlayer(-1, 0, cur.shape);
                break;
            case "d":
            case "ArrowRight":
                movePlayer(1, 0, cur.shape);
                break;
            case "s":
            case "ArrowDown":
                movePlayer(0, 1, cur.shape);
                break;
            case "w":
            case "ArrowUp":
            case "x":
                rotatePlayer("clockwise");
                break;
            case "z":
                rotatePlayer("counterclockwise");
                break;
            case "c":
                if (hold.flag) break;
                if (hold.mino === null) {
                    updateHold({ flag: true, mino: player.mino });
                    getNewMino();
                } else {
                    getHoldMino();
                }
                break;
            case "t":
                break;
            case " ":
                fixPlayer();
                break;
            case "r":
                initializeGame();
                break;
            default:
                break;
        }
    };

    useEffect(() => {
        playerRef.current = player;
    }, [player]);

    useEffect(() => {
        const preventKeyList = [
            "ArrowLeft",
            "ArrowRight",
            "ArrowDown",
            "ArrowUp",
            "x",
            "z",
            "c",
            "w",
            "a",
            "s",
            "d",
            " ",
        ];
        const handleKeyDown = (event) => {
            if (preventKeyList.includes(event.key)) {
                event.preventDefault();
            }
            handleKeyPress(event);
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [player]);

    useEffect(() => {
        const interval = setInterval(() => {
            const cur = playerRef.current;
            movePlayer(0, 1, cur.shape);
        }, 888);
        return () => clearInterval(interval);
    }, [next, hold, intervalTrigger]);

    useEffect(() => {
        if (next.length <= 7) {
            const newBag = createBag();
            setNext((prev) => [...prev, ...newBag]);
        }
    }, [next]);

    useEffect(() => {
        if (player.mino === null && next.length > 0) {
            getNewMino();
        }
    }, [next]);

    return (
        <div className={styles.lab}>
            <h1>lab</h1>
            <div> 현재 미노: {player.mino}</div>
            <div> hold 미노: {hold.mino ?? "none"}</div>
            <div>
                현재 미노 shape:
                {player.shape === null ? (
                    "none"
                ) : (
                    <div style={{ lineHeight: "1.2" }}>
                        {player.shape.map((row, i) => (
                            <div key={i}>
                                {row.map((cell, j) => (
                                    <span
                                        key={j}
                                        style={{
                                            display: "inline-block",
                                            width: "1em",
                                            textAlign: "center",
                                        }}
                                    >
                                        {cell}
                                    </span>
                                ))}
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div> next 미노: {next.join(", ")}</div>
            <div> 위치: ({player.pos.x}, {player.pos.y})</div>

            <div className={styles.grid}>
                {
                    (() => {
                        const { shape, pos, mino } = player;
                        let ghostY = pos.y;
                        if (shape) {
                            while (!isCollision(field, shape, pos.x, ghostY + 1)) {
                                ghostY++;
                            }
                        }

                        return field.map((row, y) => {
                            return row.map((cell, x) => {
                                const relY = y - pos.y;
                                const relX = x - pos.x;
                                const ghostRelY = y - ghostY;

                                const isActive =
                                    shape &&
                                    relY >= 0 &&
                                    relY < shape.length &&
                                    relX >= 0 &&
                                    relX < shape[0].length &&
                                    shape[relY][relX];

                                const isGhost =
                                    !isActive &&
                                    cell === 0 &&
                                    shape &&
                                    ghostRelY >= 0 &&
                                    ghostRelY < shape.length &&
                                    relX >= 0 &&
                                    relX < shape[0].length &&
                                    shape[ghostRelY][relX];

                                if (cell === "170, 170, 170") {
                                    return null;
                                }

                                const getClassName = () => {
                                    if (y < 2) {
                                        return `${styles.hiddenCell}`;
                                    }
                                    else {
                                        return `${styles.cell}`;
                                    }
                                }

                                const getBackgroundColor = () => {
                                    if (cell !== 0) {
                                        return `rgb(${TETROMINOS[cell].color})`;
                                    } else if (isActive) {
                                        return `rgb(${TETROMINOS[mino].color})`;
                                    } else if (isGhost) {
                                        return `rgba(${TETROMINOS[mino].color}, 0.3)`;
                                    } else {
                                        return "transparent";
                                    }
                                };

                                const cellStyle = {
                                    backgroundColor: getBackgroundColor(),
                                };

                                return (
                                    <div
                                        key={`${x}-${y}`}
                                        className={getClassName()}
                                        style={cellStyle}
                                    ></div>
                                );
                            });
                        });
                    })()
                }
            </div>
            <div className={styles.rightPanel}>
                <div className={styles.hold}>
                    hold
                </div>
                <div className = {styles.next}>
                    
                    nexts
                    <div> next[0] </div>
                    <div> next[1] </div>
                    <div> next[2] </div>
                    <div> next[3] </div>
                    <div> next[4] </div>
                </div>
            </div>
        </div>
    );
}
