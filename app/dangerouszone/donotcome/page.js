// pages/index.js
'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';


export default function Home() {
  const[count, setCount] = useState(0);

  const handleKeyDown = (event) => {
    if (event.key === "ArrowUp") {
      console.log("count:", count);  // 항상 초기값 0만 출력될 수 있음
      setCount(count + 1);
    }
  };

  useEffect(() => {
    console.log("count: ", count);  // 항상 초기값 0만 출력될 수 있음
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]); //


  return (
    <div onKeyDown={handleKeyDown}>
      <h1>{count === 0 ? "This is fucking stupid idiot page. Press ArrowUp(↑)" : "FuckFuckFuckCodingistoohardtomaster"}</h1>
      <div>
        <h2>count: {count}</h2>
      </div>
    </div>
  );
}