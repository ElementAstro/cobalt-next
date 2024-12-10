import { create } from 'zustand'

interface LockScreenState {
  isLocked: boolean
  setIsLocked: (locked: boolean) => void
  lastActivityTime: number
  updateLastActivityTime: () => void
}

export const useLockScreenStore = create<LockScreenState>((set) => ({
  isLocked: true,
  setIsLocked: (locked) => set({ isLocked: locked }),
  lastActivityTime: Date.now(),
  updateLastActivityTime: () => set({ lastActivityTime: Date.now() }),
}))

