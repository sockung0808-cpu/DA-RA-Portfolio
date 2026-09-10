import { useScrollReveal } from '../../hooks/useScrollReveal'

const items = [
  [
    'HIỆN TẠI',
    'Trưởng bộ phận Hạ tầng mạng',
    'Phụ trách hạ tầng mạng và định hướng vận hành hệ thống. Tập trung vào tính ổn định, khả năng hỗ trợ và cải tiến hạ tầng.'
  ],
  [
    '2026-02 → 2026-09',
    'Kỹ Thuật Hành Chính',
    'Công ty Cổ phần Nông nghiệp THACO AGRI Trường Hải — xử lý sự cố thiết bị CNTT văn phòng, thiết lập thiết bị cho hội nghị/sự kiện và hỗ trợ người dùng.'
  ],
  [
    '2025-02 → 2025-09',
    'Nhân Viên Kỹ Thuật Sản Phẩm',
    'Công ty TNHH Thương Mại Và Dịch Vụ Kỹ Thuật Minh Nguyệt — kiểm tra chức năng sản phẩm và bảo hành tester.'
  ],
  [
    '2024',
    'Thực Tập Sinh Đào Tạo',
    'Tổng công ty Truyền thông — tổ vô tuyến, kiểm tra hoạt động trạm phát sóng.'
  ],
]

export default function Experience() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="experience" className="section reveal-section section-depth" ref={ref}>
      <div className="section-heading">
        <span>05 / EXPERIENCE</span>
        <h2>Hành trình<br /><em>phát triển.</em></h2>
      </div>

      <div className="experience">
        <div className="experience-line" />
        {items.map(([year, title, text]) => (
          <article className="experience-item" key={`${year}-${title}`}>
            <span className="experience-dot" />
            <div className="experience-year">{year}</div>
            <div className="experience-content">
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
