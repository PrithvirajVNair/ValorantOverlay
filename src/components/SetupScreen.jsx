/**
 * SetupScreen — Configuration UI for the VALORANT stream overlay.
 *
 * Lets the user enter their HenrikDev API key, Riot ID, region,
 * and toggle which fields appear on the overlay. This screen has a
 * normal dark background (not transparent) and is NOT the OBS view.
 */

import { useState, useEffect } from 'react';
import { loadApiKey, saveApiKey, clearApiKey } from '../utils/storage';
import { buildObsUrl } from '../App';
import ErrorBanner from './ErrorBanner';

const REGIONS = [
  { value: 'na',    label: 'North America' },
  { value: 'eu',    label: 'Europe' },
  { value: 'ap',    label: 'Asia Pacific' },
  { value: 'kr',    label: 'Korea' },
  { value: 'latam', label: 'Latin America' },
  { value: 'br',    label: 'Brazil' },
];

/**
 * @param {Object} props
 * @param {Object}   props.config       — current OverlayConfig
 * @param {Function} props.onConfigChange — (newConfig) => void
 * @param {Function} props.onLaunch     — called when "Launch Overlay" is clicked
 * @param {string}   props.apiKey       — current API key in state
 * @param {Function} props.onApiKeyChange — (newKey) => void
 */
export default function SetupScreen({
  config,
  onConfigChange,
  onLaunch,
  apiKey,
  onApiKeyChange,
}) {
  const [keyInput, setKeyInput] = useState(apiKey || '');
  const [remember, setRemember] = useState(!!loadApiKey());
  const [error, setError] = useState(null);
  const [keyValid, setKeyValid] = useState(!!apiKey);
  const [copied, setCopied] = useState(false);

  // Sync input if external apiKey changes (e.g. loaded from storage)
  useEffect(() => {
    if (apiKey) {
      setKeyInput(apiKey);
      setKeyValid(true);
    }
  }, [apiKey]);

  /** Validate and set the API key */
  const handleConnect = () => {
    const trimmed = keyInput.trim();
    if (!trimmed) {
      setError({ type: 'auth', message: 'Please enter an API key.' });
      return;
    }
    if (trimmed.length < 10) {
      setError({ type: 'auth', message: 'API key seems too short. Check your key.' });
      return;
    }

    setError(null);
    setKeyValid(true);
    onApiKeyChange(trimmed);

    if (remember) {
      saveApiKey(trimmed);
    } else {
      clearApiKey();
    }
  };

  /** Clear saved key and reset UI */
  const handleClearKey = () => {
    clearApiKey();
    setKeyInput('');
    setKeyValid(false);
    setRemember(false);
    onApiKeyChange('');
    setError(null);
  };

  const handleFieldChange = (name, value) => {
    onConfigChange({ ...config, [name]: value });
  };

  const handleDisplayToggle = (field) => {
    onConfigChange({
      ...config,
      displayFields: {
        ...config.displayFields,
        [field]: !config.displayFields[field],
      },
    });
  };

  /** Can only launch if key + player name are filled */
  const canLaunch = keyValid && config.playerName && config.playerTag;

  return (
    <div style={s.container}>
      <div style={s.card} className="fade-in">
        {/* Header */}
        <div style={s.header}>
          <div style={s.logoMark} />
          <div>
            <h1 style={s.title}>VALORANT Overlay</h1>
            <p style={s.subtitle}>Stream overlay for OBS Browser Source</p>
          </div>
        </div>

        {/* Error banner */}
        {error && <ErrorBanner error={error} onDismiss={() => setError(null)} />}

        {/* ---------- API Key Section ---------- */}
        <section style={s.section}>
          <h2 style={s.sectionTitle}>
            <span style={s.sectionNumber}>1</span>
            API Key
          </h2>

          <div style={s.inputGroup}>
            <label htmlFor="api-key-input" style={s.label}>HenrikDev API Key</label>
            <div style={s.inputRow}>
              <input
                id="api-key-input"
                type="password"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleConnect()}
                placeholder="HDEV-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
                style={{ ...s.input, ...s.monoInput }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="button"
                onClick={handleConnect}
                style={s.btnPrimary}
                id="connect-btn"
              >
                {keyValid ? '✓ Connected' : 'Connect'}
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
                  if (!e.target.checked) clearApiKey();
                  else if (keyInput.trim()) saveApiKey(keyInput.trim());
                }}
                style={s.checkbox}
                id="remember-key-checkbox"
              />
              Remember API key
            </label>

            <button
              type="button"
              onClick={handleClearKey}
              style={s.btnGhost}
              id="clear-key-btn"
            >
              Clear saved key
            </button>
          </div>

          <a
            href="https://api.henrikdev.xyz/dashboard/"
            target="_blank"
            rel="noopener noreferrer"
            style={s.link}
            id="get-api-key-link"
          >
            Get an API key →
          </a>
        </section>

        {/* ---------- Player Section ---------- */}
        <section style={{ ...s.section, opacity: keyValid ? 1 : 0.4, pointerEvents: keyValid ? 'auto' : 'none' }}>
          <h2 style={s.sectionTitle}>
            <span style={s.sectionNumber}>2</span>
            Player
          </h2>

          <div style={s.fieldGrid}>
            <div style={s.inputGroup}>
              <label htmlFor="player-name-input" style={s.label}>Riot ID Name</label>
              <input
                id="player-name-input"
                type="text"
                value={config.playerName}
                onChange={(e) => handleFieldChange('playerName', e.target.value)}
                placeholder="TenZ"
                style={s.input}
                maxLength={30}
              />
            </div>

            <div style={s.inputGroup}>
              <label htmlFor="player-tag-input" style={s.label}>Tag</label>
              <input
                id="player-tag-input"
                type="text"
                value={config.playerTag}
                onChange={(e) => handleFieldChange('playerTag', e.target.value)}
                placeholder="1"
                style={s.input}
                maxLength={10}
              />
            </div>

            <div style={s.inputGroup}>
              <label htmlFor="region-select" style={s.label}>Region</label>
              <select
                id="region-select"
                value={config.region}
                onChange={(e) => handleFieldChange('region', e.target.value)}
                style={s.select}
              >
                {REGIONS.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>
        </section>

        {/* ---------- Display Toggles ---------- */}
        <section style={{ ...s.section, opacity: keyValid ? 1 : 0.4, pointerEvents: keyValid ? 'auto' : 'none' }}>
          <h2 style={s.sectionTitle}>
            <span style={s.sectionNumber}>3</span>
            Display Settings
          </h2>

          <div style={s.toggleGrid}>
            {[
              { key: 'rank',     label: 'Competitive Rank' },
              { key: 'rr',       label: 'Rank Rating (RR)' },
              { key: 'season',   label: 'Current Act / Season' },
              { key: 'peakRank', label: 'Peak Rank' },
            ].map((item) => (
              <label key={item.key} style={s.toggleLabel} id={`toggle-${item.key}`}>
                <input
                  type="checkbox"
                  checked={config.displayFields[item.key]}
                  onChange={() => handleDisplayToggle(item.key)}
                  style={s.checkbox}
                />
                {item.label}
              </label>
            ))}
          </div>
        </section>

        {/* ---------- Launch ---------- */}
        <div style={{ display: 'flex', gap: 'var(--sp-2)' }}>
          <button
            type="button"
            onClick={onLaunch}
            disabled={!canLaunch}
            style={{
              ...s.btnLaunch,
              flex: 1,
              opacity: canLaunch ? 1 : 0.4,
              cursor: canLaunch ? 'pointer' : 'not-allowed',
            }}
            id="launch-overlay-btn"
          >
            Launch Overlay
          </button>
        </div>

        {/* ---------- OBS URL ---------- */}
        {canLaunch && (
          <div style={s.obsSection}>
            <h2 style={s.sectionTitle}>
              <span style={s.sectionNumber}>4</span>
              OBS Browser Source
            </h2>
            <p style={{ fontSize: 12, color: 'var(--val-cream-dim)', margin: 0 }}>
              Copy this URL into OBS → Sources → Browser Source. It contains all your config.
            </p>
            <div style={s.obsUrlRow}>
              <input
                type="text"
                readOnly
                value={buildObsUrl(apiKey, config)}
                style={{ ...s.input, ...s.monoInput, fontSize: 11, cursor: 'text' }}
                onFocus={(e) => e.target.select()}
                id="obs-url-input"
              />
              <button
                type="button"
                onClick={() => {
                  navigator.clipboard.writeText(buildObsUrl(apiKey, config));
                  setCopied(true);
                  setTimeout(() => setCopied(false), 2000);
                }}
                style={s.btnPrimary}
                id="copy-obs-url-btn"
              >
                {copied ? '✓ Copied' : 'Copy'}
              </button>
            </div>
          </div>
        )}

        {!canLaunch && keyValid && (
          <p style={s.hint}>Enter a player name and tag to continue.</p>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Inline styles — VALORANT-inspired dark setup panel
// ---------------------------------------------------------------------------

const s = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 'var(--sp-6)',
    background: 'linear-gradient(145deg, #0a1117 0%, #0f1923 50%, #131f2e 100%)',
  },
  card: {
    width: '100%',
    maxWidth: 520,
    background: 'rgba(20, 30, 42, 0.8)',
    backdropFilter: 'blur(20px)',
    borderRadius: 'var(--radius-lg)',
    border: '1px solid var(--val-border)',
    padding: 'var(--sp-8)',
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp-6)',
    boxShadow: '0 24px 64px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.03)',
  },
  header: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-4)',
  },
  logoMark: {
    width: 40,
    height: 40,
    borderRadius: 'var(--radius-sm)',
    background: 'linear-gradient(135deg, var(--val-red), var(--val-red-dark))',
    flexShrink: 0,
    boxShadow: '0 4px 12px var(--val-red-glow)',
  },
  title: {
    fontSize: 22,
    fontWeight: 800,
    letterSpacing: '1px',
    textTransform: 'uppercase',
    color: 'var(--val-cream)',
    margin: 0,
    lineHeight: 1.2,
  },
  subtitle: {
    fontSize: 13,
    color: 'var(--val-cream-dim)',
    margin: 0,
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
    gap: 'var(--sp-3)',
    transition: 'opacity var(--transition-base)',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1.2px',
    color: 'var(--val-cream)',
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
    background: 'var(--val-red)',
    color: '#fff',
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
    color: 'var(--val-cream)',
    fontSize: 14,
    outline: 'none',
    transition: 'border-color var(--transition-fast)',
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
    color: 'var(--val-cream)',
    fontSize: 14,
    outline: 'none',
    cursor: 'pointer',
  },
  fieldGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 80px 1fr',
    gap: 'var(--sp-3)',
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
    accentColor: 'var(--val-red)',
    cursor: 'pointer',
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
    transition: 'background var(--transition-fast)',
  },
  link: {
    fontSize: 13,
    color: 'var(--val-red)',
    textDecoration: 'none',
    fontWeight: 600,
    transition: 'opacity var(--transition-fast)',
  },
  btnPrimary: {
    padding: 'var(--sp-2) var(--sp-4)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'var(--val-red)',
    color: '#fff',
    fontSize: 13,
    fontWeight: 700,
    cursor: 'pointer',
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    transition: 'background var(--transition-fast), box-shadow var(--transition-fast)',
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
    width: '100%',
    padding: 'var(--sp-3) var(--sp-4)',
    borderRadius: 'var(--radius-sm)',
    border: 'none',
    background: 'linear-gradient(135deg, var(--val-red), var(--val-red-dark))',
    color: '#fff',
    fontSize: 15,
    fontWeight: 800,
    textTransform: 'uppercase',
    letterSpacing: '1.5px',
    cursor: 'pointer',
    transition: 'opacity var(--transition-fast), box-shadow var(--transition-fast)',
    boxShadow: '0 4px 16px var(--val-red-glow)',
  },
  hint: {
    fontSize: 12,
    color: 'var(--val-cream-dim)',
    textAlign: 'center',
    margin: 0,
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
  obsUrlRow: {
    display: 'flex',
    gap: 'var(--sp-2)',
  },
};
