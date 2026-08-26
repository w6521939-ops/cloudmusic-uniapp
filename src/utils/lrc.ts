export interface LrcLine {
  time: number
  text: string
}

export function parseLrc(lrcStr: string): LrcLine[] {
  if (!lrcStr) return []

  const lines = lrcStr.split('\n')
  const result: LrcLine[] = []

  for (const line of lines) {
    const match = line.match(/\[(\d{1,2}):(\d{1,2})(?:\.(\d{1,3}))?\](.*)/)
    if (!match) continue

    const min = parseInt(match[1], 10)
    const sec = parseInt(match[2], 10)
    const ms = match[3] ? parseInt(match[3].padEnd(3, '0'), 10) : 0
    const time = min * 60 + sec + ms / 1000
    const text = (match[4] || '').trim()

    result.push({ time, text })
  }

  result.sort((a, b) => a.time - b.time)
  return result
}
