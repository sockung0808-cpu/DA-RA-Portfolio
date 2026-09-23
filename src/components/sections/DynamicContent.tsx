import { useEffect, useState } from 'react'
import {
  getPublicEvents,
  type EventRecord,
  type ModuleRecord,
} from '../../lib/content'
import { db, supabaseConfigured } from '../../lib/supabase'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function EventsSection() {
  const [events, setEvents] = useState<EventRecord[]>([])
  const ref = useScrollReveal<HTMLElement>()

  useEffect(() => {
    let cancelled = false

    const loadEvents = async () => {
      try {
        const rows = await getPublicEvents()

        if (!cancelled) {
          setEvents(rows)
        }
      } catch {
        if (!cancelled) {
          setEvents([])
        }
      }
    }

    void loadEvents()

    return () => {
      cancelled = true
    }
  }, [])

  if (!events.length) {
    return null
  }

  return (
    <section
      id="events"
      className="section reveal-section section-depth"
      ref={ref}
    >
      <div className="section-heading row-heading">
        <div>
          <span>06 / EVENTS</span>

          <h2>
            Những cột mốc
            <br />
            <em>đang diễn ra.</em>
          </h2>
        </div>

        <p>
          Các sự kiện, triển khai và hoạt động nổi bật có thể được cập nhật
          trực tiếp từ Admin.
        </p>
      </div>

      <div className="events-grid">
        {events.map((event) => (
          <article
            className="event-card"
            key={event.id || event.slug}
          >
            {event.image_url && (
              <img
                src={event.image_url}
                alt={event.title}
              />
            )}

            <div className="event-body">
              <span>
                {event.event_date || 'EVENT'} ·{' '}
                {event.location || 'VIETNAM'}
              </span>

              <h3>{event.title}</h3>

              <p>{event.description}</p>

              <small>
                {event.status?.toUpperCase()}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}

export function DynamicModules() {
  const [modules, setModules] = useState<ModuleRecord[]>([])
  const ref = useScrollReveal<HTMLElement>()

  useEffect(() => {
    if (!supabaseConfigured) {
      return
    }

    let cancelled = false

    const loadModules = async () => {
      try {
        const rows = await db<ModuleRecord[]>(
          'site_modules',
          '?select=*&is_visible=eq.true&is_published=eq.true&order=sort_order.asc,created_at.asc'
        )

        if (!cancelled) {
          setModules(rows)
        }
      } catch {
        if (!cancelled) {
          setModules([])
        }
      }
    }

    void loadModules()

    return () => {
      cancelled = true
    }
  }, [])

  if (!modules.length) {
    return null
  }

  return (
    <section
      id="dynamic-modules"
      className="section reveal-section section-depth"
      ref={ref}
    >
      {modules.map((module) => {
        const content =
          (module.content ?? {}) as Record<string, unknown>

        const text =
          typeof content.text === 'string'
            ? content.text
            : typeof content.description === 'string'
              ? content.description
              : ''

        const eyebrow =
          typeof content.eyebrow === 'string'
            ? content.eyebrow
            : module.type || 'MODULE'

        const link =
          typeof content.link === 'string'
            ? content.link
            : ''

        return (
          <article
            className="dynamic-module"
            key={module.id || module.key}
          >
            <span>{eyebrow}</span>

            <h2>{module.title}</h2>

            {text && (
              <p>{text}</p>
            )}

            {link && (
              <a
                className="btn-primary"
                href={link}
                target="_blank"
                rel="noreferrer"
              >
                Khám phá ↗
              </a>
            )}
          </article>
        )
      })}
    </section>
  )
}