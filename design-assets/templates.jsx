/* global React, SignaturePreview, CharCounter */

// Templates page — three-pane IDE:
// left: HTML code · center: rendered preview · right: Airtable data bindings
function TemplatesPage() {
  const [tab, setTab] = React.useState('html');
  const [showPH, setShowPH] = React.useState(false);
  const [tpl, setTpl] = React.useState('standard');

  return (
    <div style={{display:'flex', flexDirection:'column', height:'calc(100vh - 57px)'}}>

      {/* Template switcher / toolbar */}
      <div className="flex items-center gap-3" style={{padding:'10px 22px', borderBottom:'1px solid var(--border-default)', background:'var(--surface-raised)'}}>
        <select className="input" style={{width:220}} value={tpl} onChange={e=>setTpl(e.target.value)}>
          <option value="standard">TOKY Standard v3 · 18 users</option>
          <option value="intern">Intern v1 · 1 user</option>
          <option value="minimal">Minimal · 1 user</option>
        </select>
        <button className="btn sm ghost">+ New template</button>
        <div style={{width:1, height:20, background:'var(--border-default)'}} />
        <span className="mono xs muted">templates / toky-standard-v3.html</span>
        <span className="tag accent">● unsaved</span>
        <div style={{flex:1}} />
        <div className="flex items-center gap-2">
          <span className="muted xs">Test with</span>
          <select className="input" style={{width:180}} defaultValue="jerry">
            <option value="jerry">Jerry Gennaria</option>
            <option>Alec Gleeson</option>
            <option>Annie Martineau</option>
            <option disabled>──────────</option>
            <option>Blank / placeholders</option>
          </select>
        </div>
        <CharCounter chars={6230} />
        <button className="btn ghost">History</button>
        <button className="btn ghost">Commit v4</button>
        <button className="btn primary">Push to 18 →</button>
      </div>

      {/* Three panes */}
      <div style={{flex:1, display:'grid', gridTemplateColumns:'1.15fr 1fr 360px', minHeight:0}}>

        {/* LEFT — editor */}
        <div style={{display:'flex', flexDirection:'column', borderRight:'1px solid var(--border-default)', minWidth:0}}>
          <div className="flex" style={{borderBottom:'1px solid var(--border-default)', background:'var(--surface-raised)'}}>
            {[['html','signature.html'],['css','inline-styles.css'],['partials','partials · 3']].map(([t,label]) => (
              <button key={t} onClick={()=>setTab(t)} className="btn sm" style={{
                borderRadius:0, padding:'10px 14px',
                color: tab===t?'var(--text-primary)':'var(--text-secondary)',
                borderBottom: tab===t ? '2px solid var(--primary)' : '2px solid transparent',
                background: tab===t ? 'var(--surface-base)' : 'transparent',
              }}>{label}</button>
            ))}
            <div style={{flex:1}} />
            <button className="btn sm ghost" style={{margin:4}}>Format</button>
            <button className="btn sm ghost" style={{margin:4}}>Minify ↓</button>
          </div>
          <div style={{flex:1, overflow:'auto', padding:16, background:'var(--surface-base)'}}>
            <div className="code" style={{border:0, padding:'0 0 0 40px'}}>
              <span className="ln"><span className="c">{'<!-- Gmail-safe inline-table signature -->'}</span></span>
              <span className="ln"><span className="t">{'<table'}</span> <span className="a">cellpadding</span>=<span className="s">"0"</span> <span className="a">cellspacing</span>=<span className="s">"0"</span> <span className="a">border</span>=<span className="s">"0"</span></span>
              <span className="ln">{'       '}<span className="a">style</span>=<span className="s">"font-family:Helvetica,Arial,sans-serif;width:265px;"</span><span className="t">{'>'}</span></span>
              <span className="ln">{'  '}<span className="t">{'<tr>'}</span><span className="t">{'<td>'}</span></span>
              <span className="ln">{'    '}<span className="c">{'{% if user.salutation %}'}</span></span>
              <span className="ln">{'    '}<span className="t">{'<a'}</span> <span className="a">href</span>=<span className="s">{'"{{ user.salutation_url }}"'}</span><span className="t">{'>'}</span></span>
              <span className="ln">{'      '}<span className="ph">{`{{ user.salutation }}`}</span></span>
              <span className="ln">{'    '}<span className="t">{'</a>'}</span></span>
              <span className="ln">{'    '}<span className="c">{'{% endif %}'}</span></span>
              <span className="ln">{'    '}<span className="t">{'<img'}</span> <span className="a">src</span>=<span className="s">{'"{{ asset.logo_url }}"'}</span> <span className="a">width</span>=<span className="s">"101"</span><span className="t">{'/>'}</span></span>
              <span className="ln">{'    '}<span className="t">{'<div'}</span> <span className="a">style</span>=<span className="s">"color:#be1900;font-weight:700"</span><span className="t">{'>'}</span></span>
              <span className="ln">{'      '}<span className="ph">{`{{ user.name }}`}</span> <span className="ph">{`{{ user.credentials }}`}</span></span>
              <span className="ln">{'    '}<span className="t">{'</div>'}</span></span>
              <span className="ln">{'    '}<span className="t">{'<div>'}</span><span className="ph">{`{{ user.role }}`}</span><span className="t">{'</div>'}</span></span>
              <span className="ln">{'    '}<span className="t">{'<div'}</span> <span className="a">style</span>=<span className="s">"font-weight:700"</span><span className="t">{'>'}</span><span className="ph">{`{{ user.company }}`}</span><span className="t">{'</div>'}</span></span>
              <span className="ln">{'    '}<span className="t">{'<div'}</span> <span className="a">style</span>=<span className="s">"font-style:italic"</span><span className="t">{'>'}</span><span className="ph">{`{{ user.tagline }}`}</span><span className="t">{'</div>'}</span></span>
              <span className="ln">{'    '}<span className="c">{'{% include "partials/contact-line.html" %}'}</span></span>
              <span className="ln">{'    '}<span className="c">{'{% include "partials/address.html" %}'}</span></span>
              <span className="ln">{'    '}<span className="t">{'<a'}</span> <span className="a">href</span>=<span className="s">{'"{{ user.cta_url }}"'}</span><span className="t">{'>'}</span><span className="ph">{`{{ user.cta_label }}`}</span><span className="t">{'</a>'}</span></span>
              <span className="ln">{'    '}<span className="c">{'{% include "partials/socials.html" %}'}</span></span>
              <span className="ln">{'  '}<span className="t">{'</td>'}</span><span className="t">{'</tr>'}</span></span>
              <span className="ln"><span className="t">{'</table>'}</span></span>
            </div>
          </div>
          <div style={{padding:'8px 14px', borderTop:'1px solid var(--border-default)', background:'var(--surface-raised)', display:'flex', gap:16, fontSize:11, color:'var(--text-secondary)'}}>
            <span>Ln 14, Col 28</span>
            <span>Liquid</span>
            <span>UTF-8</span>
            <div style={{flex:1}} />
            <span className="mono">● valid · 11 placeholders · 3 partials</span>
          </div>
        </div>

        {/* CENTER — preview */}
        <div style={{display:'flex', flexDirection:'column', borderRight:'1px solid var(--border-default)', minWidth:0, background:'var(--surface-base)'}}>
          <div className="flex items-center gap-2" style={{padding:'8px 14px', borderBottom:'1px solid var(--border-default)', background:'var(--surface-raised)'}}>
            <span className="xs muted mono">preview</span>
            <select className="input" style={{width:160}} defaultValue="gmail-web">
              <option value="gmail-web">Gmail · Web</option>
              <option>Gmail · iOS</option>
              <option>Outlook</option>
              <option>Apple Mail</option>
            </select>
            <div style={{flex:1}} />
            <div className="flex" style={{background:'var(--surface-base)', border:'1px solid var(--border-default)', borderRadius:5, padding:2}}>
              <button className="btn xs" onClick={()=>setShowPH(false)} style={{background: showPH?'transparent':'var(--surface-overlay)', color: showPH?'var(--text-secondary)':'var(--text-primary)'}}>Rendered</button>
              <button className="btn xs" onClick={()=>setShowPH(true)} style={{background: showPH?'var(--surface-overlay)':'transparent', color: showPH?'var(--text-primary)':'var(--text-secondary)'}}>Placeholders</button>
            </div>
          </div>
          <div style={{flex:1, overflow:'auto', padding:'32px 24px', display:'flex', justifyContent:'center', alignItems:'flex-start'}}>
            <div style={{display:'flex', flexDirection:'column', gap:14, alignItems:'center'}}>
              <SignaturePreview showPlaceholders={showPH} />
              <div className="xs muted" style={{marginTop:8}}>265 × 360 px · rendered in Helvetica</div>
            </div>
          </div>
        </div>

        {/* RIGHT — bindings */}
        <div style={{display:'flex', flexDirection:'column', minWidth:0, background:'var(--surface-raised)'}}>
          <div className="panel-header" style={{borderBottom:'1px solid var(--border-default)'}}>
            <span>Data bindings</span>
            <span className="spacer" />
            <button className="btn xs ghost">⟲</button>
          </div>

          <div style={{padding:14, borderBottom:'1px solid var(--border-default)'}}>
            <div className="xs muted mb-2 upper">Source</div>
            <div style={{padding:10, border:'1px solid var(--border-default)', borderRadius:6, background:'var(--surface-base)'}}>
              <div className="flex items-center gap-2">
                <span style={{width:8, height:8, borderRadius:'50%', background:'var(--success)'}} />
                <span className="small mono" style={{color:'var(--text-primary)'}}>Airtable</span>
              </div>
              <div className="xs muted mono" style={{marginTop:4}}>appK7fQ··· / tblPeople</div>
              <div className="xs muted">20 records · 11 fields mapped · synced 2m ago</div>
              <div className="mt-2 flex gap-2">
                <button className="btn xs ghost">Change base</button>
                <button className="btn xs ghost">Resync</button>
              </div>
            </div>
          </div>

          <div style={{flex:1, overflow:'auto', padding:'10px 14px'}}>
            <div className="xs muted mb-2 upper">Placeholders · 11</div>
            {[
              ['user.salutation',     'Salutation',        'text',    'ok'],
              ['user.salutation_url', 'Salutation.URL',    'url',     'ok'],
              ['user.name',           'Name',              'text',    'ok'],
              ['user.credentials',    'Credentials',       'text',    'optional'],
              ['user.role',           'Role',              'text',    'ok'],
              ['user.company',        '(static)',          'text',    'static'],
              ['user.tagline',        '(static)',          'text',    'static'],
              ['user.mobile',         'Mobile',            'phone',   'ok'],
              ['user.email',          'Email',             'email',   'ok'],
              ['user.cta_label',      'CTA',               'text',    'ok'],
              ['user.cta_url',        'CTA.URL',           'url',     'ok'],
            ].map(([ph, fld, type, status]) => (
              <div key={ph} style={{
                padding:10, marginBottom:6,
                background:'var(--surface-base)',
                border:'1px solid var(--border-default)',
                borderRadius:6
              }}>
                <div className="flex items-center justify-between">
                  <span className="mono xs" style={{color:'var(--text-accent)'}}>{`{{ ${ph} }}`}</span>
                  <span className="xs mono muted">{type}</span>
                </div>
                <div className="xs mono mt-2 flex items-center gap-2" style={{color:'var(--text-muted)'}}>
                  <span>→</span>
                  <span style={{color:'var(--text-primary)'}}>{fld}</span>
                  <div style={{flex:1}} />
                  {status === 'ok' && <span style={{color:'var(--success)'}}>✓</span>}
                  {status === 'optional' && <span>○ optional</span>}
                  {status === 'static' && <span>⌨ static</span>}
                </div>
              </div>
            ))}
          </div>

          <div style={{padding:'10px 14px', borderTop:'1px solid var(--border-default)'}}>
            <button className="btn ghost" style={{width:'100%', justifyContent:'center'}}>+ Add placeholder</button>
          </div>
        </div>
      </div>
    </div>
  );
}

window.TemplatesPage = TemplatesPage;
