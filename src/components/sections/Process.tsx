import { useScrollReveal } from '../../hooks/useScrollReveal'

const steps = [
  ['01', 'Xác định vấn đề', 'Hiểu nhu cầu thực tế và điểm nghẽn trong công việc.'],
  ['02', 'Phân tích quy trình', 'Xác định dữ liệu, người dùng và các bước cần tối ưu.'],
  ['03', 'Thiết kế giải pháp', 'Chọn kiến trúc và công nghệ phù hợp với nguồn lực.'],
  ['04', 'Xây dựng hệ thống', 'Phát triển, kiểm thử và hoàn thiện chức năng.'],
  ['05', 'Đưa vào vận hành', 'Đào tạo người dùng và chuyển giao quy trình.'],
  ['06', 'Đo lường & tối ưu', 'Theo dõi kết quả và tiếp tục cải tiến.'],
]

export default function Process() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="process" className="section reveal-section section-depth" ref={ref}>
      <div className="section-heading">
        <span>04 / PROCESS</span>
        <h2>Từ vấn đề<br /><em>đến giải pháp.</em></h2>
        <p>Quy trình làm việc tập trung vào kết quả, khả năng vận hành và khả năng mở rộng.</p>
      </div>

      <div className="process-grid">
        {steps.map(([number, title, text]) => (
          <article className="process-card" key={number}>
            <span>{number}</span>
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
