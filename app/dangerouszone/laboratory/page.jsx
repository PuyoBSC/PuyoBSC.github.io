"use client";

import React, { useState, useEffect, useRef } from "react";
import NextList from "./components/NextList";
import styles from "./page.module.css";
import {
    createBag,
    makeNewLine,
    createField,
    rotateMino,
    rotateMinoCounter,
    isCollision,
    getGhostY,
    fixMinoToField,
    checkGameOver,
} from "./implements/functions.js";
import {
    FIELD_HEIGHT,
    FIELD_WIDTH,
    SRS,
    TETROMINOS,
} from "./implements/constants.js";

export default function Lab() {
    const [field, setField] = useState(createField);
    const [player, setPlayer] = useState({ mino: null, pos: { x: 0, y: 0 }, rot: 0, shape: null });
    const [next, setNext] = useState([]);
    const [hold, setHold] = useState({ flag: false, mino: null });
    const [intervalTrigger, setIntervalTrigger] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const playerRef = useRef(player);
    const fieldRef = useRef(field);

    const updatePlayer = (updates) => setPlayer(prev => ({ ...prev, ...updates }));
    const updateHold = (updates) => setHold(prev => ({ ...prev, ...updates }));

    const initializeGame = () => {
        setField(createField);
        setNext([]);
        updatePlayer({ mino: null, shape: null });
        updateHold({ flag: false, mino: null });
        setGameOver(false);
    };

    const getNewMino = () => {
        let queue = [...next];
        if (queue.length === 0 || queue.length < 7) queue = [...queue, ...createBag()];

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

    const movePlayer = (dx, dy, shape) => {
        const newX = playerRef.current.pos.x + dx;
        const newY = playerRef.current.pos.y + dy;
        if (isCollision(field, shape, newX, newY)) {
            if (dy > 0) fixPlayer();
            return;
        }
        updatePlayer({ pos: { x: newX, y: newY } });
    };

    const fixPlayer = () => {
        const cur = playerRef.current;
        const ghostY = getGhostY(field, cur.shape, cur.pos.x, cur.pos.y);
        let newField = fixMinoToField(field, cur.shape, cur.pos.x, ghostY);
        newField = lineCheck(newField);
        setField(newField);
        getNewMino();
        updateHold({ flag: false });
        if (checkGameOver(newField)) setGameOver(true);
    };

    const rotatePlayer = (direction) => {
        const cur = playerRef.current;
        const srsType = player.mino === "I" ? "I" : "normal";
        if (player.mino === "O") return;

        const newShape = direction === "clockwise" ? rotateMino(player.shape) : rotateMinoCounter(player.shape);
        const rotFrom = cur.rot;
        const rotTo = (rotFrom + (direction === "clockwise" ? 1 : 3)) % 4;

        for (const [dx, dy] of SRS[srsType][rotFrom][rotTo]) {
            const newX = cur.pos.x + dx;
            const newY = cur.pos.y - dy;
            if (!isCollision(field, newShape, newX, newY)) {
                updatePlayer({ shape: newShape, pos: { x: newX, y: newY }, rot: rotTo });
                setIntervalTrigger(prev => prev + 1);
                return;
            }
        }
    };

    const lineCheck = (f) => {
        const newField = [...f];
        for (let y = 2; y < FIELD_HEIGHT - 2; y++) {
            if (newField[y].every(cell => cell !== 0)) {
                newField.splice(y, 1);
                newField.unshift(makeNewLine());
            }
        }
        return newField;
    };

    const handleKeyPress = (e) => {
        const cur = playerRef.current;
        const key = e.key;
        if (["a", "ArrowLeft"].includes(key)) movePlayer(-1, 0, cur.shape);
        else if (["d", "ArrowRight"].includes(key)) movePlayer(1, 0, cur.shape);
        else if (["s", "ArrowDown"].includes(key)) movePlayer(0, 1, cur.shape);
        else if (["w", "ArrowUp", "x"].includes(key)) rotatePlayer("clockwise");
        else if (key === "z") rotatePlayer("counterclockwise");
        else if (key === "c") {
            if (!hold.flag) {
                if (hold.mino === null) {
                    updateHold({ flag: true, mino: player.mino });
                    getNewMino();
                } else {
                    getHoldMino();
                }
            }
        }
        else if (key === " ") fixPlayer();
        else if (key === "r") initializeGame();
    };

    useEffect(() => { playerRef.current = player; }, [player]);

    useEffect(() => {
        if (gameOver) return;
        const keys = ["ArrowLeft", "ArrowRight", "ArrowDown", "ArrowUp", "x", "z", "c", "w", "a", "s", "d", " "];
        const downHandler = e => {
            if (keys.includes(e.key)) e.preventDefault();
            handleKeyPress(e);
        };
        window.addEventListener("keydown", downHandler);
        return () => window.removeEventListener("keydown", downHandler);
    }, [player]);

    useEffect(() => {
        if (gameOver) return alert("Game Over!");
        const interval = setInterval(() => movePlayer(0, 1, playerRef.current.shape), 666);
        return () => clearInterval(interval);
    }, [next, hold, intervalTrigger, gameOver]);

    useEffect(() => {
        if (next.length <= 7) setNext(prev => [...prev, ...createBag()]);
    }, [next]);

    useEffect(() => {
        if (!player.mino && next.length > 0) getNewMino();
    }, [next]);

    return (
        <div className={styles.lab}>
            <div className={styles.mainField}>
                <div className={styles.restart}><button onClick={initializeGame}>Restart</button></div>

                <div className={styles.grid}>
                    {field.map((row, y) => row.map((cell, x) => {
                        const { shape, pos, mino } = player;
                        const relY = y - pos.y;
                        const relX = x - pos.x;
                        const ghostY = shape ? getGhostY(field, shape, pos.x, pos.y) : pos.y;
                        const ghostRelY = y - ghostY;

                        const isActive = shape && relY >= 0 && relY < shape.length && relX >= 0 && relX < shape[0].length && shape[relY][relX];
                        const isGhost = !isActive && cell === 0 && shape && ghostRelY >= 0 && ghostRelY < shape.length && relX >= 0 && relX < shape[0].length && shape[ghostRelY][relX];
                        if (cell === "170, 170, 170") return null;

                        const getClassName = () => (y < 2 ? styles.hiddenCell : styles.cell);
                        const getBackgroundColor = () => {
                            if (cell !== 0) return `rgb(${TETROMINOS[cell].color})`;
                            if (isActive) return `rgb(${TETROMINOS[mino].color})`;
                            if (isGhost) return `rgba(${TETROMINOS[mino].color}, 0.3)`;
                            return "transparent";
                        };

                        return <div key={`${x}-${y}`} className={getClassName()} style={{ backgroundColor: getBackgroundColor() }} />;
                    }))}
                </div>

                <div className={styles.rightPanel}>
                    <div className={styles.hold}>
                        hold
                        <NextList className={styles.list} key="hold" nextMino={hold.mino} />
                    </div>
                    <div className={styles.next}>
                        nexts
                        {next.slice(0, 5).map((mino, i) => (
                            <NextList className={styles.list} key={i} nextMino={mino} />
                        ))}
                    </div>
                </div>
            </div>

            <div className={styles.bulletinBoard}>
                <h2>Bulletin Board</h2>
                <p>here is bsclab</p>
                <p>키보드 조작: A/D(좌우 이동), S(하강), W(시계 회전), Z(반시계), C(홀드), Space(고정), R(재시작)</p>
                <p>&nbsp;</p>
                <h3>구현 내용</h3>
                <ul>
                    <li>Hold</li>
                    <li>Nexts 표시</li>
                    <li>Wall Kick - SRS</li>
                    <li>라인 삭제</li>
                    <li>게임 오버</li>
                    <li>기타 등등</li>
                </ul>
                <p>&nbsp;</p>
                <h3>예정</h3>
                <ul>
                    <li>점수</li>
                    <li>티스핀 감지</li>
                    <li>모바일</li>
                </ul>
            </div>
        </div>
    );
}
