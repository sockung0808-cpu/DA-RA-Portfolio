/**
 * Central image registry.
 *
 * Keep all website images in `public/images/`.
 * Components import `images` from this file instead of hard-coding paths.
 * This makes image replacement and path maintenance much easier.
 */
export const images = {
  background: '/images/background-main.png',
  portrait: '/images/portrait-main.webp',
  logo: '/images/logo-main.webp',
  logoNav: '/images/logo-nav.webp',

  projects: {
    workflow: '/images/workflow-it-manager.png',
    operations: '/images/it-operations-dashboard.png',
    printer: '/images/printer-management.png',
    wms: '/images/wms-pro.png',
  },
} as const
