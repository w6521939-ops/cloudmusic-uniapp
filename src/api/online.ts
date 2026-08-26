import { request } from './request'
import type { Song, Playlist, Banner } from './data'

const PIC_BASE = 'https://p1.music.126.net'

function fixPicUrl(url: string): string {
  if (!url) return ''
  if (url.startsWith('http')) return url
  return PIC_BASE + url.replace('http://p1.music.126.net', '').replace('https://p1.music.126.net', '')
}

function formatDuration(ms: number): number {
  return Math.floor(ms / 1000)
}

function buildLrc(lrc: string, romanLrc?: string): string {
  if (lrc) return lrc
  if (romanLrc) return romanLrc
  return '[00:00.00] 暂无歌词'
}

export async function searchOnline(keyword: string, limit: number = 30): Promise<Song[]> {
  try {
    const res = await request<any>({
      url: '/search',
      data: { keywords: keyword, limit }
    })
    const songs = res?.result?.songs || []
    return songs.map((s: any): Song => ({
      id: `ne_${s.id}`,
      name: s.name || '未知歌曲',
      artist: (s.artists || s.ar || []).map((a: any) => a.name).join(' / ') || '未知歌手',
      album: (s.album?.name || s.al?.name) || '未知专辑',
      cover: fixPicUrl(s.album?.picUrl || s.al?.picUrl || ''),
      audio: '',
      duration: formatDuration(s.duration || s.dt || 0),
      lrc: ''
    }))
  } catch (e) {
    console.error('[online] search failed:', e)
    return []
  }
}

export async function getSongUrl(neId: string): Promise<string> {
  try {
    const rawId = neId.replace('ne_', '')
    const res = await request<any>({
      url: '/song/url/v1',
      data: { id: rawId, level: 'exhigh' }
    })
    const data = res?.data || []
    if (data.length > 0 && data[0].url) {
      return data[0].url
    }
    return ''
  } catch (e) {
    console.error('[online] getSongUrl failed:', e)
    return ''
  }
}

export async function getLyric(neId: string): Promise<string> {
  try {
    const rawId = neId.replace('ne_', '')
    const res = await request<any>({
      url: '/lyric',
      data: { id: rawId }
    })
    const lrc = res?.lrc?.lyric || ''
    const romanLrc = res?.roman?.lyric || res?.romalrc?.lyric || ''
    return buildLrc(lrc, romanLrc)
  } catch (e) {
    console.error('[online] getLyric failed:', e)
    return '[00:00.00] 暂无歌词'
  }
}

export async function getBanners(): Promise<Banner[]> {
  try {
    const res = await request<any>({
      url: '/banner',
      data: {}
    })
    const banners = res?.banners || []
    const gradients = [
      'linear-gradient(135deg, #667eea, #764ba2)',
      'linear-gradient(135deg, #f093fb, #f5576c)',
      'linear-gradient(135deg, #4facfe, #00f2fe)',
      'linear-gradient(135deg, #43e97b, #38f9d7)',
      'linear-gradient(135deg, #fa709a, #fee140)',
      'linear-gradient(135deg, #a8edea, #fed6e3)'
    ]
    return banners.slice(0, 6).map((b: any, i: number): Banner => ({
      id: `ban_${b.encodeId || i}`,
      title: b.typeTitle || '精选推荐',
      subtitle: b.bannerBizType || '点击查看',
      gradient: gradients[i % gradients.length],
      tag: '编辑推荐',
      image: fixPicUrl(b.imageUrl || b.picUrl || '')
    }))
  } catch (e) {
    console.error('[online] getBanners failed:', e)
    return []
  }
}

export async function getPersonalizedPlaylists(limit: number = 6): Promise<Playlist[]> {
  try {
    const res = await request<any>({
      url: '/personalized',
      data: { limit }
    })
    const result = res?.result || []
    return result.map((p: any): Playlist => ({
      id: `ne_pl_${p.id}`,
      name: p.name || '未知歌单',
      cover: fixPicUrl(p.picUrl || ''),
      desc: p.copywriter || p.description || '精选好歌',
      tags: p?.playCount ? [`播放${formatPlayCount(p.playCount)}`] : ['推荐'],
      songIds: []
    }))
  } catch (e) {
    console.error('[online] getPersonalizedPlaylists failed:', e)
    return []
  }
}

function formatPlayCount(count: number): string {
  if (count >= 100000000) return (count / 100000000).toFixed(1) + '亿'
  if (count >= 10000) return (count / 10000).toFixed(1) + '万'
  return String(count)
}

export async function getPlaylistSongs(playlistId: string): Promise<Song[]> {
  try {
    const rawId = playlistId.replace('ne_pl_', '')
    const res = await request<any>({
      url: '/playlist/track/all',
      data: { id: rawId, limit: 50 }
    })
    const songs = res?.songs || []
    return songs.map((s: any): Song => ({
      id: `ne_${s.id}`,
      name: s.name || '未知歌曲',
      artist: (s.ar || []).map((a: any) => a.name).join(' / ') || '未知歌手',
      album: (s.al?.name) || '未知专辑',
      cover: fixPicUrl(s.al?.picUrl || ''),
      audio: '',
      duration: formatDuration(s.dt || 0),
      lrc: ''
    }))
  } catch (e) {
    console.error('[online] getPlaylistSongs failed:', e)
    return []
  }
}

export async function getHotSearches(): Promise<string[]> {
  try {
    const res = await request<any>({
      url: '/search/hot/detail',
      data: {}
    })
    const data = res?.data || []
    return data.slice(0, 10).map((item: any) => item.searchWord || '')
  } catch (e) {
    console.error('[online] getHotSearches failed:', e)
    return []
  }
}

export async function getTopSongs(areaId: string = '0'): Promise<Song[]> {
  try {
    const res = await request<any>({
      url: '/top/song',
      data: { type: areaId }
    })
    const data = res?.data || []
    return data.slice(0, 10).map((s: any): Song => ({
      id: `ne_${s.id}`,
      name: s.name || '未知歌曲',
      artist: (s.artists || []).map((a: any) => a.name).join(' / ') || '未知歌手',
      album: (s.album?.name) || '未知专辑',
      cover: fixPicUrl(s.album?.picUrl || ''),
      audio: '',
      duration: formatDuration(s.duration || 0),
      lrc: ''
    }))
  } catch (e) {
    console.error('[online] getTopSongs failed:', e)
    return []
  }
}
