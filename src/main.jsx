import { StrictMode, useMemo, useState } from "react"
import { createRoot } from "react-dom/client"
import { ArrowUpRight, Check, ChevronRight, Download, GitBranch, Search, ShieldCheck, Sparkles, ThumbsUp, Zap } from "lucide-react"
import "./index.css"

const mods = [
  {
    id: "cet",
    title: "Cyber Engine Tweaks",
    short: "CET",
    platform: "PC Windows",
    description: "A scripting framework that unlocks deep customization and quality-of-life mods for Cyberpunk 2077.",
    status: "Stable",
    statusTone: "green",
    version: "v1.33.0",
    language: "Lua / C++",
    stars: "6.8k",
    likes: 128,
    repo: "https://github.com/maximegmd/CyberEngineTweaks",
    accent: "lime",
  },
  {
    id: "opensage",
    title: "OpenSAGE",
    short: "OS",
    platform: "Android APK",
    description: "An open-source reimplementation of the SAGE game engine built for classic strategy experiences.",
    status: "Beta",
    statusTone: "blue",
    version: "v0.9.8",
    language: "C# / OpenGL",
    stars: "3.1k",
    likes: 94,
    repo: "https://github.com/OpenSAGE/OpenSAGE",
    accent: "blue",
  },
  {
    id: "dxvk",
    title: "DXVK Renderer",
    short: "DX",
    platform: "PC Windows",
    description: "Vulkan-based Direct3D 9, 10 and 11 implementation for smoother legacy PC game performance.",
    status: "Stable",
    statusTone: "green",
    version: "v2.7",
    language: "C++ / Vulkan",
    stars: "11.4k",
    likes: 211,
    repo: "https://github.com/doitsujin/dxvk",
    accent: "lime",
  },
  {
    id: "openmw",
    title: "OpenMW",
    short: "OM",
    platform: "Android APK",
    description: "A modern, cross-platform reimplementation of the Morrowind engine with touch-ready controls.",
    status: "Stable",
    statusTone: "green",
    version: "v0.49.0",
    language: "C++ / Lua",
    stars: "4.9k",
    likes: 167,
    repo: "https://github.com/OpenMW/openmw",
    accent: "blue",
  },
  {
    id: "proton",
    title: "Proton-GE",
    short: "PG",
    platform: "PC Windows",
    description: "Community-built compatibility tools and patches that keep more games running beautifully.",
    status: "Active",
    statusTone: "violet",
    version: "GE-Proton 10-20",
    language: "C / Wine",
    stars: "8.2k",
    likes: 183,
    repo: "https://github.com/GloriousEggroll/proton-ge-custom",
    accent: "lime",
  },
]

const tabs = ["All", "Android APK", "PC Windows"]

function App() {
  const [activeTab, setActiveTab] = useState("All")
  const [query, setQuery] = useState("")
  const [votes, setVotes] = useState(() => Object.fromEntries(mods.map((mod) => [mod.id, mod.likes])))
  const [liked, setLiked] = useState({})

  const filteredMods = useMemo(() => mods.filter((mod) => {
    const matchesTab = activeTab === "All" || mod.platform === activeTab
    const search = query.trim().toLowerCase()
    const matchesQuery = !search || `${mod.title} ${mod.description} ${mod.platform} ${mod.language}`.toLowerCase().includes(search)
    return matchesTab && matchesQuery
  }), [activeTab, query])

  function upvote(id) {
    setVotes((current) => ({ ...current, [id]: current[id] + (liked[id] ? -1 : 1) }))
    setLiked((current) => ({ ...current, [id]: !current[id] }))
  }

  return (
    <div className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />
      <header className="site-header">
        <a className="brand" href="#top" aria-label="ModForge home"><span className="brand-mark"><Zap size={17} fill="currentColor" /></span><span>MOD<span>FORGE</span></span></a>
        <nav className="desktop-nav" aria-label="Primary navigation"><a className="active" href="#explore">Explore</a><a href="#how-it-works">How it works</a><a href="#community">Community</a></nav>
        <a className="github-link" href="https://github.com" target="_blank" rel="noreferrer"><GitBranch size={17} /> <span>GitHub</span> <ArrowUpRight size={15} /></a>
      </header>

      <main id="top">
        <section className="hero" id="explore">
          <div className="eyebrow"><span className="pulse-dot" /> OPEN SOURCE MODDING HUB</div>
          <h1>MOD YOUR<br /><span>WORLD.</span></h1>
          <p className="hero-copy">Discover, share, and supercharge your games with<br className="desktop-only" /> community-built mods and optimization tools.</p>
          <div className="hero-stats"><div><strong>2,480<span>+</span></strong><small>MODS INDEXED</small></div><div><strong>18k<span>+</span></strong><small>ACTIVE MODDERS</small></div><div><strong>99.9<span>%</span></strong><small>UPTIME</small></div></div>
        </section>

        <section className="catalog-section" aria-labelledby="catalog-title">
          <div className="section-heading"><div><p className="section-kicker">// COMMUNITY CATALOG</p><h2 id="catalog-title">FIND YOUR <span>NEXT BUILD.</span></h2></div><div className="live-status"><span className="pulse-dot" /> LIVE DIRECTORY <b>●</b></div></div>
          <div className="toolbar"><div className="search-wrap"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search mods, tools, engines..." aria-label="Search mods" /></div><div className="tabs" role="tablist" aria-label="Filter by platform">{tabs.map((tab) => <button key={tab} className={activeTab === tab ? "tab active" : "tab"} onClick={() => setActiveTab(tab)} role="tab" aria-selected={activeTab === tab}>{tab}</button>)}</div></div>
          <div className="catalog-meta"><span>SHOWING <b>{filteredMods.length}</b> OF {mods.length} MODS</span><span className="sort-label">SORTED BY <b>POPULARITY</b> <ChevronRight size={14} /></span></div>
          <div className="mod-grid">{filteredMods.map((mod) => <ModCard key={mod.id} mod={mod} votes={votes[mod.id]} isLiked={liked[mod.id]} onUpvote={() => upvote(mod.id)} />)}</div>
          {filteredMods.length === 0 && <div className="empty-state"><Sparkles size={24} /><p>No builds found in this sector.</p><button onClick={() => { setQuery(""); setActiveTab("All") }}>Reset filters</button></div>}
        </section>

        <section className="manifesto" id="how-it-works"><div className="manifesto-icon"><ShieldCheck size={26} /></div><div><p className="section-kicker">// BUILT BY THE COMMUNITY</p><h2>OPEN SOURCE.<br /><span>OPEN POSSIBILITIES.</span></h2></div><p className="manifesto-copy">Every build is community-reviewed, transparently versioned, and ready for your next session. No gatekeeping. Just better games.</p></section>
      </main>
      <footer id="community"><span>MODFORGE / COMMUNITY-POWERED GAMING INFRASTRUCTURE</span><span>STATUS: <b>ALL SYSTEMS NOMINAL</b></span></footer>
    </div>
  )
}

function ModCard({ mod, votes, isLiked, onUpvote }) {
  return <article className={`mod-card ${mod.accent}`}>
    <div className="card-top"><div className="mod-icon">{mod.short}</div><div className="card-tags"><span className="platform-tag">{mod.platform}</span><span className={`status-tag ${mod.statusTone}`}><Check size={12} /> {mod.status}</span></div></div>
    <h3>{mod.title}</h3><p className="description">{mod.description}</p>
    <div className="card-details"><span>{mod.version}</span><span>{mod.language}</span><span><GitBranch size={13} /> {mod.stars}</span></div>
    <div className="card-footer"><button className={isLiked ? "vote-button voted" : "vote-button"} onClick={onUpvote} aria-label={`Upvote ${mod.title}`}><ThumbsUp size={16} fill={isLiked ? "currentColor" : "none"} /> <span>{votes}</span></button><a className="download-button" href={mod.repo} target="_blank" rel="noreferrer">Download <Download size={15} /></a></div>
  </article>
}

createRoot(document.getElementById("root")).render(<StrictMode><App /></StrictMode>)
