import styles from '../styles/Loading.module.scss'

export default function Loading() {
  return (
    <div className={styles.container}>
      <div className={styles.yellow}></div>
      <div className={styles.red}></div>
      <div className={styles.blue}></div>
      <div className={styles.violet}></div>
    </div>
  )
}