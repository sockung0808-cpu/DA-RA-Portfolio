import { images } from '../../data/images'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const cards = [
  ['01', '⌁', 'Network Infrastructure', 'Tập trung vào hạ tầng mạng, kết nối, thiết bị và khả năng vận hành ổn định cho hệ thống.'],
  ['02', '◇', 'IT Management', 'Quản lý thiết bị CNTT, hỗ trợ người dùng, quy trình vận hành và các vấn đề kỹ thuật thực tế.'],
  ['03', 'ϟ', 'System Development', 'Tự xây dựng web app, dashboard và automation để số hóa những công việc có thể tối ưu.'],
]

export default function About() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="about" className="section reveal-section section-depth" ref={ref}>
      <div className="section-heading">
        <span>01 / ABOUT</span>
        <h2>Tôi xây dựng<br /><em>hệ thống giải quyết vấn đề.</em></h2>
        <p>
          Điểm mạnh của tôi là kết hợp kiến thức hạ tầng, hỗ trợ kỹ thuật,
          quản trị IT và phát triển phần mềm để biến nhu cầu thực tế thành giải pháp.
        </p>
      </div>

      <div className="about-intro">
        <div className="about-photo">
          <img
            src={images.portrait}
            alt="Chân dung Đa Ra"
            loading="lazy"
          />
        </div>

        <div className="about-intro-copy">
          <span>ĐA RA / TRƯỞNG BỘ PHẬN HẠ TẦNG MẠNG</span>
          <h3>
            Connect.<br />
            Solve.<br />
            <em>Improve.</em>
          </h3>
          <p>
            Tôi bắt đầu từ một vấn đề cụ thể — hệ thống chậm, thiết bị lỗi,
            quy trình thủ công hoặc dữ liệu khó kiểm soát — sau đó phân tích,
            xây dựng và đưa ra giải pháp có thể vận hành thực tế.
          </p>
        </div>
      </div>

      <div className="about-grid">
        {cards.map(([number, icon, title, text]) => (
          <article className="about-card" key={title}>
            <span className="about-number">{number}</span>
            <div className="about-icon">{icon}</div>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
