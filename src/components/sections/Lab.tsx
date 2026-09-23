import { useScrollReveal } from '../../hooks/useScrollReveal'

const labs = [
  ['01', 'CCNA / Networking', 'Packet Tracer, subnetting, LAN/WAN và tư duy network theo môi trường doanh nghiệp.'],
  ['02', 'Ubuntu / Server', 'Linux, service, file sharing, permissions và home-lab mindset.'],
  ['03', 'IoT / ESP32', 'Cảm biến nhiệt độ, độ ẩm, ánh sáng và điều khiển thiết bị.'],
  ['04', 'Automation', 'Telegram Bot, workflow và tự động hóa các tác vụ lặp lại.'],
]

export default function Lab() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="lab" className="section reveal-section section-depth" ref={ref}>
      <div className="section-heading">
        <span>07 / LAB</span>
        <h2>Learning by<br /><em>building.</em></h2>
        <p>
          Những phòng lab và thử nghiệm cá nhân giúp tôi liên tục học bằng cách
          xây dựng sản phẩm thật.
        </p>
      </div>

      <div className="lab-grid">
        {labs.map(([number, title, text]) => (
          <article className="lab-card" key={title}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
            <div className="lab-line" />
          </article>
        ))}
      </div>
    </section>
  )
}
