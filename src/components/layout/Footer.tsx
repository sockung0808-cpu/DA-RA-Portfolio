import { images } from '../../data/images'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-brand">
        <div className="footer-logo"><img src={images.logoNav} alt="ĐA RA" /></div>
        <div>
          <strong>ĐA RA</strong>
          <small>IT MANAGER</small>
        </div>
      </div>

      <p>BUILD SYSTEMS • SOLVE PROBLEMS • CREATE VALUE</p>
      <span>© 2026 ĐA RA</span>
    </footer>
  )
}
