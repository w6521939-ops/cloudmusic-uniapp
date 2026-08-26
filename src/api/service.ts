import {
  songs as mockSongs,
  playlists as mockPlaylists,
  banners as mockBanners,
  hotSearches as mockHotSearches,
  getSongsByIds as mockGetSongsByIds,
  getSongById as mockGetSongById,
  searchSongs as mockSearchSongs,
  type Song,
  type Playlist,
  type Banner
} from './data'
import {
  searchOnline,
  getBanners,
  getPersonalizedPlaylists,
  getPlaylistSongs,
  getHotSearches,
  getTopSongs,
  getSongUrl,
  getLyric
} from './online'

export type { Song, Playlist, Banner }

const songCache = new Map<string, Song>()

export function cacheSong(song: Song): void {
  if (song && song.id) {
    songCache.set(song.id, { ...song })
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  const online = await getBanners()
  return online.length > 0 ? online : mockBanners
}

export async function fetchPlaylists(): Promise<Playlist[]> {
  const online = await getPersonalizedPlaylists()
  return online.length > 0 ? online : mockPlaylists
}

export async function fetchHotSongs(): Promise<Song[]> {
  const online = await getTopSongs()
  return online.length > 0 ? online : mockSongs.slice(0, 8)
}

export async function fetchHotSearches(): Promise<string[]> {
  const online = await getHotSearches()
  return online.length > 0 ? online : mockHotSearches
}

export async function searchMusic(keyword: string): Promise<Song[]> {
  const online = await searchOnline(keyword)
  if (online.length > 0) return online
  return mockSearchSongs(keyword)
}

export async function fetchPlaylistSongs(playlist: Playlist): Promise<Song[]> {
  if (playlist.songIds.length > 0) {
    return mockGetSongsByIds(playlist.songIds)
  }
  const online = await getPlaylistSongs(playlist.id)
  return online.length > 0 ? online : []
}

export async function fetchSongUrl(song: Song): Promise<string> {
  if (song.audio) return song.audio
  if (song.id.startsWith('ne_')) {
    return await getSongUrl(song.id)
  }
  return song.audio
}

export async function fetchSongLrc(song: Song): Promise<string> {
  if (song.lrc) return song.lrc
  if (song.id.startsWith('ne_')) {
    return await getLyric(song.id)
  }
  return song.lrc || '[00:00.00] 暂无歌词'
}

export function getSongById(id: string): Song | undefined {
  if (songCache.has(id)) return songCache.get(id)
  return mockGetSongById(id)
}

export function getMockSongs(): Song[] {
  return mockSongs
}
