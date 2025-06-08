"use client";

import styles from "./DarkMode.module.css";
import { useState, useEffect } from "react";

export default function DarkModeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme) {
      setDark(savedTheme === "dark");
    } else {
      const pcs = window.matchMedia("(prefers-color-scheme: dark)").matches;
      setDark(pcs);
    }
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  console.log("Styles:", styles);
  console.log("Button class:", styles.darkModeButton);

  return (
    <button className={styles.darkModeButton} onClick={() => setDark(!dark)}>
      {dark ? "🌙" : "☀️"}
    </button>
  );
}
