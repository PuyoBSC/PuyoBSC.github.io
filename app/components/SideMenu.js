"use client"; // 클라이언트에서 실행되도록 설정

import { Noto_Sans_Bhaiksuki } from "next/font/google";
import styles from "./SideMenu.module.css"; // CSS 모듈 import
import Link from "next/link";

export default function SideMenu({ open, setOpen }) {

  return (
    <div>
      {/* 사이드 메뉴 */}
      <div className={`${styles.sideMenu} ${open ? styles.open : ""}`}>
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

      {/* 오버레이 배경 (메뉴 열렸을 때 화면 클릭 시 닫힘) */}
      {open && <div className={styles.overlay} onClick={() => setOpen(false)}></div>}
    </div>
  )
}
