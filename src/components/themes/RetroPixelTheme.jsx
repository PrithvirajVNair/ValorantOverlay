/**
 * RetroPixelTheme.jsx — 8-Bit Retro Gaming Arcade Theme Component.
 *
 * Features retro arcade scanlines, pixel art border frames, glowing arcade marquee lights,
 * and retro color palettes (Arcade Red, Synthwave Purple, GameBoy Emerald, Pixel Gold).
 */
import React from "react";

export function getTintedBg(colorHex) {
  if (!colorHex || typeof colorHex !== "string") return "#1a0b12";
  let hex = colorHex.replace("#", "").trim();
  if (hex.length === 3)
    hex = hex
      .split("")
      .map((c) => c + c)
      .join("");
  if (hex.length !== 6) return "#1a0b12";

  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  // Mix 30% rank color with 70% dark CRT phosphor base for a rich tinted background
  const bgR = Math.round(r * 0.28 + 12);
  const bgG = Math.round(g * 0.28 + 12);
  const bgB = Math.round(b * 0.28 + 14);

  return `rgb(${bgR}, ${bgG}, ${bgB})`;
}

export const RETRO_PRESETS = [
  {
    id: "rank-dynamic",
    name: "Dynamic Rank",
    border: "#ff4655",
    bg: "#3d121c",
    text: "#ffffff",
    desc: "Auto-matches player rank color",
  },
  {
    id: "arcade-red",
    name: "Arcade Red",
    border: "#ff2a4b",
    bg: "#3b0c16",
    text: "#ff758c",
    glow: "rgba(255, 42, 75, 0.3)",
  },
  {
    id: "synthwave",
    name: "80s Synthwave",
    border: "#ff00d4",
    bg: "#330947",
    text: "#00f0ff",
    glow: "rgba(255, 0, 212, 0.3)",
  },
  {
    id: "gameboy",
    name: "GameBoy Green",
    border: "#8bac0f",
    bg: "#0f380f",
    text: "#9bbc0f",
    glow: "rgba(139, 172, 15, 0.3)",
  },
  {
    id: "pixel-amber",
    name: "Pixel Amber",
    border: "#ffb703",
    bg: "#3a2500",
    text: "#ffb703",
    glow: "rgba(255, 183, 3, 0.3)",
  },
];

export default function RetroPixelTheme({
  children,
  preset = "rank-dynamic",
  scanlines = true,
  rankColor,
  playerDetails,
  className = "",
  style = {},
}) {
  const dynamicColor = rankColor || "#ff4655";
  let activePreset = RETRO_PRESETS.find((p) => p.id === preset);

  if (!activePreset || preset === "rank-dynamic") {
    activePreset = {
      id: "rank-dynamic",
      name: "Dynamic Rank",
      border: dynamicColor,
      bg: getTintedBg(dynamicColor),
      text: "#ffffff",
      glow: dynamicColor,
      isDynamic: true,
    };
  }

  return (
    <div
      className={`retro-theme-root ${className}`}
      style={{
        position: "relative",
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "flex-start",
        gap: "8px",
        padding: "16px",
        fontFamily: "'Courier New', Courier, monospace",
        ...style,
      }}
    >
      <div style={s.cardWrapper} id="overlay-card-wrapper">
        {/* Pixel Art Double Border */}
        <div
          className="overlay-border-ring"
          style={{
            ...s.borderRing,
            border: `3px solid ${activePreset.border}`,
            outline: "2px solid #000",
            boxShadow: `0 0 18px ${activePreset.border}`,
          }}
        >
          {/* Retro Arcade Surface */}
          <div
            style={{
              ...s.card,
              background: activePreset.bg,
              color: activePreset.text,
              boxShadow: activePreset.isDynamic
                ? `inset 0 0 28px ${activePreset.border}55, inset 0 0 10px rgba(0,0,0,0.8)`
                : `inset 0 0 24px ${activePreset.glow}`,
            }}
            className="fade-in overlay-card-surface"
            id="overlay-card"
          >
            {/* CRT Scanline Overlay */}
            {scanlines && <div style={s.scanlines} />}

            {/* Content Container */}
            <div style={{ ...s.contentContainer, position: "relative" }}>
              {children ||
                (playerDetails?.showSkeleton ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "14px",
                      width: "100%",
                      padding: "10px 16px",
                    }}
                    id="retro-skeleton-container"
                  >
                    {/* 8-Bit Pixel Rank Emblem Skeleton */}
                    <div
                      style={{
                        width: 46,
                        height: 46,
                        background: "rgba(255, 255, 255, 0.08)",
                        border: `2px solid ${activePreset.border}`,
                        boxShadow: `0 0 10px ${activePreset.border}55`,
                        animation: "retroPulse 1.2s infinite ease-in-out",
                        flexShrink: 0,
                      }}
                    />

                    {/* Retro Text Bars Skeleton */}
                    <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "8px" }}>
                      <div
                        style={{
                          width: "110px",
                          height: "14px",
                          background: "rgba(255, 255, 255, 0.15)",
                          borderLeft: `3px solid ${activePreset.border}`,
                          animation: "retroPulse 1.2s infinite ease-in-out",
                        }}
                      />
                      <div style={{ display: "flex", gap: "6px" }}>
                        <div
                          style={{
                            width: "55px",
                            height: "12px",
                            background: "rgba(255, 255, 255, 0.09)",
                            animation: "retroPulse 1.2s infinite ease-in-out 0.2s",
                          }}
                        />
                        <div
                          style={{
                            width: "40px",
                            height: "12px",
                            background: "rgba(255, 255, 255, 0.09)",
                            animation: "retroPulse 1.2s infinite ease-in-out 0.4s",
                          }}
                        />
                      </div>
                    </div>
                  </div>
                ) : playerDetails && (
                  <>
                    <div
                      style={{
                        position: "absolute",
                        top: -15,
                        right: -1,
                        zIndex: 5,
                      }}
                    >
                      {playerDetails.displayFields?.season &&
                        playerDetails.currentSeason && (
                          <span
                            style={{
                              fontSize: 10,
                              fontWeight: 800,
                              padding: "1px 6px",
                              background: "rgba(0,0,0)",
                              border: "1px solid rgba(255,255,255,0.3)",
                              color: "#fff",
                              fontFamily: "monospace",
                            }}
                            id="retro-element-season-tag"
                          >
                            {playerDetails.currentSeason.toUpperCase()}
                          </span>
                        )}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "14px",
                        width: "100%",
                        padding: "10px 16px",
                      }}
                    >
                      {/* 1. RETRO RANK EMBLEM */}
                      {playerDetails.displayFields?.rank && (
                        <div
                          style={{
                            position: "relative",
                            width: 46,
                            height: 46,
                            background: "rgba(0,0,0,0.5)",
                            border: `2px solid ${activePreset.border}`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                          }}
                          id="retro-element-badge"
                        >
                          <img
                            src={playerDetails.rankIconUrl}
                            alt={playerDetails.tierName}
                            style={{
                              width: 36,
                              height: 36,
                              objectFit: "contain",
                            }}
                          />
                        </div>
                      )}

                      {/* 2. RETRO INFO SECTION (NAME, RANK, RR) */}
                      <div
                        style={{
                          flex: 1,
                          display: "flex",
                          flexDirection: "column",
                          gap: "2px",
                        }}
                      >
                        {/* ROW 1: RANK TITLE & PLAYER NAME */}
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "flex-start",
                            height: "100%",
                          }}
                          id="retro-element-name-row"
                        >
                          <span
                            style={{
                              fontSize: 12,
                              fontWeight: 800,
                              color: "#ffffff",
                              letterSpacing: "0.5px",
                              fontFamily: "sans-serif",
                            }}
                            id="retro-element-player-name"
                          >
                            {playerDetails.playerName}
                          </span>
                          {playerDetails.displayFields?.rank && (
                            <span
                              style={{
                                fontSize: 24,
                                fontWeight: 900,
                                color:
                                  playerDetails.rankInfo?.color ||
                                  activePreset.border,
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                                fontFamily: "monospace",
                                lineHeight: 1,
                              }}
                              id="retro-element-rank-name"
                            >
                              {playerDetails.tierName}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        {/* ROW 2: RR POINTS, MATCH GAIN, SEASON TAG */}
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                          }}
                          id="retro-element-meta-row"
                        >
                          {playerDetails.displayFields?.rr &&
                            typeof playerDetails.rr === "number" && (
                              <span
                                style={{
                                  fontSize: 12,
                                  fontWeight: 800,
                                  color: "#fff",
                                  fontFamily: "monospace",
                                }}
                                id="retro-element-rr-counter"
                              >
                                {playerDetails.rr}{" "}
                                <span style={{ fontSize: 9, opacity: 0.8 }}>
                                  RR
                                </span>
                              </span>
                            )}

                          {playerDetails.displayFields?.rr &&
                            typeof playerDetails.lastChange === "number" &&
                            !playerDetails.isDemo && (
                              <span
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  gap: "6px",
                                  fontSize: 10,
                                  fontWeight: 800,
                                  padding: "1px 6px",
                                  background: "rgba(0,0,0,0.4)",
                                  border: `1px solid ${playerDetails.lastChange >= 0 ? "#2dd4a8" : "#ef4444"}`,
                                  color:
                                    playerDetails.lastChange >= 0
                                      ? "#2dd4a8"
                                      : "#ef4444",
                                  fontFamily: "monospace",
                                }}
                                id="retro-element-rr-change"
                              >
                                {playerDetails.lastChange >= 0 ? "+" : ""}
                                {playerDetails.lastChange} RR
                              </span>
                            )}
                        </div>
                        {/* 3. RETRO LED CLOCK */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "6px",
                          marginLeft: "auto",
                        }}
                        id="retro-element-clock-area"
                      >
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 700,
                            color: "rgba(255,255,255,0.85)",
                            fontFamily: "monospace",
                          }}
                          id="retro-element-clock"
                        >
                          {playerDetails.updatedLabel}
                        </span>
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            background: activePreset.border,
                            boxShadow: `0 0 6px ${activePreset.border}`,
                          }}
                          id="retro-element-live-led"
                        />
                      </div>
                      </div>
                    </div>
                  </>
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
    zIndex: 1,
    borderRadius: "0px",
  },
  card: {
    position: "relative",
    display: "flex",
    alignItems: "center",
    textShadow: "0 2px 0 #000",
    overflow: "visible",
    borderRadius: "0px",
  },
  scanlines: {
    position: "absolute",
    inset: 0,
    background:
      "repeating-linear-gradient(0deg, rgba(0, 0, 0, 0.45) 0px, rgba(0, 0, 0, 0.45) 1px, transparent 1px, transparent 3px)",
    pointerEvents: "none",
    zIndex: 2,
  },
  contentContainer: {
    position: "relative",
    zIndex: 4,
    display: "flex",
    alignItems: "center",
    width: "100%",
  },
};
