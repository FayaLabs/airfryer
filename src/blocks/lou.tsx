import { useRef } from 'react'
import { useLouWalk } from '../lib/gsap-motion'

// Lou in the hero, cut into three layers so his legs really swing.
export function AfLou() {
  const ref = useRef<HTMLDivElement>(null)
  useLouWalk(ref)
  return (
    <div ref={ref} className="af-walker" aria-hidden="true">
      <div className="af-walker__flip" data-lou="flip">
        <img src="/media/lou-leg-l.png" alt="" className="af-walker__leg-l" data-lou="leg-l" />
        <img src="/media/lou-leg-r.png" alt="" className="af-walker__leg-r" data-lou="leg-r" />
        <img src="/media/lou-body.png" alt="" className="af-walker__body" data-lou="body" />
      </div>
    </div>
  )
}
