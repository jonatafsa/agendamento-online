import styles from '../styles/Nav.module.scss'

export default function UserNav() {
  return (
    <div className={styles.user__navigation}>
      <div className={styles.user}>
        <img src="http://github.com/jonatafsa.png" alt="avatar" />
      </div>

      <div className={styles.notification}>
        <svg width="24" height="29" viewBox="0 0 24 29" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M16.004 23.6357C16.004 24.6695 15.5933 25.661 14.8623 26.392C14.1313 27.123 13.1399 27.5336 12.1061 27.5336C11.0723 27.5336 10.0808 27.123 9.34983 26.392C8.61883 25.661 8.20816 24.6695 8.20816 23.6357M13.0429 5.44936L11.1381 5.44546C6.79322 5.43506 3.02134 8.96527 2.99146 13.2413V18.1656C2.99146 19.1921 2.86153 20.1939 2.30153 21.0475L1.92863 21.6166C1.36083 22.4793 1.9715 23.6357 2.99146 23.6357H21.2207C22.2406 23.6357 22.85 22.4793 22.2835 21.6166L21.9106 21.0475C21.3519 20.1939 21.2207 19.1908 21.2207 18.1643V13.2426C21.1687 8.96527 17.3877 5.45975 13.0429 5.44936V5.44936Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M12.1062 1.54749C12.7954 1.54749 13.4563 1.82127 13.9437 2.3086C14.431 2.79593 14.7048 3.4569 14.7048 4.14609V5.4454H9.50757V4.14609C9.50757 3.4569 9.78135 2.79593 10.2687 2.3086C10.756 1.82127 11.417 1.54749 12.1062 1.54749Z" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={styles.alerts}>1</span>
      </div>
    </div>
  )
}