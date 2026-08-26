import { reactive } from 'vue'
import { songs as allSongs } from '../api/data'
import { getSongById, fetchSongUrl, fetchSongLrc, cacheSong, type Song } from '../api/service'
import { parseLrc, type LrcLine } from '../utils/lrc'
// #ifdef H5
import { H5AudioManager } from '../utils/h5-audio'
// #endif

export type PlayMode = 'sequence' | 'loop' | 'random'

interface PlayerState {
  currentSong: Song | null
  queue: Song[]
  currentIndex: number
  isPlaying: boolean
  isLoading: boolean
  currentTime: number
  duration: number
  playMode: PlayMode
  lrcLines: LrcLine[]
  currentLrcIndex: number
  favorites: string[]
  history: string[]
  audioManager: UniApp.BackgroundAudioManager | null
}

const state = reactive<PlayerState>({
  currentSong: null,
  queue: [],
  currentIndex: 0,
  isPlaying: false,
  isLoading: false,
  currentTime: 0,
  duration: 0,
  playMode: 'sequence',
  lrcLines: [],
  currentLrcIndex: -1,
  favorites: [],
  history: [],
  audioManager: null
})

function loadFavorites(): string[] {
  try {
    const data = uni.getStorageSync('cm_favorites')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function loadHistory(): string[] {
  try {
    const data = uni.getStorageSync('cm_history')
    return data ? JSON.parse(data) : []
  } catch {
    return []
  }
}

function saveFavorites(): void {
  try {
    uni.setStorageSync('cm_favorites', JSON.stringify(state.favorites))
  } catch {}
}

function saveHistory(): void {
  try {
    uni.setStorageSync('cm_history', JSON.stringify(state.history))
  } catch {}
}

function setupAudioManager(): void {
  let audio: any
  // #ifdef H5
  audio = new H5AudioManager()
  // #endif
  // #ifndef H5
  audio = uni.getBackgroundAudioManager()
  // #endif

  audio.onPlay(() => {
    state.isPlaying = true
  })

  audio.onPause(() => {
    state.isPlaying = false
  })

  audio.onStop(() => {
    state.isPlaying = false
  })

  audio.onEnded(() => {
    handleEnded()
  })

  audio.onTimeUpdate(() => {
    state.currentTime = audio.currentTime || 0
    state.duration = audio.duration || 0
    updateLrcIndex()
  })

  audio.onError((err: any) => {
    console.error('Audio error:', err)
    state.isPlaying = false
  })

  state.audioManager = audio
}

function handleEnded(): void {
  switch (state.playMode) {
    case 'loop':
      if (state.currentSong) {
        playSong(state.currentSong)
      }
      break
    case 'random':
      playRandom()
      break
    default:
      if (state.queue.length === 0) return
      state.currentIndex = (state.currentIndex + 1) % state.queue.length
      const nextSong = state.queue[state.currentIndex]
      if (nextSong) {
        playSong(nextSong)
      }
  }
}

async function playRandom(): Promise<void> {
  if (state.queue.length === 0) return
  let randomIndex = Math.floor(Math.random() * state.queue.length)
  while (randomIndex === state.currentIndex && state.queue.length > 1) {
    randomIndex = Math.floor(Math.random() * state.queue.length)
  }
  state.currentIndex = randomIndex
  const song = state.queue[randomIndex]
  if (song) {
    await playSong(song)
  }
}

function updateLrcIndex(): void {
  if (state.lrcLines.length === 0) return
  let idx = -1
  for (let i = 0; i < state.lrcLines.length; i++) {
    if (state.lrcLines[i].time <= state.currentTime) {
      idx = i
    } else {
      break
    }
  }
  state.currentLrcIndex = idx
}

async function playSong(song: Song): Promise<void> {
  if (!state.audioManager) return

  state.currentSong = song
  state.currentTime = 0
  state.duration = song.duration
  state.currentLrcIndex = -1
  state.isLoading = true
  cacheSong(song)

  if (!state.history.includes(song.id)) {
    state.history.unshift(song.id)
    if (state.history.length > 50) state.history.pop()
    saveHistory()
  }

  state.audioManager.title = song.name
  state.audioManager.singer = song.artist
  state.audioManager.coverImgUrl = song.cover

  let lrc = song.lrc
  if (!lrc) {
    lrc = await fetchSongLrc(song)
    song.lrc = lrc
  }
  state.lrcLines = parseLrc(lrc)

  let audioUrl = song.audio
  if (!audioUrl) {
    audioUrl = await fetchSongUrl(song)
    if (audioUrl) {
      song.audio = audioUrl
    }
  }

  state.isLoading = false

  if (audioUrl) {
    state.audioManager.src = audioUrl
  } else {
    uni.showToast({ title: '暂无播放源', icon: 'none' })
  }
}

export const playerStore = {
  state,

  init(): void {
    state.favorites = loadFavorites()
    state.history = loadHistory()
    setupAudioManager()
  },

  get currentSong(): Song | null {
    return state.currentSong
  },

  get isPlaying(): boolean {
    return state.isPlaying
  },

  get isLoading(): boolean {
    return state.isLoading
  },

  get currentTime(): number {
    return state.currentTime
  },

  get duration(): number {
    return state.duration
  },

  get playMode(): PlayMode {
    return state.playMode
  },

  get lrcLines(): LrcLine[] {
    return state.lrcLines
  },

  get currentLrcIndex(): number {
    return state.currentLrcIndex
  },

  get favorites(): string[] {
    return state.favorites
  },

  get history(): string[] {
    return state.history
  },

  get hasCurrent(): boolean {
    return state.currentSong !== null
  },

  setQueue(songList: Song[], startIndex: number = 0): void {
    state.queue = [...songList]
    state.currentIndex = startIndex
  },

  async playFromList(songList: Song[], index: number): Promise<void> {
    this.setQueue(songList, index)
    const song = songList[index]
    if (song) {
      await playSong(song)
    }
  },

  async playSongById(id: string): Promise<void> {
    const song = getSongById(id)
    if (song) {
      if (state.queue.length === 0) {
        state.queue = [...allSongs]
      }
      const idx = state.queue.findIndex(s => s.id === id)
      state.currentIndex = idx >= 0 ? idx : 0
      await playSong(song)
    }
  },

  togglePlay(): void {
    if (!state.audioManager || !state.currentSong) return
    if (state.isPlaying) {
      state.audioManager.pause()
    } else {
      state.audioManager.play()
    }
  },

  async playNext(): Promise<void> {
    if (state.queue.length === 0) return
    if (state.playMode === 'random') {
      await playRandom()
      return
    }
    state.currentIndex = (state.currentIndex + 1) % state.queue.length
    const song = state.queue[state.currentIndex]
    if (song) {
      await playSong(song)
    }
  },

  async playPrev(): Promise<void> {
    if (state.queue.length === 0) return
    if (state.playMode === 'random') {
      await playRandom()
      return
    }
    state.currentIndex = (state.currentIndex - 1 + state.queue.length) % state.queue.length
    const song = state.queue[state.currentIndex]
    if (song) {
      await playSong(song)
    }
  },

  seekTo(seconds: number): void {
    if (state.audioManager) {
      state.audioManager.seek(seconds)
      state.currentTime = seconds
    }
  },

  cyclePlayMode(): void {
    const modes: PlayMode[] = ['sequence', 'loop', 'random']
    const idx = modes.indexOf(state.playMode)
    state.playMode = modes[(idx + 1) % modes.length]
  },

  toggleFavorite(songId: string): void {
    const idx = state.favorites.indexOf(songId)
    if (idx >= 0) {
      state.favorites.splice(idx, 1)
    } else {
      state.favorites.unshift(songId)
    }
    saveFavorites()
  },

  isFavorite(songId: string): boolean {
    return state.favorites.includes(songId)
  },

  clearHistory(): void {
    state.history = []
    saveHistory()
  },

  formatTime(seconds: number): string {
    if (!seconds || isNaN(seconds)) return '00:00'
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
}
