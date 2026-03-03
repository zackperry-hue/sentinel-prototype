import { useState, useEffect, useCallback } from "react";

// ═══════════════════════════════════════════════════════════
// SENTINEL DASHBOARD PROTOTYPE — All 4 Screens Connected
// ═══════════════════════════════════════════════════════════

// ── Color Tokens ──
const C = {
  navy: "#0B1D3A", navyLight: "#132847", navyMid: "#1A3358", slate: "#2A4066",
  teal: "#00B4D8", tealDark: "#0096B4", tealMuted: "rgba(0,180,216,0.12)",
  amber: "#F59E0B", amberMuted: "rgba(245,158,11,0.10)",
  red: "#EF4444", redMuted: "rgba(239,68,68,0.08)",
  green: "#22C55E", greenMuted: "rgba(34,197,94,0.08)", greenStrong: "rgba(34,197,94,0.15)",
  purple: "#8B5CF6", purpleMuted: "rgba(139,92,246,0.08)",
  orange: "#F97316", orangeMuted: "rgba(249,115,22,0.08)",
  white: "#FFFFFF", gray50: "#F8FAFC", gray100: "#F1F5F9", gray200: "#E2E8F0",
  gray300: "#CBD5E1", gray400: "#94A3B8", gray500: "#64748B", gray600: "#475569",
  gray700: "#334155",
  textPrimary: "#0F172A", textSecondary: "#475569", textMuted: "#94A3B8",
  scoreGreen: "#16A34A", scoreAmber: "#D97706", scoreRed: "#DC2626",
};

const scoreColor = (v) => v >= 80 ? C.scoreGreen : v >= 70 ? C.scoreAmber : C.scoreRed;
const scoreBg = (v) => v >= 80 ? C.greenMuted : v >= 70 ? C.amberMuted : v >= 0 ? C.redMuted : C.gray100;
const scoreClass = (v) => v >= 80 ? "green" : v >= 70 ? "amber" : "red";
const trendColor = (v) => v > 0.5 ? C.scoreGreen : v < -0.5 ? C.scoreRed : C.gray500;
const trendArrow = (v) => v > 0.5 ? "↑" : v < -0.5 ? "↓" : "→";

// ── Mock Data ──
const teams = [
  { id: 1, name: "Team 1", supervisor: "Alex Morgan", score: 78, trend: 2.1, calls: 412, attention: 8 },
  { id: 2, name: "Team 2", supervisor: "Jordan Lee", score: 72, trend: -1.4, calls: 389, attention: 14 },
  { id: 3, name: "Team 3", supervisor: "Casey Rivera", score: 76, trend: 0.8, calls: 356, attention: 11 },
  { id: 4, name: "Team 4", supervisor: "Zack Perry", score: 69, trend: -3.2, calls: 401, attention: 19 },
  { id: 5, name: "Team 5", supervisor: "Taylor Kim", score: 81, trend: 1.5, calls: 378, attention: 5 },
];

const sparkData = {
  1: [72,74,73,76,75,78,77,78], 2: [76,75,74,73,74,72,73,72],
  3: [73,74,74,75,76,75,76,76], 4: [75,74,72,73,71,70,70,69],
  5: [77,78,79,78,80,79,81,81],
};

const reps = [
  { id: 1, name: "Jessamyn Pellet", initials: "JP", team: 4, score: 58, trend: -5.2, calls: 62, sentiment: 48, knowledge: 55, ease: 69, demeanor: 71, script: 74, atRisk: true },
  { id: 2, name: "Shara Gennaro", initials: "SG", team: 4, score: 62, trend: -3.8, calls: 58, sentiment: 46, knowledge: 52, ease: 72, demeanor: 62, script: 72, atRisk: true },
  { id: 3, name: "Malia Rene", initials: "MR", team: 4, score: 66, trend: -1.9, calls: 71, sentiment: 49, knowledge: 52, ease: 74, demeanor: 76, script: 80 },
  { id: 4, name: "Elana Wennerholm", initials: "EW", team: 4, score: 71, trend: 0.2, calls: 78, sentiment: 53, knowledge: 65, ease: 78, demeanor: 74, script: 82 },
  { id: 5, name: "Paolina Pernas", initials: "PP", team: 4, score: 73, trend: 1.4, calls: 68, sentiment: 50, knowledge: 76, ease: 60, demeanor: 82, script: 71 },
  { id: 6, name: "Gigi Burrow", initials: "GB", team: 4, score: 75, trend: 0.8, calls: 75, sentiment: 55, knowledge: 69, ease: 78, demeanor: 83, script: 88 },
  { id: 7, name: "Nariko Nick", initials: "NN", team: 4, score: 82, trend: 2.3, calls: 80, sentiment: 60, knowledge: 72, ease: 78, demeanor: 87, script: 90 },
  { id: 8, name: "Lurleen Kirstin", initials: "LK", team: 4, score: 84, trend: 1.7, calls: 88, sentiment: 54, knowledge: 69, ease: 86, demeanor: 84, script: 92 },
  { id: 9, name: "Ruthy Powel", initials: "RP", team: 4, score: 86, trend: 3.1, calls: 91, sentiment: 54, knowledge: 76, ease: 88, demeanor: 88, script: 94 },
];

const managerCalls = [
  { date: "02/23", team: "Team 1", cat: "Self Pay Balance", rep: "Polly Pedaiah", script: 60, ease: 79, demeanor: 68, knowledge: 90, sentStart: 45, sentEnd: 80, score: 74, events: [{t:"compliance",l:"HIPAA flag"},{t:"escalation",l:"Supervisor req."}], dur: "6:26" },
  { date: "02/23", team: "Team 1", cat: "Authorization", rep: "Polly Pedaiah", script: 100, ease: 34, demeanor: 47, knowledge: 72, sentStart: 30, sentEnd: 55, score: 63, events: [{t:"escalation",l:"Supervisor req."}], dur: "8:15" },
  { date: "02/22", team: "Team 5", cat: "Authorization", rep: "Delcine Karl", script: 80, ease: 75, demeanor: 58, knowledge: 55, sentStart: 70, sentEnd: 100, score: 87, events: [{t:"compliance",l:"HIPAA flag"}], dur: "2:10" },
  { date: "02/22", team: "Team 4", cat: "Post-Procedure", rep: "Nariko Nick", script: 80, ease: 69, demeanor: 100, knowledge: 51, sentStart: 55, sentEnd: 35, score: 75, events: [{t:"quality",l:"Low knowledge"}], dur: "1:27" },
  { date: "02/22", team: "Team 5", cat: "Self Pay Balance", rep: "Jillane Janey", script: 80, ease: 64, demeanor: 81, knowledge: 78, sentStart: 80, sentEnd: 95, score: 76, events: [], dur: "1:24" },
  { date: "02/21", team: "Team 3", cat: "Symptom Advice", rep: "Bernice Krusche", script: 80, ease: 60, demeanor: 84, knowledge: 84, sentStart: 45, sentEnd: 75, score: 77, events: [{t:"quality",l:"Long hold"}], dur: "2:05" },
  { date: "02/21", team: "Team 2", cat: "Emergencies", rep: "Adriane Chane", script: 100, ease: 75, demeanor: 96, knowledge: 76, sentStart: 60, sentEnd: 95, score: 87, events: [], dur: "2:12" },
  { date: "02/21", team: "Team 1", cat: "Symptom Advice", rep: "Dooi Lasley", script: 100, ease: 67, demeanor: 86, knowledge: 78, sentStart: 55, sentEnd: 100, score: 83, events: [{t:"quality",l:"Excellent empathy"}], dur: "2:49" },
];

// ── Shared Components ──
const Sparkline = ({ data, color, w = 100, h = 28 }) => {
  const mn = Math.min(...data), mx = Math.max(...data), r = mx - mn || 1;
  const pts = data.map((v, i) => `${(i/(data.length-1))*w},${h-((v-mn)/r)*(h-4)-2}`).join(" ");
  return <svg width={w} height={h} style={{display:"block"}}><polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx={w} cy={h-((data[data.length-1]-mn)/r)*(h-4)-2} r="3" fill={color}/></svg>;
};

const ScoreBadge = ({ score, size = "md" }) => {
  const s = size === "sm" ? {p:"2px 8px",fs:11,minW:36} : {p:"3px 10px",fs:13,minW:42};
  return <span style={{display:"inline-flex",alignItems:"center",justifyContent:"center",minWidth:s.minW,padding:s.p,borderRadius:6,background:scoreBg(score),color:scoreColor(score),fontWeight:700,fontSize:s.fs,fontFamily:"'DM Mono',monospace"}}>{score}%</span>;
};

const EventTag = ({ type, label }) => {
  const c = {compliance:{bg:"#FEF2F2",c:"#DC2626",i:"⚠"},escalation:{bg:"#FFF7ED",c:"#D97706",i:"↑"},quality:{bg:"#F0F9FF",c:"#0284C7",i:"●"}}[type]||{bg:"#F0F9FF",c:"#0284C7",i:"●"};
  return <span style={{display:"inline-flex",alignItems:"center",gap:3,padding:"2px 8px",borderRadius:4,background:c.bg,color:c.c,fontSize:11,fontWeight:600,whiteSpace:"nowrap"}}><span style={{fontSize:10}}>{c.i}</span> {label}</span>;
};

const SentimentArc = ({ start, end }) => {
  const up = end > start, flat = Math.abs(end-start)<10;
  const color = flat ? C.amber : up ? C.green : C.red;
  const w=48,h=18,sy=h-(start/100)*(h-4)-2,ey=h-(end/100)*(h-4)-2;
  const cy2 = up ? Math.min(sy,ey)-5 : Math.max(sy,ey)+5;
  return <div style={{display:"flex",alignItems:"center",gap:4}}>
    <svg width={w} height={h}><path d={`M2,${sy} Q${w/2},${cy2} ${w-2},${ey}`} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round"/><circle cx={w-2} cy={ey} r="2" fill={color}/></svg>
    <span style={{fontSize:10,color,fontWeight:600}}>{start}→{end}%</span>
  </div>;
};

const MetricBar = ({ value, benchmark = 0, topRep = 0, goal = 0 }) => (
  <div style={{display:"flex",alignItems:"center",gap:8,minWidth:110}}>
    <div style={{flex:1,height:6,background:C.gray100,borderRadius:3,position:"relative"}}>
      <div style={{height:"100%",borderRadius:3,width:`${value}%`,background:scoreColor(value),transition:"width 0.4s"}}/>
      {benchmark > 0 && <div style={{position:"absolute",top:-3,left:`${benchmark}%`,width:2,height:12,background:C.gray400,borderRadius:1}}/>}
    </div>
    <span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:value<70?700:500,color:scoreColor(value),minWidth:32,textAlign:"right"}}>{value}%</span>
  </div>
);

// ── Animated Page Wrapper ──
const PageTransition = ({ children, k }) => {
  const [vis, setVis] = useState(false);
  useEffect(() => { setVis(false); const t = setTimeout(() => setVis(true), 30); return () => clearTimeout(t); }, [k]);
  return <div style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(12px)",transition:"all 0.35s cubic-bezier(0.4,0,0.2,1)"}}>{children}</div>;
};

// ── Staggered animation helper ──
const Stagger = ({ children, delay = 60 }) => {
  const [vis, setVis] = useState(false);
  useEffect(() => { const t = setTimeout(() => setVis(true), 20); return () => clearTimeout(t); }, []);
  return <>{Array.isArray(children) ? children.map((child, i) => (
    <div key={i} style={{opacity:vis?1:0,transform:vis?"translateY(0)":"translateY(16px)",transition:`all 0.4s cubic-bezier(0.4,0,0.2,1) ${i*delay}ms`}}>{child}</div>
  )) : children}</>;
};

// ═══════════════════════════════════════════════════════════
// HEADER
// ═══════════════════════════════════════════════════════════
const Header = ({ screen, navigate, avatar = "ZB" }) => (
  <header style={{background:C.navy,padding:"0 28px",height:54,display:"flex",alignItems:"center",justifyContent:"space-between",borderBottom:`1px solid ${C.navyMid}`,flexShrink:0}}>
    <div style={{display:"flex",alignItems:"center",gap:16}}>
      <div style={{display:"flex",alignItems:"center",gap:7,cursor:"pointer"}} onClick={()=>navigate("manager")}>
        <div style={{width:26,height:26,borderRadius:"50%",background:`linear-gradient(135deg,${C.teal},${C.tealDark})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:13,color:"white",fontWeight:700}}>S</div>
        <span style={{color:C.white,fontWeight:700,fontSize:15,letterSpacing:"-0.02em"}}>SENTINEL</span>
      </div>
      <div style={{width:1,height:22,background:C.slate}}/>
      <span style={{color:C.gray300,fontSize:13}}>Pelorus Demo Hospital</span>
    </div>
    <div style={{flex:"0 1 380px"}}>
      <div style={{background:C.navyLight,border:`1px solid ${C.slate}`,borderRadius:9,padding:"7px 14px",display:"flex",alignItems:"center",gap:9,cursor:"text"}}>
        <span style={{fontSize:14,color:C.teal}}>✦</span>
        <span style={{color:C.gray400,fontSize:13}}>Ask Sentinel AI about this data...</span>
        <span style={{marginLeft:"auto",background:C.slate,borderRadius:4,padding:"2px 5px",fontSize:10,color:C.gray400,fontFamily:"'DM Mono',monospace"}}>⌘K</span>
      </div>
    </div>
    <div style={{display:"flex",alignItems:"center",gap:20}}>
      {[{l:"Manager",s:"manager"},{l:"Supervisor",s:"supervisor"},{l:"Outlier Events",s:"outliers"},{l:"Rep",s:"rep"}].map(n=>(
        <span key={n.s} onClick={()=>navigate(n.s)} style={{color:screen===n.s?C.white:C.gray400,fontSize:13,fontWeight:screen===n.s?600:400,cursor:"pointer",transition:"color 0.2s",borderBottom:screen===n.s?`2px solid ${C.teal}`:"2px solid transparent",paddingBottom:2}}>{n.l}</span>
      ))}
      <div style={{width:30,height:30,borderRadius:"50%",background:C.slate,display:"flex",alignItems:"center",justifyContent:"center",color:C.gray300,fontSize:11,fontWeight:600}}>{avatar}</div>
    </div>
  </header>
);

// ── Date Selector ──
const DateSelector = () => {
  const [active, setActive] = useState("30d");
  return <div style={{display:"flex",background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,overflow:"hidden"}}>
    {["7d","30d","90d","QTD","Custom"].map(d=>(
      <button key={d} onClick={()=>setActive(d)} style={{padding:"5px 13px",fontSize:12,fontWeight:active===d?600:500,color:active===d?C.teal:C.textSecondary,background:active===d?C.tealMuted:"transparent",border:"none",cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s"}}>{d}</button>
    ))}
  </div>;
};

// ═══════════════════════════════════════════════════════════
// SCREEN 1: MANAGER DASHBOARD
// ═══════════════════════════════════════════════════════════
const ManagerDashboard = ({ navigate }) => {
  const [activeTab, setActiveTab] = useState("all");
  const [hovered, setHovered] = useState(null);

  return <PageTransition k="manager"><div style={{maxWidth:1360,margin:"0 auto",padding:"22px 28px"}}>
    {/* Page Header */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:22}}>
      <div>
        <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:30,fontWeight:400,letterSpacing:"-0.02em",color:C.navy,margin:0}}>Manager Dashboard</h1>
        <p style={{margin:"3px 0 0",color:C.textSecondary,fontSize:13}}>Quality intelligence across all teams and categories</p>
      </div>
      <div style={{display:"flex",gap:8,alignItems:"center"}}><DateSelector/><button style={{padding:"6px 14px",fontSize:12,color:C.textSecondary,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:8,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Export ↓</button></div>
    </div>

    {/* Summary Cards */}
    <Stagger delay={70}>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:22}}>
        {[{l:"Total Calls",v:"4,723",s:"Last 30 days",a:C.teal},{l:"Avg. Smart Score",v:"74%",s:"Across all teams",a:C.amber},{l:"Score Trend",v:"-1.7%",s:"vs. prior period",a:C.red},{l:"Needs Attention",v:"57",s:"Calls below 70%",a:C.red}].map((c,i)=>(
          <div key={i} style={{background:C.white,borderRadius:11,padding:"18px 22px",borderLeft:`4px solid ${c.a}`,boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:11,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{c.l}</div>
            <div style={{fontSize:28,fontWeight:700,color:C.textPrimary,marginTop:3,fontFamily:"'DM Mono',monospace",letterSpacing:"-0.03em"}}>{c.v}</div>
            <div style={{fontSize:11,color:C.textMuted,marginTop:1}}>{c.s}</div>
          </div>
        ))}
      </div>

      {/* Team Performance */}
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <h2 style={{fontSize:15,fontWeight:600,color:C.navy,margin:0}}>Team Performance</h2>
          <div style={{display:"flex",gap:14,fontSize:11,color:C.textMuted}}>
            {[{c:C.green,l:"80%+"},{c:C.amber,l:"70–79%"},{c:C.red,l:"<70%"}].map(x=>(
              <span key={x.l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:7,height:7,borderRadius:2,background:x.c,display:"inline-block"}}/>{x.l}</span>
            ))}
          </div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11}}>
          {teams.map(t=>{
            const tc = t.score>=80?C.green:t.score>=70?C.amber:C.red;
            return <div key={t.id} onClick={()=>navigate("supervisor",{teamId:t.id})} onMouseEnter={()=>setHovered(t.id)} onMouseLeave={()=>setHovered(null)}
              style={{background:C.white,borderRadius:11,padding:18,boxShadow:hovered===t.id?"0 4px 20px rgba(0,0,0,0.08)":"0 1px 3px rgba(0,0,0,0.04)",cursor:"pointer",transition:"all 0.2s",transform:hovered===t.id?"translateY(-2px)":"none",border:`1px solid ${hovered===t.id?C.gray200:"transparent"}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <div><div style={{fontSize:13,fontWeight:600,color:C.navy}}>{t.name}</div><div style={{fontSize:11,color:C.textMuted}}>{t.supervisor}</div></div>
                <span style={{fontSize:20,fontWeight:700,color:scoreColor(t.score),fontFamily:"'DM Mono',monospace",lineHeight:1}}>{t.score}</span>
              </div>
              <Sparkline data={sparkData[t.id]} color={tc} w={110} h={30}/>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:10,fontSize:12}}>
                <span style={{fontWeight:600,color:trendColor(t.trend),fontFamily:"'DM Mono',monospace"}}>{trendArrow(t.trend)} {Math.abs(t.trend).toFixed(1)}%</span>
                <span style={{color:C.textMuted}}>{t.calls} calls</span>
              </div>
              {t.attention > 10 && <div style={{marginTop:8,padding:"4px 8px",borderRadius:5,background:C.redMuted,color:C.scoreRed,fontSize:11,fontWeight:600,textAlign:"center"}}>{t.attention} calls need review</div>}
            </div>;
          })}
        </div>
      </div>

      {/* Call List */}
      <div style={{background:C.white,borderRadius:11,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
        <div style={{padding:"14px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
          <div style={{display:"flex"}}>
            {[{l:"All Calls",v:"all",n:4723},{l:"Needs Attention",v:"attention",n:57},{l:"Compliance Flags",v:"compliance",n:23}].map(tab=>(
              <button key={tab.v} onClick={()=>setActiveTab(tab.v)} style={{padding:"7px 14px",fontSize:12,fontWeight:activeTab===tab.v?600:500,color:activeTab===tab.v?C.teal:C.textSecondary,background:"transparent",border:"none",borderBottom:`2px solid ${activeTab===tab.v?C.teal:"transparent"}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                {tab.l}<span style={{fontSize:10,padding:"1px 6px",borderRadius:9,background:activeTab===tab.v?C.tealMuted:C.gray100,color:activeTab===tab.v?C.tealDark:C.textMuted,fontWeight:600}}>{tab.n}</span>
              </button>
            ))}
          </div>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:C.gray50,borderBottom:`1px solid ${C.gray200}`}}>
              {["Date","Team","Category","Rep","Script","Ease","Demeanor","Knowledge","Sentiment","Events","Score","Dur.",""].map(h=>(
                <th key={h} style={{padding:"9px 12px",textAlign:"left",fontWeight:600,fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {managerCalls.map((c,i)=>(
                <tr key={i} style={{borderBottom:`1px solid ${C.gray100}`,cursor:"pointer",background:c.score<70?"rgba(239,68,68,0.03)":"transparent",transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background=c.score<70?"rgba(239,68,68,0.03)":"transparent"}>
                  <td style={{padding:"10px 12px",color:C.textSecondary,fontFamily:"'DM Mono',monospace",fontSize:11}}>{c.date}</td>
                  <td style={{padding:"10px 12px",fontWeight:500}}>{c.team}</td>
                  <td style={{padding:"10px 12px",color:C.textSecondary,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.cat}</td>
                  <td style={{padding:"10px 12px",fontWeight:500}}>{c.rep}</td>
                  <td style={{padding:"10px 12px",color:scoreColor(c.script),fontFamily:"'DM Mono',monospace"}}>{c.script}%</td>
                  <td style={{padding:"10px 12px",color:scoreColor(c.ease),fontFamily:"'DM Mono',monospace"}}>{c.ease}%</td>
                  <td style={{padding:"10px 12px",color:scoreColor(c.demeanor),fontFamily:"'DM Mono',monospace"}}>{c.demeanor}%</td>
                  <td style={{padding:"10px 12px",color:scoreColor(c.knowledge),fontFamily:"'DM Mono',monospace"}}>{c.knowledge}%</td>
                  <td style={{padding:"10px 12px"}}><SentimentArc start={c.sentStart} end={c.sentEnd}/></td>
                  <td style={{padding:"10px 12px"}}><div style={{display:"flex",gap:3,flexWrap:"wrap"}}>{c.events.length?c.events.map((e,j)=><EventTag key={j} type={e.t} label={e.l}/>):<span style={{color:C.textMuted}}>—</span>}</div></td>
                  <td style={{padding:"10px 12px"}}><ScoreBadge score={c.score}/></td>
                  <td style={{padding:"10px 12px",color:C.textSecondary,fontFamily:"'DM Mono',monospace",fontSize:11}}>{c.dur}</td>
                  <td style={{padding:"10px 12px"}}><button onClick={(e)=>{e.stopPropagation();navigate("calldetail",{call:c})}} style={{padding:"3px 9px",fontSize:10,fontWeight:600,color:C.teal,background:C.tealMuted,border:"none",borderRadius:4,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Review</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderTop:`1px solid ${C.gray100}`,fontSize:12,color:C.textMuted}}>
          <span>Showing 1–8 of 4,723 calls</span>
          <div style={{display:"flex",gap:3}}>{["←","1","2","3","...","189","→"].map((p,i)=>(
            <button key={i} style={{padding:"4px 9px",fontSize:11,fontWeight:p==="1"?600:400,color:p==="1"?C.teal:C.textSecondary,background:p==="1"?C.tealMuted:"transparent",border:`1px solid ${p==="1"?"transparent":C.gray200}`,borderRadius:4,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>{p}</button>
          ))}</div>
        </div>
      </div>
    </Stagger>
  </div></PageTransition>;
};

// ═══════════════════════════════════════════════════════════
// SCREEN 2: SUPERVISOR DASHBOARD
// ═══════════════════════════════════════════════════════════
const SupervisorDashboard = ({ navigate }) => (
  <PageTransition k="supervisor"><div style={{maxWidth:1360,margin:"0 auto",padding:"22px 28px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:22}}>
      <div>
        <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:30,fontWeight:400,letterSpacing:"-0.02em",color:C.navy,margin:0}}>Supervisor Dashboard</h1>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:5}}>
          <span style={{padding:"3px 10px",background:C.tealMuted,borderRadius:5,fontSize:12,fontWeight:600,color:C.tealDark}}>👤 Zack Perry — Team 4</span>
          <span style={{padding:"3px 10px",background:C.gray100,borderRadius:5,fontSize:12,color:C.textSecondary}}>970 calls</span>
        </div>
      </div>
      <DateSelector/>
    </div>

    <Stagger delay={60}>
      {/* Health Strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11,marginBottom:22}}>
        {[{l:"Sentiment",v:50,bench:62,tr:-4.2,alert:"Lowest metric"},{l:"Knowledge",v:63,bench:71,tr:-2.1,alert:"8pts below hospital"},{l:"Ease",v:72,bench:74,tr:0.3},{l:"Demeanor",v:75,bench:76,tr:1.1},{l:"Script",v:81,bench:79,tr:2.4}].map((m,i)=>(
          <div key={i} style={{background:C.white,borderRadius:11,padding:"15px 18px",boxShadow:"0 1px 3px rgba(0,0,0,0.04)",borderLeft:`4px solid ${scoreColor(m.v)}`,cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 16px rgba(0,0,0,0.08)"} onMouseLeave={e=>e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}>
            <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{m.l}</div>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginTop:5}}>
              <span style={{fontSize:26,fontWeight:700,color:scoreColor(m.v),fontFamily:"'DM Mono',monospace",lineHeight:1}}>{m.v}%</span>
              <div style={{textAlign:"right",fontSize:10,color:C.textMuted}}>Hospital<br/><span style={{fontWeight:600,color:C.textSecondary}}>{m.bench}%</span></div>
            </div>
            <div style={{marginTop:5,fontSize:11,fontWeight:600,color:trendColor(m.tr),fontFamily:"'DM Mono',monospace"}}>{trendArrow(m.tr)} {Math.abs(m.tr).toFixed(1)}% vs prior</div>
            {m.alert && <div style={{marginTop:7,padding:"3px 7px",borderRadius:4,background:C.redMuted,color:C.scoreRed,fontSize:10,fontWeight:600}}>⚠ {m.alert}</div>}
          </div>
        ))}
      </div>

      {/* Outlier Events */}
      <div style={{marginBottom:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}><h2 style={{fontSize:15,fontWeight:600,color:C.navy,margin:0}}>Outlier Events</h2><span style={{fontSize:12,color:C.textMuted}}>620 total</span></div>
          <span onClick={()=>navigate("outliers")} style={{fontSize:12,color:C.teal,fontWeight:600,cursor:"pointer"}}>View all events →</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(6,1fr)",gap:9}}>
          {[{i:"⭐",n:95,l:"Hero Moments",c:C.scoreGreen},{i:"💬",n:91,l:"Compliments",c:"#7C3AED"},{i:"⚡",n:93,l:"Demeanor",c:C.scoreAmber},{i:"⚠",n:85,l:"Compliance",c:C.scoreRed},{i:"💲",n:87,l:"Surprise Billing",c:C.scoreAmber},{i:"📉",n:84,l:"Concerns",c:C.scoreAmber}].map((o,i)=>(
            <div key={i} onClick={()=>navigate("outliers")} style={{background:C.white,borderRadius:9,padding:"12px 10px",textAlign:"center",cursor:"pointer",transition:"all 0.2s",border:"1px solid transparent",boxShadow:"0 1px 3px rgba(0,0,0,0.04)"}} onMouseEnter={e=>{e.currentTarget.style.borderColor=C.gray200;e.currentTarget.style.boxShadow="0 2px 10px rgba(0,0,0,0.06)"}} onMouseLeave={e=>{e.currentTarget.style.borderColor="transparent";e.currentTarget.style.boxShadow="0 1px 3px rgba(0,0,0,0.04)"}}>
              <div style={{fontSize:17,marginBottom:2}}>{o.i}</div>
              <div style={{fontSize:20,fontWeight:700,color:o.c,fontFamily:"'DM Mono',monospace"}}>{o.n}</div>
              <div style={{fontSize:10,color:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:1}}>{o.l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Rep Overview Table */}
      <div style={{background:C.white,borderRadius:11,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
        <div style={{padding:"14px 22px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
          <div style={{display:"flex"}}>
            {[{l:"All Reps",n:reps.length},{l:"Needs Coaching",n:reps.filter(r=>r.atRisk).length},{l:"Top Performers",n:reps.filter(r=>r.score>=80).length}].map((t,i)=>(
              <button key={i} style={{padding:"7px 14px",fontSize:12,fontWeight:i===0?600:500,color:i===0?C.teal:C.textSecondary,background:"transparent",border:"none",borderBottom:`2px solid ${i===0?C.teal:"transparent"}`,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",display:"flex",alignItems:"center",gap:5}}>
                {t.l}<span style={{fontSize:10,padding:"1px 6px",borderRadius:9,background:i===0?C.tealMuted:C.gray100,color:i===0?C.tealDark:C.textMuted,fontWeight:600}}>{t.n}</span>
              </button>
            ))}
          </div>
          <span style={{fontSize:11,color:C.textMuted}}>Sorted by Smart Score</span>
        </div>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
            <thead><tr style={{background:C.gray50,borderBottom:`1px solid ${C.gray200}`}}>
              {["Rep","Score","Trend","Sentiment","Knowledge","Ease","Demeanor","Script","Calls","Actions"].map(h=>(
                <th key={h} style={{padding:"9px 14px",textAlign:"left",fontWeight:600,fontSize:10,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.06em",whiteSpace:"nowrap"}}>{h}</th>
              ))}
            </tr></thead>
            <tbody>
              {reps.map(r=>(
                <tr key={r.id} onClick={()=>navigate("rep",{repId:r.id})} style={{borderBottom:`1px solid ${C.gray100}`,cursor:"pointer",background:r.atRisk?"rgba(239,68,68,0.03)":"transparent",transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background=r.atRisk?"rgba(239,68,68,0.03)":"transparent"}>
                  <td style={{padding:"12px 14px"}}>
                    <div style={{display:"flex",alignItems:"center",gap:9}}>
                      <div style={{width:30,height:30,borderRadius:"50%",background:r.score>=80?C.greenMuted:C.gray100,display:"flex",alignItems:"center",justifyContent:"center",fontSize:11,fontWeight:600,color:r.score>=80?C.scoreGreen:C.textSecondary,flexShrink:0}}>{r.initials}</div>
                      <div><div style={{fontWeight:600,fontSize:12}}>{r.name}{r.atRisk && <span style={{marginLeft:5,padding:"1px 6px",borderRadius:3,background:C.redMuted,color:C.scoreRed,fontSize:9,fontWeight:700}}>⚠ At risk</span>}</div><div style={{fontSize:10,color:C.textMuted}}>{r.calls} calls</div></div>
                    </div>
                  </td>
                  <td style={{padding:"12px 14px"}}><ScoreBadge score={r.score}/></td>
                  <td style={{padding:"12px 14px"}}><span style={{fontFamily:"'DM Mono',monospace",fontSize:12,fontWeight:600,color:trendColor(r.trend)}}>{trendArrow(r.trend)} {Math.abs(r.trend).toFixed(1)}%</span></td>
                  <td style={{padding:"12px 14px"}}><MetricBar value={r.sentiment} benchmark={50}/></td>
                  <td style={{padding:"12px 14px"}}><MetricBar value={r.knowledge} benchmark={63}/></td>
                  <td style={{padding:"12px 14px"}}><MetricBar value={r.ease} benchmark={72}/></td>
                  <td style={{padding:"12px 14px"}}><MetricBar value={r.demeanor} benchmark={75}/></td>
                  <td style={{padding:"12px 14px"}}><MetricBar value={r.script} benchmark={81}/></td>
                  <td style={{padding:"12px 14px",fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textSecondary}}>{r.calls}</td>
                  <td style={{padding:"12px 14px"}}><div style={{display:"flex",gap:5}}>
                    <button style={{padding:"4px 10px",fontSize:10,fontWeight:600,color:C.teal,background:C.tealMuted,border:"none",borderRadius:4,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Coach</button>
                    <button style={{padding:"4px 8px",fontSize:10,fontWeight:600,color:C.textMuted,background:C.gray100,border:"none",borderRadius:4,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Calls</button>
                  </div></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={{padding:"10px 22px",borderTop:`1px solid ${C.gray100}`,display:"flex",gap:18,fontSize:11,color:C.textMuted}}>
          {[{c:C.green,l:"80%+"},{c:C.amber,l:"70–79%"},{c:C.red,l:"<70%"}].map(x=><span key={x.l} style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:7,height:7,borderRadius:2,background:x.c}}/>{x.l}</span>)}
          <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:2,height:10,background:C.gray400,borderRadius:1}}/>Team benchmark</span>
        </div>
      </div>
    </Stagger>
  </div></PageTransition>
);

// ═══════════════════════════════════════════════════════════
// SCREEN 3: OUTLIER EVENTS
// ═══════════════════════════════════════════════════════════
const OutlierEvents = ({ navigate }) => {
  const [activeCat, setActiveCat] = useState("all");
  const cats = [{id:"all",i:"📊",n:2860,l:"All",c:C.textSecondary},{id:"compliance",i:"⚠",n:378,l:"Compliance",c:C.scoreRed},{id:"concerns",i:"📉",n:416,l:"Concerns",c:C.scoreAmber},{id:"demeanor",i:"😤",n:437,l:"Demeanor",c:C.scoreAmber},{id:"billing",i:"💲",n:406,l:"Surprise Billing",c:C.scoreAmber},{id:"disengage",i:"🚫",n:411,l:"Disengagement",c:C.textSecondary},{id:"hero",i:"⭐",n:407,l:"Hero Moments",c:C.scoreGreen},{id:"compliment",i:"💬",n:405,l:"Compliments",c:"#7C3AED"}];

  const events = {
    attention: [
      {date:"02/23",rep:"Polly Pedaiah",team:"Team 1",tag:"compliance",tagLabel:"High Severity",summary:"Rep offered 90% discount, in excess of the 50% limit for prompt pay.",call:"Self Pay Balance",actions:["Escalate","Review"]},
      {date:"02/22",rep:"Delcine Karl",team:"Team 5",tag:"compliance",tagLabel:"High Severity",summary:"Rep failed to read the required consent statement before scheduling a procedure.",call:"Authorization",actions:["Escalate","Review"]},
      {date:"02/23",rep:"Polly Pedaiah",team:"Team 1",tag:"concern",tagLabel:"Patient Concern",summary:'"Nobody warned me that I would owe $6000"',call:"Self Pay Balance",quote:true,actions:["Flag","Review"]},
      {date:"02/22",rep:"Nariko Nick",team:"Team 4",tag:"demeanor",tagLabel:"Dismissive Tone",summary:"Rep spoke to a colleague in the background using a dismissive tone about the patient's concern.",call:"Post-Procedure",actions:["Flag","Review"]},
      {date:"02/22",rep:"Delcine Karl",team:"Team 5",tag:"billing",tagLabel:"Estimate Dispute",summary:'"The estimate I was given was off by over a thousand dollars. How is that possible?"',call:"Authorization",quote:true,actions:["Flag","Review"]},
    ],
    recognition: [
      {date:"02/20",rep:"Olivette Alburg",team:"Team 5",tag:"hero",tagLabel:"Cross-Dept Coordination",summary:"Rep worked with multiple departments during a single call to fully resolve a complex issue.",call:"Appointments & Scheduling",actions:["Recognize","Review"]},
      {date:"02/14",rep:"Adriane Chane",team:"Team 2",tag:"hero",tagLabel:"Patient Advocacy",summary:"Rep followed up with the patient's physician office to expedite a referral.",call:"Appointments & Scheduling",actions:["Recognize","Review"]},
      {date:"02/23",rep:"Polly Pedaiah",team:"Team 1",tag:"compliment",tagLabel:"Patient Praise",summary:'"I\'m telling all my friends about this hospital. The service is top-notch."',call:"Self Pay Balance",quote:true,actions:["Recognize","Review"]},
      {date:"02/21",rep:"Sheela Bartholemy",team:"Team 4",tag:"compliment",tagLabel:"Patient Praise",summary:'"Your empathy and professionalism are exactly what patients need."',call:"Self Pay Balance",quote:true,actions:["Recognize","Review"]},
    ],
  };

  const tagStyles = {compliance:{bg:"#FEF2F2",c:"#DC2626"},concern:{bg:C.amberMuted,c:C.scoreAmber},demeanor:{bg:"rgba(239,68,68,0.06)",c:"#B91C1C"},billing:{bg:C.orangeMuted,c:"#C2410C"},hero:{bg:C.greenMuted,c:C.scoreGreen},compliment:{bg:C.purpleMuted,c:"#7C3AED"}};

  const EventRow = ({e}) => {
    const ts = tagStyles[e.tag]||tagStyles.concern;
    return <div style={{display:"grid",gridTemplateColumns:"75px 110px 1fr auto",gap:14,padding:"12px 20px",borderBottom:`1px solid ${C.gray100}`,alignItems:"start",cursor:"pointer",transition:"background 0.1s"}} onMouseEnter={ev=>ev.currentTarget.style.background=C.gray50} onMouseLeave={ev=>ev.currentTarget.style.background="transparent"}>
      <div style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.textMuted,paddingTop:2}}>{e.date}</div>
      <div><div style={{fontSize:12,fontWeight:600}}>{e.rep}</div><div style={{fontSize:10,color:C.textMuted}}>{e.team}</div></div>
      <div>
        <span style={{display:"inline-flex",padding:"2px 7px",borderRadius:4,fontSize:10,fontWeight:600,background:ts.bg,color:ts.c,marginBottom:5}}>{e.tagLabel}</span>
        <div style={{fontSize:12,lineHeight:1.5,color:C.textSecondary}}>{e.quote?<em style={{color:C.textPrimary,fontWeight:500}}>{e.summary}</em>:e.summary}</div>
        <div style={{fontSize:10,color:C.textMuted,marginTop:3}}>{e.call}</div>
      </div>
      <div style={{display:"flex",gap:5,paddingTop:2}}>{e.actions.map((a,i)=>(
        <button key={i} onClick={a==="Review"?()=>navigate("calldetail",{call:managerCalls[0]}):undefined} style={{padding:"4px 9px",fontSize:10,fontWeight:600,color:i===0?(e.tag==="hero"||e.tag==="compliment"?C.scoreGreen:e.tag==="compliance"?C.scoreRed:C.scoreAmber):C.teal,background:i===0?(e.tag==="hero"||e.tag==="compliment"?C.greenMuted:e.tag==="compliance"?C.redMuted:C.amberMuted):C.tealMuted,border:"none",borderRadius:4,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",whiteSpace:"nowrap"}}>{a}</button>
      ))}</div>
    </div>;
  };

  return <PageTransition k="outliers"><div style={{maxWidth:1360,margin:"0 auto",padding:"22px 28px"}}>
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:22}}>
      <div>
        <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:30,fontWeight:400,letterSpacing:"-0.02em",color:C.navy,margin:0}}>Outlier Events</h1>
        <p style={{margin:"3px 0 0",color:C.textSecondary,fontSize:13}}>AI-detected moments that need attention or recognition · 2,860 events</p>
      </div>
      <DateSelector/>
    </div>

    <Stagger delay={50}>
      {/* AI Insights */}
      <div style={{background:`linear-gradient(135deg,${C.navy} 0%,${C.navyMid} 100%)`,borderRadius:13,padding:"22px 26px",marginBottom:22,color:C.white,position:"relative",overflow:"hidden"}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:14}}><span style={{fontSize:16,color:C.teal}}>✦</span><span style={{fontSize:13,fontWeight:600}}>Sentinel AI Insights — Patterns Detected</span></div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:14}}>
          {[{tag:"⚠ Risk Pattern",tagC:"#FCA5A5",tagBg:"rgba(239,68,68,0.2)",text:<><strong>Nariko Nick</strong> has 5 Demeanor outliers in 30 days — 3× team average. All in Post-Procedure calls.</>,act:"View calls →"},
            {tag:"📈 Rising Trend",tagC:"#FDE68A",tagBg:"rgba(245,158,11,0.2)",text:<><strong>Surprise Billing</strong> events up 40% this quarter, concentrated in Authorization calls.</>,act:"Explore trend →"},
            {tag:"⭐ Bright Spot",tagC:"#86EFAC",tagBg:"rgba(34,197,94,0.2)",text:<><strong>Olivette Alburg</strong> generated 8 Hero Moments this month — highest on team.</>,act:"Share with team →"}
          ].map((ins,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:9,padding:"12px 14px",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.10)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
              <span style={{display:"inline-flex",padding:"2px 7px",borderRadius:4,fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",background:ins.tagBg,color:ins.tagC,marginBottom:7}}>{ins.tag}</span>
              <div style={{fontSize:12,lineHeight:1.5,color:C.gray300}}>{ins.text}</div>
              <div style={{marginTop:7,fontSize:11,color:C.teal,fontWeight:600}}>{ins.act}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Strip */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(8,1fr)",gap:7,marginBottom:22}}>
        {cats.map(cat=>(
          <div key={cat.id} onClick={()=>setActiveCat(cat.id)} style={{background:C.white,borderRadius:9,padding:"11px 8px",textAlign:"center",cursor:"pointer",transition:"all 0.2s",border:`2px solid ${activeCat===cat.id?C.teal:"transparent"}`,boxShadow:activeCat===cat.id?`0 2px 10px rgba(0,180,216,0.15)`:"0 1px 3px rgba(0,0,0,0.04)"}}>
            <div style={{fontSize:16,marginBottom:1}}>{cat.i}</div>
            <div style={{fontSize:18,fontWeight:700,color:cat.c,fontFamily:"'DM Mono',monospace"}}>{cat.n}</div>
            <div style={{fontSize:9,color:activeCat===cat.id?C.tealDark:C.textMuted,fontWeight:600,textTransform:"uppercase",letterSpacing:"0.04em",marginTop:1}}>{cat.l}</div>
          </div>
        ))}
      </div>

      {/* Requires Attention */}
      <div style={{display:"flex",alignItems:"center",gap:10,margin:"24px 0 14px"}}>
        <div style={{flex:1,height:1,background:C.gray200}}/><span style={{padding:"3px 10px",borderRadius:4,background:C.redMuted,color:C.scoreRed,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>⚠ Requires Attention</span><div style={{flex:1,height:1,background:C.gray200}}/>
      </div>
      <div style={{background:C.white,borderRadius:11,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden",marginBottom:16}}>
        {events.attention.map((e,i)=><EventRow key={i} e={e}/>)}
        <div style={{padding:"10px 20px",borderTop:`1px solid ${C.gray100}`,display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted}}>
          <span>Showing 5 of 1,648 · 42 unacknowledged</span>
          <span style={{color:C.teal,fontWeight:600,cursor:"pointer"}}>View all →</span>
        </div>
      </div>

      {/* Recognition */}
      <div style={{display:"flex",alignItems:"center",gap:10,margin:"24px 0 14px"}}>
        <div style={{flex:1,height:1,background:C.gray200}}/><span style={{padding:"3px 10px",borderRadius:4,background:C.greenMuted,color:C.scoreGreen,fontSize:11,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em"}}>⭐ Recognition Opportunities</span><div style={{flex:1,height:1,background:C.gray200}}/>
      </div>
      <div style={{background:C.white,borderRadius:11,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
        {events.recognition.map((e,i)=><EventRow key={i} e={e}/>)}
        <div style={{padding:"10px 20px",borderTop:`1px solid ${C.gray100}`,display:"flex",justifyContent:"space-between",fontSize:11,color:C.textMuted}}>
          <span>Showing 4 of 812 · Share in team meetings</span>
          <span style={{color:C.teal,fontWeight:600,cursor:"pointer"}}>View all →</span>
        </div>
      </div>
    </Stagger>
  </div></PageTransition>;
};

// ═══════════════════════════════════════════════════════════
// SCREEN 4: REP DASHBOARD
// ═══════════════════════════════════════════════════════════
const RepDashboard = ({ navigate }) => {
  const rep = reps.find(r=>r.id===5); // Paolina

  const metrics = [
    {l:"Knowledge",v:rep.knowledge,rank:"#1 of 13",bench:63,goal:80,tr:4.2,star:true},
    {l:"Demeanor",v:rep.demeanor,rank:"#4 of 13",bench:75,goal:85,tr:2.8},
    {l:"Script",v:rep.script,rank:"#7 of 13",bench:81,goal:80,tr:-1.3},
    {l:"Ease",v:rep.ease,rank:"#10 of 13",bench:72,goal:70,tr:0.1},
    {l:"Sentiment",v:rep.sentiment,rank:"#11 of 13",bench:50,goal:60,tr:-3.1},
  ];

  return <PageTransition k="rep"><div style={{maxWidth:1100,margin:"0 auto",padding:"22px 28px"}}>
    {/* Welcome */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end",marginBottom:22}}>
      <div>
        <h1 style={{fontFamily:"'Instrument Serif',serif",fontSize:30,fontWeight:400,letterSpacing:"-0.02em",color:C.navy,margin:0}}>Hi Paolina 👋</h1>
        <div style={{display:"flex",alignItems:"center",gap:10,marginTop:5}}>
          <span style={{padding:"3px 10px",background:C.tealMuted,borderRadius:5,fontSize:12,fontWeight:600,color:C.tealDark}}>Team 4</span>
          <span style={{padding:"3px 10px",background:C.gray100,borderRadius:5,fontSize:12,color:C.textSecondary}}>68 calls this period</span>
          <span style={{fontSize:12,color:C.textMuted}}>Last 30 days</span>
        </div>
      </div>
      <DateSelector/>
    </div>

    <Stagger delay={60}>
      {/* Coaching Panel */}
      <div style={{background:`linear-gradient(135deg,${C.navy} 0%,#162D50 100%)`,borderRadius:13,padding:"22px 26px",marginBottom:24,color:C.white}}>
        <div style={{display:"flex",alignItems:"center",gap:7,marginBottom:12}}><span style={{fontSize:16,color:C.teal}}>✦</span><span style={{fontSize:13,fontWeight:600}}>Your Coaching Summary</span></div>
        <div style={{fontSize:14,lineHeight:1.65,color:C.gray300,maxWidth:800}}>
          Your <span style={{color:"#86EFAC",fontWeight:600}}>strongest area is Knowledge (76%)</span> — you're #1 on Team 4 and 13 points above the team average. Your biggest opportunity is <span style={{color:"#FDE68A",fontWeight:600}}>Sentiment Trajectory (50%)</span>. Top performers acknowledge frustration early and close with clear next steps.
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:11,marginTop:14}}>
          {[{tag:"💪 Strength",tagC:"#86EFAC",text:<>Knowledge accuracy is your superpower. <strong>76% vs. 63% team avg.</strong></>},
            {tag:"🎯 This Week",tagC:"#FDE68A",text:<>Try opening with <strong>"I understand this is frustrating"</strong> on billing calls.</>},
            {tag:"🎧 Listen & Learn",tagC:"#93C5FD",text:<>Ruthy Powel's 02/18 call scored 92% Sentiment. <strong>Listen to her closing →</strong></>}
          ].map((t,i)=>(
            <div key={i} style={{background:"rgba(255,255,255,0.06)",border:"1px solid rgba(255,255,255,0.08)",borderRadius:8,padding:"11px 14px",cursor:"pointer",transition:"all 0.2s"}} onMouseEnter={e=>e.currentTarget.style.background="rgba(255,255,255,0.10)"} onMouseLeave={e=>e.currentTarget.style.background="rgba(255,255,255,0.06)"}>
              <div style={{fontSize:10,fontWeight:700,color:t.tagC,marginBottom:5}}>{t.tag}</div>
              <div style={{fontSize:12,lineHeight:1.45,color:C.gray300}}>{t.text}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Scorecard */}
      <div style={{background:C.white,borderRadius:13,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",padding:"24px 26px",marginBottom:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <div style={{fontSize:15,fontWeight:600,color:C.navy}}>Your Performance Scorecard</div>
          <div style={{display:"flex",gap:16,fontSize:10,color:C.textMuted}}>
            <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:16,height:4,borderRadius:2,background:C.teal,display:"inline-block"}}/>You</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:2,height:10,background:C.gray400,borderRadius:1,display:"inline-block"}}/>Team Avg</span>
            <span style={{display:"flex",alignItems:"center",gap:4}}><span style={{width:8,height:8,border:`2px solid ${C.amber}`,borderRadius:"50%",display:"inline-block"}}/>Goal</span>
          </div>
        </div>
        {metrics.map((m,i)=>(
          <div key={i} style={{display:"grid",gridTemplateColumns:"130px 55px 1fr 50px 50px 70px",alignItems:"center",gap:14,padding:"14px 0",borderBottom:i<metrics.length-1?`1px solid ${C.gray100}`:"none",background:m.star?C.greenMuted:"transparent",margin:m.star?"0 -26px":"0",padding:m.star?"14px 26px":"14px 0",borderRadius:m.star?7:0}}>
            <div>
              <div style={{fontSize:13,fontWeight:600,color:C.navy}}>{m.l} {m.star && "⭐"}</div>
              <div style={{fontSize:10,color:m.star?C.scoreGreen:C.textMuted,fontWeight:m.star?600:400}}>{m.rank}</div>
            </div>
            <div style={{fontSize:22,fontWeight:700,color:scoreColor(m.v),fontFamily:"'DM Mono',monospace",letterSpacing:"-0.02em"}}>{m.v}%</div>
            <div style={{position:"relative",height:30}}>
              <div style={{position:"absolute",top:11,left:0,right:0,height:8,background:C.gray100,borderRadius:4}}/>
              <div style={{position:"absolute",top:9,left:0,height:12,borderRadius:6,width:`${m.v}%`,background:`linear-gradient(90deg,${scoreColor(m.v)},${scoreColor(m.v)}dd)`,transition:"width 0.4s"}}/>
              <div style={{position:"absolute",top:0,left:`${m.bench}%`,width:2,height:30,background:C.gray400,borderRadius:1}}/>
              <div style={{position:"absolute",top:8,left:`${m.goal}%`,width:10,height:10,border:`2px solid ${C.amber}`,borderRadius:"50%",background:C.white,transform:"translateX(-5px)"}}/>
            </div>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>{m.bench}%</div><div style={{fontSize:9,color:C.textMuted}}>Team</div></div>
            <div style={{textAlign:"center"}}><div style={{fontSize:11,color:C.scoreAmber,fontWeight:600,fontFamily:"'DM Mono',monospace"}}>{m.goal}%</div><div style={{fontSize:9,color:C.textMuted}}>Goal</div></div>
            <div style={{textAlign:"right"}}><div style={{fontSize:12,fontWeight:600,color:trendColor(m.tr),fontFamily:"'DM Mono',monospace"}}>{trendArrow(m.tr)} {Math.abs(m.tr).toFixed(1)}%</div><div style={{fontSize:9,color:C.textMuted}}>vs prior</div></div>
          </div>
        ))}
      </div>

      {/* 30-Day Progress */}
      <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",padding:"22px 24px",marginBottom:22}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
          <div style={{fontSize:15,fontWeight:600,color:C.navy}}>Your 30-Day Progress</div>
          <div style={{fontSize:11,color:C.textMuted}}>Feb 2 → Mar 2, 2026</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(5,1fr)",gap:11}}>
          {[{l:"Knowledge",from:72,to:76,d:4.2},{l:"Demeanor",from:79,to:82,d:2.8},{l:"Script",from:72,to:71,d:-1.3},{l:"Ease",from:60,to:60,d:0.1},{l:"Sentiment",from:53,to:50,d:-3.1}].map((p,i)=>(
            <div key={i} style={{textAlign:"center",padding:"14px 10px",borderRadius:9,border:`1px solid ${p.d>1?`rgba(34,197,94,0.2)`:C.gray100}`,background:p.d>1?C.greenMuted:"transparent"}}>
              <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.04em"}}>{p.l}</div>
              <div style={{display:"flex",justifyContent:"center",alignItems:"baseline",gap:5,marginTop:7}}>
                <span style={{fontSize:14,color:C.textMuted,fontFamily:"'DM Mono',monospace",textDecoration:"line-through"}}>{p.from}%</span>
                <span style={{fontSize:12,color:C.textMuted}}>→</span>
                <span style={{fontSize:20,fontWeight:700,color:p.d>0.5?C.scoreGreen:p.d<-0.5?C.scoreRed:C.textSecondary,fontFamily:"'DM Mono',monospace"}}>{p.to}%</span>
              </div>
              <div style={{marginTop:5,fontSize:11,fontWeight:600,color:trendColor(p.d),fontFamily:"'DM Mono',monospace"}}>{trendArrow(p.d)} {Math.abs(p.d).toFixed(1)}%{p.d>2?" 🎉":""}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Wins & Watch */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18,marginBottom:22}}>
        {/* Wins */}
        <div style={{background:C.white,borderRadius:11,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><span>⭐</span><span style={{fontSize:14,fontWeight:600,color:C.navy}}>Your Wins</span><span style={{fontSize:10,padding:"1px 7px",borderRadius:9,background:C.greenMuted,color:C.scoreGreen,fontWeight:700}}>13</span></div>
            <span style={{fontSize:11,color:C.teal,fontWeight:600,cursor:"pointer"}}>View all →</span>
          </div>
          {[{d:"02/20",tag:"Hero Moment",tagC:C.scoreGreen,tagBg:C.greenMuted,s:"You resolved a complex multi-department scheduling issue in a single call.",ct:"Appointments & Scheduling"},
            {d:"02/18",tag:"Compliment",tagC:"#7C3AED",tagBg:C.purpleMuted,s:'"She was so thorough and patient explaining everything. I finally understand my bill."',ct:"Self Pay Balance",q:true},
            {d:"02/14",tag:"Hero Moment",tagC:C.scoreGreen,tagBg:C.greenMuted,s:"You proactively verified insurance was active before proceeding — prevented a billing issue.",ct:"Authorization"}
          ].map((m,i)=>(
            <div key={i} style={{padding:"12px 18px",borderBottom:`1px solid ${C.gray100}`,cursor:"pointer",transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",gap:7,marginBottom:5}}><span style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>{m.d}</span><span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:3,background:m.tagBg,color:m.tagC,textTransform:"uppercase"}}>{m.tag}</span></div>
              <div style={{fontSize:12,lineHeight:1.5,color:C.textSecondary}}>{m.q?<em style={{color:C.textPrimary,fontWeight:500}}>{m.s}</em>:m.s}</div>
              <div style={{fontSize:10,color:C.textMuted,marginTop:3}}>{m.ct}</div>
              <div onClick={()=>navigate("calldetail",{call:managerCalls[0]})} style={{fontSize:11,color:C.teal,fontWeight:600,marginTop:5,cursor:"pointer"}}>▶ Listen to this call →</div>
            </div>
          ))}
        </div>

        {/* Watch */}
        <div style={{background:C.white,borderRadius:11,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"14px 18px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
            <div style={{display:"flex",alignItems:"center",gap:7}}><span>🎯</span><span style={{fontSize:14,fontWeight:600,color:C.navy}}>Areas to Watch</span><span style={{fontSize:10,padding:"1px 7px",borderRadius:9,background:C.amberMuted,color:C.scoreAmber,fontWeight:700}}>8</span></div>
            <span style={{fontSize:11,color:C.teal,fontWeight:600,cursor:"pointer"}}>View all →</span>
          </div>
          {[{d:"02/23",tag:"Concern",tagC:C.scoreAmber,tagBg:C.amberMuted,s:"Patient expressed confusion about charges but wasn't given a clear explanation before being transferred.",ct:"Self Pay Balance"},
            {d:"02/21",tag:"Compliance",tagC:C.scoreRed,tagBg:C.redMuted,s:"Insurance info provided without verifying it was current — could lead to claim denial.",ct:"Symptom/Health Advice"},
            {d:"02/19",tag:"Demeanor",tagC:"#B91C1C",tagBg:"rgba(239,68,68,0.06)",s:"Call ended abruptly after patient asked a follow-up question — Sentinel detected a rushed tone.",ct:"Billing and Payment"}
          ].map((m,i)=>(
            <div key={i} style={{padding:"12px 18px",borderBottom:`1px solid ${C.gray100}`,cursor:"pointer",transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
              <div style={{display:"flex",gap:7,marginBottom:5}}><span style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>{m.d}</span><span style={{fontSize:9,fontWeight:700,padding:"1px 6px",borderRadius:3,background:m.tagBg,color:m.tagC,textTransform:"uppercase"}}>{m.tag}</span></div>
              <div style={{fontSize:12,lineHeight:1.5,color:C.textSecondary}}>{m.s}</div>
              <div style={{fontSize:10,color:C.textMuted,marginTop:3}}>{m.ct}</div>
              <div onClick={()=>navigate("calldetail",{call:managerCalls[0]})} style={{fontSize:11,color:C.teal,fontWeight:600,marginTop:5,cursor:"pointer"}}>▶ Review this call →</div>
            </div>
          ))}
        </div>
      </div>

      {/* Learn From Your Calls */}
      <div style={{background:C.white,borderRadius:11,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
        <div style={{padding:"14px 18px",borderBottom:`1px solid ${C.gray100}`}}>
          <div style={{fontSize:15,fontWeight:600,color:C.navy}}>Learn From Your Calls</div>
          <div style={{fontSize:11,color:C.textMuted,marginTop:2}}>Compare your best and worst to spot what works</div>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr"}}>
          <div>
            <div style={{padding:"9px 18px",background:C.greenMuted,fontSize:11,fontWeight:700,color:C.scoreGreen,textTransform:"uppercase",letterSpacing:"0.04em"}}>⭐ Your Best — What You Did Right</div>
            {[{d:"02/18",cat:"Authorization",insight:"Opened with empathy, verified insurance proactively, closed with clear next steps.",sc:92},
              {d:"02/15",cat:"Appointments & Scheduling",insight:"Handled complex reschedule without transferring. Patient praised thoroughness.",sc:89},
              {d:"02/12",cat:"Self Pay Balance",insight:"Explained billing clearly, offered payment options proactively.",sc:87}
            ].map((c,i)=>(
              <div key={i} style={{padding:"11px 18px",borderBottom:`1px solid ${C.gray100}`,display:"grid",gridTemplateColumns:"1fr auto",gap:10,cursor:"pointer",transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>{c.d}</div>
                  <div style={{fontSize:12,fontWeight:500,marginTop:1}}>{c.cat}</div>
                  <div style={{fontSize:11,color:C.textSecondary,marginTop:3,lineHeight:1.45}}>{c.insight}</div>
                  <div style={{fontSize:10,color:C.teal,fontWeight:600,marginTop:4}}>▶ Listen →</div>
                </div>
                <div style={{textAlign:"right"}}><span style={{fontSize:16,fontWeight:700,color:C.scoreGreen,fontFamily:"'DM Mono',monospace"}}>{c.sc}%</span></div>
              </div>
            ))}
          </div>
          <div style={{borderLeft:`1px solid ${C.gray200}`}}>
            <div style={{padding:"9px 18px",background:C.redMuted,fontSize:11,fontWeight:700,color:C.scoreRed,textTransform:"uppercase",letterSpacing:"0.04em"}}>🎯 Toughest — What to Try Next Time</div>
            {[{d:"02/19",cat:"Self Pay Balance",insight:'Patient expressed confusion early but response focused on policy. Try: Acknowledge frustration first.',sc:38},
              {d:"02/16",cat:"Post-Procedure/Discharge",insight:'Patient had multiple questions but was rushed. Try: "What other questions do you have?"',sc:42},
              {d:"02/11",cat:"Emergencies & Urgent",insight:"Accurate info but clinical tone. Try: Match the patient's emotional energy first.",sc:45}
            ].map((c,i)=>(
              <div key={i} style={{padding:"11px 18px",borderBottom:`1px solid ${C.gray100}`,display:"grid",gridTemplateColumns:"1fr auto",gap:10,cursor:"pointer",transition:"background 0.1s"}} onMouseEnter={e=>e.currentTarget.style.background=C.gray50} onMouseLeave={e=>e.currentTarget.style.background="transparent"}>
                <div>
                  <div style={{fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}>{c.d}</div>
                  <div style={{fontSize:12,fontWeight:500,marginTop:1}}>{c.cat}</div>
                  <div style={{fontSize:11,color:C.textSecondary,marginTop:3,lineHeight:1.45}}>{c.insight}</div>
                  <div style={{fontSize:10,color:C.teal,fontWeight:600,marginTop:4}}>▶ Listen →</div>
                </div>
                <div style={{textAlign:"right"}}><span style={{fontSize:16,fontWeight:700,color:C.scoreRed,fontFamily:"'DM Mono',monospace"}}>{c.sc}%</span></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Stagger>
  </div></PageTransition>;
};

// ═══════════════════════════════════════════════════════════
// SCREEN 5: CALL DETAIL
// ═══════════════════════════════════════════════════════════
const CallDetail = ({ navigate, params }) => {
  const call = params.call || managerCalls[0];
  const scCol = (v) => v >= 80 ? C.scoreGreen : v >= 70 ? C.scoreAmber : C.scoreRed;
  const scBg = (v) => v >= 80 ? C.greenMuted : v >= 70 ? C.amberMuted : C.redMuted;
  const scBar = (v) => v >= 80 ? C.green : v >= 70 ? C.amber : C.red;

  const emotions = [
    { t: "0:05", label: "Tense", color: C.scoreRed, dot: "#F87171", desc: "Nervous about whether insurance will cover procedure" },
    { t: "0:24", label: "Anxious", color: C.scoreAmber, dot: "#FBBF24", desc: "Expressed frustration about unexpected balance amount" },
    { t: "2:30", label: "Relieved", color: C.scoreGreen, dot: "#4ADE80", desc: "Grateful for clear explanation of billing breakdown" },
    { t: "4:15", label: "Satisfied", color: "#2563EB", dot: "#60A5FA", desc: "Payment plan agreed, patient feels informed and in control" },
    { t: "6:10", label: "Happy", color: C.scoreGreen, dot: "#4ADE80", desc: "Compliments the service and recommends the hospital" },
  ];

  const scriptChecks = [
    { pass: false, text: "Representative stated the hospital/organization name" },
    { pass: true, text: "For outbound calls: stated the reason for calling" },
    { pass: false, text: "Representative verified the patient's date of birth" },
    { pass: true, text: "Representative verified the patient's name" },
    { pass: true, text: "Representative stated their name" },
  ];

  const metrics = [
    { l: "Script Adherence", v: call.script, bench: 72, sub: "3/5 checks" },
    { l: "Ease", v: call.ease, bench: 75 },
    { l: "Demeanor", v: call.demeanor, bench: 78 },
    { l: "Knowledge", v: call.knowledge, bench: 82 },
    { l: "Sentiment Trajectory", v: Math.round((call.sentEnd / 100) * 100), bench: 65, sub: call.sentStart < call.sentEnd ? "Improved" : "Declined" },
  ];

  const hasCompliance = call.events.some(e => e.t === "compliance");
  const sentImproved = call.sentEnd > call.sentStart;

  return <PageTransition k="calldetail"><div style={{maxWidth:1320,margin:"0 auto",padding:"18px 28px 100px"}}>
    {/* Breadcrumb */}
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{display:"flex",alignItems:"center",gap:6,fontSize:13,color:C.textMuted}}>
        <span onClick={()=>navigate("manager")} style={{color:C.teal,cursor:"pointer",fontWeight:500}}>Call List</span>
        <span style={{color:C.gray300}}>›</span>
        <span onClick={()=>navigate("supervisor")} style={{color:C.teal,cursor:"pointer",fontWeight:500}}>{call.team}</span>
        <span style={{color:C.gray300}}>›</span>
        <span style={{color:C.textSecondary,fontWeight:600}}>Call {call.date} — {call.rep}</span>
      </div>
      <div style={{display:"flex",gap:6}}>
        <button style={{padding:"5px 12px",fontSize:12,color:C.textSecondary,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:6,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>← Previous</button>
        <button style={{padding:"5px 12px",fontSize:12,color:C.textSecondary,background:C.white,border:`1px solid ${C.gray200}`,borderRadius:6,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>Next →</button>
      </div>
    </div>

    {/* Identity Bar */}
    <div style={{background:C.navy,borderRadius:12,padding:"18px 24px",display:"flex",alignItems:"center",gap:20,marginBottom:16,color:C.white}}>
      <div style={{width:46,height:46,borderRadius:"50%",background:C.slate,display:"flex",alignItems:"center",justifyContent:"center",fontSize:15,fontWeight:700,color:C.gray300,flexShrink:0}}>{call.rep.split(" ").map(n=>n[0]).join("")}</div>
      <div style={{flex:1}}>
        <div style={{fontSize:17,fontWeight:700}}>{call.rep}</div>
        <div style={{display:"flex",gap:20,marginTop:4,fontSize:12,color:C.gray400}}>
          <span>Team <span style={{color:C.gray200,fontWeight:500}}>{call.team}</span></span>
          <span>Date <span style={{color:C.gray200,fontWeight:500}}>{call.date}/2026</span></span>
          <span>Duration <span style={{color:C.gray200,fontWeight:500}}>{call.dur}</span></span>
          <span>Category <span style={{color:C.gray200,fontWeight:500}}>{call.cat}</span></span>
        </div>
      </div>
      <div style={{textAlign:"center",padding:"8px 18px",borderRadius:10,background:call.score>=80?"rgba(34,197,94,0.15)":call.score>=70?"rgba(245,158,11,0.15)":"rgba(239,68,68,0.15)"}}>
        <div style={{fontSize:9,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.06em",fontWeight:600}}>Smart Score</div>
        <div style={{fontSize:26,fontWeight:700,fontFamily:"'DM Mono',monospace",color:call.score>=80?"#86EFAC":call.score>=70?"#FBBF24":"#FCA5A5"}}>{call.score}%</div>
      </div>
    </div>

    {/* Flags Row */}
    <div style={{display:"grid",gridTemplateColumns:`repeat(${hasCompliance ? 4 : 3},1fr)`,gap:10,marginBottom:18}}>
      {hasCompliance && <div style={{padding:"12px 14px",borderRadius:10,display:"flex",alignItems:"flex-start",gap:10,background:C.redMuted,border:"1px solid rgba(239,68,68,0.15)"}}>
        <span style={{fontSize:16}}>⚠</span>
        <div><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.scoreRed,marginBottom:3}}>Compliance</div>
        <div style={{fontSize:12,lineHeight:1.45,color:C.textSecondary}}>Rep offered 90% discount, in excess of 50% limit for prompt pay</div></div>
      </div>}
      <div style={{padding:"12px 14px",borderRadius:10,display:"flex",alignItems:"flex-start",gap:10,background:C.amberMuted,border:"1px solid rgba(245,158,11,0.2)"}}>
        <span style={{fontSize:16}}>⚡</span>
        <div><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.scoreAmber,marginBottom:3}}>Patient Concern</div>
        <div style={{fontSize:12,lineHeight:1.45,color:C.textSecondary}}><em style={{color:C.textPrimary,fontWeight:500}}>"Nobody warned me that I would owe $6000"</em></div></div>
      </div>
      <div style={{padding:"12px 14px",borderRadius:10,display:"flex",alignItems:"flex-start",gap:10,background:C.greenMuted,border:"1px solid rgba(34,197,94,0.15)"}}>
        <span style={{fontSize:16}}>⭐</span>
        <div><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:C.scoreGreen,marginBottom:3}}>Compliment</div>
        <div style={{fontSize:12,lineHeight:1.45,color:C.textSecondary}}><em style={{color:C.textPrimary,fontWeight:500}}>"I'm telling all my friends about this hospital."</em></div></div>
      </div>
      <div style={{padding:"12px 14px",borderRadius:10,display:"flex",alignItems:"flex-start",gap:10,background:C.purpleMuted,border:"1px solid rgba(139,92,246,0.15)"}}>
        <span style={{fontSize:16}}>💡</span>
        <div><div style={{fontSize:9,fontWeight:700,textTransform:"uppercase",letterSpacing:"0.06em",color:"#7C3AED",marginBottom:3}}>Coaching Tip</div>
        <div style={{fontSize:12,lineHeight:1.45,color:C.textSecondary}}>Acknowledge frustration earlier to build rapport before problem-solving</div></div>
      </div>
    </div>

    {/* Two Column Layout */}
    <div style={{display:"grid",gridTemplateColumns:"1fr 340px",gap:18}}>
      {/* LEFT COLUMN */}
      <div style={{display:"flex",flexDirection:"column",gap:18}}>

        {/* Audio Player + Emotion Strip */}
        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",padding:20}}>
          <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:10}}>
            <button style={{width:40,height:40,borderRadius:"50%",background:C.teal,display:"flex",alignItems:"center",justifyContent:"center",border:"none",cursor:"pointer",color:"white",fontSize:15,flexShrink:0,transition:"all 0.15s"}} onMouseEnter={e=>e.currentTarget.style.background=C.tealDark} onMouseLeave={e=>e.currentTarget.style.background=C.teal}>▶</button>
            <div style={{flex:1}}>
              <div style={{width:"100%",height:6,background:C.gray200,borderRadius:3,position:"relative",cursor:"pointer"}}>
                <div style={{height:"100%",width:"38%",background:C.teal,borderRadius:3}}/>
                <div style={{position:"absolute",top:-5,left:"38%",width:14,height:14,background:C.teal,border:`3px solid ${C.white}`,borderRadius:"50%",transform:"translateX(-50%)",boxShadow:"0 1px 4px rgba(0,0,0,0.15)"}}/>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",marginTop:4,fontSize:10,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}><span>2:29</span><span>{call.dur}</span></div>
            </div>
            <div style={{display:"flex",gap:6,flexShrink:0}}>
              <button style={{padding:"5px 10px",fontSize:11,color:C.textSecondary,background:C.gray100,border:"none",borderRadius:5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>1×</button>
              <button style={{padding:"5px 10px",fontSize:11,color:C.textSecondary,background:C.gray100,border:"none",borderRadius:5,cursor:"pointer",fontFamily:"'DM Sans',sans-serif"}}>🔊</button>
            </div>
          </div>
          {/* Emotion Strip */}
          <div style={{marginTop:12}}>
            <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em",marginBottom:6}}>Sentiment through call — click to jump</div>
            <div style={{display:"flex",height:28,borderRadius:6,overflow:"hidden",cursor:"pointer"}}>
              <div style={{width:"18%",background:"linear-gradient(90deg,#F87171,#FB923C)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.9)"}}>Tense</span></div>
              <div style={{width:"22%",background:"linear-gradient(90deg,#FB923C,#FBBF24)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.9)"}}>Anxious</span></div>
              <div style={{width:"30%",background:"linear-gradient(90deg,#FBBF24,#4ADE80)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.9)"}}>Improving</span></div>
              <div style={{width:"30%",background:"linear-gradient(90deg,#4ADE80,#22C55E)",display:"flex",alignItems:"center",justifyContent:"center"}}><span style={{fontSize:9,fontWeight:600,color:"rgba(255,255,255,0.9)"}}>Happy / Calm</span></div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:3,fontSize:9,color:C.textMuted,fontFamily:"'DM Mono',monospace"}}><span>0:00</span><span>1:10</span><span>2:30</span><span>4:30</span><span>{call.dur}</span></div>
          </div>
        </div>

        {/* Performance Metrics Grid */}
        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
            <span style={{fontSize:14,fontWeight:600,color:C.navy}}>Performance Metrics</span>
            <div style={{display:"flex",alignItems:"center",gap:10,fontSize:10,color:C.textMuted}}>
              <span style={{display:"flex",alignItems:"center",gap:3}}><span style={{width:2,height:10,background:C.gray400,borderRadius:1,display:"inline-block"}}/>Rep 30-day avg</span>
            </div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)"}}>
            {metrics.map((m, i) => {
              const diff = m.v - m.bench;
              return <div key={i} style={{padding:"16px 18px",borderBottom:i<3?`1px solid ${C.gray100}`:"none",borderRight:(i%3!==2)?`1px solid ${C.gray100}`:"none"}}>
                <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>{m.l}</div>
                <div style={{display:"flex",alignItems:"baseline",gap:8,marginTop:6}}>
                  <span style={{fontSize:28,fontWeight:700,fontFamily:"'DM Mono',monospace",letterSpacing:"-0.02em",lineHeight:1,color:scCol(m.v)}}>{m.v}%</span>
                  {m.sub && <span style={{fontSize:11,color:C.textMuted}}>{m.sub}</span>}
                </div>
                <div style={{marginTop:8,height:4,background:C.gray100,borderRadius:2,position:"relative"}}>
                  <div style={{height:"100%",borderRadius:2,width:`${m.v}%`,background:scBar(m.v)}}/>
                  <div style={{position:"absolute",top:-4,left:`${m.bench}%`,width:2,height:12,background:C.gray400,borderRadius:1}}/>
                </div>
                <div style={{fontSize:10,color:C.textMuted,marginTop:5}}>Rep avg: {m.bench}% · <span style={{color:diff>=0?C.scoreGreen:C.scoreRed,fontWeight:600}}>{Math.abs(diff)} pts {diff>=0?"above":"below"}{diff>=20?" 🎉":""}</span></div>
              </div>;
            })}
            {/* Payment Outcome cell */}
            <div style={{padding:"16px 18px"}}>
              <div style={{fontSize:10,fontWeight:600,color:C.textMuted,textTransform:"uppercase",letterSpacing:"0.05em"}}>Payment Outcome</div>
              <div style={{marginTop:8,padding:"14px 18px",borderRadius:10,display:"flex",alignItems:"center",gap:14,background:C.greenMuted,border:"1px solid rgba(34,197,94,0.15)"}}>
                <div style={{fontSize:24,fontWeight:700,fontFamily:"'DM Mono',monospace",color:C.scoreGreen}}>$600</div>
                <div><div style={{fontSize:12,color:C.textSecondary}}>Payment collected</div><div style={{fontSize:10,color:C.textMuted}}>Outside policy discount applied</div></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sentiment Trajectory 2D Plot */}
        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
            <span style={{fontSize:14,fontWeight:600,color:C.navy}}>Sentiment Trajectory</span>
            <span style={{fontSize:11,color:C.textMuted}}>Emotional arc during this call</span>
          </div>
          <div style={{padding:20}}>
            <div style={{position:"relative",width:"100%",height:260,borderRadius:10,overflow:"hidden",background:"linear-gradient(180deg,rgba(34,197,94,0.08) 0%,rgba(255,255,255,0.02) 50%,rgba(239,68,68,0.08) 100%)"}}>
              {/* Cross lines */}
              <div style={{position:"absolute",top:0,left:"50%",width:1,height:"100%",background:C.gray200}}/>
              <div style={{position:"absolute",top:"50%",left:0,width:"100%",height:1,background:C.gray200}}/>
              {/* Axis labels */}
              <span style={{position:"absolute",top:8,left:"50%",transform:"translateX(-50%)",fontSize:10,fontWeight:600,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.05em"}}>Affirmed ↑</span>
              <span style={{position:"absolute",bottom:8,left:"50%",transform:"translateX(-50%)",fontSize:10,fontWeight:600,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.05em"}}>Adverse ↓</span>
              <span style={{position:"absolute",left:8,top:"50%",transform:"translateY(-50%) rotate(-90deg)",fontSize:10,fontWeight:600,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.05em"}}>Disruptive</span>
              <span style={{position:"absolute",right:8,top:"50%",transform:"translateY(-50%) rotate(90deg)",fontSize:10,fontWeight:600,color:C.gray400,textTransform:"uppercase",letterSpacing:"0.05em"}}>Calm</span>
              {/* SVG Path */}
              <svg style={{position:"absolute",inset:0,width:"100%",height:"100%",zIndex:2}}>
                <defs><linearGradient id="trajGrad" x1="0%" y1="0%" x2="100%"><stop offset="0%" style={{stopColor:"#F87171"}}/><stop offset="40%" style={{stopColor:"#FBBF24"}}/><stop offset="100%" style={{stopColor:"#22C55E"}}/></linearGradient></defs>
                <path d="M 100,200 C 160,155 240,125 330,110 C 420,95 490,75 560,60" fill="none" stroke="url(#trajGrad)" strokeWidth="3" strokeLinecap="round"/>
              </svg>
              {/* Nodes */}
              <div style={{position:"absolute",left:100,top:200,width:14,height:14,borderRadius:"50%",background:"#F87171",border:`3px solid ${C.white}`,boxShadow:"0 2px 6px rgba(0,0,0,0.15)",zIndex:3,transform:"translate(-50%,-50%)"}}/>
              <div style={{position:"absolute",left:100,top:218,transform:"translateX(-50%)",fontSize:10,fontWeight:600,color:C.scoreRed,whiteSpace:"nowrap",zIndex:4,textAlign:"center"}}>Call Start<br/><span style={{fontWeight:400,fontSize:9,color:C.textMuted}}>Tense · Adverse</span></div>
              <div style={{position:"absolute",left:330,top:110,width:14,height:14,borderRadius:"50%",background:"#FBBF24",border:`3px solid ${C.white}`,boxShadow:"0 2px 6px rgba(0,0,0,0.15)",zIndex:3,transform:"translate(-50%,-50%)"}}/>
              <div style={{position:"absolute",left:330,top:88,transform:"translateX(-50%)",fontSize:10,fontWeight:600,color:C.scoreAmber,whiteSpace:"nowrap",zIndex:4,textAlign:"center"}}>2:30 — Improving<br/><span style={{fontWeight:400,fontSize:9,color:C.textMuted}}>Rep explains balance</span></div>
              <div style={{position:"absolute",left:560,top:60,width:14,height:14,borderRadius:"50%",background:"#22C55E",border:`3px solid ${C.white}`,boxShadow:"0 2px 6px rgba(0,0,0,0.15)",zIndex:3,transform:"translate(-50%,-50%)"}}/>
              <div style={{position:"absolute",left:560,top:38,transform:"translateX(-50%)",fontSize:10,fontWeight:600,color:C.scoreGreen,whiteSpace:"nowrap",zIndex:4,textAlign:"center"}}>Call End<br/><span style={{fontWeight:400,fontSize:9,color:C.textMuted}}>Calm · Affirmed</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT SIDEBAR */}
      <div style={{display:"flex",flexDirection:"column",gap:18}}>
        {/* AI Call Summary */}
        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
            <span style={{fontSize:14,fontWeight:600,color:C.navy}}>✦ AI Call Summary</span>
          </div>
          <div style={{padding:"16px 20px"}}>
            <div style={{fontSize:13,lineHeight:1.65,color:C.textSecondary}}>
              Patient called <strong style={{color:C.textPrimary}}>extremely upset about the balance owed</strong>. The rep <strong style={{color:C.textPrimary}}>improved sentiment significantly</strong> by explaining the balance clearly. Rep offered a <strong style={{color:C.textPrimary}}>discount outside of policy</strong> and collected $600. Knowledge was strong throughout. Script adherence was low — <strong style={{color:C.textPrimary}}>missed hospital name and DOB verification</strong>.
            </div>
          </div>
        </div>

        {/* Script Adherence Detail */}
        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
            <span style={{fontSize:14,fontWeight:600,color:C.navy}}>Script Adherence</span>
            <span style={{fontSize:11,color:C.scoreRed,fontWeight:600}}>3/5 passed</span>
          </div>
          <div style={{padding:"10px 20px"}}>
            {scriptChecks.map((s, i) => (
              <div key={i} style={{display:"flex",alignItems:"flex-start",gap:8,padding:"9px 0",borderBottom:i<scriptChecks.length-1?`1px solid ${C.gray100}`:"none",fontSize:12,color:C.textSecondary}}>
                <span style={{fontSize:14,flexShrink:0,marginTop:1,color:s.pass?C.scoreGreen:C.scoreRed}}>{s.pass?"✓":"✕"}</span>
                {s.text}
              </div>
            ))}
          </div>
        </div>

        {/* Emotional Timeline */}
        <div style={{background:C.white,borderRadius:12,boxShadow:"0 1px 3px rgba(0,0,0,0.04)",overflow:"hidden"}}>
          <div style={{padding:"14px 20px",display:"flex",justifyContent:"space-between",alignItems:"center",borderBottom:`1px solid ${C.gray100}`}}>
            <span style={{fontSize:14,fontWeight:600,color:C.navy}}>Emotional Timeline</span>
            <span style={{fontSize:11,color:C.textMuted}}>Click to jump</span>
          </div>
          <div style={{padding:"14px 20px"}}>
            <div style={{position:"relative",paddingLeft:18}}>
              <div style={{position:"absolute",left:5,top:6,bottom:6,width:2,background:C.gray200,borderRadius:1}}/>
              {emotions.map((em, i) => (
                <div key={i} style={{position:"relative",padding:"8px 0 8px 16px"}}>
                  <div style={{position:"absolute",left:-14,top:12,width:10,height:10,borderRadius:"50%",background:em.dot,border:`2px solid ${C.white}`,boxShadow:`0 0 0 1px ${C.gray200}`}}/>
                  <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:C.textMuted}}>{em.t}</div>
                  <div style={{fontSize:12,fontWeight:600,marginTop:1,color:em.color}}>{em.label}</div>
                  <div style={{fontSize:11,color:C.textSecondary,lineHeight:1.4,marginTop:2}}>{em.desc}</div>
                  <div style={{fontSize:10,color:C.teal,fontWeight:600,cursor:"pointer",marginTop:3,display:"inline-flex",alignItems:"center",gap:3}}>▶ Jump to {em.t} →</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* Sticky Action Bar */}
    <div style={{position:"fixed",bottom:0,left:0,right:0,background:C.white,borderTop:`1px solid ${C.gray200}`,padding:"10px 28px",display:"flex",justifyContent:"center",gap:10,zIndex:100,boxShadow:"0 -2px 10px rgba(0,0,0,0.04)"}}>
      {[
        {l:"▶ Listen Again",bg:C.teal,c:C.white,hbg:C.tealDark},
        {l:"⚠ Flag for QA Review",bg:C.redMuted,c:C.scoreRed,border:"1px solid rgba(239,68,68,0.15)"},
        {l:"💡 Add to Coaching Plan",bg:C.purpleMuted,c:"#7C3AED",border:"1px solid rgba(139,92,246,0.15)"},
        {l:"📋 Training Library",bg:C.gray100,c:C.textSecondary},
        {l:"📄 Export PDF",bg:C.gray100,c:C.textSecondary},
      ].map((b,i) => (
        <button key={i} style={{padding:"8px 18px",fontSize:12,fontWeight:600,borderRadius:8,cursor:"pointer",fontFamily:"'DM Sans',sans-serif",transition:"all 0.15s",display:"flex",alignItems:"center",gap:6,border:b.border||"none",background:b.bg,color:b.c}}>{b.l}</button>
      ))}
    </div>
  </div></PageTransition>;
};

// ═══════════════════════════════════════════════════════════
// MAIN APP — Router
// ═══════════════════════════════════════════════════════════
export default function App() {
  const [screen, setScreen] = useState("manager");
  const [params, setParams] = useState({});

  const navigate = useCallback((s, p = {}) => {
    setParams(p);
    setScreen(s);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: C.gray50, fontFamily: "'DM Sans', sans-serif", color: C.textPrimary }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=DM+Mono:wght@400;500&family=Instrument+Serif&display=swap" rel="stylesheet" />
      <Header screen={screen} navigate={navigate} avatar={screen === "rep" ? "PP" : "ZB"} />
      {screen === "manager" && <ManagerDashboard navigate={navigate} />}
      {screen === "supervisor" && <SupervisorDashboard navigate={navigate} />}
      {screen === "outliers" && <OutlierEvents navigate={navigate} />}
      {screen === "rep" && <RepDashboard navigate={navigate} />}
      {screen === "calldetail" && <CallDetail navigate={navigate} params={params} />}
    </div>
  );
}
