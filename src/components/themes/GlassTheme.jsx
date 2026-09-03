/**
 * GlassTheme.jsx — Apple-Inspired Liquid Glass Theme Component.
 *
 * Encapsulates liquid refraction, frosted backdrop blur, specular highlights,
 * sweeping liquid sheen, and rank-adaptive caustics.
 * Presets: clear, prism, ruby, emerald, sapphire, gold, platinum.
 */
import React from "react";

export const GLASS_PRESETS = [
  {
    id: "clear",
    name: "Pure Crystal",
    desc: "100% Ultra-clear transparent glass",
    color: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.15))",
  },
  {
    id: "prism",
    name: "Prism Glass",
    desc: "Prismatic rainbow light sheen",
    color: "linear-gradient(135deg, #ff4655, #00f2fe)",
  },
  {
    id: "ruby",
    name: "Crimson Ruby",
    desc: "Valorant Crimson Core glow",
    color: "linear-gradient(135deg, #ff2a4b, #ff758c)",
  },
  {
    id: "emerald",
    name: "Toxic Emerald",
    desc: "Ascendant Viper emerald glass",
    color: "linear-gradient(135deg, #10b981, #34d399)",
  },
  {
    id: "sapphire",
    name: "Ice Sapphire",
    desc: "Glacier ice crystal blue",
    color: "linear-gradient(135deg, #3b82f6, #60a5fa)",
  },
  {
    id: "gold",
    name: "Radiant Gold",
    desc: "Radiant crown gold aura",
    color: "linear-gradient(135deg, #f59e0b, #fbbf24)",
  },
  {
    id: "platinum",
    name: "Cyan Crystal",
    desc: "Cyber cyan crystal gloss",
    color: "linear-gradient(135deg, #06b6d4, #22d3ee)",
  },
];

export default function GlassTheme({
  children,
  preset = "prism",
  glassBlur = "high",
  refraction = true,
  refractionPower = 18,
  displacementScale = 100,
  cornerRadius = 20,
  sheenSpeed = "normal",
  borderGlow = true,
  playerDetails,
  className = "",
  style = {},
}) {
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

  const currentRadius = `${Math.min(
    20,
    Math.max(0, Number(cornerRadius) || 20)
  )}px`;
  const normalizedPower = Math.min(50, Math.max(5, Number(refractionPower) || 18));
  const normalizedScale = Math.min(
    200,
    Math.max(100, Number(displacementScale) || 100)
  );
  const displacementMultiplier = normalizedScale / 100;
  const effectiveScale = normalizedPower * displacementMultiplier * 1.5;

  const themeClass = `glass-theme-${preset || "prism"}`;

  return (
    <div
      className={`glass-theme-root ${themeClass} ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        padding: "16px",
        fontFamily: "var(--font-sans)",
        "--overlay-radius": currentRadius,
        ...style,
      }}
    >
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

      {/* Main Outer Liquid Glass Border Ring */}
      <div style={s.cardWrapper} id="overlay-card-wrapper">
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

            {/* Border Glass Lens Refraction */}
            {refraction && (
              <div
                className="overlay-backdrop-layer"
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: currentRadius,
                  clipPath: `inset(0 round ${currentRadius})`,
                  background: "transparent",
                  backdropFilter: `url(#liquid-glass-refract) blur(1.5px) contrast(${
                    110 + Math.round(effectiveScale * 1.2)
                  }%) brightness(55%) saturate(210%)`,
                  WebkitBackdropFilter: `url(#liquid-glass-refract) blur(1.5px) contrast(${
                    110 + Math.round(effectiveScale * 1.2)
                  }%) brightness(55%) saturate(210%)`,
                  boxShadow: `
                    inset 0 0 0 1.5px rgba(255, 255, 255, 0.35),
                    inset 0 0 ${Math.min(
                      42,
                      Math.round(16 + (displacementMultiplier - 1.0) * 26)
                    )}px 3px rgba(255, 255, 255, 0.24),
                    inset 0 -12px 20px -14px rgba(0, 0, 0, 0.20)
                  `,
                  maskImage:
                    "radial-gradient(ellipse at center, transparent 55%, black 88%)",
                  WebkitMaskImage:
                    "radial-gradient(ellipse at center, transparent 55%, black 88%)",
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
                borderRadius: `${currentRadius} ${currentRadius} 0 0`,
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

            {/* Render Content */}
            <div style={s.contentContainer}>
              {children || (playerDetails && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "14px",
                    width: "100%",
                    padding: "12px 18px",
                  }}
                >
                  {/* 1. GLASS RANK EMBLEM */}
                  {playerDetails.displayFields?.rank && (
                    <div
                      style={{
                        position: "relative",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "14px",
                        background: "rgba(255, 255, 255, 0.08)",
                        border: "1px solid rgba(255, 255, 255, 0.22)",
                        boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.4), 0 4px 14px rgba(0, 0, 0, 0.3)",
                        backdropFilter: "blur(12px)",
                        padding: "6px",
                        flexShrink: 0,
                      }}
                      id="glass-element-badge"
                    >
                      <img
                        src={playerDetails.rankIconUrl}
                        alt={playerDetails.tierName}
                        style={{ width: 42, height: 42, objectFit: "contain" }}
                      />
                    </div>
                  )}

                  {/* 2. GLASS INFO SECTION */}
                  <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "3px" }}>
                    <div style={{ display: "flex", alignItems: "baseline", gap: "6px" }} id="glass-element-name-row">
                      <span
                        style={{
                          fontSize: "15px",
                          fontWeight: 800,
                          color: "#ffffff",
                          letterSpacing: "0.4px",
                        }}
                        id="glass-element-player-name"
                      >
                        {playerDetails.playerName}
                      </span>
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }} id="glass-element-meta-row">
                      {playerDetails.displayFields?.rank && (
                        <span
                          style={{
                            fontSize: 12,
                            fontWeight: 800,
                            color: playerDetails.rankInfo?.color || "#fff",
                            textTransform: "uppercase",
                          }}
                          id="glass-element-rank-name"
                        >
                          {playerDetails.tierName}
                        </span>
                      )}

                      {playerDetails.displayFields?.rr && typeof playerDetails.rr === "number" && (
                        <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }} id="glass-element-rr-counter">
                          {playerDetails.rr} <span style={{ fontSize: 10, opacity: 0.8 }}>RR</span>
                        </span>
                      )}

                      {playerDetails.displayFields?.rr && typeof playerDetails.lastChange === "number" && !playerDetails.isDemo && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            background: playerDetails.lastChange >= 0 ? "rgba(45, 212, 168, 0.18)" : "rgba(239, 68, 68, 0.18)",
                            color: playerDetails.lastChange >= 0 ? "#2dd4a8" : "#ef4444",
                            border: `1px solid ${playerDetails.lastChange >= 0 ? "rgba(45, 212, 168, 0.4)" : "rgba(239, 68, 68, 0.4)"}`,
                            padding: "2px 8px",
                            borderRadius: "9999px",
                          }}
                          id="glass-element-rr-change"
                        >
                          {playerDetails.lastChange >= 0 ? "+" : ""}{playerDetails.lastChange} RR
                        </span>
                      )}

                      {playerDetails.displayFields?.season && playerDetails.currentSeason && (
                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: 700,
                            background: "rgba(8, 14, 22, 0.42)",
                            border: "1px solid rgba(255, 255, 255, 0.26)",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            color: "#fff",
                          }}
                          id="glass-element-season-tag"
                        >
                          {playerDetails.currentSeason.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* 3. GLASS TIME SECTION */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "auto" }} id="glass-element-clock-area">
                    <span style={{ fontSize: "11px", fontWeight: 700, opacity: 0.85 }} id="glass-element-clock">
                      {playerDetails.updatedLabel}
                    </span>
                    <span
                      style={{
                        width: 7,
                        height: 7,
                        borderRadius: "50%",
                        background: "#2dd4a8",
                        boxShadow: "0 0 8px #2dd4a8",
                      }}
                      id="glass-element-live-dot"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  cardWrapper: {
    position: "relative",
    display: "inline-flex",
    alignItems: "center",
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
    background: "transparent",
    color: "#fff",
    textShadow: "0 2px 5px rgba(0, 0, 0, 0.88), 0 1px 1px rgba(0, 0, 0, 0.75)",
    overflow: "hidden",
    boxShadow: "var(--glass-specular)",
    transition:
      "transform var(--transition-base), background var(--transition-base)",
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
  contentContainer: {
    position: "relative",
    zIndex: 2,
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
};
