import styles from '../styles/Footer.module.scss'

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <p>© {new Date().getFullYear()} todos os direitos reservados <b>CT MUAY THAI GIRLS</b></p>
      <div className={styles.links}>
        <a href="#">Termos de uso</a>
        <a href="#">Política de privacidade</a>
      </div>
    </footer>
  )
}