/* global React, SignaturePreview, CharCounter, sampleTeam */

// Team page — roster-first, view-only per-person.
// No inline editing of individual fields. Row click opens a read-only detail
// panel showing their rendered signature + status, with actions: download,
// resend, resync-from-Airtable, open template, etc.
function TeamPage() {
  const [selected, setSelected] = React.useState(180406);
  const [checked, setChecked] = React.useState(new Set([180559, 180560, 207191]));
  const [filter, setFilter] = React.useState('all');

  const person = sampleTeam.find(p => p.id === selected);

  const toggle = (id) => {
    const next = new Set(checked);
    if (next.has(id)) next.delete(id); else next.add(id);
    setChecked(next);
  };

  const filtered = sampleTeam.filter(p => {
    if (filter === 'all') return true;
    return p.status === filter;
  });

  return (
    <div style={{padding:'20px 28px', display:'grid', gap:16}}>

      {/* Page header */}
      <div className="flex items-center gap-3">
        <div>
          <h2 style={{margin:0, fontSize:20, fontWeight:700, letterSpacing:'-0.02em'}}>Team signatures</h2>
          <div className="small muted" style={{marginTop:2}}>20 active · 1 draft · 1 stale · synced from Airtable 2 min ago</div>
        </div>
        <div style={{flex:1}} />
        <input className="input" placeholder="Search team…" style={{maxWidth:220}} />
        <select className="input" style={{maxWidth:160}} value={filter} onChange={e=>setFilter(e.target.value)}>
          <option value="all">All statuses</option>
          <option value="synced">Synced</option>
          <option value="draft">Draft</option>
          <option value="stale">Stale</option>
        </select>
        <button className="btn ghost">⤓ Resync Airtable</button>
        <button className="btn primary">+ Add person</button>
      </div>

      {/* Bulk action strip — appears when rows checked */}
      {checked.size > 0 && (
        <div className="panel" style={{padding:'10px 14px', display:'flex', alignItems:'center', gap:12, background:'var(--surface-overlay)'}}>
          <span className="small"><b>{checked.size} selected</b></span>
          <div style={{width:1, height:18, background:'var(--border-default)'}} />
          <button className="btn sm ghost">↻ Push template change</button>
          <button className="btn sm ghost">🖼 Swap banner</button>
          <button className="btn sm ghost">✉ Email signatures</button>
          <button className="btn sm ghost">⤓ Download ZIP</button>
          <div style={{flex:1}} />
          <button className="btn sm" onClick={()=>setChecked(new Set())}>Clear</button>
        </div>
      )}

      <div style={{display:'grid', gridTemplateColumns:'1fr 440px', gap:16, alignItems:'start'}}>

        {/* Roster table */}
        <div className="panel" style={{overflow:'hidden'}}>
          <table className="tbl">
            <thead>
              <tr>
                <th style={{width:28}}>
                  <input type="checkbox"
                         checked={checked.size === filtered.length && filtered.length > 0}
                         onChange={e => setChecked(e.target.checked ? new Set(filtered.map(p=>p.id)) : new Set())} />
                </th>
                <th>Name</th>
                <th>Role</th>
                <th>Template</th>
                <th>Status</th>
                <th style={{width:90}}>Size</th>
                <th style={{width:80}}>Updated</th>
                <th style={{width:40}}></th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p, i) => (
                <tr key={p.id}
                    className={selected===p.id?'selected':''}
                    onClick={()=>setSelected(p.id)}>
                  <td onClick={e=>e.stopPropagation()}>
                    <input type="checkbox" checked={checked.has(p.id)} onChange={()=>toggle(p.id)} />
                  </td>
                  <td>
                    <div className="flex items-center gap-3">
                      <span className="avatar">{p.initials}</span>
                      <div>
                        <div style={{fontWeight:600}}>{p.name}</div>
                        <div className="xs muted mono">{p.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="muted">{p.role}</td>
                  <td><span className="chip">{p.template === 'intern' ? 'Intern v1' : 'Standard v3'}</span></td>
                  <td>
                    {p.status==='synced' && <span className="chip ok">● synced</span>}
                    {p.status==='draft'  && <span className="chip warn">● draft</span>}
                    {p.status==='stale'  && <span className="chip err">● stale</span>}
                  </td>
                  <td className="mono xs muted">{(6100 + i*37).toLocaleString()} ch</td>
                  <td className="xs muted">{p.updated} ago</td>
                  <td onClick={e=>e.stopPropagation()}><button className="btn sm">⋯</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          <div style={{padding:'10px 14px', borderTop:'1px solid var(--border-default)', display:'flex', alignItems:'center', gap:10}}>
            <span className="small muted">Showing {filtered.length} of {sampleTeam.length}</span>
            <div style={{flex:1}} />
            <button className="btn sm ghost">‹</button>
            <button className="btn sm" style={{background:'var(--surface-overlay)'}}>1</button>
            <button className="btn sm ghost">2</button>
            <button className="btn sm ghost">›</button>
          </div>
        </div>

        {/* Detail rail — read-only */}
        <div style={{position:'sticky', top:80, display:'flex', flexDirection:'column', gap:12}}>
          <div className="panel">
            <div className="panel-header">
              <span>Signature preview</span>
              <span className="spacer" />
              <span className="muted">{person.name}</span>
            </div>
            <div style={{padding:22, background:'var(--surface-base)', display:'flex', justifyContent:'center', borderBottom:'1px solid var(--border-default)'}}>
              <SignaturePreview fields={{...defaultFields, name: person.name, role: person.role, email: person.email, mobile: person.mobile}} />
            </div>
            <div style={{padding:'10px 14px', display:'flex', gap:6, flexWrap:'wrap'}}>
              <button className="btn sm ghost">📋 Copy as rich text</button>
              <button className="btn sm ghost">⤓ HTML file</button>
              <button className="btn sm ghost">✉ Email to {person.name.split(' ')[0]}</button>
              <button className="btn sm ghost">🔗 Gmail install link</button>
            </div>
          </div>

          {/* Read-only field snapshot */}
          <div className="panel">
            <div className="panel-header">
              <span>Field values</span>
              <span className="spacer" />
              <span className="tag accent">Airtable · read-only</span>
            </div>
            <div className="panel-body" style={{padding:'4px 16px'}}>
              {[
                ['Name', person.name, 'People.Name'],
                ['Role', person.role, 'People.Role'],
                ['Mobile', person.mobile, 'People.Mobile'],
                ['Email', person.email, 'People.Email'],
                ['Salutation', 'Catch our podcast, The Intangible Brand.', 'Template default'],
                ['CTA', 'Schedule a meeting.', 'People.CTA'],
                ['CTA URL', 'calendly.com/gennaria/', 'People.CTA_URL'],
              ].map(([k, v, src], i) => (
                <div key={i} className="fieldrow" style={{gridTemplateColumns:'100px 1fr', padding:'8px 0'}}>
                  <label style={{padding:0}}>{k}</label>
                  <div>
                    <div style={{fontSize:13}}>{v}</div>
                    <div className="sub mono">◇ {src}</div>
                  </div>
                </div>
              ))}
              <div className="fieldrow" style={{gridTemplateColumns:'100px 1fr', padding:'10px 0', borderBottom:0}}>
                <label style={{padding:0}}>Edit in</label>
                <div className="flex gap-2">
                  <button className="btn sm ghost">↗ Open in Airtable</button>
                </div>
              </div>
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <span>Template</span>
              <span className="spacer" />
              <button className="btn xs">Open →</button>
            </div>
            <div className="panel-body flex items-center gap-3" style={{padding:14}}>
              <div style={{
                width:44, height:44,
                background:'var(--surface-overlay)',
                border:'1px solid var(--border-default)',
                borderRadius:5,
                display:'flex', alignItems:'center', justifyContent:'center',
                fontFamily:'var(--font-mono)', fontSize:10, color:'var(--text-accent)'
              }}>{'{ }'}</div>
              <div className="flex-1">
                <div style={{fontWeight:600, fontSize:13}}>TOKY Standard v3</div>
                <div className="xs muted">Last edited by Jerry · 2d ago · used by 18</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer bar with char counter */}
      <div style={{position:'fixed', bottom:16, left:16, zIndex:50}}>
        <CharCounter chars={6230 + (person.id % 800)} />
      </div>
    </div>
  );
}

window.TeamPage = TeamPage;
