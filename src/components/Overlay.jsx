/**
 * Overlay — Apple-Inspired Liquid Glass OBS Stream Overlay.
 *
 * Renders on a 100% transparent background for OBS Browser Source.
 * Features:
 *   - Apple Liquid Glass translucency + specular reflections
 *   - Sweep liquid light sheen animation (with configurable speed)
 *   - Rank-adaptive ambient liquid caustics (with configurable opacity)
 *   - SVG refraction displacement map
 *   - 4 Dynamic Layout Modes:
 *       1. `card`    — Broadcast Card
 *       2. `capsule` — VisionOS Capsule Pill
 *       3. `banner`  — Full Streamer Banner Bar
 *       4. `minimal` — Minimalist Rank Emblem HUD
 */

import { useMemo } from "react";
import { RefreshCw, Settings, TrendingUp } from "lucide-react";
import RankBadge from "./RankBadge";
import ErrorBanner from "./ErrorBanner";
import usePlayerData from "../hooks/usePlayerData";
import { getRankInfo } from "../data/ranks";

// Demo data shown when no API connection is configured
const DEMO_DATA = {
  account: { name: "PlayerName", tag: "0000", account_level: 142 },
  mmr: {
    current: { tier: { id: 19, name: "Diamond 2" }, rr: 67, last_change: 22 },
    seasonal: [{ season: { short: "e9a2" }, games: 48, wins: 28 }],
    peak: { tier: { id: 22, name: "Ascendant 2" }, season: { short: "e8a3" } },
  },
};

/**
 * @param {Object} props
 * @param {string} props.apiKey
 * @param {Object} props.config
 * @param {Function} props.onBack — return to setup
 */
export default function Overlay({ apiKey, config = {}, backdropBg, onBack }) {
  const {
    displayFields = { rank: true, rr: true, season: true, peakRank: true },
    theme = "prism",
    layout = "card",
    glassBlur = "high",
    refraction = true,
    refractionPower = 18,
    displacementScale,
    cornerRadius = 20,
    lensZoom = 1.0,
    glowOpacity = 0.7,
    sheenSpeed = "normal",
    borderGlow = true,
    playerName,
    playerTag,
    region,
  } = config || {};

  const {
    playerData,
    loading,
    error,
    lastUpdated,
    refresh,
    rateLimited,
    retryIn,
  } = usePlayerData({
    apiKey,
    playerName,
    playerTag,
    region,
  });

  const data = playerData || DEMO_DATA;
  const isDemo = !playerData;

  const current = data.mmr?.current;
  const tierId = current?.tier?.id ?? 0;
  const tierName = current?.tier?.name;
  const rr = current?.rr;
  const lastChange = current?.last_change;
  const rankInfo = getRankInfo(tierId);

  const currentSeason = useMemo(() => {
    if (!data.mmr?.seasonal?.length) return null;
    const latest = data.mmr.seasonal[data.mmr.seasonal.length - 1];
    return latest?.season?.short || null;
  }, [data.mmr?.seasonal]);

  const peak = data.mmr?.peak;

  const updatedLabel = useMemo(() => {
    if (!lastUpdated) return "Live";
    return lastUpdated.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, [lastUpdated]);

  const showSkeleton = loading && !playerData;
  const themeClass = `glass-theme-${theme}`;

  const backdropBlurValue =
    glassBlur === "low" ? "4px" : glassBlur === "medium" ? "8px" : "14px";

  const sheenDuration =
    sheenSpeed === "fast"
      ? "3s"
      : sheenSpeed === "slow"
      ? "10s"
      : sheenSpeed === "off"
      ? "0s"
      : "6s";

  const requestedRadius = Number(cornerRadius);
  const currentRadius = `${Math.min(
    20,
    Math.max(0, Number.isFinite(requestedRadius) ? requestedRadius : 20)
  )}px`;

  const glowColor = rankInfo?.color || "var(--theme-liquid-glow, rgba(255, 70, 85, 0.6))";
  // `lensZoom` is retained as a fallback for existing OBS URLs/configurations.
  // New configurations use the user-facing 100–200 displacement scale directly.
  const normalizedPower = Math.min(50, Math.max(5, Number(refractionPower) || 18));
  const normalizedDisplacementScale = Math.min(
    200,
    Math.max(100, Number(displacementScale ?? lensZoom * 100) || 100)
  );
  const displacementMultiplier = normalizedDisplacementScale / 100;
  const effectiveScale = normalizedPower * displacementMultiplier * 1.5;

  return (
    <div style={{ ...s.root, "--overlay-radius": currentRadius }} className={`${themeClass} overlay-surface`}>
      {/* SVG Liquid Refraction Filter */}
      {refraction && (
        <svg
          style={{ position: "absolute", width: 0, height: 0, overflow: "hidden" }}
          aria-hidden="true"
        >
          <filter
            id="liquid-glass-refract"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
            filterUnits="objectBoundingBox"
          >
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.012"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale={effectiveScale}
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </svg>
      )}

      {/* Main Glass Card Wrapper */}
      <div style={s.cardWrapper} id="overlay-card-wrapper">
        {/* Settings gear */}
        <button
          type="button"
          onClick={onBack}
          style={s.settingsBtn}
          title="Back to settings"
          id="overlay-settings-btn"
          aria-label="Open settings"
        >
          <Settings size={15} aria-hidden="true" />
        </button>

        {/* Outer Liquid Glass Border Ring */}
        <div
          className="overlay-border-ring"
          style={{
            ...s.borderRing,
            borderRadius: currentRadius,
            background: borderGlow
              ? "var(--theme-border-gradient, linear-gradient(135deg, rgba(255,255,255,0.5), rgba(255,70,85,0.4)))"
              : "rgba(255,255,255,0.15)",
          }}
        >
          {/* Main Glass Panel */}
          <div
            style={{
              ...s.card,
              ...(layout === "capsule"
                ? s.cardCapsule
                : layout === "banner"
                ? s.cardBanner
                : layout === "minimal"
                ? s.cardMinimal
                : s.cardStandard),
              ...(isDemo ? s.cardDemo : {}),
              borderRadius: currentRadius,
            }}
            className="fade-in overlay-card-surface"
            id="overlay-card"
          >
            {/* Base Glass Backdrop Blur Layer */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: currentRadius,
                clipPath: `inset(0 round ${currentRadius})`,
                background: "var(--theme-glass-tint, var(--glass-bg))",
                backdropFilter: `blur(${backdropBlurValue}) saturate(210%) contrast(108%)`,
                WebkitBackdropFilter: `blur(${backdropBlurValue}) saturate(210%) contrast(108%)`,
                pointerEvents: "none",
                zIndex: 0,
                overflow: "hidden",
              }}
            />

            {/* Border Glass Lens Physical Distortion & Displacement for Live Backdrop */}
            {refraction && (
              <div
                className="overlay-backdrop-layer"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: currentRadius,
                  clipPath: `inset(0 round ${currentRadius})`,
                  background: "transparent",
                  // edit brightness for whiteline opacity
                  backdropFilter: `url(#liquid-glass-refract) blur(1.5px) contrast(${110 + Math.round(effectiveScale * 1.2)}%) brightness(55%) saturate(210%)`,
                  WebkitBackdropFilter: `url(#liquid-glass-refract) blur(1.5px) contrast(${110 + Math.round(effectiveScale * 1.2)}%) brightness(55%) saturate(210%)`,
                  boxShadow: `
                    inset 0 0 0 1.5px rgba(255, 255, 255, 0.35),
                    inset 0 0 ${Math.min(42, Math.round(16 + (displacementMultiplier - 1.0) * 26))}px 3px rgba(255, 255, 255, 0.24),
                    inset 0 -12px 20px -14px rgba(0, 0, 0, 0.20)
                  `,
                  maskImage: "radial-gradient(ellipse at center, transparent 55%, black 88%)",
                  WebkitMaskImage: "radial-gradient(ellipse at center, transparent 55%, black 88%)",
                  pointerEvents: "none",
                  zIndex: 0,
                  overflow: "hidden",
                }}
              />
            )}
            {/* Top Light Specular Highlight Bevel */}
            <div
              style={{
                ...s.specularBevel,
                borderRadius:
                  `${currentRadius} ${currentRadius} 0 0`,
              }}
            />

            {/* Dynamic Sweep Light Sheen */}
            {sheenSpeed !== "off" && (
              <div
                className="overlay-lens-layer"
                style={{
                  ...s.lightSheen,
                  animationDuration: sheenDuration,
                }}
              />
            )}

            {/* Skeleton state */}
            {showSkeleton && (
              <div style={s.skeletonRow}>
                <div
                  className="skeleton-glass"
                  style={{ width: 44, height: 44, borderRadius: "12px" }}
                />
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <div
                    className="skeleton-glass"
                    style={{ width: 110, height: 16 }}
                  />
                  <div
                    className="skeleton-glass"
                    style={{ width: 70, height: 12 }}
                  />
                </div>
              </div>
            )}

            {/* Real Content */}
            {!showSkeleton && (
              <>
                {/* MINIMAL LAYOUT */}
                {layout === "minimal" ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    {displayFields.rank && (
                      <RankBadge
                        tierId={tierId}
                        tierName={tierName}
                        rr={rr}
                        showRR={false}
                        iconSize={38}
                        hideText={true}
                      />
                    )}
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: rankInfo?.color || "#fff",
                        }}
                      >
                        {tierName || rankInfo?.name}
                      </span>
                      {displayFields.rr && typeof rr === "number" && (
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>
                          {rr} <span style={{ fontSize: 10, opacity: 0.7 }}>RR</span>
                        </span>
                      )}
                    </div>
                  </div>
                ) : layout === "banner" ? (
                  /* BANNER LAYOUT */
                  <div style={{ display: "flex", alignItems: "center", width: "100%" }}>
                    {displayFields.rank && (
                      <RankBadge
                        tierId={tierId}
                        tierName={tierName}
                        rr={rr}
                        showRR={false}
                        iconSize={34}
                        hideText={true}
                      />
                    )}

                    <div style={{ marginLeft: "10px", display: "flex", flexDirection: "column" }}>
                      <span style={s.playerName}>
                        {data.account?.name || config.playerName}
                      </span>
                    </div>

                    <div className="glass-banner-divider" />

                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 800,
                          color: rankInfo?.color || "#fff",
                        }}
                      >
                        {tierName || rankInfo?.name}
                      </span>
                      {displayFields.rr && typeof rr === "number" && (
                        <span style={{ fontSize: 11, fontWeight: 700, color: "#fff" }}>
                          {rr} RR
                          {typeof lastChange === "number" && !isDemo && (
                            <span
                              style={{
                                marginLeft: 4,
                                color: lastChange >= 0 ? "#2dd4a8" : "#ef4444",
                              }}
                            >
                              ({lastChange >= 0 ? "+" : ""}
                              {lastChange})
                            </span>
                          )}
                        </span>
                      )}
                    </div>

                    {displayFields.season && currentSeason && (
                      <>
                        <div className="glass-banner-divider" />
                        <span style={s.metaPill}>{currentSeason.toUpperCase()}</span>
                      </>
                    )}

                    <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 5 }}>
                      <span style={s.liveStatusDot} />
                    </div>
                  </div>
                ) : (
                  /* STANDARD CARD & CAPSULE */
                  <>
                    {displayFields.rank && (
                      <div style={s.rankSection}>
                        <RankBadge
                          tierId={tierId}
                          tierName={tierName}
                          rr={displayFields.rr ? rr : undefined}
                          showRR={displayFields.rr}
                          iconSize={layout === "capsule" ? 36 : 42}
                          hideText={layout === "capsule" && !displayFields.rr}
                        />
                      </div>
                    )}

                    <div style={s.infoSection}>
                      <div style={s.nameRow}>
                        <span style={s.playerName}>
                          {data.account?.name || config.playerName}
                        </span>
                      </div>

                      <div style={s.metaRow}>
                        {displayFields.rr &&
                          typeof lastChange === "number" &&
                          !isDemo && (
                            <span
                              style={{
                                ...s.metaPill,
                                background:
                                  lastChange >= 0
                                    ? "rgba(45, 212, 168, 0.18)"
                                    : "rgba(239, 68, 68, 0.18)",
                                color: lastChange >= 0 ? "#2dd4a8" : "#ef4444",
                                borderColor:
                                  lastChange >= 0
                                    ? "rgba(45, 212, 168, 0.4)"
                                    : "rgba(239, 68, 68, 0.4)",
                              }}
                            >
                              {lastChange >= 0 ? "+" : ""}
                              {lastChange} RR
                            </span>
                          )}

                        {displayFields.season && currentSeason && (
                          <span style={s.metaPill}>
                            {currentSeason.toUpperCase()}
                          </span>
                        )}

                        {displayFields.peakRank && peak?.tier && (
                          <span
                            style={s.metaPill}
                            title={`Peak: ${peak.tier.name}`}
                          >
                            <TrendingUp size={11} strokeWidth={2.5} aria-hidden="true" /> {peak.tier.name}
                          </span>
                        )}
                      </div>
                    </div>

                    <div style={s.timeSection}>
                      <span style={s.timeLabel}>{updatedLabel}</span>
                      <span style={s.liveStatusDot} />
                    </div>
                  </>
                )}
              </>
            )}

            {loading && <div style={s.loadingDot} />}
          </div>
        </div>

        {!isDemo && !loading && !rateLimited && (
          <button
            type="button"
            onClick={refresh}
            style={s.refreshBtn}
            title="Refresh now"
            id="overlay-refresh-btn"
          >
            <RefreshCw size={14} aria-hidden="true" />
          </button>
        )}
      </div>

      {isDemo && !loading && (
        <div style={s.demoLabel}>
          Apple Liquid Glass ({layout.toUpperCase()}) Preview — Connect API Key in Setup
        </div>
      )}

      {error && (
        <div style={s.errorWrap}>
          <ErrorBanner error={error} retryIn={retryIn} />
        </div>
      )}
    </div>
  );
}

const s = {
  root: {
    position: "relative",
    display: "inline-flex",
    flexDirection: "column",
    alignItems: "flex-start",
    gap: "8px",
    padding: "16px",
    fontFamily: "var(--font-sans)",
    "--radius-sm": "8px",
    "--radius-md": "14px",
    "--radius-lg": "20px",
    "--radius-pill": "9999px",
  },
  cardWrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
  },
  ambientGlow: {
    position: "absolute",
    inset: "-28px",
    borderRadius: "40px",
    filter: "blur(25px)",
    pointerEvents: "none",
    animation: "liquidCaustic 4s ease-in-out infinite",
    zIndex: 0,
  },
  borderRing: {
    position: "relative",
    padding: "1.5px",
    boxShadow: "0 14px 40px rgba(0, 0, 0, 0.55)",
    zIndex: 1,
  },
  card: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    gap: "14px",
    // The actual translucency comes from the backdrop layer below. Keeping
    // this surface transparent avoids covering the refracted page backdrop.
    background: "transparent",
    // Inherited by labels that do not specify their own shadow; keeps text
    // readable over bright or rapidly changing capture footage.
    color: "#fff",
    textShadow: "0 2px 5px rgba(0, 0, 0, 0.88), 0 1px 1px rgba(0, 0, 0, 0.75)",
    overflow: "hidden",
    boxShadow: "var(--glass-specular)",
    transition:
      "transform var(--transition-base), background var(--transition-base)",
  },
  cardStandard: {
    padding: "12px 18px 12px 14px",
    minWidth: 290,
  },
  cardCapsule: {
    padding: "8px 18px 8px 10px",
    minWidth: 240,
  },
  cardBanner: {
    padding: "8px 16px",
    minWidth: 380,
  },
  cardMinimal: {
    padding: "8px 14px",
    minWidth: 150,
  },
  cardDemo: {
    border: "1px dashed rgba(255, 255, 255, 0.25)",
  },
  specularBevel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "45%",
    background:
      "linear-gradient(180deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0) 100%)",
    pointerEvents: "none",
  },
  lightSheen: {
    position: "absolute",
    top: "-50%",
    left: 0,
    width: "40%",
    height: "200%",
    background:
      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)",
    transform: "rotate(25deg)",
    animation: "liquidSheen 6s cubic-bezier(0.16, 1, 0.3, 1) infinite",
    pointerEvents: "none",
  },
  rankSection: {
    flexShrink: 0,
    position: "relative",
    zIndex: 1,
  },
  infoSection: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
    gap: "3px",
    minWidth: 0,
    position: "relative",
    zIndex: 1,
  },
  nameRow: {
    display: "flex",
    alignItems: "baseline",
    gap: "6px",
  },
  playerName: {
    fontSize: "15px",
    fontWeight: 800,
    color: "#ffffff",
    letterSpacing: "0.4px",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    textShadow: "0 2px 7px rgba(0,0,0,0.92), 0 1px 1px rgba(0,0,0,0.8)",
  },
  playerTag: {
    fontSize: "12px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.88)",
    textShadow: "0 2px 5px rgba(0,0,0,0.85)",
    whiteSpace: "nowrap",
  },
  metaRow: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    flexWrap: "wrap",
  },
  metaPill: {
    fontSize: "11px",
    fontWeight: 700,
    color: "#ffffff",
    background: "rgba(8, 14, 22, 0.42)",
    border: "1px solid rgba(255, 255, 255, 0.26)",
    padding: "2px 8px",
    borderRadius: "9999px",
    whiteSpace: "nowrap",
    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
  },
  timeSection: {
    flexShrink: 0,
    display: "flex",
    alignItems: "center",
    gap: "5px",
    paddingLeft: "6px",
    position: "relative",
    zIndex: 1,
  },
  timeLabel: {
    fontSize: "10px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.82)",
    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
    whiteSpace: "nowrap",
  },
  liveStatusDot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    background: "#2dd4a8",
    boxShadow: "0 0 8px #2dd4a8",
  },
  loadingDot: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 6,
    height: 6,
    borderRadius: "50%",
    background: "var(--val-red)",
    boxShadow: "0 0 10px var(--val-red)",
    animation: "liquidCaustic 1s ease-in-out infinite",
  },
  skeletonRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%",
  },
  settingsBtn: {
    position: "absolute",
    top: -10,
    right: -10,
    width: 28,
    height: 28,
    borderRadius: "50%",
    background: "rgba(20, 30, 42, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "#fff",
    fontSize: 14,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  refreshBtn: {
    position: "absolute",
    bottom: -10,
    right: -10,
    width: 26,
    height: 26,
    borderRadius: "50%",
    background: "rgba(20, 30, 42, 0.85)",
    border: "1px solid rgba(255, 255, 255, 0.3)",
    color: "#fff",
    fontSize: 12,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(0,0,0,0.4)",
    zIndex: 10,
  },
  demoLabel: {
    fontSize: "11px",
    fontWeight: 600,
    color: "rgba(255, 255, 255, 0.5)",
    letterSpacing: "0.4px",
    paddingLeft: "4px",
  },
  errorWrap: {
    maxWidth: 320,
  },
};
