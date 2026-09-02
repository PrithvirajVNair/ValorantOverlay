/**
 * PUBG PC Tiers and Ranks metadata with custom SVG vector rank emblems
 */

import React from 'react';

export const PUBG_RANK_ICONS = {
  unranked: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" fill="#334155" opacity="0.6" />
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" stroke="#94a3b8" strokeWidth="1.5" strokeLinejoin="round" />
      <circle cx="12" cy="11" r="3" stroke="#cbd5e1" strokeWidth="1.5" />
    </svg>
  ),
  bronze: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="url(#bronzeGrad)" stroke="#f59e0b" strokeWidth="1" />
      <path d="M12 7l2.5 5h-5L12 7zM9.5 13h5L12 18l-2.5-5z" fill="#fef3c7" opacity="0.9" />
      <defs>
        <linearGradient id="bronzeGrad" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d97706" />
          <stop offset="1" stopColor="#78350f" />
        </linearGradient>
      </defs>
    </svg>
  ),
  silver: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7v4c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="url(#silverGrad)" stroke="#cbd5e1" strokeWidth="1" />
      <path d="M12 6l3.5 6-3.5 6-3.5-6 3.5-6z" fill="#ffffff" />
      <defs>
        <linearGradient id="silverGrad" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#94a3b8" />
          <stop offset="1" stopColor="#334155" />
        </linearGradient>
      </defs>
    </svg>
  ),
  gold: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7v4c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="url(#goldGrad)" stroke="#fde047" strokeWidth="1.2" />
      <polygon points="12,5 14.5,10 20,10.5 16,14.5 17.5,20 12,17 6.5,20 8,14.5 4,10.5 9.5,10" fill="#fff" opacity="0.95" />
      <defs>
        <linearGradient id="goldGrad" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#fbbf24" />
          <stop offset="1" stopColor="#b45309" />
        </linearGradient>
      </defs>
    </svg>
  ),
  platinum: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L20 10L12 22L4 10L12 2Z" fill="url(#platGrad)" stroke="#7dd3fc" strokeWidth="1.2" />
      <path d="M12 2L20 10H4L12 2Z" fill="#38bdf8" opacity="0.6" />
      <path d="M12 22L20 10L12 14L4 10L12 22Z" fill="#0284c7" opacity="0.85" />
      <path d="M12 2L12 14" stroke="#ffffff" strokeWidth="1" opacity="0.75" />
      <defs>
        <linearGradient id="platGrad" x1="12" y1="2" x2="12" y2="22" gradientUnits="userSpaceOnUse">
          <stop stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0369a1" />
        </linearGradient>
      </defs>
    </svg>
  ),
  diamond: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 3H18L22 9L12 21L2 9L6 3Z" fill="url(#diaGrad)" stroke="#e9d5ff" strokeWidth="1.2" />
      <polygon points="6,3 18,3 12,9" fill="#f5d0fe" opacity="0.85" />
      <polygon points="2,9 6,3 12,9" fill="#c084fc" opacity="0.75" />
      <polygon points="22,9 18,3 12,9" fill="#c084fc" opacity="0.75" />
      <polygon points="2,9 12,9 12,21" fill="#9333ea" opacity="0.9" />
      <polygon points="22,9 12,9 12,21" fill="#7e22ce" opacity="0.9" />
      <defs>
        <linearGradient id="diaGrad" x1="12" y1="3" x2="12" y2="21" gradientUnits="userSpaceOnUse">
          <stop stopColor="#c084fc" />
          <stop offset="1" stopColor="#581c87" />
        </linearGradient>
      </defs>
    </svg>
  ),
  master: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L4 6v5c0 5.55 3.84 10.74 8 12 4.16-1.26 8-6.45 8-12V6l-8-4z" fill="url(#masterGrad)" stroke="#fca5a5" strokeWidth="1.2" />
      <polygon points="12,5 14.5,10 20,10.5 16,14.5 17.5,20 12,17 6.5,20 8,14.5 4,10.5 9.5,10" fill="#ffffff" opacity="0.95" />
      <defs>
        <linearGradient id="masterGrad" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ef4444" />
          <stop offset="1" stopColor="#7f1d1d" />
        </linearGradient>
      </defs>
    </svg>
  ),
  grandmaster: (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2L3 7v4c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-9-5z" fill="url(#gmGrad)" stroke="#fde047" strokeWidth="1.5" />
      <path d="M5 16L7 9L12 12L17 9L19 16H5Z" fill="#fef08a" />
      <circle cx="12" cy="7" r="1.5" fill="#fff" />
      <circle cx="6" cy="8" r="1.5" fill="#fff" />
      <circle cx="18" cy="8" r="1.5" fill="#fff" />
      <defs>
        <linearGradient id="gmGrad" x1="12" y1="2" x2="12" y2="23" gradientUnits="userSpaceOnUse">
          <stop stopColor="#f59e0b" />
          <stop offset="1" stopColor="#78350f" />
        </linearGradient>
      </defs>
    </svg>
  ),
};

export const PUBG_RANKS = {
  unranked:   { name: 'Unranked',    color: '#94a3b8', bg: 'rgba(148, 163, 184, 0.15)', border: '#64748b', icon: PUBG_RANK_ICONS.unranked },
  bronze:     { name: 'Bronze',      color: '#cd7f32', bg: 'rgba(205, 127, 50, 0.15)',  border: '#cd7f32', icon: PUBG_RANK_ICONS.bronze },
  silver:     { name: 'Silver',      color: '#e2e8f0', bg: 'rgba(226, 232, 240, 0.15)', border: '#94a3b8', icon: PUBG_RANK_ICONS.silver },
  gold:       { name: 'Gold',        color: '#f39c12', bg: 'rgba(243, 156, 18, 0.2)',   border: '#f39c12', icon: PUBG_RANK_ICONS.gold },
  platinum:   { name: 'Platinum',    color: '#38bdf8', bg: 'rgba(56, 189, 248, 0.2)',   border: '#38bdf8', icon: PUBG_RANK_ICONS.platinum },
  diamond:    { name: 'Diamond',     color: '#a855f7', bg: 'rgba(168, 85, 247, 0.2)',   border: '#a855f7', icon: PUBG_RANK_ICONS.diamond },
  master:     { name: 'Master',      color: '#ef4444', bg: 'rgba(239, 68, 68, 0.2)',    border: '#ef4444', icon: PUBG_RANK_ICONS.master },
  grandmaster: { name: 'Grandmaster', color: '#f59e0b', bg: 'rgba(245, 158, 11, 0.25)', border: '#f59e0b', icon: PUBG_RANK_ICONS.grandmaster },
};

export function getPubgRankInfo(rankName = 'Gold I') {
  if (!rankName) return PUBG_RANKS.gold;
  const key = String(rankName).toLowerCase().split(' ')[0];
  return PUBG_RANKS[key] || PUBG_RANKS.gold;
}
