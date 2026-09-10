import { useEffect, useRef, useState } from 'react'
import { useScrollReveal } from '../../hooks/useScrollReveal'

const metrics = [
  ['04', '+', 'Dự án public'],
  ['04', '', 'Nền tảng triển khai'],
  ['06', '+', 'Nhóm năng lực'],
  ['01', '', 'Portfolio đang phát triển'],
]

function Metric({ value, suffix, label }: { value: string; suffix: string; label: string }) {
  const ref = useRef<HTMLDivElement | null>(null)
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    let frame = 0
    let start = 0
    let active = false

    const animate = (timestamp: number) => {
      if (!active) return
      if (!start) start = timestamp
      const progress = Math.min((timestamp - start) / 850, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(Number(value) * eased))
      if (progress < 1) frame = window.requestAnimationFrame(animate)
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        active = true
        start = 0
        setDisplay(0)
        frame = window.requestAnimationFrame(animate)
      } else {
        active = false
        window.cancelAnimationFrame(frame)
        start = 0
        setDisplay(0)
      }
    }, { threshold: 0.45 })

    observer.observe(element)
    return () => {
      active = false
      window.cancelAnimationFrame(frame)
      observer.disconnect()
    }
  }, [value])

  return (
    <div className="proof-card" ref={ref}>
      <strong>{String(display).padStart(2, '0')}{suffix}</strong>
      <span>{label}</span>
    </div>
  )
}

export default function Proof() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="proof" className="section proof-section reveal-section" ref={ref}>
      <div className="section-heading row-heading">
        <div>
          <span>06 / PROOF OF WORK</span>
          <h2>Không chỉ nói về<br /><em>năng lực.</em></h2>
        </div>
        <p>
          Portfolio này kết nối trực tiếp đến các sản phẩm đã được publish,
          để người xem có thể kiểm chứng bằng trải nghiệm thực tế.
        </p>
      </div>

      <div className="proof-grid">
        {metrics.map(([value, suffix, label]) => (
          <Metric key={label} value={value} suffix={suffix} label={label} />
        ))}
      </div>

      <div className="proof-quote">
        <span>THINK · BUILD · DEPLOY · IMPROVE</span>
        <p>
          Từ một nhu cầu thực tế, tôi tìm cách biến nó thành một hệ thống có thể
          sử dụng, đo lường và tiếp tục mở rộng.
        </p>
      </div>
    </section>
  )
}
