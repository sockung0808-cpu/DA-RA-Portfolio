import { useScrollReveal } from '../../hooks/useScrollReveal'

const features = [
  ['◉', 'QUẢN LÝ HIỆU QUẢ', 'Tối ưu quy trình'],
  ['ϟ', 'VẬN HÀNH TỐI ƯU', 'Tiết kiệm thời gian'],
  ['∞', 'KẾT NỐI THÀNH CÔNG', 'Phát triển bền vững'],
  ['◎', 'QUYẾT ĐỊNH CHÍNH XÁC', 'Dựa trên dữ liệu'],
]

export default function FeatureStrip() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section className="feature-strip" ref={ref} aria-label="Điểm mạnh">
      {features.map(([icon, title, subtitle]) => (
        <div key={title}>
          <span className="feature-icon">{icon}</span>
          <div>
            <strong>{title}</strong>
            <small>{subtitle}</small>
          </div>
        </div>
      ))}
    </section>
  )
}
