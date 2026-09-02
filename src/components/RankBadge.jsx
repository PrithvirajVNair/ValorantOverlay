/**
 * RankBadge — Displays a VALORANT competitive rank icon alongside
 * the rank name and optional RR value, featuring an Apple Liquid Glass emblem look.
 */

import { getRankIconUrl, getRankInfo } from "../data/ranks";

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "var(--sp-3)",
  },
  iconContainer: {
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
    overflow: "hidden",
  },
  iconSpecHighlight: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    height: "50%",
    background: "linear-gradient(180deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0) 100%)",
    pointerEvents: "none",
  },
  icon: {
    objectFit: "contain",
    filter: "drop-shadow(0 4px 8px rgba(0, 0, 0, 0.5))",
    transition: "transform var(--transition-base)",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "2px",
  },
  rankName: {
    fontSize: "14px",
    fontWeight: 800,
    letterSpacing: "0.6px",
    lineHeight: 1.1,
    textTransform: "uppercase",
    textShadow: "0 2px 8px rgba(0,0,0,0.92), 0 1px 1px rgba(0,0,0,0.8)",
  },
  rrContainer: {
    display: "flex",
    alignItems: "center",
    gap: "4px",
  },
  rr: {
    fontSize: "12px",
    fontWeight: 700,
    color: "#ffffff",
    letterSpacing: "0.4px",
    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
  },
  rrLabel: {
    fontSize: "10px",
    fontWeight: 800,
    color: "rgba(255, 255, 255, 0.85)",
    textTransform: "uppercase",
    textShadow: "0 1px 3px rgba(0,0,0,0.9)",
  },
};

/**
 * @param {Object} props
 * @param {number} props.tierId      — Competitive tier ID (0–27)
 * @param {string} [props.tierName]  — Tier name override (from API)
 * @param {number} [props.rr]        — Rank rating (0–100)
 * @param {boolean} [props.showRR]   — Whether to show the RR value
 * @param {number} [props.iconSize]  — Icon size in px (default 42)
 * @param {boolean} [props.hideText] — Hide rank text labels (for capsule layout)
 */
export default function RankBadge({
  tierId,
  tierName,
  rr,
  showRR = true,
  iconSize = 42,
  hideText = false,
}) {
  const rankInfo = getRankInfo(tierId);
  const iconUrl = getRankIconUrl(tierId);
  const displayName = tierName || rankInfo.name;

  return (
    <div style={styles.wrapper}>
      <div style={{ ...styles.iconContainer, width: iconSize + 12, height: iconSize + 12 }}>
        <div style={styles.iconSpecHighlight} />
        <img
          src={iconUrl}
          alt={displayName}
          style={{ ...styles.icon, width: iconSize, height: iconSize }}
          loading="lazy"
        />
      </div>

      {!hideText && (
        <div style={styles.info}>
          <span style={{ ...styles.rankName, color: rankInfo.color }}>
            {displayName}
          </span>
          {showRR && typeof rr === "number" && (
            <div style={styles.rrContainer}>
              <span style={styles.rr}>{rr}</span>
              <span style={styles.rrLabel}>RR</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
