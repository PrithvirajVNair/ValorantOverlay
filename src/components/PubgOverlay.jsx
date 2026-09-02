/**
 * PubgOverlay — Transparent Stream Overlay for PUBG PC.
 */

import { useMemo } from 'react';
import { Crosshair, RefreshCw, Settings, Trophy } from 'lucide-react';
import usePubgData from '../hooks/usePubgData';
import { getPubgRankInfo } from '../data/pubgRanks.jsx';
import ErrorBanner from './ErrorBanner';

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
    padding: 'var(--sp-3) var(--sp-4) var(--sp-3) var(--sp-2)',
    background: 'rgba(15, 20, 26, 0.92)',
    borderRadius: 'var(--radius-md)',
    border: '1px solid rgba(243, 156, 18, 0.3)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.6)',
    overflow: 'hidden',
    minWidth: 290,
  },
  accentBar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 3,
    background: 'linear-gradient(180deg, #f39c12, #d35400)',
    borderRadius: '3px 0 0 3px',
  },
  badgeSection: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 42,
    height: 42,
    borderRadius: '10px',
    flexShrink: 0,
    fontSize: '22px',
  },
  infoSection: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    minWidth: 0,
  },
  nameRow: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 'var(--sp-2)',
  },
  playerName: {
    fontFamily: 'var(--font-heading)',
    fontSize: 18,
    letterSpacing: '0.8px',
    color: '#fff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  platformTag: {
    fontSize: 11,
    fontWeight: 700,
    color: '#f39c12',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  metaRow: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-2)',
    flexWrap: 'wrap',
  },
  metaPillKd: {
    fontSize: 12,
    fontWeight: 800,
    color: '#2dd4a8',
    background: 'rgba(45, 212, 168, 0.12)',
    border: '1px solid rgba(45, 212, 168, 0.25)',
    padding: '1px 7px',
    borderRadius: 4,
    whiteSpace: 'nowrap',
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
    color: 'rgba(236, 232, 225, 0.35)',
    whiteSpace: 'nowrap',
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
  loadingDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 6,
    height: 6,
    borderRadius: '50%',
    background: '#f39c12',
    animation: 'pulse 1.4s ease-in-out infinite',
  },
};

export default function PubgOverlay({ apiKey, config, onBack }) {
  const { data, loading, error, lastUpdated, refresh } = usePubgData({
    apiKey,
    playerName: config.playerName,
    platform: config.platform || 'steam',
  });

  const showSkeleton = loading && !data && !error;
  const rankInfo = getPubgRankInfo(data?.rank || 'Unranked');

  const updatedLabel = useMemo(() => {
    if (!lastUpdated) return 'Live';
    return lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }, [lastUpdated]);

  const display = config.displayFields || { rank: true, kd: true, wins: true, damage: true, matches: true };

  return (
    <div style={s.root}>
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

      {/* 1. Skeleton loader — shown during initial fetch */}
      {showSkeleton && (
        <div style={s.card} className="fade-in" id="overlay-card-skeleton">
          <div style={s.accentBar} />
          <div style={s.badgeSection}>
            <div
              className="skeleton"
              style={{ width: 42, height: 42, borderRadius: 10 }}
            />
          </div>
          <div style={s.infoSection}>
            <div
              className="skeleton"
              style={{ width: 110, height: 16, marginBottom: 6 }}
            />
            <div style={s.metaRow}>
              <div className="skeleton" style={{ width: 55, height: 14 }} />
              <div className="skeleton" style={{ width: 60, height: 14 }} />
              <div className="skeleton" style={{ width: 50, height: 14 }} />
            </div>
          </div>
          <div style={s.timeSection}>
            <div className="skeleton" style={{ width: 35, height: 10 }} />
          </div>
          <div style={s.loadingDot} />
        </div>
      )}

      {/* 2. Error message banner — shown if fetch failed */}
      {error && !loading && (
        <div style={{ maxWidth: 340 }}>
          <ErrorBanner error={error} />
        </div>
      )}

      {/* 3. Live PUBG Card — shown once data is loaded */}
      {data && !showSkeleton && (
        <div style={s.card} className="fade-in" id="overlay-card">
          <div style={s.accentBar} />

          {/* Rank Icon / Badge */}
          <div
            style={{
              ...s.badgeSection,
              background: rankInfo.bg,
              border: `1px solid ${rankInfo.border}`,
            }}
            title={rankInfo.name}
          >
            {rankInfo.icon}
          </div>

          {/* Player Stats */}
          <div style={s.infoSection}>
            <div style={s.nameRow}>
              <span style={s.playerName}>{data.name}</span>
              <span style={s.platformTag}>{data.platform || 'STEAM'}</span>
            </div>

            <div style={s.metaRow}>
              {display.rank !== false && (
                <span
                  style={{
                    ...s.metaPill,
                    color: rankInfo.color,
                    border: `1px solid ${rankInfo.border}`,
                    background: rankInfo.bg,
                    fontWeight: 700,
                  }}
                >
                  {data.rank || 'Unranked'}
                </span>
              )}

              {display.kd !== false && (
                <span style={s.metaPillKd}>K/D {data.kd}</span>
              )}

              {display.wins !== false && (
                <span style={s.metaPill}><Trophy size={12} aria-hidden="true" /> {data.wins} WINS</span>
              )}

              {display.damage !== false && (
                <span style={s.metaPill}><Crosshair size={12} aria-hidden="true" /> {data.avgDamage} DMG</span>
              )}

              {display.matches !== false && (
                <span style={s.metaPill}>MATCHES {data.matches}</span>
              )}
            </div>
          </div>

          {/* Updated timestamp */}
          <div style={s.timeSection}>
            <span style={s.timeLabel}>{updatedLabel}</span>
          </div>

          {loading && <div style={s.loadingDot} />}
        </div>
      )}

      {!loading && data && (
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
  );
}
