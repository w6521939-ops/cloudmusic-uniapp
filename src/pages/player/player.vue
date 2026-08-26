<template>
  <view class="player-page">
    <view class="bg-blur" :style="{ backgroundImage: `url(${currentSong?.cover})` }"></view>
    <view class="bg-mask"></view>

    <view class="player-header" :style="{ paddingTop: statusBarHeight + 'px' }">
      <text class="icon icon-close close-btn" @tap="goBack"></text>
      <text class="player-title">正在播放</text>
      <text class="icon icon-more more-btn"></text>
    </view>

    <view class="player-body" v-if="currentSong">
      <view class="cover-section" v-if="!showLrc">
        <view class="cover-wrap" :class="{ spinning: playerStore.isPlaying }">
          <image class="cover-img" :src="currentSong.cover" mode="aspectFill" />
        </view>
      </view>

      <view class="lrc-section" v-else @tap="toggleLrc">
        <scroll-view scroll-y class="lrc-scroll" :scroll-into-view="lrcScrollId" scroll-with-animation>
          <view class="lrc-padding-top"></view>
          <view
            v-for="(line, i) in playerStore.lrcLines"
            :key="i"
            :id="'lrc-' + i"
            class="lrc-line"
            :class="{ active: i === playerStore.currentLrcIndex }"
          >
            {{ line.text || '...' }}
          </view>
          <view class="lrc-padding-bottom"></view>
        </scroll-view>
      </view>

      <view class="info-section">
        <text class="song-name">{{ currentSong.name }}</text>
        <text class="artist-name">{{ currentSong.artist }}</text>
      </view>

      <view class="progress-section">
        <text class="time current-time">{{ playerStore.formatTime(playerStore.currentTime) }}</text>
        <slider
          class="progress-slider"
          :value="progressValue"
          :max="playerStore.duration || 100"
          block-size="12"
          activeColor="#1EC8A8"
          backgroundColor="rgba(255,255,255,0.2)"
          @changing="onSeeking"
          @change="onSeek"
        />
        <text class="time total-time">{{ playerStore.formatTime(playerStore.duration) }}</text>
      </view>

      <view class="controls-section">
        <view class="ctrl-group">
          <text class="icon mode-btn" :class="modeIcon" @tap="playerStore.cyclePlayMode()"></text>
        </view>
        <view class="ctrl-group main-controls">
          <text class="icon icon-prev prev-btn" @tap="playerStore.playPrev()"></text>
          <view class="play-btn-wrap" @tap="playerStore.togglePlay()">
            <text v-if="playerStore.isLoading" class="play-loading">···</text>
            <text v-else class="icon play-btn" :class="playerStore.isPlaying ? 'icon-pause' : 'icon-play'"></text>
          </view>
          <text class="icon icon-next next-btn" @tap="playerStore.playNext()"></text>
        </view>
        <view class="ctrl-group">
          <text
            class="icon heart-btn"
            :class="{ 'icon-heart': true, favorited: isFav }"
            @tap="toggleFav"
          ></text>
        </view>
      </view>

      <view class="toggle-lrc" @tap="toggleLrc">
        <text>{{ showLrc ? '封面' : '歌词' }}</text>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue'
import { playerStore } from '../../store/player'

const statusBarHeight = ref(20)
const showLrc = ref(false)
const seeking = ref(false)
const seekValue = ref(0)

const currentSong = computed(() => playerStore.state.currentSong)
const isFav = computed(() => currentSong.value ? playerStore.isFavorite(currentSong.value.id) : false)

const progressValue = computed(() => {
  if (seeking.value) return seekValue.value
  return playerStore.currentTime
})

const lrcScrollId = computed(() => {
  const idx = playerStore.currentLrcIndex
  return idx >= 0 ? 'lrc-' + idx : ''
})

const modeIcon = computed(() => {
  switch (playerStore.playMode) {
    case 'loop': return 'icon-single-loop'
    case 'random': return 'icon-random'
    default: return 'icon-loop'
  }
})

function onSeeking(e: any) {
  seeking.value = true
  seekValue.value = e.detail.value
}

function onSeek(e: any) {
  playerStore.seekTo(e.detail.value)
  seeking.value = false
}

function toggleFav() {
  if (currentSong.value) {
    playerStore.toggleFavorite(currentSong.value.id)
  }
}

function toggleLrc() {
  showLrc.value = !showLrc.value
}

function goBack() {
  uni.navigateBack()
}

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
})
</script>

<style scoped>
.player-page {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.bg-blur {
  position: fixed;
  top: -50rpx;
  left: -50rpx;
  right: -50rpx;
  bottom: -50rpx;
  background-size: cover;
  background-position: center;
  filter: blur(60px);
  transform: scale(1.2);
}
.bg-mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.55);
}
.player-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32rpx 16rpx;
  position: relative;
  z-index: 1;
}
.close-btn, .more-btn {
  width: 56rpx;
  height: 56rpx;
  color: rgba(255, 255, 255, 0.8);
}
.player-title {
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.8);
}
.player-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  padding: 0 48rpx 60rpx;
  position: relative;
  z-index: 1;
}
.cover-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}
.cover-wrap {
  width: 480rpx;
  height: 480rpx;
  border-radius: 50%;
  overflow: hidden;
  border: 8rpx solid rgba(255, 255, 255, 0.1);
  animation: spin 20s linear infinite;
  animation-play-state: paused;
}
.cover-wrap.spinning {
  animation-play-state: running;
}
.cover-img {
  width: 100%;
  height: 100%;
}
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
.lrc-section {
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
}
.lrc-scroll {
  width: 100%;
  height: 600rpx;
}
.lrc-padding-top {
  height: 240rpx;
}
.lrc-padding-bottom {
  height: 240rpx;
}
.lrc-line {
  text-align: center;
  font-size: 30rpx;
  color: rgba(255, 255, 255, 0.35);
  padding: 16rpx 0;
  transition: color 0.3s, font-size 0.3s;
}
.lrc-line.active {
  color: #fff;
  font-size: 34rpx;
  font-weight: 600;
}
.info-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8rpx;
  padding: 20rpx 0;
}
.song-name {
  font-size: 38rpx;
  font-weight: 600;
  color: #fff;
}
.artist-name {
  font-size: 26rpx;
  color: rgba(255, 255, 255, 0.6);
}
.progress-section {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 16rpx 0;
}
.time {
  font-size: 22rpx;
  color: rgba(255, 255, 255, 0.5);
  width: 70rpx;
  text-align: center;
}
.progress-slider {
  flex: 1;
}
.controls-section {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24rpx 0;
}
.ctrl-group {
  display: flex;
  align-items: center;
  gap: 16rpx;
  width: 120rpx;
  justify-content: center;
}
.main-controls {
  flex: 1;
  gap: 48rpx;
}
.mode-btn, .heart-btn {
  width: 48rpx;
  height: 48rpx;
  color: rgba(255, 255, 255, 0.7);
}
.heart-btn.favorited {
  color: #ff4757;
}
.prev-btn, .next-btn {
  width: 56rpx;
  height: 56rpx;
  color: rgba(255, 255, 255, 0.9);
}
.play-btn-wrap {
  width: 112rpx;
  height: 112rpx;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2rpx solid rgba(255, 255, 255, 0.2);
}
.play-btn {
  width: 56rpx;
  height: 56rpx;
  color: #fff;
}
.play-loading {
  font-size: 40rpx;
  color: #fff;
  font-weight: 700;
}
.toggle-lrc {
  padding: 16rpx 48rpx;
  border-radius: 32rpx;
  background: rgba(255, 255, 255, 0.1);
}
.toggle-lrc text {
  font-size: 24rpx;
  color: rgba(255, 255, 255, 0.7);
}
</style>
