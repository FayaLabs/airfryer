import { routeFor, type L } from '../i18n'

// The site-wide announcement bar — the one variable promo line, driven by this
// param. `enabled: false` hides it everywhere; `position` puts it above the
// header (header priority) or fixed at the bottom. Rendered by AfAnnouncement
// in blocks/chrome.tsx, and dismissible per visitor.

export interface Announcement {
  enabled: boolean
  text: L
  href: string
  position: 'top' | 'bottom'
}

export const announcement: Announcement = {
  enabled: false,
  // The promo line. Edit this per campaign (or set enabled: false between them).
  text: {
    en: 'Viva los seres que bailan — the shirt is out',
    es: 'Viva los seres que bailan — ya está la camiseta',
    pt: 'Viva los seres que bailan — a camisa chegou',
  },
  href: routeFor('shirt'),
  position: 'top',
}
