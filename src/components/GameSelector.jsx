/**
 * GameSelector — Initial game selection screen.
 * Allows user to pick between VALORANT and PUBG PC overlays.
 */

import { Circle } from "lucide-react";

const s = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--sp-6)',
    background: 'linear-gradient(145deg, #070d14 0%, #0d1622 50%, #121e2d 100%)',
    fontFamily: 'var(--font-sans)',
  },
  header: {
    textAlign: 'center',
    marginBottom: 'var(--sp-8)',
  },
  badge: {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '20px',
    background: 'rgba(255, 70, 85, 0.15)',
    border: '1px solid rgba(255, 70, 85, 0.3)',
    color: 'var(--val-red)',
    fontSize: '12px',
    fontWeight: 700,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    marginBottom: 'var(--sp-3)',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: '36px',
    letterSpacing: '2px',
    color: 'var(--val-cream)',
    textTransform: 'uppercase',
    margin: 0,
    lineHeight: 1.1,
  },
  subtitle: {
    fontSize: '14px',
    color: 'var(--val-cream-dim)',
    marginTop: 'var(--sp-2)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 320px))',
    gap: 'var(--sp-6)',
    width: '100%',
    maxWidth: '700px',
    justifyContent: 'center',
  },
  card: {
    position: 'relative',
    background: 'rgba(20, 30, 42, 0.75)',
    backdropFilter: 'blur(16px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--val-border)',
    padding: 'var(--sp-6)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: 'var(--sp-4)',
    cursor: 'pointer',
    transition: 'all var(--transition-base)',
    overflow: 'hidden',
    textAlign: 'left',
  },
  cardHoverValo: {
    border: '1px solid rgba(255, 70, 85, 0.5)',
    boxShadow: '0 12px 32px rgba(255, 70, 85, 0.2)',
    transform: 'translateY(-4px)',
  },
  cardHoverPubg: {
    border: '1px solid rgba(243, 156, 18, 0.5)',
    boxShadow: '0 12px 32px rgba(243, 156, 18, 0.2)',
    transform: 'translateY(-4px)',
  },
  gameIconWrap: {
    width: 56,
    height: 56,
    borderRadius: 'var(--radius-md)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    fontWeight: 800,
  },
  iconValo: {
    background: 'linear-gradient(135deg, #ff4655, #bd3944)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(255, 70, 85, 0.4)',
  },
  iconPubg: {
    background: 'linear-gradient(135deg, #f39c12, #d35400)',
    color: '#fff',
    boxShadow: '0 4px 16px rgba(243, 156, 18, 0.4)',
  },
  gameMeta: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  gameTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: '24px',
    letterSpacing: '1px',
    color: 'var(--val-cream)',
    margin: 0,
    textTransform: 'uppercase',
  },
  gameDesc: {
    fontSize: '13px',
    color: 'var(--val-cream-dim)',
    lineHeight: 1.4,
  },
  tagRow: {
    display: 'flex',
    gap: '6px',
    marginTop: 'auto',
  },
  tag: {
    fontSize: '11px',
    fontWeight: 600,
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'var(--val-cream-dim)',
  },
  statusReady: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(45, 212, 168, 0.15)',
    color: '#2dd4a8',
    border: '1px solid rgba(45, 212, 168, 0.3)',
  },
  statusComingSoon: {
    fontSize: '11px',
    fontWeight: 700,
    padding: '2px 8px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.08)',
    color: 'rgba(255, 255, 255, 0.5)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
  },
};

export default function GameSelector({ onSelectGame }) {
  const [hovered, setHovered] = useState(null);

  return (
    <div style={s.container} className="site-ui game-selector-page">
      <div style={s.header} className="fade-in">
        <span style={s.badge}>OBS Stream Overlay Hub</span>
        <h1 style={s.title}>Select Your Game</h1>
        <p style={s.subtitle}>
          Choose a game to customize your live statistics stream overlay for OBS
        </p>
      </div>

      <div style={s.grid} className="fade-in">
        {/* VALORANT CARD */}
        <div
          style={{
            ...s.card,
            ...(hovered === 'valorant' ? s.cardHoverValo : {}),
          }}
          onMouseEnter={() => setHovered('valorant')}
          onMouseLeave={() => setHovered(null)}
          onClick={() => onSelectGame('valorant')}
          id="select-game-valorant"
          role="button"
          tabIndex={0}
        >
          <div style={{ ...s.gameIconWrap, ...s.iconValo }}>
            V
          </div>
          <div style={s.gameMeta}>
            <h2 style={s.gameTitle}>VALORANT</h2>
            <p style={s.gameDesc}>
              Real-time Competitive Rank, Rank Rating (RR), Act Season info & Peak Rank tracking.
            </p>
          </div>
          <div style={s.tagRow}>
            <span style={s.statusReady}><Circle size={8} fill="currentColor" aria-hidden="true" /> READY</span>
            <span style={s.tag}>Rank & RR</span>
            <span style={s.tag}>Peak Rank</span>
          </div>
        </div>

        {/* PUBG PC CARD */}
        <div
          style={{
            ...s.card,
            opacity: 0.5,
            cursor: 'not-allowed',
            filter: 'grayscale(0.45)',
          }}
          id="select-game-pubg"
          aria-disabled="true"
        >
          <div style={{ ...s.gameIconWrap, ...s.iconPubg }}>
            P
          </div>
          <div style={s.gameMeta}>
            <h2 style={s.gameTitle}>PUBG PC</h2>
            <p style={s.gameDesc}>
              Live Player Statistics including K/D Ratio, Wins, Matches Played, Rank Tier & Avg Damage.
            </p>
          </div>
          <div style={s.tagRow}>
            <span style={s.statusComingSoon}>COMING SOON</span>
            <span style={s.tag}>K/D Ratio</span>
            <span style={s.tag}>Wins & Rank</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState } from 'react';
