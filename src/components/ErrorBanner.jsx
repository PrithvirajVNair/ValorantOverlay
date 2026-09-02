/**
 * ErrorBanner — Displays error messages for API failures, rate limits, and auth issues.
 * Auto-dismissible for rate-limit errors (shows countdown).
 */

import { useEffect, useState } from 'react';

const styles = {
  banner: {
    display: 'flex',
    alignItems: 'center',
    gap: 'var(--sp-3)',
    padding: 'var(--sp-3) var(--sp-4)',
    borderRadius: 'var(--radius-sm)',
    fontSize: '13px',
    lineHeight: 1.4,
    animation: 'fadeIn var(--transition-base) both',
  },
  error: {
    background: 'rgba(239, 68, 68, 0.12)',
    border: '1px solid rgba(239, 68, 68, 0.3)',
    color: '#fca5a5',
  },
  warning: {
    background: 'rgba(245, 158, 11, 0.12)',
    border: '1px solid rgba(245, 158, 11, 0.3)',
    color: '#fcd34d',
  },
  icon: {
    flexShrink: 0,
    fontSize: '16px',
  },
  message: {
    flex: 1,
  },
  dismiss: {
    background: 'none',
    border: 'none',
    color: 'inherit',
    cursor: 'pointer',
    opacity: 0.6,
    fontSize: '16px',
    padding: '2px',
    lineHeight: 1,
  },
};

export default function ErrorBanner({ error, retryIn = 0, onDismiss }) {
  const [visible, setVisible] = useState(true);

  // Reset visibility when error changes
  useEffect(() => {
    setVisible(true);
  }, [error?.message]);

  if (!error || !visible) return null;

  const isWarning = error.type === 'rate_limit';
  const variantStyle = isWarning ? styles.warning : styles.error;

  return (
    <div
      role="alert"
      style={{ ...styles.banner, ...variantStyle }}
      id="error-banner"
    >
      <span style={styles.icon}>{isWarning ? '⏳' : '⚠️'}</span>
      <span style={styles.message}>
        {error.message}
        {isWarning && retryIn > 0 && (
          <span style={{ opacity: 0.8 }}> ({retryIn}s)</span>
        )}
      </span>
      {onDismiss && (
        <button
          type="button"
          style={styles.dismiss}
          onClick={() => {
            setVisible(false);
            onDismiss?.();
          }}
          aria-label="Dismiss error"
        >
          ✕
        </button>
      )}
    </div>
  );
}
