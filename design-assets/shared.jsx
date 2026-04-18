/* global React */

// Shared data + reusable preview components

const sampleTeam = [
  { id: 180406, name: 'Jerry Gennaria',  role: 'President & CEO',        email: 'jerry@toky.com',   mobile: '314.496.4294', initials: 'JG', status: 'synced', template: 'standard', updated: '2d' },
  { id: 180559, name: 'Alec Gleeson',    role: 'Creative Director',      email: 'alec@toky.com',    mobile: '314.555.0144', initials: 'AG', status: 'synced', template: 'standard', updated: '2d' },
  { id: 180560, name: 'Alex Ray',        role: 'Art Director',           email: 'alex@toky.com',    mobile: '314.555.0188', initials: 'AR', status: 'synced', template: 'standard', updated: '5d' },
  { id: 207191, name: 'Annie Martineau', role: 'Senior Designer',        email: 'annie@toky.com',   mobile: '314.555.0121', initials: 'AM', status: 'draft',  template: 'standard', updated: '1h' },
  { id: 180563, name: 'Brian Hopson',    role: 'Strategist',             email: 'brian@toky.com',   mobile: '314.555.0167', initials: 'BH', status: 'synced', template: 'standard', updated: '2d' },
  { id: 214018, name: 'Cherise Brock',   role: 'Account Director',       email: 'cherise@toky.com', mobile: '314.555.0198', initials: 'CB', status: 'synced', template: 'standard', updated: '2d' },
  { id: 180565, name: 'Deana Frisch',    role: 'Producer',               email: 'deana@toky.com',   mobile: '314.555.0132', initials: 'DF', status: 'stale',  template: 'standard', updated: '32d' },
  { id: 208505, name: 'Grace Keane',     role: 'Brand Designer',         email: 'grace@toky.com',   mobile: '314.555.0156', initials: 'GK', status: 'synced', template: 'standard', updated: '2d' },
  { id: 211195, name: 'J. Chambers',     role: 'Developer',              email: 'j@toky.com',       mobile: '314.555.0172', initials: 'JC', status: 'synced', template: 'intern',   updated: '2d' },
  { id: 200106, name: 'Jacob Goble',     role: 'Senior Developer',       email: 'jacob@toky.com',   mobile: '314.555.0109', initials: 'JG', status: 'synced', template: 'standard', updated: '2d' },
  { id: 180570, name: 'Karen Abbott',    role: 'Controller',             email: 'karen@toky.com',   mobile: '314.555.0140', initials: 'KA', status: 'synced', template: 'standard', updated: '2d' },
  { id: 180571, name: 'Lisa Mauer',      role: 'Account Supervisor',     email: 'lisa@toky.com',    mobile: '314.555.0141', initials: 'LM', status: 'synced', template: 'standard', updated: '2d' },
];

const defaultFields = {
  salutation: 'Catch our podcast, The Intangible Brand.',
  name: 'Jerry Gennaria',
  credentials: '',
  role: 'President & CEO',
  company: 'TOKY',
  tagline: 'Logic is Beautiful',
  mobile: '314.496.4294',
  email: 'jerry@toky.com',
  address: '3141 Locust Street, Ste 100, St. Louis, MO 63103',
  cta_label: 'Schedule a meeting.',
  cta_url: 'https://calendly.com/gennaria/',
};

function SignaturePreview({ fields = defaultFields, showPlaceholders = false }) {
  const f = fields;
  const P = ({ k, v }) => showPlaceholders
    ? <span className="ph-pill">{`{{ user.${k} }}`}</span>
    : <>{v || <span className="ph-pill">empty</span>}</>;

  return (
    <div className="sig-preview">
      <div className="sig-salutation"><P k="salutation" v={f.salutation} /></div>
      <div className="sig-logo">
        T<span className="o" />K Y<span className="reg">®</span>
      </div>
      <div className="sig-name"><P k="name" v={f.name} /></div>
      <div className="sig-role"><P k="role" v={f.role} /></div>
      <div className="sig-company"><P k="company" v={f.company} /></div>
      <div className="sig-tagline"><P k="tagline" v={f.tagline} /></div>
      <div className="sig-row">
        <span className="k">m.</span> <P k="mobile" v={f.mobile} />
        <span className="sep">|</span>
        <span className="k">e.</span> <P k="email" v={f.email} />
      </div>
      <div className="sig-row" style={{marginTop:4}}><P k="address" v={f.address} /></div>
      <div className="sig-cta"><P k="cta_label" v={f.cta_label} /></div>
      <div className="sig-socials">
        <span>in</span><span>ig</span><span>f</span><span>x</span>
      </div>
    </div>
  );
}

function CharCounter({ chars = 6230, limit = 10000, label = 'Gmail limit' }) {
  const pct = chars / limit;
  const cls = pct > 0.95 ? 'err' : pct > 0.8 ? 'warn' : '';
  return (
    <div className={`char-counter ${cls}`}>
      <div className="bar"><div className="fill" style={{width: `${Math.min(pct*100, 100)}%`}} /></div>
      <span>{chars.toLocaleString()} / {limit.toLocaleString()}</span>
      <span style={{color:'var(--text-muted)'}}>{label}</span>
    </div>
  );
}

Object.assign(window, { sampleTeam, defaultFields, SignaturePreview, CharCounter });
