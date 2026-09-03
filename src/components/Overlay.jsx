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
import { getRankInfo, getRankIconUrl } from "../data/ranks";
import ThemeRenderer from "./themes/ThemeRenderer";

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
  // Resolve active theme ID and theme-scoped configuration parameters
  const activeThemeId = config.theme || "glass";
  const themeScopedConfig = config.themeConfigs?.[activeThemeId] || {};
  const mergedConfig = { ...config, ...themeScopedConfig };

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
  } = mergedConfig;

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

  const playerDetails = {
    playerName: data.account?.name || config.playerName,
    playerTag: data.account?.tag || config.playerTag,
    tierId,
    tierName: tierName || rankInfo?.name,
    rr,
    lastChange,
    rankInfo,
    rankIconUrl: getRankIconUrl(tierId),
    currentSeason,
    peak,
    updatedLabel,
    displayFields,
    layout,
    isDemo,
    loading,
  };

  return (
    <div style={s.root}>
      {/* Settings gear button */}
      {onBack && (
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
      )}

      {/* Theme Component renders its own native internal layout */}
      <ThemeRenderer
        theme={theme}
        config={mergedConfig}
        rankColor={rankInfo?.color}
        playerDetails={playerDetails}
      />

      {isDemo && !loading && (
        <div style={s.demoLabel}>
          Live Streamer Studio Overlay ({layout.toUpperCase()}) Preview — Connect API Key in Setup
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
