"use client";

import {useState} from "react";
import {useEffect} from "react";
import styles from "./Header.module.css";
import SideMenu from "./SideMenu";
import DarkMode from "./DarkMode";
import Link from "next/link";

export default function Header() {
    const [open, setOpen] = useState(false);

    return (
        <div className={styles.header}>
            <button className={`${styles.menuToggle} ${open ? styles.menuOpen : ""}`} onClick={() => setOpen(!open)}>
                ☰
            </button>

            <SideMenu open={open} setOpen={setOpen} />

            <h1 className={styles.title}><Link href="/">대 석 찬</Link></h1>

            <DarkMode></DarkMode>
        </div>
    )
}