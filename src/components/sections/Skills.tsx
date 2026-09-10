import { skills } from '../../data/skills'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export default function Skills() {
  const ref = useScrollReveal<HTMLElement>()

  return (
    <section id="skills" className="section reveal-section section-depth" ref={ref}>
      <div className="section-heading">
        <span>03 / SKILLS</span>
        <h2>Công cụ & năng lực<br /><em>tôi sử dụng.</em></h2>
      </div>

      <div className="skills-layout">
        <div className="skill-list">
          {skills.map((skill, index) => (
            <div className="skill-item" key={skill}>
              <span>{String(index + 1).padStart(2, '0')}</span>
              <strong>{skill}</strong>
              <i>↗</i>
            </div>
          ))}
        </div>

        <div className="skills-description">
          <span className="big-wf">WF</span>
          <p>
            Không chỉ sử dụng công nghệ — tôi tập trung vào việc
            <strong> biến công nghệ thành giải pháp.</strong>
          </p>
        </div>
      </div>
    </section>
  )
}
