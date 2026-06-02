import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Prize, LotteryRecord, DrawCount } from '@/types'

interface LotteryState {
  drawCount: DrawCount | null
  prizes: Prize[]
  records: LotteryRecord[]
  isDrawing: boolean
  setDrawCount: (count: DrawCount) => void
  setPrizes: (prizes: Prize[]) => void
  addRecord: (record: LotteryRecord) => void
  setRecords: (records: LotteryRecord[]) => void
  setIsDrawing: (isDrawing: boolean) => void
  decrementDrawCount: () => void
}

export const useLotteryStore = create<LotteryState>()(
  persist(
    (set) => ({
      drawCount: null,
      prizes: [],
      records: [],
      isDrawing: false,

      setDrawCount: (count) => set({ drawCount: count }),

      setPrizes: (prizes) => set({ prizes }),

      addRecord: (record) =>
        set((state) => ({
          records: [record, ...state.records],
        })),

      setRecords: (records) => set({ records }),

      setIsDrawing: (isDrawing) => set({ isDrawing }),

      decrementDrawCount: () =>
        set((state) => ({
          drawCount: state.drawCount
            ? {
                ...state.drawCount,
                usedCount: state.drawCount.usedCount + 1,
                remainingCount: state.drawCount.remainingCount - 1,
              }
            : null,
        })),
    }),
    {
      name: 'lottery-storage',
    }
  )
)
