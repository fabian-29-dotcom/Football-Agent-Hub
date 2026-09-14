import { useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Bell, Check, ChevronRight, CircleHelp, ClipboardCheck, FileText, Film, Flag, Goal, HeartHandshake, Home, LayoutGrid, Mail, MapPin, MessageCircle, MoreHorizontal, Paperclip, Pencil, PlayCircle, Plus, Send, Settings, ShieldCheck, Sparkles, UserRound, WalletCards, X } from 'lucide-react';
import { Link, Router as WouterRouter, useLocation } from 'wouter';
import { ErrorBoundary } from '@/components/error-boundary';
import NotFound from '@/pages/not-found';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';

type PlayerProfile = {
  name: string; position: string; age: number; nationality: string; passport: string;
  currentClub: string; contractStatus: string; salary: string; marketValue: string;
  availability: string; readiness: number; foot: string; height: string;
};
type Opportunity = {
  id: string; club: string; country: string; role: string; match: number;
  status: 'Active conversation' | 'Monitoring' | 'Shortlisted'; next: string; note: string;
};
type DocumentItem = { id: string; type: string; detail: string; status: 'Ready' | 'Action needed' | 'In review'; updated: string; action: string };
type MessageItem = { id: string; sender: 'Agent' | 'You'; text: string; time: string; unread?: boolean };

const queryClient = new QueryClient();
const initialProfile: PlayerProfile = {
  name: 'Tiago Pereira', position: 'Attacking midfielder', age: 24, nationality: 'Portugal',
  passport: 'Portuguese · valid until 18 Jun 2029', currentClub: 'SC Braga',
  contractStatus: 'Contracted until 30 Jun 2027', salary: 'Confidential', marketValue: '€5.2m',
  availability: 'Available from 01 Jul 2026', readiness: 82, foot: 'Right', height: '1.79m',
};
const initialOpportunities: Opportunity[] = [
  { id: 'rayo', club: 'Rayo Vallecano', country: 'Spain', role: 'Attacking midfielder', match: 86, status: 'Active conversation', next: 'Club feedback expected this week', note: 'They are looking for a creative No. 10 who can play between the lines and contribute from set pieces.' },
  { id: 'feyenoord', club: 'Feyenoord', country: 'Netherlands', role: 'No. 8 / No. 10', match: 78, status: 'Shortlisted', next: 'Scouting review on 24 Apr', note: 'Your progressive passing and pressing numbers fit their midfield profile. The sporting team is reviewing the latest match package.' },
  { id: 'lille', club: 'LOSC Lille', country: 'France', role: 'Attacking midfielder', match: 73, status: 'Monitoring', next: 'Agent to reconnect in May', note: 'A longer-term option with a strong pathway for technical players. No formal conversation has started yet.' },
];
const initialDocs: DocumentItem[] = [
  { id: 'contract', type: 'Current contract', detail: 'SC Braga · signed 2023', status: 'Ready', updated: '12 Feb 2026', action: 'View document' },
  { id: 'passport', type: 'Passport & visa', detail: 'Portuguese passport', status: 'Ready', updated: '12 Feb 2026', action: 'View document' },
  { id: 'medical', type: 'Medical history', detail: 'Full medical summary', status: 'Action needed', updated: '18 Sep 2025', action: 'Request update' },
  { id: 'tax', type: 'Tax residency', detail: 'Portugal · 2025', status: 'In review', updated: '02 Apr 2026', action: 'View status' },
  { id: 'media', type: 'Media permissions', detail: 'Image and likeness release', status: 'Action needed', updated: 'Not added', action: 'Add document' },
];
const initialMessages: MessageItem[] = [
  { id: 'm1', sender: 'Agent', text: 'Quick update, Tiago. Rayo Vallecano have watched the full match package and asked for a little more detail on your availability this summer.', time: 'Today, 09:42', unread: true },
  { id: 'm2', sender: 'You', text: 'Good to know. I am available from 1 July, as we discussed. Do they have a clear idea of the role?', time: 'Today, 10:08' },
  { id: 'm3', sender: 'Agent', text: 'Yes — they see you as a central attacking midfielder in a 4-2-3-1. I will share their feedback as soon as it comes through.', time: 'Today, 10:21' },
];

const navItems = [
  { href: '/', label: 'Overview', icon: Home },
  { href: '/profile', label: 'My profile', icon: UserRound },
  { href: '/opportunities', label: 'Opportunities', icon: LayoutGrid },
  { href: '/documents', label: 'Documents', icon: FileText },
  { href: '/messages', label: 'Messages', icon: MessageCircle },
];

function Avatar({ size = 'md', label = 'TP' }: { size?: 'sm' | 'md' | 'lg'; label?: string }) {
  return <div className={`avatar ${size}`} data-testid={`img-avatar-${size}`}>{label}</div>;
}

function Shell({ children, unread, profile }: { children: React.ReactNode; unread: number; profile: PlayerProfile }) {
  const [location] = useLocation();
  return <div className="portal-shell">
    <aside className="sidebar">
      <Link href="/" className="brand-mark" data-testid="link-brand"><span className="brand-ball">P</span><span className="brand-name">Pitchside</span></Link>
      <div className="side-eyebrow">Player portal</div>
      <nav aria-label="Main navigation">
        {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-item ${location === href ? 'active' : ''}`} data-testid={`link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={17} strokeWidth={1.8} /><span>{label}</span>{label === 'Messages' && unread > 0 ? <span className="status amber" style={{ marginLeft: 'auto', padding: '3px 7px' }}>{unread}</span> : null}</Link>)}
      </nav>
      <div className="side-footer">
        <Link href="/settings" className="nav-item" data-testid="link-settings"><Settings size={17} strokeWidth={1.8} /><span>Settings</span></Link>
        <div className="player-mini"><Avatar size="sm" /><div><strong style={{ fontSize: 12 }}>{profile.name}</strong><div style={{ color: 'hsl(42 35% 96% / .5)', fontSize: 10, marginTop: 2 }}>Player account</div></div></div>
      </div>
    </aside>
    <div className="main-wrap">
      <header className="topbar"><span className="topbar-caption">Your representation, in one place</span><div className="topbar-right"><button className="icon-button" aria-label="Help" data-testid="button-help"><CircleHelp size={18} /></button><button className="icon-button" aria-label="Notifications" data-testid="button-notifications"><Bell size={18} /></button><Avatar size="sm" /></div></header>
      <main>{children}</main>
      <nav className="mobile-nav" aria-label="Mobile navigation">{navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-item ${location === href ? 'active' : ''}`} data-testid={`mobile-link-${label.toLowerCase().replaceAll(' ', '-')}`}><Icon size={18} /><span>{label}</span></Link>)}<Link href="/settings" className={`nav-item ${location === '/settings' ? 'active' : ''}`} data-testid="mobile-link-settings"><Settings size={18} /><span>Settings</span></Link></nav>
    </div>
  </div>;
}

function PageHeading({ kicker, title, copy, action }: { kicker: string; title: string; copy: string; action?: React.ReactNode }) {
  return <div className="page-heading"><div><div className="kicker">{kicker}</div><h1>{title}</h1><p className="subcopy">{copy}</p></div>{action}</div>;
}

function Status({ children }: { children: React.ReactNode }) {
  const text = String(children);
  const type = text === 'Ready' || text === 'Active conversation' ? 'green' : text === 'Action needed' || text === 'Shortlisted' || text === 'In review' ? 'amber' : 'ink';
  return <span className={`status ${type}`}>{children}</span>;
}

function HomePage({ profile, opportunities, documents, messages, onToast }: PageBaseProps) {
  const missingDocs = documents.filter((doc) => doc.status === 'Action needed').length;
  return <div className="page">
    <PageHeading kicker="Wednesday · 22 April 2026" title={`Good morning, ${profile.name.split(' ')[0]}.`} copy="Here is the latest on your representation and the few things that need your attention." />
    <div className="grid grid-main">
      <section className="grid" style={{ gap: 18 }}>
        <div className="card hero-card">
          <div className="kicker">Your player profile</div>
          <div className="hero-profile" style={{ marginTop: 18 }}><Avatar size="lg" /><div><div className="hero-name">{profile.name}</div><div className="hero-detail">{profile.position} · {profile.currentClub} · {profile.nationality}</div></div></div>
          <p className="subcopy">Your profile is being shared with clubs that match your playing style and next career step.</p>
          <div className="action-row"><Link href="/profile" className="btn btn-cream" data-testid="link-review-profile">Review profile <ChevronRight size={14} /></Link><Link href="/opportunities" className="btn" style={{ color: 'hsl(42 35% 96% / .72)', borderColor: 'hsl(42 35% 96% / .2)' }} data-testid="link-see-opportunities">See opportunities</Link></div>
        </div>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Active opportunities</div><h2 style={{ marginTop: 7 }}>Where conversations are moving</h2></div><Link href="/opportunities" className="btn btn-ghost" data-testid="link-all-opportunities">View all <ChevronRight size={14} /></Link></div>
          {opportunities.slice(0, 2).map((item) => <OpportunityRow key={item.id} item={item} onOpen={() => onToast(`Opened ${item.club} details`)} />)}
        </div>
      </section>
      <section className="grid" style={{ gap: 18, alignContent: 'start' }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Profile readiness</div><ShieldCheck size={17} color="hsl(var(--primary))" /></div>
          <div className="readiness-score"><div className="score-ring"><b>{profile.readiness}%</b></div><div className="score-text"><strong>Ready to be seen</strong><span>One or two details will make your profile stronger.</span></div></div>
          <div className="progress"><span style={{ width: `${profile.readiness}%` }} /></div><Link href="/profile" className="btn btn-ghost" style={{ marginTop: 12 }} data-testid="link-improve-readiness">Improve readiness <ChevronRight size={14} /></Link>
        </div>
        <div className="card">
          <div className="card-header"><div><div className="card-title">Today’s actions</div><h2 style={{ marginTop: 7 }}>A short list for you</h2></div><ClipboardCheck size={17} color="hsl(var(--primary))" /></div>
          <div className="check-list">
            <CheckRow done={false} title="Add your latest medical summary" detail="Requested by your agent" action={() => onToast('Medical update requested')} />
            <CheckRow done={false} title="Confirm summer availability" detail="One tap to confirm" action={() => onToast('Availability confirmed')} />
            <CheckRow done={true} title="Review your player profile" detail="Last checked today" />
          </div>
          {missingDocs === 0 ? <div className="soft-panel" style={{ marginTop: 16, fontSize: 12 }}>Everything is up to date.</div> : null}
        </div>
        <div className="card">
          <div className="card-header"><div className="card-title">Latest from your agent</div><MoreHorizontal size={17} color="hsl(var(--muted-foreground))" /></div>
          <div className="update-note"><div className="note-avatar"><Sparkles size={16} /></div><div className="note-body"><p>“Rayo have watched your full match package and asked about your summer availability. I’m following up today.”</p><time>Marco Silva · Today, 09:42</time></div></div>
          <Link href="/messages" className="btn btn-ghost" style={{ marginTop: 16 }} data-testid="link-open-message">Open conversation <ChevronRight size={14} /></Link>
        </div>
      </section>
    </div>
  </div>;
}

function CheckRow({ done, title, detail, action }: { done: boolean; title: string; detail: string; action?: () => void }) {
  return <div className="check-row"><div className="check-copy"><div className={`check-icon ${done ? 'done' : ''}`}>{done ? <Check size={13} /> : <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'currentColor' }} />}</div><div><b>{title}</b><small>{detail}</small></div></div>{action ? <button className="btn btn-ghost" onClick={action} data-testid={`button-action-${title.toLowerCase().replaceAll(' ', '-')}`}>Do now <ChevronRight size={13} /></button> : null}</div>;
}

function OpportunityRow({ item, onOpen }: { item: Opportunity; onOpen: () => void }) {
  return <div className="opportunity-row"><div><div className="club-name">{item.club}</div><div className="club-meta">{item.country} · {item.role}</div></div><Status>{item.status}</Status><div className="match">{item.match}<span>/100 fit</span></div><button className="icon-button" onClick={onOpen} aria-label={`Open ${item.club}`} data-testid={`button-opportunity-${item.id}`}><ChevronRight size={17} /></button></div>;
}

type PageBaseProps = { profile: PlayerProfile; opportunities: Opportunity[]; documents: DocumentItem[]; messages: MessageItem[]; onToast: (message: string) => void };

function ProfilePage({ profile, onProfileChange, onToast }: PageBaseProps & { onProfileChange: (profile: PlayerProfile) => void }) {
  const [tab, setTab] = useState<'overview' | 'updates'>('overview');
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(profile);
  const setField = (key: keyof PlayerProfile, value: string) => setDraft((current) => ({ ...current, [key]: value }));
  const save = () => { onProfileChange({ ...draft, age: Number(draft.age), readiness: Math.min(100, draft.readiness + 5) }); setEditing(false); onToast('Profile updated and shared with your agent'); };
  return <div className="page">
    <PageHeading kicker="Your information" title="My profile" copy="This is the profile your agent uses when presenting you to clubs. You are always in control of what is shared." action={<button className="btn btn-primary" onClick={() => { setDraft(profile); setEditing(!editing); }} data-testid="button-edit-profile"><Pencil size={14} /> {editing ? 'Close editor' : 'Update profile'}</button>} />
    <div className="tabbar"><button className={`tab ${tab === 'overview' ? 'selected' : ''}`} onClick={() => setTab('overview')} data-testid="tab-profile-overview">Overview</button><button className={`tab ${tab === 'updates' ? 'selected' : ''}`} onClick={() => setTab('updates')} data-testid="tab-profile-updates">What needs updating</button></div>
    {editing ? <div className="card" style={{ marginBottom: 18 }}><div className="card-header"><div><div className="card-title">Update your details</div><h2 style={{ marginTop: 7 }}>Keep your profile current</h2></div><button className="icon-button" onClick={() => setEditing(false)} data-testid="button-close-editor"><X size={17} /></button></div><div className="grid grid-two"><div className="field"><label>Current club</label><input value={draft.currentClub} onChange={(e) => setField('currentClub', e.target.value)} data-testid="input-current-club" /></div><div className="field"><label>Availability</label><input value={draft.availability} onChange={(e) => setField('availability', e.target.value)} data-testid="input-availability" /></div><div className="field"><label>Passport details</label><input value={draft.passport} onChange={(e) => setField('passport', e.target.value)} data-testid="input-passport" /></div><div className="field"><label>Preferred foot</label><input value={draft.foot} onChange={(e) => setField('foot', e.target.value)} data-testid="input-foot" /></div></div><div className="action-row" style={{ marginTop: 19 }}><button className="btn btn-primary" onClick={save} data-testid="button-save-profile"><Check size={14} /> Save changes</button><button className="btn btn-outline" onClick={() => setEditing(false)} data-testid="button-cancel-profile">Cancel</button></div></div> : null}
    {tab === 'overview' ? <div className="grid grid-main"><div className="card"><div className="profile-band"><Avatar size="lg" /><div><h2>{profile.name}</h2><p>{profile.position} · {profile.age} years old · {profile.nationality}</p></div></div><div className="data-grid"><DataItem label="Position" value={profile.position} /><DataItem label="Current club" value={profile.currentClub} /><DataItem label="Contract" value={profile.contractStatus} /><DataItem label="Nationality" value={profile.nationality} /><DataItem label="Passport" value="Valid" detail={profile.passport.split('·')[1]} /><DataItem label="Availability" value={profile.availability} /><DataItem label="Market value" value={profile.marketValue} /><DataItem label="Preferred foot" value={profile.foot} /><DataItem label="Height" value={profile.height} /></div></div><div className="grid" style={{ alignContent: 'start' }}><div className="card"><div className="card-header"><div><div className="card-title">Video & stats</div><h2 style={{ marginTop: 7 }}>Your latest work</h2></div><Film size={17} color="hsl(var(--primary))" /></div><div className="soft-panel"><div style={{ display: 'flex', alignItems: 'center', gap: 11 }}><div className="note-avatar"><PlayCircle size={18} /></div><div><strong style={{ fontSize: 13 }}>2025/26 season package</strong><div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, marginTop: 4 }}>Updated 14 Apr 2026 · 03:48</div></div></div><button className="btn btn-outline" style={{ width: '100%', marginTop: 14 }} onClick={() => onToast('Opening your season package')} data-testid="button-watch-video"><PlayCircle size={14} /> Watch package</button></div><div className="grid grid-two" style={{ gap: 10, marginTop: 12 }}><div className="soft-panel"><div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 10 }}>Appearances</div><strong className="display" style={{ fontSize: 20 }}>31</strong></div><div className="soft-panel"><div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 10 }}>Key passes</div><strong className="display" style={{ fontSize: 20 }}>47</strong></div></div></div><div className="card"><div className="card-header"><div><div className="card-title">Representation</div><h2 style={{ marginTop: 7 }}>Marco Silva</h2></div><HeartHandshake size={17} color="hsl(var(--primary))" /></div><p className="subcopy" style={{ marginTop: 0 }}>Your lead agent at Pitchside. Marco is your point of contact for opportunities and contract conversations.</p><Link href="/messages" className="btn btn-ghost" style={{ marginTop: 12 }} data-testid="link-message-agent">Message Marco <ChevronRight size={14} /></Link></div></div></div> : <div className="grid grid-two"><div className="card"><div className="card-header"><div><div className="card-title">Keep it current</div><h2 style={{ marginTop: 7 }}>Three details to check</h2></div><Flag size={17} color="hsl(var(--accent-foreground))" /></div><div className="check-list"><CheckRow done={false} title="Medical summary" detail="Last updated 18 Sep 2025" action={() => onToast('Your agent has been asked for the medical summary')} /><CheckRow done={false} title="Availability window" detail={profile.availability} action={() => { onProfileChange({ ...profile, readiness: 96 }); onToast('Availability marked as confirmed'); }} /><CheckRow done={true} title="Match video" detail="Updated 14 Apr 2026" /></div></div><div className="card"><div className="card-header"><div><div className="card-title">How your profile is used</div><h2 style={{ marginTop: 7 }}>Clear and purposeful</h2></div><ShieldCheck size={17} color="hsl(var(--primary))" /></div><p className="subcopy" style={{ marginTop: 0 }}>Your agent shares your football profile, availability and relevant documents only with clubs that are a fit. You will see every active opportunity here before a conversation moves forward.</p></div></div>}
  </div>;
}

function DataItem({ label, value, detail }: { label: string; value: string; detail?: string }) { return <div className="data-item"><label>{label}</label><strong>{value}</strong>{detail ? <em>{detail}</em> : null}</div>; }

function OpportunitiesPage({ opportunities, onToast }: PageBaseProps) {
  const [selected, setSelected] = useState<Opportunity | null>(null);
  return <div className="page"><PageHeading kicker="Career possibilities" title="Opportunities" copy="A considered view of the clubs and roles your agent is exploring with you." action={<div className="soft-panel" style={{ display: 'flex', gap: 9, alignItems: 'center', fontSize: 12 }}><Sparkles size={15} color="hsl(var(--primary))" /><span><b>3</b> considered options</span></div>} /><div className="card"><div className="card-header"><div><div className="card-title">In view for you</div><h2 style={{ marginTop: 7 }}>Potential next steps</h2></div><span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 12 }}>Updated today</span></div>{opportunities.map((item) => <div key={item.id} style={{ borderBottom: '1px solid hsl(var(--border))', padding: '19px 0' }}><div className="opportunity-row" style={{ border: 0, padding: 0 }}><div><div className="club-name">{item.club}</div><div className="club-meta"><MapPin size={11} style={{ verticalAlign: 'middle', marginRight: 4 }} />{item.country} · {item.role}</div></div><Status>{item.status}</Status><div className="match">{item.match}<span>/100 fit</span></div><button className="icon-button" onClick={() => setSelected(item)} data-testid={`button-view-${item.id}`} aria-label={`View ${item.club}`}><ChevronRight size={17} /></button></div><div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 14, paddingLeft: 2 }}><span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>Next: {item.next}</span><button className="btn btn-ghost" style={{ marginLeft: 'auto' }} onClick={() => setSelected(item)} data-testid={`button-details-${item.id}`}>View context <ChevronRight size={13} /></button></div></div>)}</div><div className="grid grid-two section-space"><div className="card"><div className="card-header"><div className="card-title">What happens next</div><Goal size={17} color="hsl(var(--primary))" /></div><div className="check-list"><CheckRow done title="Your profile shared with selected clubs" detail="Your agent manages this for you" /><CheckRow done title="Club fit reviewed together" detail="You can ask questions at any time" /><CheckRow done={false} title="Club conversation progresses" detail="You will be updated before anything moves forward" /></div></div><div className="card"><div className="card-header"><div className="card-title">Your say matters</div><HeartHandshake size={17} color="hsl(var(--primary))" /></div><p className="subcopy" style={{ marginTop: 0 }}>An opportunity is only right if it fits your football and your life. Message your agent with questions, preferences or a club you want to learn more about.</p><Link href="/messages" className="btn btn-primary" style={{ marginTop: 18 }} data-testid="link-talk-agent">Talk to your agent <MessageCircle size={14} /></Link></div></div>{selected ? <div className="toast" style={{ maxWidth: 380, bottom: 24 }}><div style={{ display: 'flex', justifyContent: 'space-between', gap: 18, marginBottom: 8 }}><strong>{selected.club}</strong><button className="icon-button" style={{ color: 'inherit', margin: -8 }} onClick={() => setSelected(null)} data-testid="button-close-opportunity"><X size={15} /></button></div><div style={{ color: 'hsl(42 35% 96% / .68)', fontSize: 12, lineHeight: 1.5 }}>{selected.note}</div><div style={{ color: 'hsl(var(--accent))', fontSize: 11, fontWeight: 700, marginTop: 10 }}>Next: {selected.next}</div><button className="btn btn-cream" style={{ marginTop: 13, width: '100%' }} onClick={() => { setSelected(null); onToast(`Question sent to your agent about ${selected.club}`); }} data-testid="button-ask-opportunity">Ask my agent about this</button></div> : null}</div>;
}

function DocumentsPage({ documents, onDocumentAction, onToast }: PageBaseProps & { onDocumentAction: (id: string) => void }) {
  const ready = documents.filter((doc) => doc.status === 'Ready').length;
  return <div className="page"><PageHeading kicker="Your paperwork" title="Documents" copy="A simple checklist of the documents your representation may need. Nothing is shared without a reason." action={<div className="soft-panel" style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: 12 }}><ShieldCheck size={15} color="hsl(var(--primary))" /><b>{ready}/{documents.length}</b> ready</div>} /><div className="card"><div className="card-header"><div><div className="card-title">Document checklist</div><h2 style={{ marginTop: 7 }}>Your file, at a glance</h2></div><button className="btn btn-primary" onClick={() => onToast('Choose a document to add')} data-testid="button-add-document"><Plus size={14} /> Add document</button></div>{documents.map((doc) => <div className="doc-row" key={doc.id}><div className="doc-name"><div className="doc-icon"><FileText size={16} /></div><div><strong>{doc.type}</strong><span>{doc.detail}</span></div></div><Status>{doc.status}</Status><span style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11 }}>{doc.updated}</span><button className={`btn ${doc.status === 'Action needed' ? 'btn-primary' : 'btn-outline'}`} onClick={() => onDocumentAction(doc.id)} data-testid={`button-document-${doc.id}`}>{doc.status === 'Action needed' ? <><Plus size={13} /> {doc.action}</> : <>{doc.action} <ChevronRight size={13} /></>}</button></div>)}</div><div className="soft-panel section-space" style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}><ShieldCheck size={17} color="hsl(var(--primary))" style={{ flex: '0 0 auto', marginTop: 2 }} /><div><strong style={{ fontSize: 13 }}>Your documents stay in context</strong><p style={{ color: 'hsl(var(--muted-foreground))', fontSize: 12, lineHeight: 1.5, marginTop: 4 }}>Your agent will tell you what a document is for before requesting it. You can ask for a status update at any point.</p></div></div></div>;
}

function MessagesPage({ messages, setMessages }: PageBaseProps & { setMessages: React.Dispatch<React.SetStateAction<MessageItem[]>> }) {
  const [draft, setDraft] = useState('');
  const send = () => { if (!draft.trim()) return; setMessages((current) => [...current, { id: `mine-${Date.now()}`, sender: 'You', text: draft.trim(), time: 'Just now' }]); setDraft(''); };
  return <div className="page"><PageHeading kicker="Your conversations" title="Messages" copy="A direct line to your agent, without the noise." /><div className="card message-layout"><div className="thread-list"><div className="thread-label">Conversations</div><button className="thread active" data-testid="button-thread-agent"><Avatar size="sm" /><div className="thread-content"><div className="thread-top"><strong>Marco Silva</strong><time>Today</time></div><p>{messages[messages.length - 1]?.text}</p></div>{messages.some((message) => message.unread) ? <span className="unread-dot" /> : null}</button></div><div className="conversation"><div className="conversation-head"><Avatar size="md" /><div><strong style={{ fontSize: 14 }}>Marco Silva</strong><p>Your lead agent · usually replies within a few hours</p></div><span className="status green" style={{ marginLeft: 'auto' }}>Available</span></div><div className="messages">{messages.map((message) => <div key={message.id} className={`bubble ${message.sender === 'You' ? 'mine' : ''}`} data-testid={`message-${message.id}`}>{message.text}<time>{message.time}</time></div>)}</div><div className="composer"><button className="icon-button" aria-label="Attach file" data-testid="button-attach"><Paperclip size={17} /></button><input value={draft} onChange={(e) => setDraft(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') send(); }} placeholder="Write a message to Marco…" data-testid="input-message" /><button className="btn btn-primary" onClick={send} data-testid="button-send-message"><Send size={14} /> Send</button></div></div></div></div>;
}

function SettingsPage({ onToast }: { onToast: (message: string) => void }) {
  const [updates, setUpdates] = useState(true);
  const [opportunities, setOpportunities] = useState(true);
  return <div className="page"><PageHeading kicker="Your account" title="Settings" copy="Small preferences that keep this space useful to you." /><div className="grid grid-two"><div className="card"><div className="card-header"><div><div className="card-title">Notifications</div><h2 style={{ marginTop: 7 }}>Stay in the loop</h2></div><Bell size={17} color="hsl(var(--primary))" /></div><div className="setting-row"><div><strong>Agent updates</strong><span>When Marco shares news or asks for something</span></div><button className={`switch ${updates ? 'on' : ''}`} onClick={() => { setUpdates(!updates); onToast(updates ? 'Agent updates muted' : 'Agent updates turned on'); }} aria-label="Toggle agent updates" data-testid="switch-agent-updates"><i /></button></div><div className="setting-row"><div><strong>Opportunity activity</strong><span>When a club conversation changes status</span></div><button className={`switch ${opportunities ? 'on' : ''}`} onClick={() => { setOpportunities(!opportunities); onToast(opportunities ? 'Opportunity notifications muted' : 'Opportunity notifications turned on'); }} aria-label="Toggle opportunity activity" data-testid="switch-opportunity-updates"><i /></button></div></div><div className="card"><div className="card-header"><div><div className="card-title">Representation</div><h2 style={{ marginTop: 7 }}>Your team</h2></div><HeartHandshake size={17} color="hsl(var(--primary))" /></div><div className="player-mini" style={{ padding: '4px 0 18px', borderBottom: '1px solid hsl(var(--border))' }}><Avatar size="md" label="MS" /><div><strong style={{ fontSize: 13 }}>Marco Silva</strong><div style={{ color: 'hsl(var(--muted-foreground))', fontSize: 11, marginTop: 3 }}>Lead agent · Pitchside</div></div></div><div className="setting-row"><div><strong>Representation contact</strong><span>marco@pitchside.co · +351 21 555 0184</span></div><button className="btn btn-outline" onClick={() => onToast('Opening a message to Marco')} data-testid="button-contact-agent"><Mail size={13} /> Contact</button></div><div className="soft-panel" style={{ marginTop: 17, fontSize: 12, lineHeight: 1.5 }}>Your representation agreement is active through <b>30 Jun 2027</b>. Questions about your agreement? Speak directly with Marco.</div></div></div></div>;
}

function AppContent() {
  const [location] = useLocation();
  const [profile, setProfile] = useState(initialProfile);
  const [opportunities] = useState(initialOpportunities);
  const [documents, setDocuments] = useState(initialDocs);
  const [messages, setMessages] = useState(initialMessages);
  const [toast, setToast] = useState('');
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2800); };
  const unread = useMemo(() => messages.filter((message) => message.unread).length, [messages]);
  const actionDocument = (id: string) => { const doc = documents.find((item) => item.id === id); if (!doc) return; setDocuments((current) => current.map((item) => item.id === id ? { ...item, status: 'Ready', updated: 'Just now', action: 'View document' } : item)); notify(doc.status === 'Action needed' ? `${doc.type} marked as ready` : `Opened ${doc.type}`); };
  let page: React.ReactNode;
  const base = { profile, opportunities, documents, messages, onToast: notify };
  if (location === '/profile') page = <ProfilePage {...base} onProfileChange={setProfile} />;
  else if (location === '/opportunities') page = <OpportunitiesPage {...base} />;
  else if (location === '/documents') page = <DocumentsPage {...base} onDocumentAction={actionDocument} />;
  else if (location === '/messages') page = <MessagesPage {...base} setMessages={setMessages} />;
  else if (location === '/settings') page = <SettingsPage onToast={notify} />;
  else if (location === '/' || location === '') page = <HomePage {...base} />;
  else page = <NotFound />;
  return <Shell unread={unread} profile={profile}>{page}{toast ? <div className="toast" role="status" data-testid="status-toast">{toast}</div> : null}</Shell>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><ErrorBoundary><AppContent /></ErrorBoundary></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;