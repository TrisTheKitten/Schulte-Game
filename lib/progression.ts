export interface RankDefinition {
  name: string
  size: number
}

export const RANKS: RankDefinition[] = [
  { name: 'Easy', size: 3 },
  { name: 'Medium', size: 4 },
  { name: 'Hard', size: 5 },
  { name: 'Expert', size: 6 },
  { name: 'Master', size: 7 },
  { name: 'Extreme', size: 8 },
  { name: 'Hardcore', size: 9 },
  { name: 'God', size: 10 },
]

export const getRankIndexBySize = (size: number) => RANKS.findIndex(rank => rank.size === size)

export const boundRankIndex = (index: number) => {
  if (index < 0) return 0
  if (index >= RANKS.length) return RANKS.length - 1
  return index
}
