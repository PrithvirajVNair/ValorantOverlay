/**
 * PubgSetupScreen — Configuration Panel for PUBG PC Overlay.
 */

import { useState, useEffect } from 'react';
import { ArrowLeft, Check, Copy, ExternalLink } from 'lucide-react';
import { loadPubgApiKey, savePubgApiKey, clearPubgApiKey } from '../utils/storage';
import ErrorBanner from './ErrorBanner';

const s = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--sp-6)',
    background: 'linear-gradient(145deg, #090e14 0%, #0e1722 50%, #152233 100%)',
    fontFamily: 'var(--font-sans)',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: 'rgba(20, 30, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid rgba(243, 156, 18, 0.25)',
    padding: 'var(--sp-8)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp-6)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.5)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  titleGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-3)',
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(135deg, #f39c12, #d35400)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    color: '#fff',
    fontSize: '20px',
    boxShadow: '0 4px 12px rgba(243, 156, 18, 0.35)',
  },
  title: {
    fontFamily: 'var(--font-heading)',
    fontSize: 24,
    letterSpacing: '1.5px',
    textTransform: 'uppercase',
    color: '#fff',
    margin: 0,
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--val-cream-dim)',
    margin: 0,
  },
  backGameBtn: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid var(--val-border)',
    color: 'var(--val-cream)',
    fontSize: 12,
    fontWeight: 600,
    padding: '6px 12px',
    borderRadius: 'var(--radius-sm)',
    cursor: 'pointer',
    transition: 'all var(--transition-fast)',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp-3)',
    transition: 'opacity var(--transition-base)',
  },
  sectionTitle: {
    fontFamily: 'var(--font-heading)',
    fontSize: 16,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-2)',
    margin: 0,
  },
  sectionNumber: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: 22,
    height: 22,
    borderRadius: '50%',
    background: '#f39c12',
    color: '#fff',
    fontFamily: 'var(--font-sans)',
    fontSize: 11,
    fontWeight: 800,
    flexShrink: 0,
  },
  inputGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp-1)',
  },
  label: {
    fontSize: 12,
    fontWeight: 600,
    color: 'var(--val-cream-dim)',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
  },
  inputRow: {
    display: 'flex',
    gap: 'var(--sp-2)',
  },
  input: {
    flex: 1,
    padding: 'var(--sp-2) var(--sp-3)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--val-border)',
    background: 'rgba(0,0,0,0.25)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
  },
  monoInput: {
    fontFamily: 'ui-monospace, Consolas, monospace',
    fontSize: 12,
    letterSpacing: '0.5px',
  },
  select: {
    padding: 'var(--sp-2) var(--sp-3)',
    borderRadius: 'var(--radius-sm)',
    border: '1px solid var(--val-border)',
    background: 'rgba(0,0,0,0.25)',
    color: '#fff',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 'var(--sp-3)',
  },
  checkLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-2)',
    fontSize: 13,
    color: 'var(--val-cream-dim)',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#f39c12',
    cursor: 'pointer',
  },
  link: {
    fontSize: 13,
    color: '#f39c12',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'opacity var(--transition-fast)',
  },
  toggleGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: 'var(--sp-2)',
  },
  toggleLabel: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-2)',
    fontSize: 13,
    color: 'var(--val-cream-dim)',
    cursor: 'pointer',
    padding: 'var(--sp-2) var(--sp-3)',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(0,0,0,0.15)',
    border: '1px solid var(--val-border)',
  },
  btnPrimary: {
    fontFamily: 'var(--font-heading)',
    padding: 'var(--sp-2) var(--sp-4)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: '#f39c12',
    color: '#fff',
    fontSize: 15,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    whiteSpace: 'nowrap',
    flexShrink: 0,
  },
  btnGhost: {
    background: 'none',
    border: 'none',
    color: 'var(--val-cream-dim)',
    fontSize: 12,
    cursor: 'pointer',
    textDecoration: 'underline',
    textUnderlineOffset: '2px',
  },
  btnLaunch: {
    fontFamily: 'var(--font-heading)',
    width: '100%',
    padding: 'var(--sp-3) var(--sp-4)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'linear-gradient(135deg, #f39c12, #d35400)',
    color: '#fff',
    fontSize: 18,
    textTransform: 'uppercase',
    letterSpacing: '2px',
    cursor: 'pointer',
    boxShadow: '0 4px 16px rgba(243, 156, 18, 0.35)',
  },
  obsSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp-2)',
    padding: 'var(--sp-4)',
    borderRadius: 'var(--radius-sm)',
    background: 'rgba(0,0,0,0.2)',
    border: '1px solid var(--val-border)',
  },
  hint: {
    fontSize: 12,
    color: 'var(--val-cream-dim)',
    textAlign: 'center',
    margin: 0,
  },
};

export default function PubgSetupScreen({
  apiKey,
  onApiKeyChange,
  config,
  onConfigChange,
  onLaunch,
  onChangeGame,
}) {
  const [keyInput, setKeyInput] = useState(apiKey || loadPubgApiKey() || '');
  const [remember, setRemember] = useState(Boolean(loadPubgApiKey()));
  const [error, setError] = useState(null);
  const [keyValid, setKeyValid] = useState(Boolean(apiKey || loadPubgApiKey()));
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const saved = apiKey || loadPubgApiKey();
    if (saved) {
      setKeyInput(saved);
      setKeyValid(true);
      if (!apiKey) onApiKeyChange(saved);
    }
  }, [apiKey, onApiKeyChange]);

  const handleConnect = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setError({ type: 'auth', message: 'Please enter a PUBG (Krafton) API key.' });
      return;
    }
    if (trimmed.length < 15) {
      setError({
        type: 'auth',
        message: 'API key seems too short. Check your Krafton API key.',
      });
      return;
    }

    setError(null);
    setKeyValid(true);
    onApiKeyChange(trimmed);

    if (remember) {
      savePubgApiKey(trimmed);
    } else {
      clearPubgApiKey();
    }
  };

  const handleClearKey = () => {
    clearPubgApiKey();
    setKeyInput('');
    setKeyValid(false);
    setRemember(false);
    onApiKeyChange('');
    setError(null);
  };

  const handleFieldToggle = (field) => {
    onConfigChange({
      ...config,
      displayFields: {
        ...config.displayFields,
        [field]: !config.displayFields?.[field],
      },
    });
  };

  // Generate OBS URL for PUBG
  const buildObsUrl = () => {
    const params = new URLSearchParams();
    params.set('game', 'pubg');
    if (apiKey) params.set('key', apiKey);
    params.set('name', config.playerName || 'Player');
    params.set('platform', config.platform || 'steam');

    const fields = config.displayFields || { rank: true, kd: true, wins: true, damage: true, matches: true };
    const enabled = Object.entries(fields)
      .filter(([, v]) => v)
      .map(([k]) => k);
    params.set('show', enabled.join(','));

    return `${window.location.origin}${window.location.pathname}#overlay?${params.toString()}`;
  };

  const handleCopyObsUrl = async () => {
    const url = buildObsUrl();
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      prompt('Copy this OBS Browser Source URL:', url);
    }
  };

  const canLaunch = keyValid && Boolean(config.playerName);

  return (
    <div style={s.container} className="site-ui pubg-setup-page">
      <div style={s.card} className="fade-in pubg-setup-card">
        {/* Header */}
        <div style={s.header}>
          <div style={s.titleGroup}>
            <div style={s.logoMark}>P</div>
            <div>
              <h1 style={s.title}>PUBG PC OVERLAY</h1>
              <p style={s.subtitle}>Live Player Stats Overlay for OBS</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onChangeGame}
            style={s.backGameBtn}
            id="pubg-change-game-btn"
          >
            <ArrowLeft size={15} aria-hidden="true" /> Change Game
          </button>
        </div>

        {/* Error Banner */}
        {error && (
          <ErrorBanner error={error} onDismiss={() => setError(null)} />
        )}

        {/* 1. KRAFTON API Key Section */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>
            <span style={s.sectionNumber}>1</span> KRAFTON API KEY
          </h2>

          <div style={s.inputGroup}>
            <label htmlFor="pubg-api-key-input" style={s.label}>
              PUBG / Krafton API Key
            </label>
            <div style={s.inputRow}>
              <input
                id="pubg-api-key-input"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6..."
                style={{ ...s.input, ...s.monoInput }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={handleConnect}
                style={s.btnPrimary}
                id="pubg-connect-btn"
              >
                {keyValid ? <><Check size={14} aria-hidden="true" /> Connected</> : 'Connect'}
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
                  if (!e.target.checked) clearPubgApiKey();
                  else if (keyInput.trim()) savePubgApiKey(keyInput.trim());
                }}
                style={s.checkbox}
                id="pubg-remember-key-checkbox"
              />
              Remember API key
            </label>

            <button
              type="button"
              onClick={handleClearKey}
              style={s.btnGhost}
              id="pubg-clear-key-btn"
            >
              Clear saved key
            </button>
          </div>

          <a
            href="https://developer.pubg.com/"
            target="_blank"
            rel="noopener noreferrer"
            style={s.link}
            id="pubg-get-api-key-link"
          >
            Get a PUBG API key <ExternalLink size={14} aria-hidden="true" />
          </a>
        </section>

        {/* 2. Player Info */}
        <div
          style={{
            ...s.section,
            opacity: keyValid ? 1 : 0.4,
            pointerEvents: keyValid ? 'auto' : 'none',
          }}
        >
          <h2 style={s.sectionTitle}>
            <span style={s.sectionNumber}>2</span> PLAYER INFO
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 160px', gap: 'var(--sp-2)' }}>
            <div style={s.inputGroup}>
              <label style={s.label} htmlFor="pubg-player-name">
                PLAYER IGN (IN-GAME NAME)
              </label>
              <input
                id="pubg-player-name"
                type="text"
                value={config.playerName || ''}
                onChange={(e) =>
                  onConfigChange({ ...config, playerName: e.target.value })
                }
                placeholder="e.g. shroud"
                style={s.input}
              />
            </div>

            <div style={s.inputGroup}>
              <label style={s.label} htmlFor="pubg-platform">
                PLATFORM
              </label>
              <select
                id="pubg-platform"
                value={config.platform || 'steam'}
                onChange={(e) =>
                  onConfigChange({ ...config, platform: e.target.value })
                }
                style={s.select}
              >
                <option value="steam">Steam (PC)</option>
                <option value="kakao">Kakao (PC)</option>
                <option value="xbox">Xbox</option>
                <option value="psn">PlayStation</option>
              </select>
            </div>
          </div>
        </div>

        {/* 3. Display Settings */}
        <div
          style={{
            ...s.section,
            opacity: keyValid ? 1 : 0.4,
            pointerEvents: keyValid ? 'auto' : 'none',
          }}
        >
          <h2 style={s.sectionTitle}>
            <span style={s.sectionNumber}>3</span> DISPLAY SETTINGS
          </h2>
          <div style={s.toggleGrid}>
            <label style={s.toggleLabel}>
              <input
                type="checkbox"
                checked={config.displayFields?.rank !== false}
                onChange={() => handleFieldToggle('rank')}
              />
              Rank Tier
            </label>
            <label style={s.toggleLabel}>
              <input
                type="checkbox"
                checked={config.displayFields?.kd !== false}
                onChange={() => handleFieldToggle('kd')}
              />
              K/D Ratio
            </label>
            <label style={s.toggleLabel}>
              <input
                type="checkbox"
                checked={config.displayFields?.wins !== false}
                onChange={() => handleFieldToggle('wins')}
              />
              Total Wins
            </label>
            <label style={s.toggleLabel}>
              <input
                type="checkbox"
                checked={config.displayFields?.damage !== false}
                onChange={() => handleFieldToggle('damage')}
              />
              Avg Damage
            </label>
            <label style={s.toggleLabel}>
              <input
                type="checkbox"
                checked={config.displayFields?.matches !== false}
                onChange={() => handleFieldToggle('matches')}
              />
              Total Matches
            </label>
          </div>
        </div>

        {/* Launch Button */}
        <button
          type="button"
          disabled={!canLaunch}
          onClick={onLaunch}
          style={{
            ...s.btnLaunch,
            opacity: canLaunch ? 1 : 0.4,
            cursor: canLaunch ? 'pointer' : 'not-allowed',
          }}
          id="pubg-launch-btn"
        >
          Launch PUBG Overlay
        </button>

        {/* 4. OBS Browser Source URL */}
        {canLaunch && (
          <div style={s.obsSection}>
            <h2 style={s.sectionTitle}>
              <span style={s.sectionNumber}>4</span> OBS BROWSER SOURCE
            </h2>
            <div style={s.inputRow}>
              <input
                type="text"
                readOnly
                value={buildObsUrl()}
                style={{ ...s.input, fontFamily: 'monospace', fontSize: 11 }}
              />
              <button
                type="button"
                onClick={handleCopyObsUrl}
                style={s.btnPrimary}
                id="pubg-copy-obs-url-btn"
              >
                {copied ? <><Check size={14} aria-hidden="true" /> COPIED!</> : <><Copy size={14} aria-hidden="true" /> COPY URL</>}
              </button>
            </div>
          </div>
        )}

        {!canLaunch && keyValid && (
          <p style={s.hint}>Enter a PUBG player IGN to continue.</p>
        )}
      </div>
    </div>
  );
}
