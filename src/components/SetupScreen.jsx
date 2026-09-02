/**
 * SetupScreen — VALORANT Overlay Studio with Real-time Theme & Layout Customizer.
 *
 * Features:
 *   - Sidebar Navigation Tabs:
 *       1. Dashboard & Data (Player profile, Riot ID, region, HenrikDev API key & display elements)
 *       2. Themes & Real-Time Studio (Live Previewer, theme selector, layouts, and tuning controls)
 *       3. OBS Integration (Browser Source URL and setup instructions)
 */

import { useState, useEffect } from "react";
import { ArrowLeft, Check, ChevronDown, ChevronUp, Copy, CreditCard, Gem, LayoutDashboard, Palette, PanelTop, Radio, Shield, Sparkles } from "lucide-react";
import { loadApiKey, saveApiKey, clearApiKey } from "../utils/storage";
import { buildObsUrl } from "../App";
import { VALORANT_LAYOUTS, VALORANT_THEMES } from "../data/themeRegistry";
import ErrorBanner from "./ErrorBanner";
import Overlay from "./Overlay";

const REGIONS = [
  { value: "na", label: "North America (NA)" },
  { value: "eu", label: "Europe (EU)" },
  { value: "ap", label: "Asia Pacific (AP)" },
  { value: "kr", label: "Korea (KR)" },
  { value: "latam", label: "Latin America (LATAM)" },
  { value: "br", label: "Brazil (BR)" },
];

const GAMEPLAY_BACKDROPS = [
  { id: "haven", label: "Haven Site", bg: "url('https://cdn.gracza.pl/galeria/Html/Poradniki/2048/402724625.jpg') center/cover no-repeat" },
  { id: "ascent", label: "Ascent Mid", bg: "url('https://www.gamepressure.com/valorant/gfx/word/128542578.jpg') center/cover no-repeat" },
  { id: "bind", label: "Bind Teleporter", bg: "url('https://cdn.ligadosgames.com/imagens/bind-2-valorant-cke.jpg?class=article') center/cover no-repeat" },
  { id: "gameplay", label: "Gameplay Scene", bg: "url('https://trackercdn.com/ghost/images/2020/7/161752_ezgif.com-webp-to-jpg%20%2817%29.jpg') center/cover no-repeat" },
];

const SIDEBAR_TABS = [
  { id: "dashboard", label: "Dashboard & Data", Icon: LayoutDashboard, badge: "Core" },
  { id: "themes", label: "Themes & Layout Studio", Icon: Palette, badge: "Live Edits" },
  { id: "export", label: "OBS Integration", Icon: Radio, badge: "URL" },
];

const LAYOUT_ICONS = { card: CreditCard, capsule: PanelTop, banner: PanelTop, minimal: Shield };

export default function SetupScreen({
  config,
  onConfigChange,
  onLaunch,
  apiKey,
  onApiKeyChange,
  onChangeGame,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [keyInput, setKeyInput] = useState(apiKey || "");
  const [remember, setRemember] = useState(!!loadApiKey());
  const [error, setError] = useState(null);
  const [keyValid, setKeyValid] = useState(!!apiKey);
  const [copied, setCopied] = useState(false);
  const [previewBg, setPreviewBg] = useState("haven");
  const [liquidGlassExpanded, setLiquidGlassExpanded] = useState(true);

  useEffect(() => {
    if (apiKey) {
      setKeyInput(apiKey);
      setKeyValid(true);
    }
  }, [apiKey]);

  const handleConnect = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setError({ type: "auth", message: "Please enter an API key." });
      return;
    }
    if (trimmed.length < 10) {
      setError({
        type: "auth",
        message: "API key seems too short. Check your key.",
      });
      return;
    }

    setError(null);
    setKeyValid(true);
    onApiKeyChange(trimmed);

    if (remember) {
      saveApiKey(trimmed);
    } else {
      clearApiKey();
    }
  };

  const handleClearKey = () => {
    clearApiKey();
    setKeyInput("");
    setKeyValid(false);
    setRemember(false);
    onApiKeyChange("");
    setError(null);
  };

  const handleFieldChange = (name, value) => {
    onConfigChange({ ...config, [name]: value });
  };

  const handleDisplayToggle = (field) => {
    onConfigChange({
      ...config,
      displayFields: {
        ...config.displayFields,
        [field]: !config.displayFields[field],
      },
    });
  };

  const canLaunch = keyValid && config.playerName && config.playerTag;
  const activeBackdrop = GAMEPLAY_BACKDROPS.find((b) => b.id === previewBg) || GAMEPLAY_BACKDROPS[0];

  return (
    <div style={s.pageWrapper} className="site-ui studio-page">
      {/* ---------- Studio App Container ---------- */}
      <div style={s.studioApp} className="fade-in studio-app">
        {/* ============================================================ */}
        {/* SIDEBAR NAVIGATION                                           */}
        {/* ============================================================ */}
        <aside style={s.sidebar} className="studio-sidebar">
          {/* Brand Logo Header */}
          <div style={s.sidebarBrand}>
            <div style={s.brandLogoMark}>
              <Sparkles size={22} aria-hidden="true" />
            </div>
            <div>
              <h2 style={s.brandTitle}>VALORANT</h2>
              <span style={s.brandTag}>Overlay Studio</span>
            </div>
          </div>

          {/* Navigation Items */}
          <nav style={s.sidebarNav}>
            {SIDEBAR_TABS.map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                style={{
                  ...s.navItem,
                  ...(activeTab === tab.id ? s.navItemActive : {}),
                }}
                id={`sidebar-tab-${tab.id}`}
              >
                <span style={s.navIcon}><tab.Icon size={16} aria-hidden="true" /></span>
                <span style={s.navLabel}>{tab.label}</span>
                {tab.badge && (
                  <span
                    style={{
                      ...s.navBadge,
                      ...(activeTab === tab.id ? s.navBadgeActive : {}),
                    }}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </nav>

          {/* Sidebar Footer */}
          <div style={s.sidebarFooter}>
            <div style={s.statusPill}>
              <span
                style={{
                  ...s.statusDot,
                  background: keyValid ? "#2dd4a8" : "var(--val-red)",
                }}
              />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>
                {keyValid ? "API Connected" : "API Required"}
              </span>
            </div>

            {onChangeGame && (
              <button
                type="button"
                onClick={onChangeGame}
                style={s.btnSwitchGame}
                id="sidebar-switch-game-btn"
              >
                <ArrowLeft size={15} aria-hidden="true" /> Switch Game
              </button>
            )}
          </div>
        </aside>

        {/* ============================================================ */}
        {/* MAIN STUDIO CONTENT PANEL                                    */}
        {/* ============================================================ */}
        <main style={s.contentPanel} className="studio-content">
          {/* Top Header Bar */}
          <div style={s.topHeader}>
            <div>
              <h1 style={s.headerTitle}>
                {SIDEBAR_TABS.find((t) => t.id === activeTab)?.label}
              </h1>
              <p style={s.headerSubtitle}>
                {activeTab === "themes" && "Customize Apple Liquid Glass themes, layouts & fine-tune settings with live real-time preview"}
                {activeTab === "dashboard" && "Configure player Riot ID, region, HenrikDev API credentials & displayed stats"}
                {activeTab === "export" && "Copy OBS Browser Source URL and view broadcast setup guide"}
              </p>
            </div>

            <button
              type="button"
              onClick={onLaunch}
              disabled={!canLaunch}
              style={{
                ...s.btnHeaderLaunch,
                opacity: canLaunch ? 1 : 0.4,
                cursor: canLaunch ? "pointer" : "not-allowed",
              }}
              id="header-launch-btn"
            >
              Launch OBS Overlay
            </button>
          </div>

          {/* Error Banner */}
          {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

          {/* ============================================================ */}
          {/* TAB 1: THEMES & LAYOUT STUDIO (WITH REAL-TIME PREVIEW)       */}
          {/* ============================================================ */}
          {activeTab === "themes" && (
            <div style={s.tabBody} className="fade-in">
              {/* REAL-TIME PREVIEW CANVAS (RIGHT AT TOP OF STUDIO) */}
              <section style={s.previewSection}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ ...s.sectionHeader, margin: 0 }}>
                    <Sparkles size={15} aria-hidden="true" /> Real-Time Live Gameplay Preview
                  </h3>
                  <div style={{ display: "flex", gap: "6px" }}>
                    {GAMEPLAY_BACKDROPS.map((b) => (
                      <button
                        key={b.id}
                        type="button"
                        onClick={() => setPreviewBg(b.id)}
                        style={{
                          ...s.backdropBtn,
                          ...(previewBg === b.id ? s.backdropBtnActive : {}),
                        }}
                        id={`backdrop-btn-${b.id}`}
                      >
                        {b.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div style={{ ...s.previewCanvas, background: activeBackdrop.bg }}>
                  <Overlay apiKey={apiKey} config={config} backdropBg={activeBackdrop?.bg} onBack={() => {}} />
                </div>
              </section>

              {/* PRIMARY CORE THEME ENGINE SELECTOR: APPLE LIQUID GLASS */}
              <section style={s.sectionBox}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ ...s.sectionHeader, margin: 0 }}>Active Core Theme Architecture</h3>
                  <span style={s.badgePill}>Core Engine</span>
                </div>

                {/* Primary Theme Card: Apple Liquid Glass */}
                <div
                  onClick={() => setLiquidGlassExpanded(!liquidGlassExpanded)}
                  style={{
                    ...s.coreThemeCard,
                    ...(liquidGlassExpanded ? s.coreThemeCardActive : {}),
                  }}
                  id="core-theme-liquid-glass-card"
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    <div style={s.coreThemeIcon}><Gem size={24} aria-hidden="true" /></div>
                    <div>
                      <h4 style={{ fontSize: 16, fontWeight: 800, color: "#fff", margin: 0 }}>
                        Glass Theme
                      </h4>
                      <p style={{ fontSize: 12, color: "rgba(255,255,255,0.65)", margin: "2px 0 0 0" }}>
                        Translucent specular glass with animated caustics & dynamic liquid refraction maps.
                      </p>
                    </div>
                  </div>

                  <button type="button" style={s.btnToggleExpand}>
                    {liquidGlassExpanded ? <><ChevronUp size={14} aria-hidden="true" /> Customizing</> : <><ChevronDown size={14} aria-hidden="true" /> Click to Customize</>}
                  </button>
                </div>

                {/* EXPANDABLE DETAILS UNDER APPLE LIQUID GLASS THEME */}
                {liquidGlassExpanded && (
                  <div style={s.expandedDetailsContainer} className="fade-in">
                    {/* 1. VISUAL COLOR PRESETS UNDER LIQUID GLASS */}
                    <div style={s.subSection}>
                      <h4 style={s.subHeader}>1. Visual Color Presets</h4>
                      <div style={s.themeGrid}>
                        {VALORANT_THEMES.map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => handleFieldChange("theme", t.id)}
                            style={{
                              ...s.themeCard,
                              ...(config.theme === t.id ? s.themeCardActive : {}),
                            }}
                            id={`theme-btn-${t.id}`}
                          >
                            <div style={{ ...s.themeSwatch, background: t.color }} />
                            <div style={{ textAlign: "left" }}>
                              <strong style={{ display: "block", fontSize: 13, color: "#fff" }}>
                                {t.name}
                              </strong>
                              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.6)" }}>
                                {t.desc}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. LAYOUT DESIGNS UNDER LIQUID GLASS */}
                    <div style={s.subSection}>
                      <h4 style={s.subHeader}>2. HUD Layout Designs & Structure</h4>
                      <div style={s.layoutGrid}>
                        {VALORANT_LAYOUTS.map((layoutItem) => (
                          <button
                            key={layoutItem.id}
                            type="button"
                            onClick={() => handleFieldChange("layout", layoutItem.id)}
                            style={{
                              ...s.layoutCard,
                              ...(config.layout === layoutItem.id ||
                              (!config.layout && layoutItem.id === "card")
                                ? s.layoutCardActive
                                : {}),
                            }}
                            id={`layout-btn-${layoutItem.id}`}
                          >
                            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                {(() => {
                                  const LayoutIcon = LAYOUT_ICONS[layoutItem.icon] || CreditCard;
                                  return <LayoutIcon size={18} aria-hidden="true" />;
                                })()}
                                <strong style={{ fontSize: 13, color: "#fff" }}>{layoutItem.name}</strong>
                              </div>
                              <span style={s.badgePill}>{layoutItem.badge}</span>
                            </div>
                            <span style={{ fontSize: 11, color: "rgba(255,255,255,0.65)", textAlign: "left", marginTop: 4 }}>
                              {layoutItem.desc}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 3. FINE-TUNING CONTROLS */}
                    <div style={s.subSection}>
                      <h4 style={s.subHeader}>3. Fine-Tuning & Edits</h4>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
                        {/* Glass Blur */}
                        <div style={s.inputGroup}>
                          <label style={s.label}>Frosted Glass Blur</label>
                          <select
                            value={config.glassBlur || "high"}
                            onChange={(e) => handleFieldChange("glassBlur", e.target.value)}
                            style={s.select}
                            id="blur-select"
                          >
                            <option value="high">Max Blur (12px)</option>
                            <option value="medium">Medium Blur (8px)</option>
                            <option value="low">Subtle Blur (4px)</option>
                          </select>
                        </div>

                        {/* Border Glass Lens Distortion */}
                        <div style={s.inputGroup}>
                          <label style={s.label}>Border Glass Lens Distortion</label>
                          <button
                            type="button"
                            onClick={() => handleFieldChange("refraction", !config.refraction)}
                            style={{
                              ...s.toggleChip,
                              background:
                                config.refraction !== false
                                  ? "rgba(45, 212, 168, 0.2)"
                                  : "rgba(255,255,255,0.06)",
                              borderColor:
                                config.refraction !== false
                                  ? "var(--val-success)"
                                  : "var(--val-border)",
                            }}
                            id="toggle-refraction-btn"
                          >
                            {config.refraction !== false ? <><Sparkles size={14} aria-hidden="true" /> Glass Lens ON</> : "Off"}
                          </button>
                        </div>

                        {/* Border Glass Lens Distortion Strength Slider */}
                        <div style={s.inputGroup}>
                          <label style={s.label}>
                            Border Lens Distortion Strength ({config.refractionPower ?? 18})
                          </label>
                          <input
                            type="range"
                            min="5"
                            max="50"
                            step="1"
                            value={config.refractionPower ?? 18}
                            disabled={config.refraction === false}
                            onChange={(e) =>
                              handleFieldChange("refractionPower", parseInt(e.target.value, 10))
                            }
                            style={{
                              accentColor: "var(--val-red)",
                              width: "100%",
                              cursor: config.refraction !== false ? "pointer" : "not-allowed",
                              opacity: config.refraction !== false ? 1 : 0.4,
                            }}
                            id="refraction-power-slider"
                          />
                        </div>

                        {/* Glass Lens Displacement Scale Slider */}
                        <div style={s.inputGroup}>
                          <label style={s.label}>
                            Displacement Scale ({config.displacementScale ?? Math.round((config.lensZoom ?? 1.0) * 100)})
                          </label>
                          <input
                            type="range"
                            min="100"
                            max="200"
                            step="1"
                            value={config.displacementScale ?? Math.round((config.lensZoom ?? 1.0) * 100)}
                            disabled={config.refraction === false}
                            onChange={(e) =>
                              handleFieldChange("displacementScale", parseInt(e.target.value, 10))
                            }
                            style={{
                              accentColor: "var(--val-red)",
                              width: "100%",
                              cursor: config.refraction !== false ? "pointer" : "not-allowed",
                              opacity: config.refraction !== false ? 1 : 0.4,
                            }}
                            id="displacement-scale-slider"
                          />
                        </div>

                        <div style={s.inputGroup}>
                          <label style={s.label}>
                            Overlay Corner Radius ({config.cornerRadius ?? 20}px)
                          </label>
                          <input
                            type="range"
                            min="0"
                            max="20"
                            step="1"
                            value={config.cornerRadius ?? 20}
                            onChange={(e) =>
                              handleFieldChange("cornerRadius", parseInt(e.target.value, 10))
                            }
                            style={{ accentColor: "var(--val-red)", width: "100%", cursor: "pointer" }}
                            id="overlay-radius-slider"
                          />
                        </div>

                        {/* Sheen Speed */}
                        <div style={s.inputGroup}>
                          <label style={s.label}>Sweep Light Sheen Speed</label>
                          <select
                            value={config.sheenSpeed || "normal"}
                            onChange={(e) => handleFieldChange("sheenSpeed", e.target.value)}
                            style={s.select}
                            id="sheen-select"
                          >
                            <option value="fast">Fast Sweep (3s)</option>
                            <option value="normal">Normal Sweep (6s)</option>
                            <option value="slow">Slow Sweep (10s)</option>
                            <option value="off">Disabled</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 2: DASHBOARD & DATA                                     */}
          {/* ============================================================ */}
          {activeTab === "dashboard" && (
            <div style={s.tabBody} className="fade-in">
              {/* API Key Section */}
              <section style={s.sectionBox}>
                <h3 style={s.sectionHeader}>
                  <span style={s.stepNum}>1</span> HenrikDev API Credentials
                </h3>
                <div style={s.inputGroup}>
                  <label htmlFor="api-key-input" style={s.label}>API Key</label>
                  <div style={s.inputRow}>
                    <input
                      id="api-key-input"
                      type="password"
                      value={keyInput}
                      onChange={(e) => setKeyInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleConnect()}
                      placeholder="HDEV-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                      style={{ ...s.input, ...s.monoInput }}
                    />
                    <button
                      type="button"
                      onClick={handleConnect}
                      style={s.btnPrimary}
                      id="connect-btn"
                    >
                      {keyValid ? <><Check size={14} aria-hidden="true" /> Connected</> : "Connect"}
                    </button>
                  </div>
                </div>

                <div style={s.checkRow}>
                  <label style={s.checkLabel}>
                    <input
                      type="checkbox"
                      checked={remember}
                      onChange={(e) => {
                        setRemember(e.target.checked);
                        if (!e.target.checked) clearApiKey();
                        else if (keyInput.trim()) saveApiKey(keyInput.trim());
                      }}
                      style={s.checkbox}
                      id="remember-key-checkbox"
                    />
                    Remember API key in browser
                  </label>
                  <button type="button" onClick={handleClearKey} style={s.btnGhost} id="clear-key-btn">
                    Clear key
                  </button>
                </div>
                <a
                  href="https://api.henrikdev.xyz/dashboard/"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={s.link}
                  id="get-api-key-link"
                >
                  Get free HenrikDev API key
                </a>
              </section>

              {/* Player Profile Section */}
              <section
                style={{
                  ...s.sectionBox,
                  opacity: keyValid ? 1 : 0.4,
                  pointerEvents: keyValid ? "auto" : "none",
                }}
              >
                <h3 style={s.sectionHeader}>
                  <span style={s.stepNum}>2</span> Player Profile & Region
                </h3>
                <div style={s.fieldGrid}>
                  <div style={s.inputGroup}>
                    <label htmlFor="player-name-input" style={s.label}>Riot ID Name</label>
                    <input
                      id="player-name-input"
                      type="text"
                      value={config.playerName}
                      onChange={(e) => handleFieldChange("playerName", e.target.value)}
                      placeholder="TenZ"
                      style={s.input}
                      maxLength={30}
                    />
                  </div>

                  <div style={s.inputGroup}>
                    <label htmlFor="player-tag-input" style={s.label}>Tag</label>
                    <input
                      id="player-tag-input"
                      type="text"
                      value={config.playerTag}
                      onChange={(e) => handleFieldChange("playerTag", e.target.value)}
                      placeholder="1"
                      style={s.input}
                      maxLength={10}
                    />
                  </div>

                  <div style={s.inputGroup}>
                    <label htmlFor="region-select" style={s.label}>Region</label>
                    <select
                      id="region-select"
                      value={config.region}
                      onChange={(e) => handleFieldChange("region", e.target.value)}
                      style={s.select}
                    >
                      {REGIONS.map((r) => (
                        <option key={r.value} value={r.value}>
                          {r.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </section>

              {/* Display Fields Toggles */}
              <section
                style={{
                  ...s.sectionBox,
                  opacity: keyValid ? 1 : 0.4,
                  pointerEvents: keyValid ? "auto" : "none",
                }}
              >
                <h3 style={s.sectionHeader}>
                  <span style={s.stepNum}>3</span> Displayed Stats & Badges
                </h3>
                <div style={s.toggleGrid}>
                  {[
                    { key: "rank", label: "Competitive Rank Emblem" },
                    { key: "rr", label: "Rank Rating (RR) & Delta" },
                    { key: "season", label: "Current Act / Season Tag" },
                    { key: "peakRank", label: "Peak Rank Tier Badge" },
                  ].map((item) => (
                    <label key={item.key} style={s.toggleLabel} id={`toggle-${item.key}`}>
                      <input
                        type="checkbox"
                        checked={config.displayFields[item.key]}
                        onChange={() => handleDisplayToggle(item.key)}
                        style={s.checkbox}
                      />
                      {item.label}
                    </label>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* ============================================================ */}
          {/* TAB 3: OBS INTEGRATION                                       */}
          {/* ============================================================ */}
          {activeTab === "export" && (
            <div style={s.tabBody} className="fade-in">
              <section style={s.sectionBox}>
                <h3 style={s.sectionHeader}>OBS Browser Source Integration</h3>
                <p style={{ fontSize: 13, color: "var(--val-cream-dim)", margin: 0 }}>
                  Copy your customized URL and paste it into OBS Studio: Sources, then Add Browser Source.
                </p>
                <div style={s.obsUrlRow}>
                  <input
                    type="text"
                    readOnly
                    value={buildObsUrl(apiKey, config)}
                    style={{ ...s.input, ...s.monoInput, fontSize: 11 }}
                    onFocus={(e) => e.target.select()}
                    id="obs-url-input"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(buildObsUrl(apiKey, config));
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    }}
                    style={s.btnPrimary}
                    id="copy-obs-url-btn"
                  >
                    {copied ? <><Check size={14} aria-hidden="true" /> Copied</> : <><Copy size={14} aria-hidden="true" /> Copy URL</>}
                  </button>
                </div>
              </section>

              <section style={s.sectionBox}>
                <h3 style={s.sectionHeader}>Recommended OBS Browser Settings</h3>
                <ul style={{ fontSize: 13, color: "rgba(255,255,255,0.75)", lineHeight: 1.6, paddingLeft: 20, margin: 0 }}>
                  <li><strong>Width</strong>: 600px</li>
                  <li><strong>Height</strong>: 200px</li>
                  <li><strong>FPS</strong>: 60 FPS</li>
                  <li><strong>Shutdown source when not visible</strong>: Checked (Saves GPU/CPU performance)</li>
                </ul>
              </section>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles — VALORANT Studio Sidebar App
// ---------------------------------------------------------------------------

const s = {
  pageWrapper: {
    width: "100vw",
    height: "100vh",
    overflow: "hidden",
    background: "radial-gradient(circle at 50% 20%, #131c28 0%, #080d14 70%, #030508 100%)",
  },
  studioApp: {
    width: "100vw",
    height: "100vh",
    background: "rgba(14, 21, 30, 0.95)",
    backdropFilter: "blur(32px) saturate(210%)",
    borderRadius: "0px",
    border: "none",
    boxShadow: "none",
    display: "flex",
    overflow: "hidden",
  },
  sidebar: {
    width: 260,
    background: "rgba(10, 16, 24, 0.95)",
    borderRight: "1px solid rgba(255, 255, 255, 0.12)",
    padding: "24px 18px",
    display: "flex",
    flexDirection: "column",
    gap: "24px",
    flexShrink: 0,
  },
  sidebarBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
  },
  brandLogoMark: {
    width: 38,
    height: 38,
    borderRadius: "12px",
    background: "linear-gradient(135deg, var(--val-red), #ff8591)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 18,
    boxShadow: "0 4px 14px var(--val-red-glow)",
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: 800,
    color: "#fff",
    letterSpacing: "1px",
    margin: 0,
    lineHeight: 1.1,
  },
  brandTag: {
    fontSize: 11,
    color: "rgba(255, 255, 255, 0.5)",
    fontWeight: 600,
  },
  sidebarNav: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    flex: 1,
  },
  navItem: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "transparent",
    border: "1px solid transparent",
    color: "rgba(255, 255, 255, 0.65)",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "left",
    transition: "all var(--transition-fast)",
  },
  navItemActive: {
    background: "rgba(255, 70, 85, 0.14)",
    borderColor: "rgba(255, 70, 85, 0.4)",
    color: "#fff",
    boxShadow: "inset 0 1px 0 rgba(255, 255, 255, 0.2)",
  },
  navIcon: {
    fontSize: 16,
  },
  navLabel: {
    flex: 1,
  },
  navBadge: {
    fontSize: 10,
    fontWeight: 800,
    padding: "2px 6px",
    borderRadius: "6px",
    background: "rgba(255, 255, 255, 0.08)",
    color: "rgba(255, 255, 255, 0.5)",
  },
  navBadgeActive: {
    background: "var(--val-red)",
    color: "#fff",
  },
  sidebarFooter: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  statusPill: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "6px 10px",
    borderRadius: "8px",
    background: "rgba(0, 0, 0, 0.3)",
  },
  statusDot: {
    width: 7,
    height: 7,
    borderRadius: "50%",
  },
  btnSwitchGame: {
    background: "rgba(255, 255, 255, 0.06)",
    border: "1px solid rgba(255, 255, 255, 0.14)",
    color: "rgba(255, 255, 255, 0.8)",
    fontSize: 12,
    fontWeight: 700,
    padding: "8px 12px",
    borderRadius: "10px",
    cursor: "pointer",
  },
  contentPanel: {
    flex: 1,
    padding: "28px 32px",
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    overflowY: "auto",
  },
  topHeader: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: "16px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.12)",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 800,
    color: "#fff",
    margin: 0,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "rgba(255, 255, 255, 0.6)",
    margin: 0,
  },
  btnHeaderLaunch: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, var(--val-red), #ff758c)",
    color: "#fff",
    fontSize: 12,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1px",
    cursor: "pointer",
    boxShadow: "0 4px 16px var(--val-red-glow)",
  },
  tabBody: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  sectionBox: {
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    padding: "18px 20px",
    borderRadius: "16px",
    background: "rgba(0, 0, 0, 0.25)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: 800,
    textTransform: "uppercase",
    letterSpacing: "1px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    margin: 0,
  },
  stepNum: {
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    width: 20,
    height: 20,
    borderRadius: "50%",
    background: "var(--val-red)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 800,
  },
  coreThemeCard: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "14px 18px",
    borderRadius: "14px",
    background: "rgba(255, 255, 255, 0.05)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  coreThemeCardActive: {
    background: "rgba(255, 70, 85, 0.12)",
    borderColor: "var(--val-red)",
    boxShadow: "0 0 20px var(--val-red-glow)",
  },
  coreThemeIcon: {
    fontSize: 24,
  },
  btnToggleExpand: {
    background: "rgba(255, 255, 255, 0.1)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    color: "#fff",
    fontSize: 11,
    fontWeight: 700,
    padding: "6px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },
  expandedDetailsContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "18px",
    marginTop: "10px",
    paddingTop: "14px",
    borderTop: "1px solid rgba(255, 255, 255, 0.1)",
  },
  subSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  subHeader: {
    fontSize: 12,
    fontWeight: 800,
    color: "rgba(255,255,255,0.85)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    margin: 0,
  },
  inputGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "4px",
  },
  label: {
    fontSize: 11,
    fontWeight: 700,
    color: "rgba(255, 255, 255, 0.7)",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
  },
  inputRow: {
    display: "flex",
    gap: "8px",
  },
  input: {
    flex: 1,
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(0,0,0,0.3)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
  },
  monoInput: {
    fontFamily: "ui-monospace, Consolas, monospace",
    fontSize: 12,
  },
  select: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.15)",
    background: "rgba(10, 16, 24, 0.95)",
    color: "#fff",
    fontSize: 14,
    outline: "none",
    cursor: "pointer",
  },
  fieldGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 100px 1fr",
    gap: "12px",
  },
  themeGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
    gap: "10px",
  },
  themeCard: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    padding: "10px 12px",
    borderRadius: "12px",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  themeCardActive: {
    background: "rgba(255, 70, 85, 0.15)",
    borderColor: "var(--val-red)",
    boxShadow: "0 0 14px var(--val-red-glow)",
  },
  themeSwatch: {
    width: 20,
    height: 20,
    borderRadius: "50%",
    flexShrink: 0,
  },
  layoutGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  layoutCard: {
    display: "flex",
    flexDirection: "column",
    padding: "12px 14px",
    borderRadius: "12px",
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
    cursor: "pointer",
    transition: "all var(--transition-fast)",
  },
  layoutCardActive: {
    background: "rgba(255, 70, 85, 0.15)",
    borderColor: "var(--val-red)",
    boxShadow: "0 0 16px var(--val-red-glow)",
  },
  badgePill: {
    fontSize: 10,
    fontWeight: 800,
    padding: "2px 6px",
    borderRadius: "6px",
    background: "rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.9)",
  },
  toggleChip: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "1px solid var(--val-border)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 700,
    cursor: "pointer",
    textAlign: "center",
  },
  checkRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  checkLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: 13,
    color: "var(--val-cream-dim)",
    cursor: "pointer",
  },
  checkbox: {
    accentColor: "var(--val-red)",
    cursor: "pointer",
  },
  toggleGrid: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "10px",
  },
  toggleLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: 13,
    color: "rgba(255,255,255,0.85)",
    cursor: "pointer",
    padding: "10px 12px",
    borderRadius: "10px",
    background: "rgba(0,0,0,0.2)",
    border: "1px solid rgba(255, 255, 255, 0.12)",
  },
  previewSection: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  backdropBtn: {
    background: "rgba(0,0,0,0.3)",
    border: "1px solid rgba(255,255,255,0.12)",
    color: "rgba(255,255,255,0.7)",
    fontSize: 11,
    fontWeight: 700,
    padding: "4px 8px",
    borderRadius: "6px",
    cursor: "pointer",
  },
  backdropBtnActive: {
    background: "rgba(255,255,255,0.15)",
    borderColor: "#fff",
    color: "#fff",
  },
  previewCanvas: {
    borderRadius: "16px",
    padding: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    border: "1px solid rgba(255,255,255,0.15)",
    overflow: "hidden",
    minHeight: 150,
    boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
  },
  link: {
    fontSize: 12,
    color: "var(--val-red)",
    textDecoration: "none",
    fontWeight: 700,
  },
  btnPrimary: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "none",
    background: "var(--val-red)",
    color: "#fff",
    fontSize: 13,
    fontWeight: 800,
    cursor: "pointer",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    whiteSpace: "nowrap",
  },
  btnGhost: {
    background: "none",
    border: "none",
    color: "var(--val-cream-dim)",
    fontSize: 12,
    cursor: "pointer",
    textDecoration: "underline",
  },
  obsUrlRow: {
    display: "flex",
    gap: "8px",
    marginTop: "8px",
  },
};
