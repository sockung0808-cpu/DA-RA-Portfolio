import { useEffect, useRef } from 'react'

/**
 * Lightweight scroll parallax. Writes a CSS custom property instead of
 * touching transform directly, so CSS remains in control of composition.
 */
export function useParallax<T extends HTMLElement>(strength = 0.08) {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let frame = 0
    let ticking = false

    const update = () => {
      const rect = element.getBoundingClientRect()
      const viewportCenter = window.innerHeight / 2
      const elementCenter = rect.top + rect.height / 2
      const offset = (viewportCenter - elementCenter) * strength
      element.style.setProperty('--parallax-y', `${offset.toFixed(2)}px`)
      ticking = false
    }

    const onScroll = () => {
      if (ticking) return
      ticking = true
      frame = window.requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      window.cancelAnimationFrame(frame)
    }
  }, [strength])

  return ref
}
