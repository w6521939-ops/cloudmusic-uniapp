<template>
  <view class="song-item" :class="{ active: isActive }" @tap="handleTap">
    <view class="song-index" v-if="showIndex">
      <text v-if="!isActive" class="idx-text">{{ index + 1 }}</text>
      <view v-else class="playing-icon">
        <view class="bar" v-for="i in 3" :key="i" :style="{ animationDelay: i * 0.2 + 's' }"></view>
      </view>
    </view>
    <image class="song-cover" :src="song.cover" mode="aspectFill" lazy-load />
    <view class="song-info">
      <text class="song-name" :class="{ 'text-primary': isActive }">{{ song.name }}</text>
      <text class="song-artist">{{ song.artist }} - {{ song.album }}</text>
    </view>
    <view class="song-actions" v-if="!showIndex">
      <text class="icon icon-more"></text>
    </view>
    <view class="song-duration" v-else>
      <text class="duration-text">{{ formatDuration }}</text>
    </view>
  </view>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { playerStore } from '../store/player'
import type { Song } from '../api/data'

const props = withDefaults(defineProps<{
  song: Song
  index?: number
  showIndex?: boolean
  songList?: Song[]
}>(), {
  index: 0,
  showIndex: false,
  songList: () => []
})

const isActive = computed(() => playerStore.state.currentSong?.id === props.song.id)

const formatDuration = computed(() => {
  const m = Math.floor(props.song.duration / 60)
  const s = Math.floor(props.song.duration % 60)
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
})

function handleTap() {
  const list = props.songList.length > 0 ? props.songList : [props.song]
  const idx = list.findIndex(s => s.id === props.song.id)
  playerStore.playFromList(list, idx >= 0 ? idx : 0)
}
</script>

<style scoped>
.song-item {
  display: flex;
  align-items: center;
  padding: 16rpx 32rpx;
  gap: 20rpx;
  transition: background-color 0.2s;
}
.song-item:active {
  background-color: #f0f0f0;
}
.song-item.active {
  background-color: rgba(30, 200, 168, 0.06);
}
.song-index {
  width: 48rpx;
  display: flex;
  justify-content: center;
  align-items: center;
}
.idx-text {
  font-size: 32rpx;
  color: #999;
  font-weight: 500;
}
.playing-icon {
  display: flex;
  align-items: flex-end;
  gap: 4rpx;
  height: 36rpx;
}
.bar {
  width: 6rpx;
  height: 36rpx;
  background-color: #1EC8A8;
  border-radius: 3rpx;
  animation: bar-bounce 0.8s ease-in-out infinite alternate;
}
@keyframes bar-bounce {
  0% { height: 12rpx; }
  100% { height: 36rpx; }
}
.song-cover {
  width: 96rpx;
  height: 96rpx;
  border-radius: 16rpx;
  background-color: #eee;
  flex-shrink: 0;
}
.song-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6rpx;
  overflow: hidden;
}
.song-name {
  font-size: 30rpx;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.song-name.text-primary {
  color: #1EC8A8;
}
.song-artist {
  font-size: 24rpx;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.song-actions {
  padding: 16rpx;
}
.icon {
  color: #ccc;
}
.song-duration {
  padding-right: 8rpx;
}
.duration-text {
  font-size: 24rpx;
  color: #bbb;
}
</style>
