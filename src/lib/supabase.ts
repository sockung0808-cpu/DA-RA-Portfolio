const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL?.replace(/\/$/, '')
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY)

export type SupabaseSession = {
  access_token: string
  refresh_token: string
  expires_in: number
  expires_at?: number
  token_type?: string
  user: { id: string; email?: string }
}

const SESSION_KEY = 'dara_admin_session'
let refreshPromise: Promise<SupabaseSession | null> | null = null

function readStoredSession(): SupabaseSession | null {
  try {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const session = JSON.parse(raw) as SupabaseSession
    if (!session?.access_token || !session?.refresh_token) return null
    return session
  } catch {
    return null
  }
}

export function getSession(): SupabaseSession | null {
  return readStoredSession()
}

export function setSession(session: SupabaseSession | null) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  else localStorage.removeItem(SESSION_KEY)
}

function sessionExpiresSoon(session: SupabaseSession, marginSeconds = 60) {
  if (!session.expires_at) return false
  return session.expires_at <= Math.floor(Date.now() / 1000) + marginSeconds
}

async function rawRequest(path: string, options: RequestInit = {}, token?: string) {
  if (!supabaseConfigured) {
    throw new Error('Supabase chưa được cấu hình. Hãy tạo file .env.local từ .env.example.')
  }

  const headers = new Headers(options.headers)
  headers.set('apikey', SUPABASE_ANON_KEY!)
  headers.set('Content-Type', 'application/json')
  if (token) headers.set('Authorization', `Bearer ${token}`)

  const response = await fetch(`${SUPABASE_URL}${path}`, { ...options, headers })
  const text = await response.text()

  if (!response.ok) {
    let message = text
    try {
      const payload = JSON.parse(text)
      message = payload.message || payload.error_description || payload.error || text
    } catch {
      // Keep the raw response text.
    }

    const error = new Error(message || `Supabase request failed (${response.status})`)
    ;(error as Error & { status?: number }).status = response.status
    throw error
  }

  if (response.status === 204 || !text) return null
  return JSON.parse(text)
}

async function refreshSessionInternal(current: SupabaseSession): Promise<SupabaseSession | null> {
  if (!supabaseConfigured || !current.refresh_token) return null

  try {
    const refreshed = await rawRequest('/auth/v1/token?grant_type=refresh_token', {
      method: 'POST',
      body: JSON.stringify({ refresh_token: current.refresh_token }),
    }) as SupabaseSession

    if (!refreshed?.access_token || !refreshed?.refresh_token) {
      throw new Error('Supabase không trả về session mới.')
    }

    const session: SupabaseSession = {
      ...refreshed,
      expires_at: refreshed.expires_at || Math.floor(Date.now() / 1000) + refreshed.expires_in,
    }

    setSession(session)
    return session
  } catch {
    // A refresh token can become invalid after a password/security event or
    // when an older refresh token is reused. In that case the local session
    // must be cleared so the admin can sign in again cleanly.
    setSession(null)
    return null
  }
}

export async function refreshSession(): Promise<SupabaseSession | null> {
  const current = getSession()
  if (!current) return null

  if (refreshPromise) return refreshPromise

  refreshPromise = refreshSessionInternal(current).finally(() => {
    refreshPromise = null
  })

  return refreshPromise
}

async function getValidSession(): Promise<SupabaseSession | null> {
  const current = getSession()
  if (!current) return null
  if (!sessionExpiresSoon(current)) return current
  return refreshSession()
}

export async function signIn(email: string, password: string) {
  const response = await rawRequest('/auth/v1/token?grant_type=password', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }) as SupabaseSession

  const session: SupabaseSession = {
    ...response,
    expires_at: response.expires_at || Math.floor(Date.now() / 1000) + response.expires_in,
  }

  setSession(session)
  return session
}

export async function signOut() {
  const session = getSession()
  try {
    if (session) await rawRequest('/auth/v1/logout', { method: 'POST' }, session.access_token)
  } finally {
    setSession(null)
  }
}

export async function db<T>(table: string, query = '', options: RequestInit = {}): Promise<T> {
  let session = await getValidSession()

  try {
    return await rawRequest(`/rest/v1/${table}${query}`, options, session?.access_token) as T
  } catch (error) {
    const status = (error as Error & { status?: number }).status
    const message = error instanceof Error ? error.message.toLowerCase() : ''
    const jwtExpired = status === 401 || message.includes('jwt expired') || message.includes('invalid jwt')

    if (!jwtExpired || !session?.refresh_token) throw error

    const refreshed = await refreshSession()
    if (!refreshed) {
      throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    }

    session = refreshed
    return await rawRequest(`/rest/v1/${table}${query}`, options, session.access_token) as T
  }
}

export async function storageUpload(file: File, folder = 'portfolio') {
  let session = await getValidSession()
  if (!session) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')

  const safeName = file.name.toLowerCase().replace(/[^a-z0-9._-]+/g, '-')
  const path = `${folder}/${Date.now()}-${safeName}`

  const upload = async (accessToken: string) => {
    const headers = new Headers({
      apikey: SUPABASE_ANON_KEY!,
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': file.type || 'application/octet-stream',
    })
    return fetch(`${SUPABASE_URL}/storage/v1/object/${path}`, {
      method: 'POST',
      headers,
      body: file,
    })
  }

  let response = await upload(session.access_token)

  if (response.status === 401) {
    const refreshed = await refreshSession()
    if (!refreshed) throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.')
    session = refreshed
    response = await upload(session.access_token)
  }

  if (!response.ok) {
    const text = await response.text()
    throw new Error(text || `Upload thất bại (${response.status})`)
  }

  return `${SUPABASE_URL}/storage/v1/object/public/${path}`
}
