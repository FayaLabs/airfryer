import { useEffect, useLayoutEffect, useRef, type RefObject } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Live-site GSAP motion, kept small and reduced-motion-safe. SSR renders the
// markup visible; the intro runs client-side only, so no-JS and reduced-motion
// visitors always see the content. `gsap.from` sets its start state before
// paint (useLayoutEffect on the client), so there's no flash.

const useIsoLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect

let registered = false
function ensurePlugins() {
  if (!registered && typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger)
    registered = true
  }
}

/**
 * Hero: a staggered intro on the `[data-rise]` elements plus a subtle parallax
 * drift on the background layer as the hero scrolls away. Both run only when
 * the viewer hasn't asked for reduced motion.
 */
export function useHeroMotion(rootRef: RefObject<HTMLElement | null>, bgRef: RefObject<HTMLElement | null>) {
  useIsoLayoutEffect(() => {
    const root = rootRef.current
    if (!root) return
    ensurePlugins()
    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia()
      mm.add('(prefers-reduced-motion: no-preference)', () => {
        const rise = root.querySelectorAll('[data-rise]')
        if (rise.length) {
          gsap.from(rise, { y: 40, autoAlpha: 0, duration: 0.9, ease: 'power3.out', stagger: 0.12, delay: 0.1 })
        }
        const bg = bgRef.current
        if (bg) {
          gsap.to(bg, {
            yPercent: 14,
            ease: 'none',
            scrollTrigger: { trigger: root, start: 'top top', end: 'bottom top', scrub: true },
          })
        }
      })
    }, root)
    return () => ctx.revert()
  }, [rootRef, bgRef])
}

/**
 * Lou strolls in on load, walks off to the right as you scroll and back on the
 * way up. Whatever moves him sideways (the intro, the scrub) only writes a distance; one ticker turns that distance into a walk cycle, so
 * his legs swing exactly as far as he travels, stop when he stops and run
 * backwards-free when you scroll up. Reduced motion: he just stands there.
 */
export function useLouWalk(louRef: RefObject<HTMLElement | null>) {
  useIsoLayoutEffect(() => {
    const lou = louRef.current
    // The parent, not a ref to it: a child's layout effect runs before its
    // parent's ref is attached.
    const win = lou?.parentElement
    if (!lou || !win) return
    ensurePlugins()

    // Phones: the text fills the window's floor, so he walks along its top edge.
    const seat = () => {
      const copy = win.querySelector<HTMLElement>('.af-hero__copy')
      const body = copy?.parentElement
      const narrow = window.matchMedia('(max-width: 1099px)').matches
      lou.style.bottom = narrow && copy && body ? `${win.clientHeight - body.offsetTop - copy.offsetTop}px` : ''
    }
    seat()
    const seated = new ResizeObserver(seat)
    seated.observe(win)

    const ctx = gsap.context(() => {
      gsap.matchMedia().add('(prefers-reduced-motion: no-preference)', () => {
        const q = gsap.utils.selector(lou)
        const flip = q('[data-lou="flip"]')[0]
        const body = q('[data-lou="body"]')[0]
        const legL = q('[data-lou="leg-l"]')[0]
        const legR = q('[data-lou="leg-r"]')[0]
        const setX = gsap.quickSetter(lou, 'x', 'px') as (v: number) => void
        const setBodyY = gsap.quickSetter(body, 'y', 'px') as (v: number) => void
        const setBodyR = gsap.quickSetter(body, 'rotation', 'deg') as (v: number) => void
        const setLegL = gsap.quickSetter(legL, 'rotation', 'deg') as (v: number) => void
        const setLegR = gsap.quickSetter(legR, 'rotation', 'deg') as (v: number) => void

        const pos = { intro: 0, travel: 0 }
        const offRight = () => win.clientWidth - lou.offsetLeft + 8
        gsap.from(pos, { intro: offRight, duration: 1.8, delay: 0.5, ease: 'power1.out' })
        gsap.to(pos, {
          travel: offRight,
          ease: 'none',
          scrollTrigger: { start: 0, end: () => win.offsetHeight * 0.6, scrub: 0.5, invalidateOnRefresh: true },
        })

        let last: number | null = null
        let phase = 0
        let amp = 0
        let facing = 1
        const tick = () => {
          const x = pos.intro + pos.travel
          const dx = last === null ? 0 : x - last
          last = x
          const speed = Math.abs(dx)
          const moving = speed > 0.1
          if (moving) phase += speed / (lou.offsetHeight * 0.8)
          amp += ((moving ? 1 : 0) - amp) * (moving ? 0.25 : 0.1)
          // Faces where he's going, and back to the camera once he's stopped.
          const next = speed > 0.4 ? (dx > 0 ? 1 : -1) : amp < 0.03 ? 1 : facing
          if (next !== facing) {
            facing = next
            gsap.to(flip, { scaleX: facing, duration: 0.16, ease: 'power1.out', overwrite: true })
          }
          const s = Math.sin(phase * Math.PI * 2)
          setX(x)
          setLegL(s * 26 * amp)
          setLegR(-s * 26 * amp)
          setBodyY(-Math.abs(s) * lou.offsetHeight * 0.03 * amp)
          setBodyR(s * 2.5 * amp)
        }
        tick() // In place before the first paint, not one frame later.
        gsap.ticker.add(tick)
        return () => gsap.ticker.remove(tick)
      })
    }, lou)
    return () => {
      seated.disconnect()
      lou.style.bottom = ''
      ctx.revert()
    }
  }, [louRef])
}

/**
 * The mobile menu, in and out, as one timeline: the banner and header slide up
 * off the screen while the sheet wipes down, then each item rises out of a mask
 * as its rule draws across. Closing is the same timeline reversed and faster, so
 * it can be interrupted at any point. Reduced motion: same states, no travel.
 */
export function useMenuMotion(sheetRef: RefObject<HTMLElement | null>, open: boolean, shown: boolean, onClosed: () => void) {
  const timeline = useRef<gsap.core.Timeline | null>(null)
  const closed = useRef(onClosed)
  closed.current = onClosed

  useIsoLayoutEffect(() => {
    const sheet = sheetRef.current
    if (!shown || !sheet) return
    const ctx = gsap.context(() => {
      const q = gsap.utils.selector(sheet)
      const bars = gsap.utils.toArray<HTMLElement>('.af-announce:not([data-position="bottom"]), .af-header')
      const tl = gsap.timeline({ paused: true, onReverseComplete: () => closed.current() })
      if (bars.length) tl.to(bars, { y: (_: number, el: HTMLElement) => -el.getBoundingClientRect().bottom - 1, duration: 0.36, ease: 'power3.inOut' }, 0)
      tl.fromTo(sheet, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.46, ease: 'power3.inOut' }, 0)
      tl.fromTo(q('[data-menu="close"]'), { opacity: 0, rotation: -90, scale: 0.6 }, { opacity: 1, rotation: 0, scale: 1, duration: 0.4, ease: 'back.out(2)' }, 0.26)
      tl.fromTo(q('[data-menu="label"]'), { yPercent: 115, rotation: 4 }, { yPercent: 0, rotation: 0, duration: 0.62, ease: 'power4.out', stagger: 0.06 }, 0.2)
      tl.fromTo(q('[data-menu="rule"]'), { scaleX: 0 }, { scaleX: 1, duration: 0.62, ease: 'power3.inOut', stagger: 0.06 }, 0.2)
      tl.fromTo(q('[data-menu="arrow"]'), { x: -14, y: 14, autoAlpha: 0 }, { x: 0, y: 0, autoAlpha: 1, duration: 0.4, ease: 'power3.out', stagger: 0.06 }, 0.34)
      tl.fromTo(q('[data-menu="foot"]'), { y: 12, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 0.4, ease: 'power2.out' }, 0.56)
      timeline.current = tl
    })
    return () => {
      timeline.current = null
      ctx.revert()
    }
  }, [sheetRef, shown])

  useIsoLayoutEffect(() => {
    const tl = timeline.current
    if (!tl) return
    const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (open) tl.timeScale(still ? 1000 : 1).play()
    else tl.timeScale(still ? 1000 : 1.7).reverse()
  }, [open, shown])
}

/**
 * Swaps stacked panels in the direction of travel: the old one's items leave to
 * one side, the new one's arrive from the other, one after another. Interrupting
 * finishes the running swap first, so a fast drag never strands a half-faded
 * panel. Reduced motion: no travel, the CSS just shows the active panel.
 */
export function usePanelSwap(rootRef: RefObject<HTMLElement | null>, active: number) {
  const prev = useRef(active)
  const running = useRef<gsap.core.Timeline | null>(null)
  useIsoLayoutEffect(() => {
    const from = prev.current
    prev.current = active
    const root = rootRef.current
    if (!root || from === active) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    running.current?.progress(1)
    const panels = root.querySelectorAll<HTMLElement>('[data-panel]')
    const out = panels[from]
    const inn = panels[active]
    if (!out || !inn) return
    const dir = active > from ? 1 : -1
    const outItems = out.querySelectorAll('[data-panel-item]')
    const inItems = inn.querySelectorAll('[data-panel-item]')
    gsap.set(out, { visibility: 'visible' })
    running.current = gsap
      .timeline()
      .to(outItems, { x: -dir * 48, opacity: 0, duration: 0.22, stagger: 0.02, ease: 'power2.in' }, 0)
      .set(out, { clearProps: 'visibility' })
      .set(outItems, { clearProps: 'transform,opacity' })
      .fromTo(inItems, { x: dir * 48, opacity: 0 }, { x: 0, opacity: 1, duration: 0.42, stagger: 0.05, ease: 'power3.out', clearProps: 'transform,opacity', immediateRender: true }, 0.14)
    return () => {
      running.current?.progress(1)
    }
  }, [rootRef, active])
}

/** Glides a number to a target; `onUpdate` gets each frame's value. */
export function glideTo(from: number, to: number, onUpdate: (v: number) => void, duration = 0.45) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    onUpdate(to)
    return null
  }
  const proxy = { v: from }
  return gsap.to(proxy, { v: to, duration, ease: 'power3.out', onUpdate: () => onUpdate(proxy.v) })
}
