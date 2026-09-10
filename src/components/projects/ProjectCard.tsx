import type { ProjectCaseStudy } from '../../data/projects'
import { projectLinks } from '../../data/links'
import { useScrollReveal } from '../../hooks/useScrollReveal'

type ProjectCardProps = {
  project: ProjectCaseStudy
  onOpen: () => void
}

export default function ProjectCard({ project, onOpen }: ProjectCardProps) {
  const ref = useScrollReveal<HTMLElement>()
  const demo = projectLinks[project.title]?.demo

  return (
    <article
      className="project-card reveal-section"
      ref={ref}
      onClick={(event) => {
        if ((event.target as HTMLElement).closest('a, button')) return
        onOpen()
      }}
    >
      <div className="project-cover">
        <img src={project.image} alt={`${project.title} screenshot`} loading="lazy" decoding="async" />
        <div className="project-cover-overlay">
          <span>{project.category}</span>
          <strong>VIEW CASE STUDY</strong>
        </div>
      </div>

      <div className="project-top">
        <span className="project-number">{project.number}</span>
        <span className="project-category">{project.category}</span>
        <span className="project-icon">{project.icon}</span>
      </div>

      <h3>{project.title}</h3>
      <p>{project.description}</p>

      <div className="tech-list">
        {project.tech.map((item) => (
          <span key={item}>{item}</span>
        ))}
      </div>

      <div className="project-actions">
        {demo && (
          <a
            className="project-live"
            href={demo}
            target="_blank"
            rel="noreferrer"
            onClick={(event) => event.stopPropagation()}
          >
            LIVE DEMO ↗
          </a>
        )}

        <button
          className="project-detail"
          onClick={(event) => {
            event.stopPropagation()
            onOpen()
          }}
        >
          Case Study <span>→</span>
        </button>
      </div>
    </article>
  )
}
