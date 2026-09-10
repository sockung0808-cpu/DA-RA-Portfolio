import { images } from '../../data/images'
import { useEffect, useState } from 'react'

const items = [
  ['home', 'Trang chủ'],
  ['about', 'Giới thiệu'],
  ['projects', 'Dự án'],
  ['skills', 'Kỹ năng'],
  ['process', 'Quy trình'],
  ['experience', 'Kinh nghiệm'],
  ['proof', 'Proof'],
  ['lab', 'Lab'],
  ['contact', 'Liên hệ'],
] as const

type NavbarProps = {
  activeSection: string
  onNavigate: (id: string) => void
}

export default function Navbar({ activeSection, onNavigate }: NavbarProps) {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const navigate = (id: string) => {
    onNavigate(id)
    setOpen(false)
  }

  return (
    <header className={`navbar ${open ? 'menu-open' : ''}`}>
      <button className="brand" onClick={() => navigate('home')} aria-label="Trang chủ">
        <div className="brand-logo-image">
          <img src={images.logoNav} alt="ĐA RA logo" />
        </div>
        <div className="brand-text">
          <strong>ĐA RA</strong>
          <small>IT MANAGER</small>
        </div>
      </button>

      <nav className={`nav-menu ${open ? 'open' : ''}`} aria-label="Điều hướng chính">
        {items.map(([id, label]) => (
          <button
            key={id}
            className={activeSection === id ? 'active' : ''}
            aria-current={activeSection === id ? 'page' : undefined}
            onClick={() => navigate(id)}
          >
            {label}
          </button>
        ))}
      </nav>

      <button className="nav-contact" onClick={() => navigate('contact')}>
        <span>✉</span>
        Liên hệ ngay
      </button>

      <button
        className="mobile-menu"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? 'Đóng menu' : 'Mở menu'}
        aria-expanded={open}
      >
        {open ? '×' : '☰'}
      </button>
    </header>
  )
}
