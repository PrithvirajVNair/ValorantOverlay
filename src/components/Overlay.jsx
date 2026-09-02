/**
 * Overlay — The actual OBS Browser Source overlay.
 *
 * This component renders on a fully TRANSPARENT background so it
 * composites cleanly over game footage in OBS. It shows:
 *   - Player name#tag
 *   - Competitive rank + icon
 *   - Rank Rating (RR)
 *   - Current act/season
 *   - Peak rank (optional)
 *   - Last updated timestamp
 *
 * All fields are individually toggleable via config.displayFields.
 * When no data is available, placeholder/demo content is shown.
 */

import { useMemo } from 'react';
import RankBadge from './RankBadge';
import ErrorBanner from './ErrorBanner';
import usePlayerData from '../hooks/usePlayerData';
import { getRankInfo } from '../data/ranks';

// Demo data shown when no API connection is configured
const DEMO_DATA = {
  account: { name: 'PlayerName', tag: '0000', account_level: 142 },
  mmr: {
    current: { tier: { id: 19, name: 'Diamond 2' }, rr: 67, last_change: 22 },
    seasonal: [{ season: { short: 'e9a2' }, games: 48, wins: 28 }],
    peak: { tier: { id: 22, name: 'Ascendant 2' }, season: { short: 'e8a3' } },
  },
};

/**
 * @param {Object} props
 * @param {string} props.apiKey
 * @param {Object} props.config
 * @param {Function} props.onBack — return to setup
 */
export default function Overlay({ apiKey, config, onBack }) {
  const { playerData, loading, error, lastUpdated, refresh, rateLimited, retryIn } =
    usePlayerData({
      apiKey,
      playerName: config.playerName,
      playerTag: config.playerTag,
      region: config.region,
    });

  // Use real data or demo placeholder
  const data = playerData || DEMO_DATA;
  const isDemo = !playerData;
  const { displayFields } = config;

  // Derived values
  const current = data.mmr?.current;
  const tierId = current?.tier?.id ?? 0;
  const tierName = current?.tier?.name;
  const rr = current?.rr;
  const lastChange = current?.last_change;

  const currentSeason = useMemo(() => {
    if (!data.mmr?.seasonal?.length) return null;
    const latest = data.mmr.seasonal[data.mmr.seasonal.length - 1];
    return latest?.season?.short || null;
  }, [data.mmr?.seasonal]);

  const peak = data.mmr?.peak;

  const updatedLabel = useMemo(() => {
    if (!lastUpdated) return 'Never';
    return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [lastUpdated]);
  // Show skeleton on initial load (no data yet)
  const showSkeleton = loading && !playerData;

  return (
    <div style={s.root}>
      {/* Settings gear — visible on hover, hidden from OBS normally */}
      <button
        type="button"
        onClick={onBack}
        style={s.settingsBtn}
        title="Back to settings"
        id="overlay-settings-btn"
        aria-label="Open settings"
      >
        ⚙
      </button>

      {/* Skeleton loader — shown during initial fetch */}
      {showSkeleton && (
        <div style={s.card} className="fade-in" id="overlay-card">
          <div style={s.accentBar} />
          <div style={s.rankSection}>
            <div className="skeleton" style={{ width: 44, height: 44, borderRadius: '50%' }} />
          </div>
          <div style={s.infoSection}>
            <div className="skeleton" style={{ width: 120, height: 16, marginBottom: 6 }} />
            <div style={s.metaRow}>
              <div className="skeleton" style={{ width: 60, height: 14 }} />
              <div className="skeleton" style={{ width: 45, height: 14 }} />
            </div>
          </div>
          <div style={s.timeSection}>
            <div className="skeleton" style={{ width: 40, height: 10 }} />
          </div>
          <div style={s.loadingDot} />
        </div>
      )}

      {/* Main overlay card — hidden during skeleton */}
      {!showSkeleton && (
        <div
          style={{
            ...s.card,
            ...(isDemo ? s.cardDemo : {}),
          }}
          className="fade-in"
          id="overlay-card"
        >
          {/* Left accent bar */}
          <div style={s.accentBar} />

          {/* Rank icon */}
          {displayFields.rank && (
            <div style={s.rankSection}>
              <RankBadge
                tierId={tierId}
                tierName={tierName}
                rr={displayFields.rr ? rr : undefined}
                showRR={displayFields.rr}
                iconSize={44}
              />
            </div>
          )}

          {/* Player info */}
          <div style={s.infoSection}>
            {/* Name#Tag */}
            <div style={s.nameRow}>
              <span style={s.playerName}>{data.account?.name || config.playerName}</span>
              <span style={s.playerTag}>#{data.account?.tag || config.playerTag}</span>
            </div>

            {/* Meta row: RR change, season, peak */}
            <div style={s.metaRow}>
              {displayFields.rr && typeof lastChange === 'number' && !isDemo && (
                <span style={{
                  ...s.metaPill,
                  color: lastChange >= 0 ? '#2dd4a8' : '#ef4444',
                }}>
                  {lastChange >= 0 ? '+' : ''}{lastChange} RR
                </span>
              )}

              {displayFields.season && currentSeason && (
                <span style={s.metaPill}>
                  {currentSeason.toUpperCase()}
                </span>
              )}

              {displayFields.peakRank && peak?.tier && (
                <span style={s.metaPill} title="Peak rank">
                  ▲ {peak.tier.name}
                </span>
              )}
            </div>
          </div>

          {/* Updated time */}
          <div style={s.timeSection}>
            <span style={s.timeLabel}>{updatedLabel}</span>
          </div>

          {/* Loading indicator (for refreshes, not initial load) */}
          {loading && <div style={s.loadingDot} />}
        </div>
      )}

      {/* Demo label */}
      {isDemo && !loading && (
        <div style={s.demoLabel}>Preview — connect an API key to see live data</div>
      )}

      {/* Error banner (always visible when there's an error) */}
      {error && (
        <div style={s.errorWrap}>
          <ErrorBanner error={error} retryIn={retryIn} />
        </div>
      )}

      {/* Manual refresh */}
      {!isDemo && !loading && !rateLimited && (
        <button
          type="button"
          onClick={refresh}
          style={s.refreshBtn}
          title="Refresh now"
          id="overlay-refresh-btn"
        >
          ↻
        </button>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Styles — transparent background, glassmorphic card
// ---------------------------------------------------------------------------

const s = {
  root: {
    position: 'relative',
    display: 'inline-flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 'var(--sp-2)',
    padding: 'var(--sp-4)',
    fontFamily: 'var(--font-sans)',
  },
  card: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-3)',
    padding: 'var(--sp-3) var(--sp-4) var(--sp-3) var(--sp-1)',
    background: 'rgba(10, 17, 23, 0.82)',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(236, 232, 225, 0.08)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
    overflow: 'hidden',
    minWidth: 280,
  },
  cardDemo: {
    opacity: 0.75,
    border: '1px dashed rgba(236, 232, 225, 0.15)',
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    background: 'linear-gradient(180deg, var(--val-red), var(--val-red-dark))',
    borderRadius: '3px 0 0 3px',
  },
  rankSection: {
    flexShrink: 0,
    paddingLeft: 'var(--sp-2)',
  },
  infoSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--sp-1)',
  },
  playerName: {
    fontSize: 15,
    fontWeight: 700,
    color: 'var(--val-cream)',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  playerTag: {
    fontSize: 12,
    fontWeight: 500,
    color: 'var(--val-cream-dim)',
    whiteSpace: 'nowrap',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-2)',
    flexWrap: 'wrap',
  },
  metaPill: {
    fontSize: 11,
    fontWeight: 600,
    color: 'var(--val-cream-dim)',
    background: 'rgba(255,255,255,0.06)',
    padding: '1px 6px',
    borderRadius: 4,
    whiteSpace: 'nowrap',
  },
  timeSection: {
    flexShrink: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
  },
  timeLabel: {
    fontSize: 10,
    fontWeight: 500,
    color: 'rgba(236, 232, 225, 0.35)',
    whiteSpace: 'nowrap',
  },
  loadingDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: 'var(--val-success)',
    animation: 'pulse 1.4s ease-in-out infinite',
  },
  settingsBtn: {
    position: 'absolute',
    top: 2,
    right: 2,
    background: 'none',
    border: 'none',
    color: 'var(--val-cream-dim)',
    fontSize: 16,
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity var(--transition-fast)',
    zIndex: 10,
    padding: 4,
  },
  refreshBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    background: 'none',
    border: 'none',
    color: 'var(--val-cream-dim)',
    fontSize: 14,
    cursor: 'pointer',
    opacity: 0,
    transition: 'opacity var(--transition-fast)',
    padding: 4,
  },
  demoLabel: {
    fontSize: 10,
    color: 'rgba(236, 232, 225, 0.3)',
    fontStyle: 'italic',
  },
  errorWrap: {
    maxWidth: 320,
  },
};
