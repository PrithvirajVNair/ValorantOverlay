/**
 * Theme & Layout Registry
 *
 * Provides a modular architecture for game overlay visual themes and layout designs.
 * Allows adding new games (PUBG, Apex, etc.) and layouts seamlessly.
 */

export const VALORANT_LAYOUTS = [
  {
    id: "card",
    name: "Broadcast Card",
    badge: "Popular",
    desc: "Classic expanded glass card with rank emblem, player tag & live metadata.",
    icon: "card",
  },
  {
    id: "capsule",
    name: "VisionOS Capsule",
    badge: "Sleek",
    desc: "Compact pill-shaped glass pod designed for placing near stream webcams.",
    icon: "capsule",
  },
  {
    id: "banner",
    name: "Streamer Banner Bar",
    badge: "Broadcast",
    desc: "Full-width horizontal glass ticker bar with rank dividers.",
    icon: "banner",
  },
  {
    id: "minimal",
    name: "Minimalist Emblem",
    badge: "HUD",
    desc: "Ultra-clean floating rank emblem with integrated RR counter.",
    icon: "minimal",
  },
];

export const VALORANT_THEMES = [
  {
    id: "clear",
    name: "Pure Crystal",
    color: "linear-gradient(135deg, rgba(255,255,255,0.7), rgba(255,255,255,0.15))",
    desc: "100% Ultra-clear transparent glass",
  },
  {
    id: "prism",
    name: "Prism Glass",
    color: "linear-gradient(135deg, #ff4655, #00f2fe)",
    desc: "Prismatic rainbow light sheen",
  },
  {
    id: "ruby",
    name: "Crimson Ruby",
    color: "linear-gradient(135deg, #ff2a4b, #ff758c)",
    desc: "Valorant Crimson Core glow",
  },
  {
    id: "emerald",
    name: "Toxic Emerald",
    color: "linear-gradient(135deg, #10b981, #34d399)",
    desc: "Ascendant Viper emerald glass",
  },
  {
    id: "sapphire",
    name: "Ice Sapphire",
    color: "linear-gradient(135deg, #3b82f6, #60a5fa)",
    desc: "Glacier ice crystal blue",
  },
  {
    id: "gold",
    name: "Radiant Gold",
    color: "linear-gradient(135deg, #f59e0b, #fbbf24)",
    desc: "Radiant crown gold aura",
  },
  {
    id: "platinum",
    name: "Cyan Crystal",
    color: "linear-gradient(135deg, #06b6d4, #22d3ee)",
    desc: "Cyber cyan crystal gloss",
  },
];

export const PUBG_LAYOUTS = [
  {
    id: "card",
    name: "Tactical Card",
    badge: "Classic",
    desc: "Full PUBG stat panel with K/D, Wins, Damage & Rank tier.",
    icon: "card",
  },
  {
    id: "capsule",
    name: "Battle Capsule",
    badge: "Compact",
    desc: "Streamlined horizontal capsule with K/D highlight.",
    icon: "capsule",
  },
];

export const PUBG_THEMES = [
  {
    id: "pubg-gold",
    name: "Chicken Dinner Gold",
    color: "linear-gradient(135deg, #f59e0b, #d97706)",
    desc: "Classic PUBG tactical gold amber",
  },
  {
    id: "pubg-dark",
    name: "Military Glass",
    color: "linear-gradient(135deg, #3b82f6, #1e3a8a)",
    desc: "Stealth sapphire glass",
  },
];
