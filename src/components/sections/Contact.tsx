import { useScrollReveal } from '../../hooks/useScrollReveal'
import { profile } from '../../data/profile'

export default function Contact() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="contact" className="section contact-section reveal-section section-depth" ref={ref}>
      <div className="contact-card">
        <div className="contact-copy">
          <span>09 / CONTACT</span>
          <h2>
            Hãy cùng xây dựng
            <br />
            <em>một hệ thống tốt hơn.</em>
          </h2>

          <p>
            Tôi quan tâm đến các dự án về hạ tầng mạng, IT Management,
            Web Application, Automation và Digital Transformation.
          </p>

          <div className="contact-cta-row">
            <a className="btn-primary contact-email" href={`mailto:${profile.email}`}>
              Gửi email <span>↗</span>
            </a>

            <a
              className="btn-outline"
              href="/cv/DA-RA-CV.pdf"
              target="_blank"
              rel="noreferrer"
            >
              Xem CV <span>↗</span>
            </a>
          </div>
        </div>

        <div className="contact-details">
          <a href={`mailto:${profile.email}`}>
            <small>EMAIL</small>
            {profile.email}
          </a>

          <a href={`tel:${profile.phone}`}>
            <small>PHONE</small>
            {profile.phoneDisplay}
          </a>

          <div>
            <small>CURRENT ROLE</small>
            {profile.role}
          </div>

          <div>
            <small>LOCATION</small>
            {profile.location}
          </div>

          <div className="contact-status">
            <span className="status-dot" />
            Sẵn sàng trao đổi về dự án & giải pháp IT
          </div>
        </div>
      </div>
    </section>
  )
}
