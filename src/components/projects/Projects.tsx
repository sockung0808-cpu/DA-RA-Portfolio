import { useEffect, useMemo, useState } from 'react'
import { projectCategories, projects as staticProjects, type ProjectCaseStudy } from '../../data/projects'
import { getPublicProjects, type ProjectRecord } from '../../lib/content'
import { projectLinks } from '../../data/links'
import ProjectCard from './ProjectCard'
import { useScrollReveal } from '../../hooks/useScrollReveal'

type ProjectsProps = {
  onContact: () => void
}

function categoryMatches(project: ProjectCaseStudy, filter: string) {
  if (filter === 'ALL') return true
  if (filter === 'MANAGEMENT') return project.category.includes('MANAGEMENT')
  if (filter === 'IT OPERATIONS') return project.category.includes('OPERATIONS')
  if (filter === 'AUTOMATION') return project.tech.some((tag) => tag.toLowerCase().includes('automation'))
  if (filter === 'WAREHOUSE') return project.category.includes('WAREHOUSE')
  return true
}

export default function Projects({ onContact }: ProjectsProps) {
  const ref = useScrollReveal<HTMLElement>()
  const [selected, setSelected] = useState<ProjectCaseStudy | null>(null)
  const [projects, setProjects] = useState<ProjectCaseStudy[]>(staticProjects)
  const [filter, setFilter] = useState<(typeof projectCategories)[number]>('ALL')

  useEffect(() => {
    getPublicProjects().then((rows: ProjectRecord[]) => {
      setProjects(rows.map((row) => ({
        ...row,
        image: row.image || '',
        number: row.number || '00',
        tech: row.tech || [],
        features: row.features || [],
        icon: row.icon || '◈',
        role: row.role || '',
        problem: row.problem || '',
        solution: row.solution || '',
        result: row.result || '',
        demo_url: row.demo_url || null,
        github_url: row.github_url || null,
      })))
    }).catch(() => {
      // Keep the static dataset if Supabase is temporarily unavailable.
    })
  }, [])

  const filteredProjects = useMemo(
    () => projects.filter((project) => categoryMatches(project, filter)),
    [projects, filter],
  )

  useEffect(() => {
    if (!selected) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setSelected(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [selected])

  const links = selected
    ? {
        demo: selected.demo_url || projectLinks[selected.title]?.demo,
        github: selected.github_url || projectLinks[selected.title]?.github,
      }
    : undefined

  return (
    <>
      <section id="projects" className="section projects-section reveal-section section-depth" ref={ref}>
        <div className="section-heading row-heading">
          <div>
            <span>02 / PROJECTS</span>
            <h2>Những gì tôi<br /><em>đã xây dựng.</em></h2>
          </div>
          <p>
            Không chỉ là demo — mỗi project thể hiện một bài toán, một hướng giải
            quyết và một năng lực triển khai.
          </p>
        </div>

        <div className="project-filters" aria-label="Lọc dự án">
          {projectCategories.map((item) => (
            <button
              key={item}
              className={filter === item ? 'active' : ''}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>

        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.title}
              project={project}
              onOpen={() => setSelected(project)}
            />
          ))}
        </div>
      </section>

      {selected && (
        <div className="project-modal-backdrop" onClick={() => setSelected(null)}>
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="project-modal-title"
            onClick={(event) => event.stopPropagation()}
          >
            <button className="modal-close" onClick={() => setSelected(null)} aria-label="Đóng">
              ×
            </button>

            <div className="case-study-kicker">
              <span>{selected.number}</span>
              {selected.category}
            </div>

            <div className="case-study-image">
              <img src={selected.image} alt={`${selected.title} preview`} />
            </div>

            <h3 id="project-modal-title">{selected.title}</h3>
            <p className="modal-description">{selected.description}</p>

            <div className="case-study-flow">
              <article>
                <span>01 / PROBLEM</span>
                <h4>Vấn đề</h4>
                <p>{selected.problem}</p>
              </article>
              <article>
                <span>02 / SOLUTION</span>
                <h4>Giải pháp</h4>
                <p>{selected.solution}</p>
              </article>
              <article>
                <span>03 / RESULT</span>
                <h4>Kết quả</h4>
                <p>{selected.result}</p>
              </article>
            </div>

            <div className="case-study-features">
              {selected.features.map((feature) => <span key={feature}>{feature}</span>)}
            </div>

            <div className="modal-grid">
              <div>
                <span>MY ROLE</span>
                <strong>{selected.role}</strong>
              </div>
              <div>
                <span>TECHNOLOGY</span>
                <strong>{selected.tech.join(' · ')}</strong>
              </div>
              <div>
                <span>DEPLOYMENT</span>
                <strong>{links?.demo ? 'Live deployment' : 'Prototype / development'}</strong>
              </div>
              <div>
                <span>FOCUS</span>
                <strong>Giải quyết vấn đề thực tế</strong>
              </div>
            </div>

            <div className="modal-actions">
              {links?.demo ? (
                <a href={links.demo} target="_blank" rel="noreferrer" className="btn-primary">
                  Mở dự án trực tiếp ↗
                </a>
              ) : (
                <button className="btn-primary" onClick={onContact}>
                  Liên hệ để xem Demo ↗
                </button>
              )}

              {links?.github && (
                <a href={links.github} target="_blank" rel="noreferrer" className="btn-outline">
                  GitHub
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
