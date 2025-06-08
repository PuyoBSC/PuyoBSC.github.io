import { Noto_Sans_Bhaiksuki } from "next/font/google";
import styles from "./SideMenu.module.css";
import Link from "next/link";

export default function SideMenu({ open, setOpen }) {

  return (
    <div>
      <div className={`${styles.sideMenu} ${open ? styles.sideMenuOpen : ""}`}>
        <nav>
          <ul>
            <li><Link href="/">홈</Link></li>
            <li><Link href="/Test">서비스</Link></li>
            <li><Link href="/Test2">프로젝트</Link></li>
            <li><Link href="/Test3">연락처</Link></li>
          </ul>
          <ul>
            <li><Link href="/dangerouszone/donotcome">접근엄금</Link></li>
            <li></li>
            <li></li>
            <li><Link href="/dangerouszone/laboratory">실험실</Link></li>
          </ul>
        </nav>
      </div>

      {open && <div className={styles.overlay} onClick={() => setOpen(false)}></div>}
    </div>
  )
}
