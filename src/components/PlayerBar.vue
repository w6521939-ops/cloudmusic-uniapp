<template>
  <view class="player-bar" v-if="playerStore.hasCurrent" @tap="openPlayer">
    <image class="bar-cover" :src="playerStore.currentSong?.cover" mode="aspectFill" />
    <view class="bar-info">
      <text class="bar-name">{{ playerStore.currentSong?.name }}</text>
      <text class="bar-artist">{{ playerStore.currentSong?.artist }}</text>
    </view>
    <view class="bar-controls">
      <view class="ctrl-btn" @tap.stop="togglePlay">
                <text v-if="playerStore.isLoading" class="loading-dot">···</text>
                <text v-else class="icon" :class="playerStore.isPlaying ? 'icon-pause' : 'icon-play'"></text>
              </view>
      <view class="ctrl-btn" @tap.stop="playNext">
        <text class="icon icon-next"></text>
      </view>
    </view>
    <view class="progress-line">
      <view class="progress-fill" :style="{ width: progressPercent + '%' }"></view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { playerStore } from '../store/player'

const progressPercent = computed(() => {
  if (!playerStore.duration) return 0
  return Math.min(100, (playerStore.currentTime / playerStore.duration) * 100)
})

function togglePlay() {
  playerStore.togglePlay()
}

function playNext() {
  playerStore.playNext()
}

function openPlayer() {
  uni.navigateTo({ url: '/pages/player/player' })
}
</script>

<style scoped>
.player-bar {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) + 100rpx);
  left: 16rpx;
  right: 16rpx;
  height: 104rpx;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-radius: 20rpx;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  gap: 20rpx;
  box-shadow: 0 4rpx 24rpx rgba(0, 0, 0, 0.1);
  z-index: 100;
  overflow: hidden;
}
.bar-cover {
  width: 72rpx;
  height: 72rpx;
  border-radius: 12rpx;
  flex-shrink: 0;
  background-color: #eee;
}
.bar-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4rpx;
  overflow: hidden;
}
.bar-name {
  font-size: 28rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bar-artist {
  font-size: 22rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.bar-controls {
  display: flex;
  align-items: center;
  gap: 8rpx;
  flex-shrink: 0;
}
.ctrl-btn {
  width: 72rpx;
  height: 72rpx;
  display: flex;
  align-items: center;
  justify-content: center;
}
.ctrl-btn .icon {
  width: 44rpx;
  height: 44rpx;
  color: #555;
}
.loading-dot {
  font-size: 32rpx;
  color: #1EC8A8;
  font-weight: 700;
}
.progress-line {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 4rpx;
  background-color: rgba(0, 0, 0, 0.06);
}
.progress-fill {
  height: 100%;
  background-color: #1EC8A8;
  border-radius: 2rpx;
  transition: width 0.3s linear;
}
</style>
