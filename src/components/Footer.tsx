import styles from '../styles/Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© 2022 todos os direitos reservados <b>JS-W Portal</b></p>
      <div className={styles.links}>
        <a href="#">Termos de uso</a>
        <a href="#">Política de privacidade</a>
      </div>
    </footer>
  )
}