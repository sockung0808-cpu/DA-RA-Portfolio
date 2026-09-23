import { projects as staticProjects } from '../data/projects'
import { db, supabaseConfigured } from './supabase'

export type ProjectRecord = {
  id?: string
  number: string
  slug: string
  title: string
  category: string
  description: string
  tech: string[]
  icon: string
  role: string
  problem: string
  solution: string
  result: string
  features: string[]
  image: string
  demo_url?: string | null
  github_url?: string | null
  sort_order?: number
  is_visible?: boolean
  is_published?: boolean
}

export type EventRecord = {
  id?: string
  title: string
  slug: string
  description: string
  image_url?: string | null
  event_date?: string | null
  location?: string | null
  status?: string
  sort_order?: number
  is_visible?: boolean
  is_published?: boolean
}

export type ModuleRecord = {
  id?: string
  key: string
  type: string
  title: string
  slug?: string | null
  content: Record<string, unknown>
  image_url?: string | null
  sort_order?: number
  is_visible?: boolean
  is_published?: boolean
}

export const fallbackProjects: ProjectRecord[] = staticProjects.map((p) => ({ ...p, image: p.image, is_visible: true, is_published: true }))

export async function getPublicProjects(): Promise<ProjectRecord[]> {
  if (!supabaseConfigured) return fallbackProjects
  try {
    const rows = await db<ProjectRecord[]>('projects', '?select=*&is_visible=eq.true&is_published=eq.true&order=sort_order.asc,created_at.asc')
    return rows
  } catch { return fallbackProjects }
}

export async function getPublicEvents(): Promise<EventRecord[]> {
  if (!supabaseConfigured) return []
  try { return await db<EventRecord[]>('events', '?select=*&is_visible=eq.true&is_published=eq.true&order=event_date.asc,sort_order.asc') } catch { return [] }
}
