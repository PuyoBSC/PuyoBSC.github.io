import styles from "./Footer.module.css";

export default function Footer() {
    return (
        <div className={styles.footer}>
            <span>2025 <strong>BSC</strong>'s <strong>S</strong>paghetti <strong>C</strong>ode. All rights reversed.</span>
            {/* 나는 이 코드를 작성하는 것이 정말 싫다. */}
            <span>Made with <strong>React</strong> and <strong>Next.js</strong>.</span>
            {/* and fucking stupid ChatGPT. BOYCOTT THIS STUPID LANGUAGE MODEL */}
        </div>
    )
}