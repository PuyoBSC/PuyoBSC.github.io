import Link from "next/link";
import styles from "./Header.module.css";
import SideMenuToggle from "./SideMenuToggle";
import DarkMode from "./DarkMode";

export default function Header() {
    return (
        <div className={styles.header}>
            <SideMenuToggle />

            <h1 className={styles.title}>
                <Link href="/">대 석 찬</Link>
            </h1>

            <DarkMode />
        </div>
    );
}
