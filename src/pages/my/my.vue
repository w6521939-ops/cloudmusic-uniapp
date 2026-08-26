<template>
  <view class="page">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="nav-content">
        <text class="nav-title">我的</text>
      </view>
    </view>

    <scroll-view scroll-y class="content" :style="{ top: navHeight + 'px' }">
      <view class="user-card">
        <view class="avatar-wrap">
          <view class="avatar">
            <text class="avatar-emoji">🎵</text>
          </view>
        </view>
        <view class="user-info">
          <text class="user-name">云音用户</text>
          <text class="user-desc">享受每一首好歌</text>
        </view>
      </view>

      <view class="stats-row">
        <view class="stat-item" @tap="goToFav">
          <text class="stat-num">{{ playerStore.favorites.length }}</text>
          <text class="stat-label">收藏</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ playerStore.history.length }}</text>
          <text class="stat-label">最近</text>
        </view>
        <view class="stat-divider"></view>
        <view class="stat-item">
          <text class="stat-num">{{ songs.length }}</text>
          <text class="stat-label">总曲数</text>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">我的收藏</text>
          <text class="section-more" v-if="favSongs.length" @tap="playAllFav">播放全部 ></text>
        </view>
        <view class="fav-list" v-if="favSongs.length">
          <SongItem
            v-for="(song, i) in favSongs.slice(0, 5)"
            :key="song.id"
            :song="song"
            :index="i"
            :show-index="true"
            :song-list="favSongs"
          />
        </view>
        <view class="empty-state" v-else>
          <text class="empty-icon">💝</text>
          <text class="empty-text">还没有收藏的歌曲</text>
          <text class="empty-hint">去首页发现喜欢的音乐吧</text>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">最近播放</text>
          <text class="section-more" v-if="historySongs.length" @tap="playAllHistory">播放全部 ></text>
        </view>
        <view class="history-list" v-if="historySongs.length">
          <SongItem
            v-for="(song, i) in historySongs.slice(0, 5)"
            :key="song.id"
            :song="song"
            :index="i"
            :show-index="true"
            :song-list="historySongs"
          />
        </view>
        <view class="empty-state" v-else>
          <text class="empty-icon">📻</text>
          <text class="empty-text">还没有播放记录</text>
          <text class="empty-hint">点击歌曲开始聆听</text>
        </view>
      </view>

      <view class="section">
        <view class="menu-list">
          <view class="menu-item" v-for="item in menuItems" :key="item.label" @tap="item.action">
            <text class="menu-emoji">{{ item.emoji }}</text>
            <text class="menu-label">{{ item.label }}</text>
            <text class="menu-arrow">></text>
          </view>
        </view>
      </view>

      <view class="bottom-space"></view>
    </scroll-view>

    <PlayerBar />
  </view>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { onShow } from '@dcloudio/uni-app'
import { songs } from '../../api/data'
import { getSongById, type Song } from '../../api/service'
import { playerStore } from '../../store/player'
import SongItem from '../../components/SongItem.vue'
import PlayerBar from '../../components/PlayerBar.vue'

const statusBarHeight = ref(20)
const navHeight = ref(56)

const favSongs = computed<Song[]>(() =>
  playerStore.favorites.map(id => getSongById(id)).filter(Boolean) as Song[]
)

const historySongs = computed<Song[]>(() =>
  playerStore.history.map(id => getSongById(id)).filter(Boolean) as Song[]
)

const menuItems = [
  { emoji: '⚙️', label: '设置', action: () => {} },
  { emoji: '🌙', label: '深色模式', action: () => {} },
  { emoji: '💾', label: '清除缓存', action: () => clearCache() },
  { emoji: 'ℹ️', label: '关于云音', action: () => showAbout() }
]

function playAllFav() {
  if (favSongs.value.length > 0) {
    playerStore.playFromList(favSongs.value, 0)
  }
}

function playAllHistory() {
  if (historySongs.value.length > 0) {
    playerStore.playFromList(historySongs.value, 0)
  }
}

function goToFav() {
  uni.switchTab({ url: '/pages/index/index' })
}

function clearCache() {
  uni.showModal({
    title: '清除缓存',
    content: '将清除搜索历史和播放记录，确定吗？',
    success: (res) => {
      if (res.confirm) {
        playerStore.clearHistory()
        try {
          uni.removeStorageSync('cm_search_history')
        } catch {}
        uni.showToast({ title: '已清除', icon: 'success' })
      }
    }
  })
}

function showAbout() {
  uni.showModal({
    title: '关于云音',
    content: '云音 CloudMusic v1.0.0\n基于 UniApp + Vue 3 + TypeScript',
    showCancel: false
  })
}

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  navHeight.value = sys.statusBarHeight + 44
})

onShow(() => {})
</script>

<style scoped>
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
  padding: 0 32rpx;
}
.nav-title {
  font-size: 40rpx;
  font-weight: 700;
  color: #333;
}
.content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
.user-card {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 32rpx;
  margin: 24rpx 32rpx;
  background: linear-gradient(135deg, #667eea, #764ba2);
  border-radius: 24rpx;
}
.avatar-wrap {
  position: relative;
}
.avatar {
  width: 120rpx;
  height: 120rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 4rpx solid rgba(255, 255, 255, 0.3);
}
.avatar-emoji {
  font-size: 56rpx;
}
.user-info {
  display: flex;
  flex-direction: column;
  gap: 8rpx;
}
.user-name {
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
}
.user-desc {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.8);
}
.stats-row {
  display: flex;
  align-items: center;
  justify-content: space-around;
  margin: 0 32rpx;
  padding: 24rpx;
  background-color: #fff;
  border-radius: 20rpx;
}
.stat-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  flex: 1;
}
.stat-num {
  font-size: 40rpx;
  font-weight: 700;
  color: #1EC8A8;
}
.stat-label {
  font-size: 24rpx;
  color: #999;
}
.stat-divider {
  width: 1rpx;
  height: 48rpx;
  background-color: #eee;
}
.section {
  margin: 24rpx 0;
}
.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 32rpx 16rpx;
}
.section-title {
  font-size: 32rpx;
  font-weight: 600;
  color: #333;
}
.section-more {
  font-size: 24rpx;
  color: #1EC8A8;
}
.fav-list, .history-list {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 0 32rpx;
  overflow: hidden;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12rpx;
  padding: 60rpx 0;
  background-color: #fff;
  border-radius: 20rpx;
  margin: 0 32rpx;
}
.empty-icon {
  font-size: 64rpx;
}
.empty-text {
  font-size: 28rpx;
  color: #999;
}
.empty-hint {
  font-size: 24rpx;
  color: #ccc;
}
.menu-list {
  background-color: #fff;
  border-radius: 20rpx;
  margin: 0 32rpx;
  overflow: hidden;
}
.menu-item {
  display: flex;
  align-items: center;
  padding: 28rpx 32rpx;
  gap: 20rpx;
  border-bottom: 1rpx solid #f5f5f5;
}
.menu-item:last-child {
  border-bottom: none;
}
.menu-item:active {
  background-color: #f8f8f8;
}
.menu-emoji {
  font-size: 40rpx;
}
.menu-label {
  flex: 1;
  font-size: 30rpx;
  color: #333;
}
.menu-arrow {
  font-size: 28rpx;
  color: #ccc;
}
.bottom-space {
  height: 200rpx;
}
</style>
