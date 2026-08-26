<template>
  <view class="page">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">云音</text>
        <text class="icon icon-search nav-search" @tap="goSearch"></text>
      </view>
    </view>

    <scroll-view scroll-y class="content" :style="{ top: navHeight + 'px' }">
      <view class="loading-wrap" v-if="loading">
        <text class="loading-text">加载中...</text>
      </view>

      <swiper class="banner" circular autoplay interval="4000" duration="500" v-if="!loading && banners.length">
        <swiper-item v-for="banner in banners" :key="banner.id">
          <view class="banner-item" :style="banner.image ? { backgroundImage: `linear-gradient(135deg, rgba(0,0,0,0.5), rgba(0,0,0,0.3)), url(${banner.image})`, backgroundSize: 'cover', backgroundPosition: 'center' } : { background: banner.gradient }">
            <view class="banner-text">
              <text class="banner-tag">{{ banner.tag }}</text>
              <text class="banner-title">{{ banner.title }}</text>
              <text class="banner-subtitle">{{ banner.subtitle }}</text>
            </view>
          </view>
        </swiper-item>
      </swiper>

      <view class="shortcuts">
        <view class="shortcut-item" v-for="sc in shortcuts" :key="sc.label" @tap="sc.action">
          <view class="shortcut-icon" :style="{ background: sc.color }">
            <text class="shortcut-emoji">{{ sc.emoji }}</text>
          </view>
          <text class="shortcut-label">{{ sc.label }}</text>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">推荐歌单</text>
          <text class="section-more">更多 ></text>
        </view>
        <scroll-view scroll-x class="playlist-scroll" show-scrollbar="false">
          <view class="playlist-row">
            <view class="playlist-card" v-for="pl in playlists" :key="pl.id" @tap="openPlaylist(pl)">
              <image class="playlist-cover" :src="pl.cover" mode="aspectFill" lazy-load />
              <text class="playlist-name">{{ pl.name }}</text>
              <text class="playlist-desc">{{ pl.desc }}</text>
            </view>
          </view>
        </scroll-view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">热门歌曲</text>
          <text class="section-more">全部 ></text>
        </view>
        <view class="song-list">
          <SongItem
            v-for="(song, i) in hotSongs"
            :key="song.id"
            :song="song"
            :index="i"
            :show-index="true"
            :song-list="hotSongs"
          />
        </view>
      </view>

      <view class="bottom-space"></view>
    </scroll-view>

    <PlayerBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { onPullDownRefresh } from '@dcloudio/uni-app'
import { fetchBanners, fetchPlaylists, fetchHotSongs, fetchPlaylistSongs, type Playlist, type Banner, type Song } from '../../api/service'
import { playerStore } from '../../store/player'
import SongItem from '../../components/SongItem.vue'
import PlayerBar from '../../components/PlayerBar.vue'

const statusBarHeight = ref(20)
const navHeight = ref(56)
const banners = ref<Banner[]>([])
const playlists = ref<Playlist[]>([])
const hotSongs = ref<Song[]>([])
const loading = ref(true)

const shortcuts = [
  { label: '每日推荐', emoji: '📅', color: 'linear-gradient(135deg, #667eea, #764ba2)', action: () => playAll() },
  { label: '热门榜', emoji: '🔥', color: 'linear-gradient(135deg, #f093fb, #f5576c)', action: () => playAll() },
  { label: '私人电台', emoji: '📻', color: 'linear-gradient(135deg, #4facfe, #00f2fe)', action: () => playAll() },
  { label: '歌单广场', emoji: '📋', color: 'linear-gradient(135deg, #43e97b, #38f9d7)', action: () => {} }
]

async function loadData() {
  loading.value = true
  const [b, p, s] = await Promise.all([
    fetchBanners(),
    fetchPlaylists(),
    fetchHotSongs()
  ])
  banners.value = b
  playlists.value = p
  hotSongs.value = s
  loading.value = false
}

function playAll() {
  if (hotSongs.value.length > 0) {
    playerStore.playFromList(hotSongs.value, 0)
  }
}

async function openPlaylist(pl: Playlist) {
  const plSongs = await fetchPlaylistSongs(pl)
  if (plSongs.length > 0) {
    playerStore.playFromList(plSongs, 0)
  } else {
    uni.showToast({ title: '暂无歌曲', icon: 'none' })
  }
}

function goSearch() {
  uni.switchTab({ url: '/pages/search/search' })
}

onMounted(async () => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  navHeight.value = sys.statusBarHeight + 44
  await loadData()
})

onPullDownRefresh(async () => {
  await loadData()
  setTimeout(() => uni.stopPullDownRefresh(), 500)
})
</script>

<style scoped>
.loading-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}
.loading-text {
  font-size: 28rpx;
  color: #999;
}
.page {
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #f5f5f5;
}
.nav-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 50;
  background: linear-gradient(180deg, #fff, #f8f8f8);
}
.nav-content {
  height: 88rpx;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx;
}
.nav-title {
  font-size: 40rpx;
  font-weight: 700;
  background: linear-gradient(135deg, #1EC8A8, #0EA5E9);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}
.nav-search {
  width: 44rpx;
  height: 44rpx;
  color: #666;
}
.content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.banner {
  height: 280rpx;
  margin: 16rpx 32rpx;
  border-radius: 24rpx;
  overflow: hidden;
}
.banner-item {
  height: 100%;
  display: flex;
  align-items: center;
  padding: 0 40rpx;
  border-radius: 24rpx;
}
.banner-text {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.banner-tag {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  padding: 4rpx 16rpx;
  border-radius: 8rpx;
  align-self: flex-start;
}
.banner-title {
  font-size: 44rpx;
  font-weight: 700;
  color: #fff;
}
.banner-subtitle {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.9);
}
.shortcuts {
  display: flex;
  justify-content: space-around;
  padding: 24rpx 32rpx;
}
.shortcut-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
}
.shortcut-icon {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}
.shortcut-emoji {
  font-size: 40rpx;
}
.shortcut-label {
  font-size: 24rpx;
  color: #555;
}
.section {
  margin: 16rpx 0;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16rpx 32rpx;
}
.section-title {
  font-size: 34rpx;
  font-weight: 600;
  color: #333;
}
.section-more {
  font-size: 24rpx;
  color: #999;
}
.playlist-scroll {
  white-space: nowrap;
  padding: 0 16rpx;
}
.playlist-row {
  display: inline-flex;
  gap: 20rpx;
  padding: 0 16rpx;
}
.playlist-card {
  width: 220rpx;
  display: flex;
  flex-direction: column;
  gap: 8rpx;
  flex-shrink: 0;
}
.playlist-cover {
  width: 220rpx;
  height: 220rpx;
  border-radius: 16rpx;
  background-color: #eee;
}
.playlist-name {
  font-size: 26rpx;
  color: #333;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.playlist-desc {
  font-size: 22rpx;
  color: #999;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.song-list {
  background-color: #fff;
  border-radius: 24rpx;
  margin: 0 32rpx;
  overflow: hidden;
}
.bottom-space {
  height: 200rpx;
}
</style>
