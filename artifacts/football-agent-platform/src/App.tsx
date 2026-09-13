import { type ReactNode, createContext, useContext, useMemo, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import {
  Activity, ArrowUpRight, Bell, BriefcaseBusiness, Building2, CalendarClock, Check,
  ChevronRight, Clock3, FileText, Filter, Home, Mail, Menu, MessageSquareText,
  MoreHorizontal, Search, Send, ShieldCheck, Sparkles, Target, UserRound, Users, X, Zap,
} from 'lucide-react';
import { Link, Route, Switch, useLocation, Router as WouterRouter } from 'wouter';
import NotFound from '@/pages/not-found';

const queryClient = new QueryClient();

type Player = {
  id: string; name: string; initials: string; position: string; age: number; nationality: string;
  passport: string; club: string; contract: string; salary: string; value: string;
  availability: string; readiness: string; tone: 'good' | 'warn' | 'hot';
};
type Club = {
  id: string; name: string; short: string; country: string; league: string; need: string;
  budget: string; contact: string; activity: string; tone: 'good' | 'warn' | 'hot';
};
type Opportunity = {
  id: string; club: string; role: string; constraint: string; players: string[];
  score: number; explanation: string; next: string; tone: 'good' | 'warn' | 'hot';
};
type Deal = {
  id: string; player: string; club: string; stage: string; fee: string; salary: string;
  next: string; deadline: string; status: string; tone: 'good' | 'warn' | 'hot';
};
type ContractRecord = {
  id: string; player: string; club: string; kind: string; expiry: string;
  status: string; next: string; documents: string[]; tone: 'good' | 'warn' | 'hot';
};
type ActivityItem = {
  id: string; type: string; title: string; description: string; time: string; urgency: 'high' | 'normal';
};

const players: Player[] = [
  { id: 'p1', name: 'Noah Williams', initials: 'NW', position: 'Centre back', age: 24, nationality: 'England', passport: 'GBR', club: 'Bristol Rovers', contract: 'Expires Jun 2025', salary: '£6,200 / wk', value: '€1.8m', availability: 'Open to move', readiness: 'Ready to introduce', tone: 'good' },
  { id: 'p2', name: 'Elias Adebayo', initials: 'EA', position: 'Attacking midfielder', age: 21, nationality: 'Nigeria', passport: 'NGA', club: 'FC Midtjylland', contract: 'Expires Jun 2026', salary: '€7,800 / wk', value: '€3.4m', availability: 'Priority', readiness: 'Video refreshed', tone: 'hot' },
  { id: 'p3', name: 'Marek Šimek', initials: 'MŠ', position: 'Goalkeeper', age: 27, nationality: 'Czech Republic', passport: 'CZE', club: 'Slovan Liberec', contract: 'Contracted', salary: '€5,100 / wk', value: '€1.1m', availability: 'Monitoring', readiness: 'Need medicals', tone: 'warn' },
  { id: 'p4', name: 'Tiago Pereira', initials: 'TP', position: 'Left winger', age: 19, nationality: 'Portugal', passport: 'PRT', club: 'Vitória SC', contract: 'Expires Jun 2027', salary: '€4,400 / wk', value: '€2.6m', availability: 'Open to move', readiness: 'Ready to introduce', tone: 'good' },
  { id: 'p5', name: 'Rayan Belkacem', initials: 'RB', position: 'No. 8', age: 23, nationality: 'France', passport: 'FRA', club: 'FC Sochaux', contract: 'Expires Jun 2025', salary: '€5,900 / wk', value: '€2.1m', availability: 'Priority', readiness: 'Contract review', tone: 'hot' },
  { id: 'p6', name: 'Milan Krstić', initials: 'MK', position: 'Striker', age: 26, nationality: 'Serbia', passport: 'SRB', club: 'FK Čukarički', contract: 'Contracted', salary: '€8,700 / wk', value: '€3.0m', availability: 'Open to move', readiness: 'Ready to introduce', tone: 'good' },
  { id: 'p7', name: 'Jude Okafor', initials: 'JO', position: 'Right back', age: 22, nationality: 'England', passport: 'GBR', club: 'Leyton Orient', contract: 'Expires Jun 2026', salary: '£3,700 / wk', value: '€850k', availability: 'Open to move', readiness: 'Profile update due', tone: 'warn' },
];

const clubs: Club[] = [
  { id: 'c1', name: 'Real Zaragoza', short: 'RZ', country: 'Spain', league: 'LaLiga 2', need: 'Starting centre back', budget: '€2.0–3.5m', contact: 'Álvaro Núñez', activity: 'Requested 3 profiles today', tone: 'hot' },
  { id: 'c2', name: 'FC Utrecht', short: 'FU', country: 'Netherlands', league: 'Eredivisie', need: 'Left-footed winger', budget: '€3.0–5.0m', contact: 'Sander Vos', activity: 'Last touchpoint 2 days ago', tone: 'good' },
  { id: 'c3', name: 'Racing Genk', short: 'RG', country: 'Belgium', league: 'Jupiler Pro League', need: 'Box-to-box midfielder', budget: '€2.5–4.0m', contact: 'Lotte Peeters', activity: 'Shortlist in review', tone: 'warn' },
  { id: 'c4', name: 'Hansa Rostock', short: 'HR', country: 'Germany', league: '2. Bundesliga', need: 'Mobile No. 9', budget: '€1.5–2.2m', contact: 'Jonas Keller', activity: 'Sent 2 introductions', tone: 'good' },
  { id: 'c5', name: 'Pisa Sporting Club', short: 'PS', country: 'Italy', league: 'Serie B', need: 'Goalkeeper', budget: '€900k–1.4m', contact: 'Marta Ricci', activity: 'Visa fit confirmed', tone: 'good' },
  { id: 'c6', name: 'Heart of Midlothian', short: 'HM', country: 'Scotland', league: 'Scottish Premiership', need: 'Attacking midfielder', budget: '£1.2–1.8m', contact: 'Calum Reid', activity: 'New sporting director', tone: 'warn' },
];

const opportunities: Opportunity[] = [
  { id: 'o1', club: 'Real Zaragoza', role: 'Starting centre back', constraint: 'EU passport preferred · €2.0–3.5m', players: ['Noah Williams', 'Marek Šimek'], score: 94, explanation: 'Noah matches the age, aerial duel and contract window brief. His GB passport removes a registration risk.', next: 'Prepare introduction', tone: 'hot' },
  { id: 'o2', club: 'FC Utrecht', role: 'Left-footed winger', constraint: 'U23 · Eredivisie experience helpful', players: ['Tiago Pereira', 'Elias Adebayo'], score: 89, explanation: 'Tiago’s 1v1 profile and Portuguese passport align with Utrecht’s current left-side build.', next: 'Share shortlist', tone: 'good' },
  { id: 'o3', club: 'Racing Genk', role: 'Box-to-box midfielder', constraint: 'High engine · €4m ceiling', players: ['Rayan Belkacem', 'Elias Adebayo'], score: 86, explanation: 'Rayan’s progressive carries and recovery volume are a close fit for the club’s transition model.', next: 'Request scouting brief', tone: 'good' },
  { id: 'o4', club: 'Hansa Rostock', role: 'Mobile No. 9', constraint: 'German or EU passport · immediate', players: ['Milan Krstić'], score: 82, explanation: 'Milan offers a reliable pressing output and a clean availability window for a summer move.', next: 'Prepare introduction', tone: 'warn' },
  { id: 'o5', club: 'Pisa Sporting Club', role: 'Goalkeeper', constraint: 'Experienced · €1.4m ceiling', players: ['Marek Šimek'], score: 78, explanation: 'Marek’s distribution and penalty record fit the role, pending a current medical pack.', next: 'Upload medical pack', tone: 'warn' },
  { id: 'o6', club: 'Heart of Midlothian', role: 'Attacking midfielder', constraint: 'Scotland work permit ready', players: ['Elias Adebayo'], score: 73, explanation: 'Strong technical match, but work permit points need checking before a formal approach.', next: 'Check work permit', tone: 'warn' },
];

const deals: Deal[] = [
  { id: 'd1', player: 'Noah Williams', club: 'Real Zaragoza', stage: 'Introduction', fee: '€2.6m', salary: '€9,200 / wk', next: 'Send video pack', deadline: '18 Jun', status: 'Club reviewing', tone: 'hot' },
  { id: 'd2', player: 'Elias Adebayo', club: 'FC Utrecht', stage: 'Negotiation', fee: '€4.1m', salary: '€12,500 / wk', next: 'Counter on bonus structure', deadline: '20 Jun', status: 'Player aligned', tone: 'good' },
  { id: 'd3', player: 'Rayan Belkacem', club: 'Racing Genk', stage: 'Terms agreed', fee: '€3.2m', salary: '€10,800 / wk', next: 'Chase signed mandate', deadline: '14 Jun', status: 'Paperwork pending', tone: 'warn' },
  { id: 'd4', player: 'Milan Krstić', club: 'Hansa Rostock', stage: 'Mandate signed', fee: '€1.9m', salary: '€7,400 / wk', next: 'Book club call', deadline: '21 Jun', status: 'Ready to present', tone: 'good' },
  { id: 'd5', player: 'Tiago Pereira', club: 'FC Utrecht', stage: 'Due diligence', fee: '€3.8m', salary: '€10,200 / wk', next: 'Request tax clearance', deadline: '17 Jun', status: 'Document chase', tone: 'warn' },
  { id: 'd6', player: 'Marek Šimek', club: 'Pisa Sporting Club', stage: 'Closed won', fee: '€1.1m', salary: '€6,600 / wk', next: 'Archive deal room', deadline: 'Complete', status: 'Contract signed', tone: 'good' },
];

const contracts: ContractRecord[] = [
  { id: 'ct1', player: 'Noah Williams', club: 'Real Zaragoza', kind: 'Representation mandate', expiry: '30 Jun 2025', status: 'Renewal due', next: 'Confirm renewal position', documents: ['Player agreement', 'Passport copy'], tone: 'warn' },
  { id: 'ct2', player: 'Rayan Belkacem', club: 'Racing Genk', kind: 'Transfer agreement', expiry: 'Signature pending', status: 'New contract sent', next: 'Chase signed copy', documents: ['Club terms', 'Player approval'], tone: 'hot' },
  { id: 'ct3', player: 'Tiago Pereira', club: 'FC Utrecht', kind: 'Transfer paperwork', expiry: '17 Jun 2025', status: 'Document chase', next: 'Request tax clearance', documents: ['Passport copy', 'Visa clearance'], tone: 'warn' },
  { id: 'ct4', player: 'Milan Krstić', club: 'Hansa Rostock', kind: 'Representation mandate', expiry: '31 May 2026', status: 'Active', next: 'Book club call', documents: ['Player agreement', 'Club brief'], tone: 'good' },
  { id: 'ct5', player: 'Marek Šimek', club: 'Pisa Sporting Club', kind: 'Medical documentation', expiry: 'Required before offer', status: 'Missing medicals', next: 'Upload medical pack', documents: ['Medical assessment'], tone: 'warn' },
  { id: 'ct6', player: 'Elias Adebayo', club: 'FC Utrecht', kind: 'Player contract', expiry: '30 Jun 2026', status: 'Active', next: 'Review bonus structure', documents: ['Player agreement', 'Club terms', 'Passport copy'], tone: 'good' },
];

const initialActivities: ActivityItem[] = [
  { id: 'a1', type: 'club message', title: 'Real Zaragoza sent a new brief', description: 'Starting centre back · summer window', time: '12 min ago', urgency: 'high' },
  { id: 'a2', type: 'contract', title: 'New contract sent to Rayan Belkacem', description: 'Racing Genk · terms agreed', time: '48 min ago', urgency: 'high' },
  { id: 'a3', type: 'visa', title: 'Visa status confirmed for Tiago Pereira', description: 'Netherlands · documents complete', time: '2 hrs ago', urgency: 'normal' },
  { id: 'a4', type: 'profile update', title: 'Elias Adebayo refreshed his profile', description: 'New clips and season stats are ready', time: 'Yesterday', urgency: 'normal' },
  { id: 'a5', type: 'opportunity', title: 'New club possibility for Noah Williams', description: 'AI match · 94% · Real Zaragoza', time: 'Yesterday', urgency: 'high' },
];

type DrawerState = { eyebrow: string; title: string; content: ReactNode } | null;
type WorkspaceContextValue = {
  openDrawer: (drawer: Exclude<DrawerState, null>) => void;
  closeDrawer: () => void;
  notify: (message: string) => void;
  prepared: string[];
  prepare: (id: string, club: string) => void;
  completed: string[];
  complete: (id: string) => void;
};
const WorkspaceContext = createContext<WorkspaceContextValue | null>(null);
function useWorkspace() {
  const value = useContext(WorkspaceContext);
  if (!value) throw new Error('Workspace context is missing');
  return value;
}

function StatusPill({ children, tone = 'good' }: { children: ReactNode; tone?: 'good' | 'warn' | 'hot' }) {
  return <span className={`status-pill status-${tone}`} data-testid={`status-${String(children).toLowerCase().replace(/\s/g, '-')}`}>{children}</span>;
}

function Drawer({ drawer, close }: { drawer: DrawerState; close: () => void }) {
  if (!drawer) return null;
  return (
    <div className="detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }} data-testid="drawer-overlay">
      <aside className="detail-drawer" aria-label="Detail view">
        <div className="drawer-head">
          <div><div className="eyebrow">{drawer.eyebrow}</div><h2 className="drawer-title">{drawer.title}</h2></div>
          <button className="icon-btn" onClick={close} aria-label="Close details" data-testid="button-close-details"><X size={16} /></button>
        </div>
        {drawer.content}
      </aside>
    </div>
  );
}

function Shell({ children }: { children: ReactNode }) {
  const { notify } = useWorkspace();
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/players', label: 'Players', icon: Users },
    { href: '/clubs', label: 'Clubs', icon: Building2 },
    { href: '/opportunities', label: 'Opportunities', icon: Target },
    { href: '/deals', label: 'Deals', icon: BriefcaseBusiness },
  ];
  const pageName = navItems.find((item) => item.href === location)?.label ?? (location === '/assistant' ? 'AI Assistant' : 'Workspace');
  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? 'mobile-open' : ''}`}>
        <Link href="/" className="flex items-center gap-3 no-underline" onClick={() => setMobileOpen(false)} data-testid="link-logo">
          <div className="brand-mark">P</div>
          <div><div className="display-font font-semibold text-[16px] tracking-[-.04em]">Pitchside</div><div className="mono text-[9px] text-slate-400 mt-0.5">AGENT WORKSPACE</div></div>
        </Link>
        <div className="nav-label">Workspace</div>
        <nav className="grid gap-1">
          {navItems.map(({ href, label, icon: Icon }) => <Link key={href} href={href} className={`nav-link ${location === href ? 'active' : ''}`} onClick={() => setMobileOpen(false)} data-testid={`link-nav-${label.toLowerCase()}`}><Icon /><span>{label}</span>{label === 'Opportunities' && <span className="ml-auto mono text-[10px]">06</span>}</Link>)}
        </nav>
        <div className="nav-label">Focus</div>
        <Link href="/assistant" className={`nav-link ${location === '/assistant' ? 'active' : ''}`} onClick={() => setMobileOpen(false)} data-testid="link-nav-assistant"><Sparkles /><span>AI Assistant</span><span className="ml-auto w-1.5 h-1.5 rounded-full bg-[#c8e94a]" /></Link>
        <div className="sidebar-bottom">
          <div className="nav-label !m-0 !px-2 mb-2">Today</div>
          <div className="px-2 text-[11px] leading-5 text-slate-400">Tuesday, 17 June<br /><span className="text-[#c8e94a]">7 actions waiting</span></div>
          <div className="profile-chip mt-4"><div className="avatar">AM</div><div><div className="text-[12px] font-semibold">Alex Morgan</div><div className="mono text-[9px] text-slate-400">FOUNDER · NORTHLINE</div></div><MoreHorizontal size={16} className="ml-auto text-slate-500" /></div>
        </div>
      </aside>
      <div className="main-wrap">
        <header className="topbar">
          <div className="flex items-center gap-3"><button className="icon-btn mobile-menu" onClick={() => setMobileOpen(!mobileOpen)} aria-label="Open navigation" data-testid="button-mobile-menu"><Menu size={17} /></button><span className="crumb">{pageName} <span className="text-[#b2b09f]">/</span> Northline Sports</span></div>
          <div className="top-actions"><button className="icon-btn" onClick={() => notify('Workspace search is ready — try the AI Assistant for a natural-language search')} aria-label="Search workspace" data-testid="button-global-search"><Search size={16} /></button><button className="icon-btn relative" onClick={() => notify('You have 3 unread club messages')} aria-label="Notifications" data-testid="button-notifications"><Bell size={16} /><span className="absolute right-1.5 top-1.5 w-1.5 h-1.5 bg-[#ec765e] rounded-full" /></button><Link href="/assistant" className="btn btn-lime !min-h-[35px] !px-3" data-testid="link-top-assistant"><Sparkles size={14} /> Ask AI</Link></div>
        </header>
        <main>{children}</main>
      </div>
    </div>
  );
}

function Dashboard() {
  const { completed, complete, openDrawer, notify } = useWorkspace();
  const todays = [
    { icon: UserRound, title: 'Profile updates', text: 'Elias Adebayo refreshed his profile', time: '48m', id: 'a4' },
    { icon: Target, title: 'New club possibilities', text: 'Noah Williams · 94% AI match', time: '1h', id: 'a5' },
    { icon: ShieldCheck, title: 'Visa status', text: 'Tiago Pereira is cleared for Netherlands', time: '2h', id: 'a3' },
    { icon: FileText, title: 'Contract update', text: 'Rayan Belkacem · new contract sent', time: '48m', id: 'a2' },
    { icon: MessageSquareText, title: 'Club messages', text: 'Real Zaragoza sent a new brief', time: '12m', id: 'a1' },
  ];
  const priority = [
    { title: 'Send Noah Williams profile to Real Zaragoza', meta: 'AI match 94% · requested 12 min ago', id: 'p-noah' },
    { title: 'Chase signed mandate from Rayan Belkacem', meta: 'Racing Genk · due today', id: 'p-rayan' },
    { title: 'Book the Hansa Rostock sporting call', meta: 'Milan Krstić · before Friday', id: 'p-milan' },
  ];
  return <div className="page">
    <div className="flex flex-wrap justify-between items-end gap-5"><div><div className="eyebrow">Tuesday · 17 June 2025</div><h1 className="page-title">Good morning, Alex<span className="text-[#b5d73e]">.</span></h1><p className="page-subtitle">The window is moving. Here’s what needs your attention before lunch.</p></div><button className="btn btn-primary" onClick={() => notify('Briefing shared with the Northline team')} data-testid="button-share-briefing"><Send size={14} /> Share daily briefing</button></div>
    <div className="metric-grid">
      {[['Active players', '24', '+3 this month', Users], ['Open opportunities', '18', '6 high confidence', Target], ['Deals in motion', '07', '€18.4m pipeline', BriefcaseBusiness], ['Actions due today', '11', '3 are urgent', CalendarClock]].map(([label, value, note, Icon]) => <div className="card metric" key={label as string} data-testid={`metric-${String(label).toLowerCase().replace(/\s/g, '-')}`}><div className="flex justify-between items-center"><span className="eyebrow">{label as string}</span><Icon size={17} className="text-[#7a8a4b]" /></div><strong className="metric-value">{value as string}</strong><span className="metric-note">{note as string}</span></div>)}
    </div>
    <section><div className="section-head"><div><p className="section-kicker">Your operating pulse</p><h2 className="section-title">Today’s</h2></div><span className="mono text-[10px] text-muted-foreground">LAST UPDATED 09:42</span></div>
      <div className="todays-grid"><div className="today-list">{todays.map(({ icon: Icon, title, text, time, id }) => <button className="today-item text-left" key={id} onClick={() => openDrawer({ eyebrow: title, title: text, content: <DetailActivity id={id} /> })} data-testid={`button-today-${id}`}><span className="today-icon"><Icon size={16} /></span><span><span className="item-title block">{title}</span><span className="item-meta block">{text}</span></span><span className="item-time">{time}</span><ChevronRight size={14} className="text-[#a1a194] ml-1" /></button>)}</div>
        <div className="lime-panel"><div className="eyebrow !text-[#536523]">Window intelligence</div><h3 className="display-font text-[27px] leading-[1.05] tracking-[-.06em] mt-3 max-w-[250px]">Three profiles are ready to move today.</h3><p className="text-[12px] leading-5 mt-3 max-w-[250px]">Noah, Tiago and Milan all have a clean introduction path with clubs already asking.</p><Link href="/opportunities" className="btn btn-primary mt-5" data-testid="link-view-opportunities">View opportunities <ArrowUpRight size={14} /></Link></div>
      </div>
    </section>
    <div className="activity-layout"><section><div className="section-head"><div><p className="section-kicker">Live from your desk</p><h2 className="section-title">Recent activity</h2></div><button className="btn btn-quiet !min-h-[32px]" onClick={() => notify('Activity view is up to date')} data-testid="button-refresh-activity"><Activity size={13} /> Refresh</button></div><div className="card activity-card">{initialActivities.map((item) => <div className="activity-row" key={item.id} data-testid={`activity-${item.id}`}><div className="activity-line" /><div className="activity-content"><div className="activity-type">{item.type}</div><div className="item-title mt-1">{item.title}</div><div className="item-meta">{item.description}</div></div><div className="item-time">{item.time}</div></div>)}</div></section>
      <section><div className="section-head"><div><p className="section-kicker">Keep the window moving</p><h2 className="section-title">Priority actions</h2></div></div><div className="card priority-card">{priority.map((item) => <div className="priority-row" key={item.id}><span className={`priority-dot ${item.id === 'p-milan' ? 'lime' : ''}`} /><div className="flex-1"><div className={`item-title ${completed.includes(item.id) ? 'line-through text-muted-foreground' : ''}`}>{item.title}</div><div className="item-meta">{item.meta}</div></div><button className={`icon-btn !w-[29px] !h-[29px] ${completed.includes(item.id) ? 'bg-[#c8e94a]' : ''}`} onClick={() => { complete(item.id); notify('Action marked complete'); }} aria-label="Mark action complete" data-testid={`button-complete-${item.id}`}><Check size={14} /></button></div>)}</div></section>
    </div>
  </div>;
}

function DetailActivity({ id }: { id: string }) {
  const { notify } = useWorkspace();
  const activity = initialActivities.find((item) => item.id === id) ?? initialActivities[0];
  return <><div className="detail-block"><div className="detail-label">Activity context</div><p className="text-[13px] leading-6 text-muted-foreground">{activity.description}. This item has been added to today’s operating pulse and is ready for your review.</p></div><div className="detail-grid detail-block"><div className="detail-value"><div className="detail-label">Received</div>{activity.time}</div><div className="detail-value"><div className="detail-label">Priority</div>{activity.urgency === 'high' ? 'High' : 'Standard'}</div></div><button className="btn btn-primary mt-6" onClick={() => notify('Activity marked as reviewed')} data-testid="button-open-activity"><Check size={14} /> Mark as reviewed</button></>;
}

function getPlayerUpdates(player: Player) {
  const profileNeedsUpdate = player.readiness === 'Profile update due';
  const contractNeedsUpdate = player.contract.includes('2025') || player.readiness === 'Contract review';
  const needsMedicalPack = player.readiness === 'Need medicals';
  const passportNeedsUpdate = player.id === 'p2' || player.id === 'p6';
  return [
    {
      label: 'Profile information',
      status: profileNeedsUpdate ? 'Needs update' : 'Current',
      detail: profileNeedsUpdate ? 'Refresh availability and latest season stats' : 'Position, age and club details are current',
      icon: UserRound,
    },
    {
      label: needsMedicalPack ? 'Medical pack' : 'Video & stats',
      status: needsMedicalPack || player.id === 'p7' ? 'Needs update' : 'Current',
      detail: needsMedicalPack ? 'Upload current medical assessment before sharing' : player.id === 'p7' ? 'New clips and season stats are due' : 'Latest clips and performance data are on file',
      icon: FileText,
    },
    {
      label: 'Contract documents',
      status: contractNeedsUpdate ? 'Needs update' : 'Current',
      detail: contractNeedsUpdate ? 'Confirm the renewal position before the summer window' : `${player.contract} · compensation details are on file`,
      icon: BriefcaseBusiness,
    },
    {
      label: 'Passport & visa',
      status: passportNeedsUpdate ? 'Needs update' : 'Current',
      detail: passportNeedsUpdate ? 'Confirm work permit route for the next target markets' : `${player.passport} passport details are on file`,
      icon: ShieldCheck,
    },
  ] as const;
}

function PlayerDetail({ player }: { player: Player }) {
  const { notify } = useWorkspace();
  const [tab, setTab] = useState<'overview' | 'updates'>('overview');
  const updates = getPlayerUpdates(player);
  const outstanding = updates.filter((item) => item.status === 'Needs update').length;
  return <><div className="flex items-center gap-3"><div className="player-avatar !w-[48px] !h-[48px]">{player.initials}</div><div><StatusPill tone={player.tone}>{player.readiness}</StatusPill><p className="text-[12px] text-muted-foreground mt-2">{player.position} · {player.age} · {player.nationality}</p></div></div><div className="detail-tabs" role="tablist" aria-label="Player information tabs"><button className={`detail-tab ${tab === 'overview' ? 'active' : ''}`} onClick={() => setTab('overview')} role="tab" aria-selected={tab === 'overview'}>Information</button><button className={`detail-tab ${tab === 'updates' ? 'active' : ''}`} onClick={() => setTab('updates')} role="tab" aria-selected={tab === 'updates'}>Updates {outstanding > 0 && <span className="detail-tab-count">{outstanding}</span>}</button></div>{tab === 'overview' ? <><div className="detail-block"><div className="detail-label">Representation snapshot</div><div className="detail-grid"><div className="detail-value"><div className="detail-label">Current club</div>{player.club}</div><div className="detail-value"><div className="detail-label">Passport</div>{player.passport}</div><div className="detail-value"><div className="detail-label">Market value</div>{player.value}</div><div className="detail-value"><div className="detail-label">Availability</div>{player.availability}</div></div></div><div className="detail-block"><div className="detail-label">Contract & compensation</div><div className="detail-value">{player.contract}<span className="text-muted-foreground ml-2">· {player.salary}</span></div></div><div className="detail-block"><div className="detail-label">Recommended next move</div><p className="text-[13px] leading-6 text-muted-foreground">Profile is {player.readiness.toLowerCase()}. Review the latest information before sharing with a club contact.</p></div><button className="btn btn-lime mt-5" onClick={() => notify(`${player.name} added to today's follow-ups`)} data-testid="button-add-followup"><Clock3 size={14} /> Add follow-up</button></> : <div className="detail-block"><div className="update-summary"><div><div className="detail-label">Profile readiness</div><strong>{outstanding === 0 ? 'Ready to share' : `${outstanding} update${outstanding === 1 ? '' : 's'} needed`}</strong></div><StatusPill tone={outstanding === 0 ? 'good' : 'warn'}>{outstanding === 0 ? 'Up to date' : 'Review items'}</StatusPill></div><div className="update-list">{updates.map(({ label, status, detail, icon: Icon }) => <div className="update-row" key={label}><span className={`update-icon ${status === 'Needs update' ? 'needs-update' : ''}`}><Icon size={15} /></span><div className="flex-1"><div className="flex items-center justify-between gap-3"><strong className="text-[12px]">{label}</strong><span className={`update-status ${status === 'Needs update' ? 'needs-update' : ''}`}>{status}</span></div><p className="item-meta mt-1">{detail}</p></div></div>)}</div>{outstanding > 0 && <button className="btn btn-primary mt-5" onClick={() => notify(`Update checklist opened for ${player.name}`)} data-testid="button-update-player-info"><FileText size={14} /> Review update checklist</button>}</div>}</>;
}

function Players() {
  const { openDrawer } = useWorkspace();
  const [query, setQuery] = useState('');
  const [position, setPosition] = useState('All positions');
  const filtered = useMemo(() => players.filter((player) => (position === 'All positions' || player.position === position) && `${player.name} ${player.club} ${player.nationality}`.toLowerCase().includes(query.toLowerCase())), [query, position]);
  return <div className="page"><div><div className="eyebrow">Roster intelligence · 24 represented</div><h1 className="page-title">Players</h1><p className="page-subtitle">Every profile, contract window and introduction signal in one view.</p></div><div className="toolbar"><label className="search-box"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search name, club or nationality" data-testid="input-player-search" /></label><select className="filter-select" value={position} onChange={(event) => setPosition(event.target.value)} aria-label="Filter by position" data-testid="select-player-position"><option>All positions</option>{Array.from(new Set(players.map((player) => player.position))).map((item) => <option key={item}>{item}</option>)}</select><button className="btn btn-outline" onClick={() => { setQuery(''); setPosition('All positions'); }} data-testid="button-clear-player-filters"><Filter size={14} /> Clear filters</button></div><div className="card table-wrap"><table className="data-table"><thead><tr><th>Player</th><th>Position</th><th>Age / passport</th><th>Current club</th><th>Contract</th><th>Readiness</th><th /></tr></thead><tbody>{filtered.map((player) => <tr key={player.id} onClick={() => openDrawer({ eyebrow: `Player profile · ${player.passport}`, title: player.name, content: <PlayerDetail player={player} /> })} data-testid={`row-player-${player.id}`}><td><div className="player-cell"><div className="player-avatar">{player.initials}</div><div><div className="font-semibold text-[13px]">{player.name}</div><div className="item-meta">{player.nationality}</div></div></div></td><td>{player.position}</td><td><span className="mono text-[11px]">{player.age}</span><span className="text-muted-foreground mx-1">·</span><span className="mono text-[11px]">{player.passport}</span></td><td>{player.club}</td><td><div>{player.contract}</div><div className="item-meta">{player.value}</div></td><td><StatusPill tone={player.tone}>{player.readiness}</StatusPill></td><td><ChevronRight size={14} className="text-muted-foreground" /></td></tr>)}</tbody></table>{filtered.length === 0 && <div className="p-12 text-center"><Users className="mx-auto text-muted-foreground" /><h3 className="font-semibold mt-3">No profiles found</h3><p className="item-meta">Try a different name, club or position.</p></div>}</div></div>;
}

function ClubDetail({ club }: { club: Club }) {
  const { openDrawer } = useWorkspace();
  return <><div className="flex items-center gap-3"><div className="club-badge !w-[48px] !h-[48px]">{club.short}</div><div><StatusPill tone={club.tone}>{club.activity}</StatusPill><p className="text-[12px] text-muted-foreground mt-2">{club.league} · {club.country}</p></div></div><div className="detail-block"><div className="detail-label">Recruitment brief</div><div className="detail-value"><div className="font-semibold">{club.need}</div><div className="item-meta mt-2">Budget range: {club.budget}</div></div></div><div className="detail-grid detail-block"><div className="detail-value"><div className="detail-label">Primary contact</div>{club.contact}</div><div className="detail-value"><div className="detail-label">Last activity</div>{club.activity}</div></div><button className="btn btn-lime mt-6" onClick={() => openDrawer({ eyebrow: `Outreach · ${club.country}`, title: club.name, content: <ClubOutreach club={club} /> })} data-testid="button-draft-club-message"><MessageSquareText size={14} /> Open chat & present</button></>;
}

function ClubOutreach({ club }: { club: Club }) {
  const { notify } = useWorkspace();
  const [connected, setConnected] = useState(false);
  const [sent, setSent] = useState(false);
  const [playerName, setPlayerName] = useState(players[0].name);
  const [attachments, setAttachments] = useState({ profile: true, video: true, passport: false });
  const selectedPlayer = players.find((player) => player.name === playerName) ?? players[0];
  const attachmentOptions = [
    { key: 'profile' as const, label: 'Player profile', detail: `${selectedPlayer.position} · ${selectedPlayer.age} · ${selectedPlayer.value}`, icon: UserRound },
    { key: 'video' as const, label: 'Video & stats', detail: 'Latest clips and performance snapshot', icon: FileText },
    { key: 'passport' as const, label: 'Passport & visa', detail: `${selectedPlayer.passport} registration details`, icon: ShieldCheck },
  ];
  return <><div className="flex items-center gap-3"><div className="club-badge !w-[48px] !h-[48px]">{club.short}</div><div><StatusPill tone={connected ? 'good' : 'warn'}>{connected ? 'Chat connected' : 'Ready to connect'}</StatusPill><p className="text-[12px] text-muted-foreground mt-2">{club.contact} · {club.need}</p></div></div><div className="chat-preview detail-block"><div className="flex items-center gap-3"><span className="chat-preview-icon"><MessageSquareText size={16} /></span><div><div className="detail-label">Club chat</div><strong>{connected ? `Connected with ${club.contact}` : 'Secure chat link ready'}</strong></div></div><p className="item-meta mt-3">Introduce yourself, share a shortlist and keep the conversation attached to this recruitment brief.</p><button className={`btn ${connected ? 'btn-quiet' : 'btn-primary'} mt-4`} onClick={() => { setConnected(true); notify(`Chat connected with ${club.contact}`); }} data-testid="button-connect-club-chat">{connected ? <Check size={14} /> : <MessageSquareText size={14} />}{connected ? 'Chat connected' : 'Connect club chat'}</button></div><div className="detail-block"><div className="detail-label">Present a player</div><select className="filter-select w-full" value={playerName} onChange={(event) => { setPlayerName(event.target.value); setSent(false); }} aria-label="Select player to present" data-testid="select-presentation-player">{players.map((player) => <option key={player.id}>{player.name}</option>)}</select></div><div className="detail-block"><div className="detail-label">Include in presentation</div><div className="attachment-list">{attachmentOptions.map(({ key, label, detail, icon: Icon }) => <button className={`attachment-row ${attachments[key] ? 'selected' : ''}`} key={key} onClick={() => setAttachments((current) => ({ ...current, [key]: !current[key] }))} aria-pressed={attachments[key]} data-testid={`button-attachment-${key}`}><span className="attachment-icon"><Icon size={15} /></span><span className="flex-1 text-left"><strong className="block text-[12px]">{label}</strong><span className="item-meta">{detail}</span></span><span className={`attachment-check ${attachments[key] ? 'selected' : ''}`}>{attachments[key] && <Check size={11} />}</span></button>)}</div></div><button className="btn btn-lime w-full mt-5" onClick={() => { if (!connected) { notify('Connect the club chat before sending a presentation'); return; } setSent(true); notify(`${selectedPlayer.name} presentation sent to ${club.contact}`); }} data-testid="button-send-presentation">{sent ? <Check size={14} /> : <Send size={14} />}{sent ? 'Presentation sent' : `Present ${selectedPlayer.name}`}</button></>;
}

function Clubs() {
  const { openDrawer } = useWorkspace();
  const [query, setQuery] = useState('');
  const [tab, setTab] = useState<'needs' | 'outreach'>('needs');
  const filtered = clubs.filter((club) => `${club.name} ${club.country} ${club.need} ${club.contact}`.toLowerCase().includes(query.toLowerCase()));
  return <div className="page"><div><div className="eyebrow">Club network · 42 active relationships</div><h1 className="page-title">Clubs</h1><p className="page-subtitle">Know the brief, the person and the moment before you make the approach.</p></div><div className="page-tabs" role="tablist" aria-label="Club workflow tabs"><button className={`page-tab ${tab === 'needs' ? 'active' : ''}`} onClick={() => setTab('needs')} role="tab" aria-selected={tab === 'needs'}><Target size={14} /> Recruitment needs <span>06</span></button><button className={`page-tab ${tab === 'outreach' ? 'active' : ''}`} onClick={() => setTab('outreach')} role="tab" aria-selected={tab === 'outreach'}><MessageSquareText size={14} /> Chat & presentations <span>06</span></button></div><div className="toolbar"><label className="search-box"><Search size={15} className="text-muted-foreground" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search clubs, leagues or contacts" data-testid="input-club-search" /></label><button className="btn btn-outline" onClick={() => setQuery('')} data-testid="button-clear-club-search"><Filter size={14} /> Clear search</button></div>{tab === 'needs' ? <div className="club-grid">{filtered.map((club) => <button className="card club-card hover-card text-left" key={club.id} onClick={() => openDrawer({ eyebrow: `Club profile · ${club.country}`, title: club.name, content: <ClubDetail club={club} /> })} data-testid={`card-club-${club.id}`}><div className="club-head"><div className="club-badge">{club.short}</div><div><h2 className="display-font font-semibold text-[16px] tracking-[-.035em]">{club.name}</h2><p className="item-meta">{club.league} · {club.country}</p></div></div><div className="mt-6"><div className="eyebrow">Current recruitment need</div><div className="font-semibold text-[13px] mt-1">{club.need}</div><div className="item-meta mt-1">Budget {club.budget}</div></div><div className="mt-5 pt-3 border-t border-border flex justify-between items-center"><span className="item-meta">{club.contact}</span><StatusPill tone={club.tone}>{club.activity.split(' ').slice(0, 2).join(' ')}</StatusPill></div></button>)}</div> : <div className="outreach-grid">{filtered.map((club) => <article className="card outreach-card hover-card" key={club.id} data-testid={`card-outreach-${club.id}`}><div className="club-head"><div className="club-badge">{club.short}</div><div><h2 className="display-font font-semibold text-[16px] tracking-[-.035em]">{club.name}</h2><p className="item-meta">{club.league} · {club.country}</p></div><StatusPill tone={club.tone}>{club.activity.split(' ').slice(0, 2).join(' ')}</StatusPill></div><div className="mt-6"><div className="eyebrow">Looking for</div><div className="font-semibold text-[13px] mt-1">{club.need}</div><div className="item-meta mt-1">Budget {club.budget} · {club.contact}</div></div><div className="chat-preview compact mt-5"><span className="chat-preview-icon"><MessageSquareText size={15} /></span><span><span className="detail-label block !mb-1">Club chat</span><strong>Ready to connect</strong></span><ChevronRight size={14} className="ml-auto text-muted-foreground" /></div><button className="btn btn-lime w-full mt-4" onClick={() => openDrawer({ eyebrow: `Outreach · ${club.country}`, title: club.name, content: <ClubOutreach club={club} /> })} data-testid={`button-open-outreach-${club.id}`}><MessageSquareText size={14} /> Open chat & present</button></article>)}</div>}</div>;
}

function OpportunityDetail({ opportunity }: { opportunity: Opportunity }) {
  const { prepare, prepared, notify } = useWorkspace();
  const isPrepared = prepared.includes(opportunity.id);
  return <><div className="flex items-center gap-3"><div className="score-ring !w-[64px] !h-[64px]" style={{ '--score': `${opportunity.score}%` } as React.CSSProperties}><span>{opportunity.score}%</span></div><div><StatusPill tone={opportunity.tone}>{opportunity.role}</StatusPill><p className="text-[12px] text-muted-foreground mt-2">{opportunity.club} · {opportunity.constraint}</p></div></div><div className="detail-block"><div className="detail-label">Why this match</div><p className="text-[13px] leading-6 text-muted-foreground">{opportunity.explanation}</p></div><div className="detail-block"><div className="detail-label">Matched players</div><div className="flex flex-wrap gap-2">{opportunity.players.map((player) => <span className="detail-value !py-2" key={player}>{player}</span>)}</div></div><button className={`btn ${isPrepared ? 'btn-quiet' : 'btn-lime'} mt-6`} onClick={() => { if (!isPrepared) prepare(opportunity.id, opportunity.club); else notify('Introduction already prepared'); }} data-testid={`button-drawer-prepare-${opportunity.id}`}>{isPrepared ? <Check size={14} /> : <Send size={14} />}{isPrepared ? 'Introduction prepared' : 'Prepare introduction'}</button></>;
}

function Opportunities() {
  const { openDrawer, prepare, prepared, notify } = useWorkspace();
  const [minScore, setMinScore] = useState('All match scores');
  const filtered = opportunities.filter((opportunity) => minScore === 'All match scores' || opportunity.score >= Number(minScore));
  return <div className="page"><div><div className="eyebrow">AI-assisted discovery · refreshed 8 min ago</div><h1 className="page-title">Opportunities</h1><p className="page-subtitle">Turn a club brief into a credible next conversation, not another spreadsheet row.</p></div><div className="toolbar"><select className="filter-select" value={minScore} onChange={(event) => setMinScore(event.target.value)} aria-label="Filter opportunities by score" data-testid="select-opportunity-score"><option>All match scores</option><option value="90">90% and above</option><option value="80">80% and above</option></select><button className="btn btn-outline" onClick={() => setMinScore('All match scores')} data-testid="button-reset-opportunity-filter"><Zap size={14} /> Reset scoring view</button><span className="ml-auto self-center mono text-[10px] text-muted-foreground">{filtered.length} MATCHES IN VIEW</span></div><div className="opps-grid">{filtered.map((opportunity) => { const isPrepared = prepared.includes(opportunity.id); return <article className="card opp-card hover-card" key={opportunity.id} data-testid={`card-opportunity-${opportunity.id}`}><div className="opp-top"><div><div className="opp-role">{opportunity.role}</div><h2 className="display-font font-semibold text-[19px] tracking-[-.045em] mt-2">{opportunity.club}</h2><p className="item-meta mt-1">{opportunity.constraint}</p></div><div className="score-ring" style={{ '--score': `${opportunity.score}%` } as React.CSSProperties}><span>{opportunity.score}</span></div></div><div className="opp-explanation">{opportunity.explanation}</div><div className="flex flex-wrap gap-1.5 mb-3">{opportunity.players.map((player) => <span key={player} className="mono text-[9px] bg-muted px-2 py-1 rounded">{player}</span>)}</div><div className="opp-foot"><button className="item-meta text-left hover:text-foreground transition-colors" onClick={() => openDrawer({ eyebrow: `AI match · ${opportunity.score}%`, title: opportunity.club, content: <OpportunityDetail opportunity={opportunity} /> })} data-testid={`button-view-opportunity-${opportunity.id}`}>View match context <ChevronRight size={12} className="inline" /></button><button className={`btn ${isPrepared ? 'btn-quiet' : 'btn-primary'} !min-h-[31px] !text-[10px] !px-2.5`} onClick={() => { if (!isPrepared) prepare(opportunity.id, opportunity.club); else notify('Introduction is already ready'); }} data-testid={`button-prepare-${opportunity.id}`}>{isPrepared ? <Check size={12} /> : <Send size={12} />}{isPrepared ? 'Prepared' : 'Prepare'}</button></div></article>; })}</div><div className="mt-5 text-center"><span className="item-meta">Your scores combine role fit, constraints and relationship timing.</span></div></div>;
}

function DealDetail({ deal }: { deal: Deal }) {
  const { notify } = useWorkspace();
  return <><div className="flex items-center gap-3"><div className="avatar !rounded-[9px] !bg-[#192238] !text-[#c8e94a]">{deal.player.split(' ').map((item) => item[0]).join('')}</div><div><StatusPill tone={deal.tone}>{deal.stage}</StatusPill><p className="text-[12px] text-muted-foreground mt-2">{deal.club}</p></div></div><div className="detail-grid detail-block"><div className="detail-value"><div className="detail-label">Transfer fee</div>{deal.fee}</div><div className="detail-value"><div className="detail-label">Proposed salary</div>{deal.salary}</div><div className="detail-value"><div className="detail-label">Deadline</div>{deal.deadline}</div><div className="detail-value"><div className="detail-label">Status</div>{deal.status}</div></div><div className="detail-block"><div className="detail-label">Next action</div><div className="detail-value">{deal.next}</div></div><button className="btn btn-primary mt-6" onClick={() => notify(`Follow-up added for ${deal.player}`)} data-testid="button-deal-followup"><CalendarClock size={14} /> Add deadline reminder</button></>;
}

function ContractDetail({ contract }: { contract: ContractRecord }) {
  const { notify } = useWorkspace();
  return <><div className="flex items-center gap-3"><div className="avatar !rounded-[9px] !bg-[#192238] !text-[#c8e94a]">{contract.player.split(' ').map((item) => item[0]).join('')}</div><div><StatusPill tone={contract.tone}>{contract.status}</StatusPill><p className="text-[12px] text-muted-foreground mt-2">{contract.club} · {contract.kind}</p></div></div><div className="detail-grid detail-block"><div className="detail-value"><div className="detail-label">Contract type</div>{contract.kind}</div><div className="detail-value"><div className="detail-label">Expiry / deadline</div>{contract.expiry}</div></div><div className="detail-block"><div className="detail-label">Document checklist</div><div className="document-list">{contract.documents.map((document) => <div className="document-row" key={document}><span className="document-check"><Check size={12} /></span><span>{document}</span></div>)}</div></div><div className="detail-block"><div className="detail-label">Next action</div><div className="detail-value">{contract.next}</div></div><button className="btn btn-primary mt-6" onClick={() => notify(`Reminder added for ${contract.player}`)} data-testid="button-contract-reminder"><CalendarClock size={14} /> Add contract reminder</button></>;
}

function Deals() {
  const { openDrawer, notify } = useWorkspace();
  const columns = ['Introduction', 'Negotiation', 'Terms agreed', 'Closed won'];
  const [tab, setTab] = useState<'pipeline' | 'contracts'>('pipeline');
  return <div className="page"><div className="flex flex-wrap justify-between items-end gap-4"><div><div className="eyebrow">Commercial pipeline · 7 active deals</div><h1 className="page-title">Deals</h1><p className="page-subtitle">Keep every conversation, clause and chase moving toward a signature.</p></div><button className="btn btn-lime" onClick={() => notify('Deal room creation is ready for your next mandate')} data-testid="button-new-deal"><BriefcaseBusiness size={14} /> New deal room</button></div><div className="page-tabs" role="tablist" aria-label="Deal workflow tabs"><button className={`page-tab ${tab === 'pipeline' ? 'active' : ''}`} onClick={() => setTab('pipeline')} role="tab" aria-selected={tab === 'pipeline'}><BriefcaseBusiness size={14} /> Deal pipeline <span>06</span></button><button className={`page-tab ${tab === 'contracts' ? 'active' : ''}`} onClick={() => setTab('contracts')} role="tab" aria-selected={tab === 'contracts'}><FileText size={14} /> Contracts & paperwork <span>06</span></button></div>{tab === 'pipeline' ? <><div className="toolbar"><span className="mono text-[10px] text-muted-foreground self-center">€18.4M TOTAL PIPELINE</span><span className="mono text-[10px] text-muted-foreground self-center">·</span><span className="mono text-[10px] text-muted-foreground self-center">2 PAPERWORK CHASES</span></div><div className="deal-grid">{columns.map((column) => <section className="deal-column" key={column}><div className="deal-column-head"><div><div className="eyebrow">{column}</div><div className="mono text-[10px] text-muted-foreground mt-1">{deals.filter((deal) => deal.stage === column).length} deals</div></div><button className="icon-btn !w-[27px] !h-[27px]" onClick={() => notify(`${column} stage has ${deals.filter((deal) => deal.stage === column).length} deals`)} aria-label={`More actions for ${column}`} data-testid={`button-deal-column-${column.toLowerCase().replace(/\s/g, '-')}`}><MoreHorizontal size={15} className="text-muted-foreground" /></button></div>{deals.filter((deal) => deal.stage === column).map((deal) => <button className="deal-card text-left w-full" key={deal.id} onClick={() => openDrawer({ eyebrow: `Deal room · ${deal.stage}`, title: deal.player, content: <DealDetail deal={deal} /> })} data-testid={`card-deal-${deal.id}`}><div className="flex justify-between items-center"><StatusPill tone={deal.tone}>{deal.status}</StatusPill><span className="mono text-[10px] text-muted-foreground">{deal.deadline}</span></div><h3>{deal.player}</h3><div className="club">{deal.club}</div><div className="deal-value">{deal.fee}</div><div className="deal-next">Next · {deal.next}</div></button>)}</section>)}</div></> : <><div className="toolbar"><span className="mono text-[10px] text-muted-foreground self-center">2 ALERTS NEEDING ATTENTION</span><span className="mono text-[10px] text-muted-foreground self-center">·</span><span className="mono text-[10px] text-muted-foreground self-center">6 DOCUMENT ROOMS</span></div><div className="contracts-grid">{contracts.map((contract) => <button className="card contract-card hover-card text-left" key={contract.id} onClick={() => openDrawer({ eyebrow: `Contract file · ${contract.status}`, title: contract.player, content: <ContractDetail contract={contract} /> })} data-testid={`card-contract-${contract.id}`}><div className="flex justify-between items-start gap-3"><div><div className="eyebrow">{contract.kind}</div><h2 className="display-font font-semibold text-[17px] tracking-[-.04em] mt-2">{contract.player}</h2><p className="item-meta mt-1">{contract.club}</p></div><StatusPill tone={contract.tone}>{contract.status}</StatusPill></div><div className="contract-meta"><div><div className="detail-label">Expiry / deadline</div><strong>{contract.expiry}</strong></div><div><div className="detail-label">Next action</div><strong>{contract.next}</strong></div></div><div className="contract-footer"><span className="item-meta"><FileText size={12} className="inline mr-1" />{contract.documents.length} documents on file</span><ChevronRight size={14} className="text-muted-foreground" /></div></button>)}</div></>}</div>;
}

function Assistant() {
  const { notify } = useWorkspace();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<{ role: 'assistant' | 'user'; text: string }[]>([
    { role: 'assistant', text: 'Morning, Alex. I’ve scanned the latest club briefs and player updates. What should we move first?' },
  ]);
  const prompts = ['Which players are ready for a Spanish club?', 'Draft a follow-up for Real Zaragoza', 'What deals need paperwork today?', 'Find the best match for Utrecht'];
  const ask = (question: string) => {
    const clean = question.trim();
    if (!clean) return;
    setMessages((current) => [...current, { role: 'user', text: clean }, { role: 'assistant', text: responseFor(clean) }]);
    setInput('');
  };
  return <div className="page"><div className="mb-7"><div className="eyebrow">Pitchside intelligence · private workspace</div><h1 className="page-title">AI Assistant</h1><p className="page-subtitle">A second pair of eyes for your next approach, follow-up or deal decision.</p></div><div className="assistant-layout"><section className="card assistant-main"><div className="assistant-head"><div><div className="eyebrow">Northline copilot</div><h2 className="display-font text-[20px] tracking-[-.04em] mt-1">Ready when you are.</h2></div><div className="flex items-center gap-2 text-[10px] mono text-[#c8e94a]"><span className="w-1.5 h-1.5 rounded-full bg-[#c8e94a]" /> LIVE CONTEXT</div></div><div className="chat-thread">{messages.map((message, index) => <div className={`chat-msg ${message.role === 'user' ? 'user' : ''}`} key={`${message.role}-${index}`} data-testid={`message-${index}`}><div className="bot-dot">{message.role === 'assistant' ? 'P' : 'AM'}</div><div className="chat-bubble">{message.text}</div></div>)}</div><form className="chat-input" onSubmit={(event) => { event.preventDefault(); ask(input); }}><input value={input} onChange={(event) => setInput(event.target.value)} placeholder="Ask about a player, club or next action..." aria-label="Ask Pitchside AI" data-testid="input-assistant" /><button className="btn btn-lime !min-h-[42px] !px-4" type="submit" data-testid="button-send-assistant"><Send size={14} /> Send</button></form></section><aside className="card prompt-list"><div className="eyebrow">Start with a prompt</div><h2 className="section-title mt-2">Useful questions</h2>{prompts.map((prompt) => <button className="prompt-btn" key={prompt} onClick={() => ask(prompt)} data-testid={`button-prompt-${prompt.slice(0, 12).replace(/\s/g, '-').toLowerCase()}`}>{prompt}<ChevronRight size={13} className="inline ml-2 text-muted-foreground" /></button>)}<div className="detail-block border-t border-border pt-4 mt-5"><div className="detail-label">Context loaded</div><div className="grid gap-2"><div className="flex justify-between text-[11px]"><span>Players</span><span className="mono text-muted-foreground">24</span></div><div className="flex justify-between text-[11px]"><span>Club briefs</span><span className="mono text-muted-foreground">42</span></div><div className="flex justify-between text-[11px]"><span>Open deals</span><span className="mono text-muted-foreground">07</span></div></div></div></aside></div></div>;
}

function responseFor(question: string) {
  const lower = question.toLowerCase();
  if (lower.includes('spanish') || lower.includes('spain')) return 'Noah Williams is the cleanest Spanish fit: 94% match to Real Zaragoza, GB passport, and an open summer window. I would lead with his aerial profile and availability. Tiago Pereira is a longer-shot creative option at 71%.';
  if (lower.includes('zaragoza')) return 'Here’s a concise follow-up: “Hi Álvaro, following your centre-back brief, Noah Williams looks like a strong fit for the summer window. He brings aerial security, a GB passport and an immediate availability path. I’ve attached his latest clips and contract context — happy to arrange a call this week.”';
  if (lower.includes('paperwork') || lower.includes('deal')) return 'Two items need movement today: Rayan Belkacem’s signed mandate is still pending at Racing Genk, and Tiago Pereira’s tax clearance is due before his Utrecht review. Marek Šimek’s medical pack is the next blocker for Pisa.';
  if (lower.includes('utrecht')) return 'Tiago Pereira is the best Utrecht match at 89%. His left-footed 1v1 profile and Portuguese passport fit the brief. Elias Adebayo is a credible secondary option if Utrecht prioritises central progression.';
  return 'I found 6 relevant records across your workspace. The highest-leverage move is Noah Williams to Real Zaragoza: 94% match, active club brief and no registration friction. Want me to draft the introduction?';
}

function AppContent() {
  const [location] = useLocation();
  const [drawer, setDrawer] = useState<DrawerState>(null);
  const [toast, setToast] = useState('');
  const [prepared, setPrepared] = useState<string[]>([]);
  const [completed, setCompleted] = useState<string[]>([]);
  const notify = (message: string) => { setToast(message); window.setTimeout(() => setToast(''), 2600); };
  const contextValue: WorkspaceContextValue = {
    openDrawer: setDrawer, closeDrawer: () => setDrawer(null), notify,
    prepared, prepare: (id, club) => { setPrepared((current) => current.includes(id) ? current : [...current, id]); notify(`Introduction prepared for ${club}`); },
    completed, complete: (id) => setCompleted((current) => current.includes(id) ? current : [...current, id]),
  };
  return <WorkspaceContext.Provider value={contextValue}><Shell><ErrorBoundary resetKey={location}><Switch><Route path="/" component={Dashboard} /><Route path="/players" component={Players} /><Route path="/clubs" component={Clubs} /><Route path="/opportunities" component={Opportunities} /><Route path="/deals" component={Deals} /><Route path="/assistant" component={Assistant} /><Route component={NotFound} /></Switch></ErrorBoundary></Shell><Drawer drawer={drawer} close={() => setDrawer(null)} />{toast && <div className="toast" role="status" data-testid="toast-message"><Check size={14} className="inline mr-2 text-[#c8e94a]" />{toast}</div>}</WorkspaceContext.Provider>;
}

function App() {
  return <QueryClientProvider client={queryClient}><TooltipProvider><WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}><AppContent /></WouterRouter><Toaster /></TooltipProvider></QueryClientProvider>;
}

export default App;