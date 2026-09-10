import { images } from '../../data/images'
import { useParallax } from '../../hooks/useParallax'
type HeroProps = {
  onNavigate: (id: string) => void
}

export default function Hero({ onNavigate }: HeroProps) {
  const visualRef = useParallax<HTMLDivElement>(0.055)

  return (
    <section id="home" className="hero section">
      <div className="hero-copy reveal">
        <div className="hero-badge">
          <span className="pulse" />
          XIN CHÀO, TÔI LÀ ĐA RA
        </div>

        <p className="hero-proof">
          NETWORK INFRASTRUCTURE · IT MANAGEMENT · WEB APPS · AUTOMATION
        </p>

        <h1>
          ĐA <span>RA</span>
        </h1>

        <h2>IT MANAGER</h2>

        <div className="hero-line">
          Hạ tầng mạng <i /> Quản trị IT <i /> Giải pháp <i /> Tự động hóa
        </div>

        <p className="hero-description">
          Hiện đang phụ trách <strong>Hạ tầng mạng</strong>, đồng thời phát triển
          các hệ thống web và automation để giải quyết những bài toán vận hành
          thực tế. Tôi tập trung vào sự kết nối giữa
          <strong> con người – hạ tầng – công nghệ – dữ liệu</strong>.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => onNavigate('projects')}>
            <span>↗</span>
            Xem dự án
          </button>

          <button className="btn-outline" onClick={() => onNavigate('contact')}>
            Kết nối với tôi
            <span>→</span>
          </button>
        </div>

        <div className="hero-stats">
          <div><strong>04+</strong><span>Dự án public</span></div>
          <div><strong>01</strong><span>Vai trò hiện tại: Hạ tầng mạng</span></div>
          <div><strong>∞</strong><span>Học bằng xây dựng</span></div>
        </div>
      </div>

      <div className="hero-visual hero-profile-visual reveal reveal-delay" ref={visualRef}>
        <div className="hero-tech-orbit orbit-a" />
        <div className="hero-tech-orbit orbit-b" />

        <div className="portrait-frame">
          <div className="portrait-glow" />
          <img
            src={images.portrait}
            alt="Chân dung Đa Ra"
            fetchPriority="high"
          />
        </div>

        <img
          className="hero-logo-watermark"
          src={images.logo}
          alt=""
          aria-hidden="true"
        />

        <div className="hero-sig">ĐA RA</div>

        <div className="hero-side-label">
          <span>FOCUS</span>
          <span>SOLUTION</span>
          <span>VALUE</span>
        </div>
      </div>
    </section>
  )
}
