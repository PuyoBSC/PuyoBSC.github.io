"use client";

import { useState } from "react";
import SideMenu from "./SideMenu";
import styles from "./SideMenuToggle.module.css";

export default function SideMenuToggle() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <button
                className={styles.menuToggle}
                onClick={() => setOpen(!open)}
            >
                {open ? null : '☰'  }
            </button>

            <SideMenu open={open} setOpen={setOpen} />
        </>
    );
}
