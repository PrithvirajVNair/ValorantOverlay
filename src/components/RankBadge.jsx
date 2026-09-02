/**
 * RankBadge — Displays a VALORANT competitive rank icon alongside
 * the rank name and optional RR value. Color-coded by tier.
 */

import { getRankIconUrl, getRankInfo } from "../data/ranks";

const styles = {
  wrapper: {
    display: "flex",
    alignItems: "center",
    gap: "var(--sp-2)",
  },
  icon: {
    width: 40,
    height: 40,
    objectFit: "contain",
    filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.4))",
    transition: "transform var(--transition-base)",
  },
  info: {
    display: "flex",
    flexDirection: "column",
    gap: "1px",
  },
  rankName: {
    fontSize: "14px",
    fontWeight: 700,
    letterSpacing: "0.3px",
    lineHeight: 1.2,
    textTransform: "uppercase",
  },
  rr: {
    fontSize: "12px",
    fontWeight: 500,
    color: "var(--val-cream-dim)",
  },
};

/**
 * @param {Object} props
 * @param {number} props.tierId      — Competitive tier ID (0–27)
 * @param {string} [props.tierName]  — Tier name override (from API)
 * @param {number} [props.rr]        — Rank rating (0–100)
 * @param {boolean} [props.showRR]   — Whether to show the RR value
 * @param {number} [props.iconSize]  — Icon size in px (default 40)
 */
export default function RankBadge({
  tierId,
  tierName,
  rr,
  showRR = true,
  iconSize = 40,
}) {
  const rankInfo = getRankInfo(tierId);
  const iconUrl = getRankIconUrl(tierId);
  const displayName = tierName || rankInfo.name;

  return (
    <div style={styles.wrapper}>
      <img
        src={iconUrl}
        alt={displayName}
        style={{ ...styles.icon, width: iconSize, height: iconSize }}
        loading="lazy"
      />
      <div style={styles.info}>
        <span style={{ ...styles.rankName, color: rankInfo.color }}>
          {displayName}
        </span>
        {showRR && typeof rr === "number" && (
          <span style={styles.rr}>{rr} RR</span>
        )}
      </div>
    </div>
  );
}
