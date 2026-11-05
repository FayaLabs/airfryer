import { create } from 'zustand'
import type { Session } from '../content/entities'

// What's playing, and where it may play. One store so a card's play button, the
// header ticker, the set page and the docked player all agree on a single video.

interface PlayerState {
  current: Session | null
  /** The set page's frame, when that page is open; the player overlays it. */
  stage: HTMLElement | null
  stageId: string | null
  play: (s: Session) => void
  close: () => void
  setStage: (el: HTMLElement | null, id: string | null) => void
}

export const usePlayer = create<PlayerState>((set) => ({
  current: null,
  stage: null,
  stageId: null,
  play: (current) => set({ current }),
  close: () => set({ current: null }),
  setStage: (stage, stageId) => set({ stage, stageId }),
}))
