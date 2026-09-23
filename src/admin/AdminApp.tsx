import { useEffect, useMemo, useState } from 'react'
import { db, getSession, signIn, signOut, storageUpload, supabaseConfigured } from '../lib/supabase'
import { fallbackProjects, type EventRecord, type ModuleRecord, type ProjectRecord } from '../lib/content'
import './admin.css'

type View = 'dashboard' | 'projects' | 'events' | 'modules' | 'media' | 'settings'

const emptyProject: ProjectRecord = { number:'05', slug:'', title:'', category:'MANAGEMENT', description:'', tech:[], icon:'◈', role:'', problem:'', solution:'', result:'', features:[], image:'', demo_url:'', github_url:'', sort_order:5, is_visible:true, is_published:false }
const emptyEvent: EventRecord = { title:'', slug:'', description:'', image_url:'', event_date:'', location:'', status:'upcoming', sort_order:1, is_visible:true, is_published:false }
const emptyModule: ModuleRecord = { key:'', type:'Text', title:'', slug:'', content:{}, image_url:'', sort_order:1, is_visible:true, is_published:false }

function Field({ label, value, onChange, textarea=false, type='text' }: {label:string; value:string|number|undefined|null; onChange:(v:string)=>void; textarea?:boolean; type?:string}) {
  return <label className="admin-field"><span>{label}</span>{textarea ? <textarea value={String(value ?? '')} onChange={e=>onChange(e.target.value)} rows={4}/> : <input type={type} value={String(value ?? '')} onChange={e=>onChange(e.target.value)}/>}</label>
}

export default function AdminApp() {
  const [session, setSession] = useState(getSession())
  const [view, setView] = useState<View>('dashboard')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [projects, setProjects] = useState<ProjectRecord[]>([])
  const [events, setEvents] = useState<EventRecord[]>([])
  const [modules, setModules] = useState<ModuleRecord[]>([])
  const [projectForm, setProjectForm] = useState<ProjectRecord | null>(null)
  const [eventForm, setEventForm] = useState<EventRecord | null>(null)
  const [moduleForm, setModuleForm] = useState<ModuleRecord | null>(null)

  const load = async () => {
    if (!session || !supabaseConfigured) return
    setBusy(true); setError('')
    try {
      const [p,e,m] = await Promise.all([
        db<ProjectRecord[]>('projects','?select=*&order=sort_order.asc,created_at.asc'),
        db<EventRecord[]>('events','?select=*&order=event_date.asc,sort_order.asc'),
        db<ModuleRecord[]>('site_modules','?select=*&order=sort_order.asc,created_at.asc'),
      ])
      setProjects(p); setEvents(e); setModules(m)
    } catch (err) { setError(err instanceof Error ? err.message : 'Không thể tải dữ liệu.') }
    finally { setBusy(false) }
  }
  useEffect(() => { load() }, [session])

  if (!session) return <Login onLogin={setSession} />

  const saveProject = async () => { if (!projectForm) return; setBusy(true); try { const payload={...projectForm, tech:projectForm.tech, features:projectForm.features}; if(projectForm.id) await db('projects',`?id=eq.${projectForm.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(payload)}); else await db('projects','',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(payload)}); setProjectForm(null); await load() } catch(e){setError(e instanceof Error?e.message:'Lưu thất bại')} finally{setBusy(false)} }
  const saveEvent = async () => { if (!eventForm) return; setBusy(true); try { if(eventForm.id) await db('events',`?id=eq.${eventForm.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(eventForm)}); else await db('events','',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(eventForm)}); setEventForm(null); await load() } catch(e){setError(e instanceof Error?e.message:'Lưu thất bại')} finally{setBusy(false)} }
  const saveModule = async () => { if (!moduleForm) return; setBusy(true); try { if(moduleForm.id) await db('site_modules',`?id=eq.${moduleForm.id}`,{method:'PATCH',headers:{Prefer:'return=minimal'},body:JSON.stringify(moduleForm)}); else await db('site_modules','',{method:'POST',headers:{Prefer:'return=minimal'},body:JSON.stringify(moduleForm)}); setModuleForm(null); await load() } catch(e){setError(e instanceof Error?e.message:'Lưu thất bại')} finally{setBusy(false)} }
  const remove = async (table:string,id:string) => { if(!confirm('Xóa mục này?')) return; setBusy(true); try { await db(table,`?id=eq.${id}`,{method:'DELETE'}); await load() } catch(e){setError(e instanceof Error?e.message:'Xóa thất bại')} finally{setBusy(false)} }

  return <div className="admin-shell">
    <aside className="admin-sidebar">
      <div className="admin-logo"><strong>ĐA RA</strong><span>ADMIN CONSOLE</span></div>
      <div className="admin-nav">
        {([['dashboard','▦','Dashboard'],['projects','◈','Projects'],['events','◷','Events'],['modules','◇','Modules'],['media','▧','Media'],['settings','⚙','Settings']] as const).map(([id,icon,label])=><button key={id} className={view===id?'active':''} onClick={()=>setView(id)}><i>{icon}</i>{label}</button>)}
      </div>
      <button className="admin-logout" onClick={async()=>{await signOut();setSession(null)}}>↪ Đăng xuất</button>
    </aside>
    <main className="admin-main">
      <header className="admin-top"><div><span>DA RA / ADMIN</span><h1>{view === 'dashboard' ? 'Control Center' : view[0].toUpperCase()+view.slice(1)}</h1></div><div className="admin-user">● {session.user.email}</div></header>
      {error && <div className="admin-alert">⚠ {error}<button onClick={()=>setError('')}>×</button></div>}
      {busy && <div className="admin-loading">SYNCING...</div>}
      {!supabaseConfigured && <div className="admin-alert">Supabase chưa cấu hình. Đây là giao diện Admin preview; hãy tạo `.env.local` và chạy SQL trong `supabase/schema.sql` để bật CRUD thật.</div>}

      {view==='dashboard' && <section className="admin-content"><div className="admin-stat-grid"><Stat n={projects.length} label="PROJECTS"/><Stat n={events.length} label="EVENTS"/><Stat n={modules.length} label="MODULES"/><Stat n={projects.filter(p=>p.is_published).length} label="PUBLISHED"/></div><div className="admin-panel"><div className="panel-head"><div><span>QUICK ACTIONS</span><h2>Quản trị nội dung</h2></div></div><div className="quick-grid"><button onClick={()=>{setView('projects');setProjectForm({...emptyProject})}}>+ Thêm Project</button><button onClick={()=>{setView('events');setEventForm({...emptyEvent})}}>+ Thêm Event</button><button onClick={()=>{setView('modules');setModuleForm({...emptyModule})}}>+ Thêm Module</button></div></div></section>}

      {view==='projects' && <section className="admin-content"><Toolbar title="Projects" onAdd={()=>setProjectForm({...emptyProject,number:String(projects.length+1).padStart(2,'0'),sort_order:projects.length+1})}/><div className="admin-table">{projects.map(p=><Row key={p.id||p.slug} title={p.title} meta={`${p.category} · ${p.tech.join(' · ')}`} published={!!p.is_published} onEdit={()=>setProjectForm({...p})} onDelete={()=>p.id&&remove('projects',p.id)}/>)}</div>{projectForm&&<ProjectEditor value={projectForm} setValue={setProjectForm} onSave={saveProject} onClose={()=>setProjectForm(null)}/>}</section>}
      {view==='events' && <section className="admin-content"><Toolbar title="Events" onAdd={()=>setEventForm({...emptyEvent,sort_order:events.length+1})}/><div className="admin-table">{events.map(e=><Row key={e.id||e.slug} title={e.title} meta={`${e.event_date||'No date'} · ${e.location||'No location'}`} published={!!e.is_published} onEdit={()=>setEventForm({...e})} onDelete={()=>e.id&&remove('events',e.id)}/>)}</div>{eventForm&&<EventEditor value={eventForm} setValue={setEventForm} onSave={saveEvent} onClose={()=>setEventForm(null)}/>}</section>}
      {view==='modules' && <section className="admin-content"><Toolbar title="Modules / Blocks" onAdd={()=>setModuleForm({...emptyModule,sort_order:modules.length+1})}/><div className="admin-table">{modules.map(m=><Row key={m.id||m.key} title={m.title||m.key} meta={`${m.type} · ${m.key}`} published={!!m.is_published} onEdit={()=>setModuleForm({...m})} onDelete={()=>m.id&&remove('site_modules',m.id)}/>)}</div>{moduleForm&&<ModuleEditor value={moduleForm} setValue={setModuleForm} onSave={saveModule} onClose={()=>setModuleForm(null)}/>}</section>}
      {view==='media' && <MediaPage/>}
      {view==='settings' && <SettingsPage/>}
    </main>
  </div>
}

function Login({onLogin}:{onLogin:(s:any)=>void}) { const [email,setEmail]=useState(''); const [password,setPassword]=useState(''); const [error,setError]=useState(''); const [busy,setBusy]=useState(false); return <div className="login-shell"><div className="login-card"><div className="login-brand"><strong>ĐA RA</strong><span>ADMIN ACCESS</span></div><span className="login-kicker">SECURE CONTROL CENTER</span><h1>Đăng nhập</h1><p>Quản lý projects, events và các module của portfolio.</p><label className="admin-field"><span>Email</span><input value={email} onChange={e=>setEmail(e.target.value)} autoComplete="username"/></label><label className="admin-field"><span>Password</span><input type="password" value={password} onChange={e=>setPassword(e.target.value)} autoComplete="current-password"/></label>{error&&<div className="admin-alert">⚠ {error}</div>}<button className="admin-primary" disabled={busy||!supabaseConfigured} onClick={async()=>{setBusy(true);setError('');try{onLogin(await signIn(email,password))}catch(e){setError(e instanceof Error?e.message:'Đăng nhập thất bại')}finally{setBusy(false)}}}>{busy?'ĐANG XÁC THỰC...':'ĐĂNG NHẬP →'}</button>{!supabaseConfigured&&<small className="login-note">Cần cấu hình Supabase trước khi đăng nhập.</small>}<a href="/">← Về portfolio</a></div></div> }
function Stat({n,label}:{n:number;label:string}){return <div className="admin-stat"><strong>{n}</strong><span>{label}</span></div>}
function Toolbar({title,onAdd}:{title:string;onAdd:()=>void}){return <div className="panel-head"><div><span>CONTENT MANAGEMENT</span><h2>{title}</h2></div><button className="admin-primary small" onClick={onAdd}>+ Thêm mới</button></div>}
function Row({title,meta,published,onEdit,onDelete}:{title:string;meta:string;published:boolean;onEdit:()=>void;onDelete:()=>void}){return <div className="admin-row"><div><strong>{title}</strong><span>{meta}</span></div><span className={`status ${published?'on':'off'}`}>{published?'PUBLISHED':'DRAFT'}</span><div className="row-actions"><button onClick={onEdit}>Sửa</button><button onClick={onDelete}>Xóa</button></div></div>}
function EditorShell({title,children,onSave,onClose}:{title:string;children:any;onSave:()=>void;onClose:()=>void}){return <div className="editor-overlay"><div className="editor-card"><div className="panel-head"><div><span>EDITOR</span><h2>{title}</h2></div><button onClick={onClose} className="modal-close">×</button></div>{children}<div className="editor-actions"><button className="btn-outline" onClick={onClose}>Hủy</button><button className="admin-primary" onClick={onSave}>Lưu thay đổi</button></div></div></div>}
function ProjectEditor({value,setValue,onSave,onClose}:{value:ProjectRecord;setValue:any;onSave:()=>void;onClose:()=>void}){const f=(k:keyof ProjectRecord)=>(v:string)=>setValue((x:any)=>({...x,[k]:['tech','features'].includes(k as string)?v.split(',').map(s=>s.trim()).filter(Boolean):v}));return <EditorShell title="Project" onSave={onSave} onClose={onClose}><div className="editor-grid"><Field label="Tên project" value={value.title} onChange={f('title')}/><Field label="Slug" value={value.slug} onChange={f('slug')}/><Field label="Category" value={value.category} onChange={f('category')}/><Field label="Icon" value={value.icon} onChange={f('icon')}/><Field label="Image URL" value={value.image} onChange={f('image')}/><Field label="Demo URL" value={value.demo_url} onChange={f('demo_url')}/><Field label="GitHub URL" value={value.github_url} onChange={f('github_url')}/><Field label="Thứ tự" value={value.sort_order} onChange={f('sort_order')} type="number"/><Field label="Technology (cách nhau bằng dấu phẩy)" value={value.tech.join(', ')} onChange={f('tech')}/><Field label="Features (cách nhau bằng dấu phẩy)" value={value.features.join(', ')} onChange={f('features')}/><Field label="Mô tả" value={value.description} onChange={f('description')} textarea/><Field label="My Role" value={value.role} onChange={f('role')}/><Field label="Problem" value={value.problem} onChange={f('problem')} textarea/><Field label="Solution" value={value.solution} onChange={f('solution')} textarea/><Field label="Result" value={value.result} onChange={f('result')} textarea/></div><div className="check-row"><label><input type="checkbox" checked={!!value.is_visible} onChange={e=>setValue((x:any)=>({...x,is_visible:e.target.checked}))}/> Hiển thị</label><label><input type="checkbox" checked={!!value.is_published} onChange={e=>setValue((x:any)=>({...x,is_published:e.target.checked}))}/> Published</label></div></EditorShell>}
function EventEditor({value,setValue,onSave,onClose}:{value:EventRecord;setValue:any;onSave:()=>void;onClose:()=>void}){const f=(k:keyof EventRecord)=>(v:string)=>setValue((x:any)=>({...x,[k]:v}));return <EditorShell title="Event" onSave={onSave} onClose={onClose}><div className="editor-grid"><Field label="Tên sự kiện" value={value.title} onChange={f('title')}/><Field label="Slug" value={value.slug} onChange={f('slug')}/><Field label="Ngày" value={value.event_date} onChange={f('event_date')} type="date"/><Field label="Địa điểm" value={value.location} onChange={f('location')}/><Field label="Image URL" value={value.image_url} onChange={f('image_url')}/><Field label="Status" value={value.status} onChange={f('status')}/><Field label="Thứ tự" value={value.sort_order} onChange={f('sort_order')} type="number"/><Field label="Mô tả" value={value.description} onChange={f('description')} textarea/></div><div className="check-row"><label><input type="checkbox" checked={!!value.is_visible} onChange={e=>setValue((x:any)=>({...x,is_visible:e.target.checked}))}/> Hiển thị</label><label><input type="checkbox" checked={!!value.is_published} onChange={e=>setValue((x:any)=>({...x,is_published:e.target.checked}))}/> Published</label></div></EditorShell>}
function ModuleEditor({value,setValue,onSave,onClose}:{value:ModuleRecord;setValue:any;onSave:()=>void;onClose:()=>void}){const content=JSON.stringify(value.content,null,2);return <EditorShell title="Module / Block" onSave={onSave} onClose={onClose}><div className="editor-grid"><Field label="Key" value={value.key} onChange={v=>setValue((x:any)=>({...x,key:v}))}/><Field label="Type" value={value.type} onChange={v=>setValue((x:any)=>({...x,type:v}))}/><Field label="Title" value={value.title} onChange={v=>setValue((x:any)=>({...x,title:v}))}/><Field label="Slug" value={value.slug} onChange={v=>setValue((x:any)=>({...x,slug:v}))}/><Field label="Image URL" value={value.image_url} onChange={v=>setValue((x:any)=>({...x,image_url:v}))}/><Field label="Thứ tự" value={value.sort_order} onChange={v=>setValue((x:any)=>({...x,sort_order:Number(v)}))} type="number"/><Field label="Content JSON" value={content} onChange={v=>{try{setValue((x:any)=>({...x,content:JSON.parse(v)}))}catch{}}} textarea/></div><div className="check-row"><label><input type="checkbox" checked={!!value.is_visible} onChange={e=>setValue((x:any)=>({...x,is_visible:e.target.checked}))}/> Hiển thị</label><label><input type="checkbox" checked={!!value.is_published} onChange={e=>setValue((x:any)=>({...x,is_published:e.target.checked}))}/> Published</label></div></EditorShell>}
function MediaPage(){const [url,setUrl]=useState('');const [busy,setBusy]=useState(false);return <section className="admin-content"><div className="panel-head"><div><span>SUPABASE STORAGE</span><h2>Media</h2></div></div><div className="admin-panel media-box"><p>Upload ảnh trực tiếp vào Supabase Storage. URL trả về có thể dùng trong Project/Event/Module.</p><input type="file" accept="image/*" onChange={async e=>{const file=e.target.files?.[0];if(!file)return;setBusy(true);try{setUrl(await storageUpload(file))}catch(err){setUrl(err instanceof Error?err.message:'Upload thất bại')}finally{setBusy(false)}}}/>{busy&&<span>Uploading...</span>}{url&&<textarea readOnly value={url} rows={3}/>}</div></section>}
function SettingsPage(){return <section className="admin-content"><div className="admin-panel"><span>SITE SETTINGS</span><h2>Cấu hình hệ thống</h2><p>Thông tin liên hệ, SEO và social links nên được đưa vào bảng `site_settings` ở phase tiếp theo. Kiến trúc đã chừa sẵn khu vực này để mở rộng mà không ảnh hưởng public UI.</p><div className="setting-note">🔐 Auth · 🗄 PostgreSQL · 🖼 Storage · 🛡 RLS</div></div></section>}
