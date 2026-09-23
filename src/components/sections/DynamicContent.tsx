import { useEffect, useState } from 'react'
import { getPublicEvents, type EventRecord, type ModuleRecord } from '../../lib/content'
import { db, supabaseConfigured } from '../../lib/supabase'
import { useScrollReveal } from '../../hooks/useScrollReveal'

export function EventsSection() {
  const [events,setEvents]=useState<EventRecord[]>([])
  const ref=useScrollReveal<HTMLElement>()
  useEffect(() => {
    let cancelled = false
    const loadEvents = async () => {
      try {
        const rows = await getPublicEvents()
        if (!cancelled) setEvents(rows)
      } catch {
        if (!cancelled) setEvents([])
      }
    }
    void loadEvents()
    return () => { cancelled = true }
  }, [])
  if(!events.length) return null
  return <section id="events" className="section reveal-section section-depth" ref={ref}>
    <div className="section-heading row-heading"><div><span>06 / EVENTS</span><h2>Những cột mốc<br/><em>đang diễn ra.</em></h2></div><p>Các sự kiện, triển khai và hoạt động nổi bật có thể được cập nhật trực tiếp từ Admin.</p></div>
    <div className="events-grid">{events.map(e=><article className="event-card" key={e.id||e.slug}>{e.image_url&&<img src={e.image_url} alt=""/>}<div className="event-body"><span>{e.event_date||'EVENT'} · {e.location||'VIETNAM'}</span><h3>{e.title}</h3><p>{e.description}</p><small>{e.status?.toUpperCase()}</small></div></article>)}</div>
  </section>
}

export function DynamicModules() {
  const [modules,setModules]=useState<ModuleRecord[]>([])
  const ref=useScrollReveal<HTMLElement>()
  useEffect(() => {
    if (!supabaseConfigured) return

    let cancelled = false

    const loadModules = async () => {
      try {
        const rows = await db<ModuleRecord[]>('site_modules','?select=*&is_visible=eq.true&is_published=eq.true&order=sort_order.asc,created_at.asc')
        if (!cancelled) setModules(rows)
      } catch {
        if (!cancelled) setModules([])
      }
    }

    void loadModules()

    return () => {
      cancelled = true
    }
  },[])
  if(!modules.length) return null
  return <section id="dynamic-modules" className="section reveal-section section-depth" ref={ref}>
    {modules.map(m=>{
      const c=m.content||{}
      const text=String(c.text||c.description||'')
      const eyebrow=String(c.eyebrow||m.type||'MODULE')
      return <article className="dynamic-module" key={m.id||m.key}><span>{eyebrow}</span><h2>{m.title}</h2>{text&&<p>{text}</p>}{c.link&&<a className="btn-primary" href={String(c.link)} target="_blank" rel="noreferrer">Khám phá ↗</a>}</article>
    })}
  </section>
}
