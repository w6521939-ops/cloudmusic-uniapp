<template>
  <view class="page">
    <view class="nav-bar" :style="{ paddingTop: statusBarHeight + 'px' }">
      <view class="search-bar">
        <text class="icon icon-search search-icon"></text>
        <input
          class="search-input"
          v-model="keyword"
          placeholder="搜索歌曲、歌手、专辑"
          confirm-type="search"
          @confirm="doSearch"
          focus
        />
        <text v-if="keyword" class="clear-btn icon icon-close" @tap="clearSearch"></text>
      </view>
      <text class="nav-cancel" @tap="goBack">取消</text>
    </view>

    <scroll-view scroll-y class="content" :style="{ top: navHeight + 'px' }" v-if="!results.length">
      <view class="section" v-if="history.length">
        <view class="section-header">
          <text class="section-title">搜索历史</text>
          <text class="icon icon-trash clear-history" @tap="clearHistory"></text>
        </view>
        <view class="tags">
          <view class="tag" v-for="h in history" :key="h" @tap="searchFromHistory(h)">
            <text>{{ h }}</text>
          </view>
        </view>
      </view>

      <view class="section">
        <view class="section-header">
          <text class="section-title">热门搜索</text>
        </view>
        <view class="hot-list">
          <view
            class="hot-item"
            v-for="(h, i) in hotSearches"
            :key="h"
            @tap="searchFromHistory(h)"
          >
            <text class="hot-rank" :class="{ 'hot-rank-top': i < 3 }">{{ i + 1 }}</text>
            <text class="hot-text">{{ h }}</text>
          </view>
        </view>
      </view>
    </scroll-view>

    <scroll-view scroll-y class="content" :style="{ top: navHeight + 'px' }" v-else>
      <view class="searching-wrap" v-if="searching">
        <text class="searching-text">搜索中...</text>
      </view>
      <view v-else>
        <view class="result-header">
          <text class="result-count">找到 {{ results.length }} 首相关歌曲</text>
        </view>
        <view class="song-list" v-if="results.length">
          <SongItem
            v-for="(song, i) in results"
            :key="song.id"
            :song="song"
            :index="i"
            :show-index="true"
            :song-list="results"
          />
        </view>
        <view class="empty-search" v-else>
          <text class="empty-search-text">未找到相关歌曲</text>
        </view>
      </view>
    </scroll-view>

    <PlayerBar />
  </view>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { searchMusic, fetchHotSearches, type Song } from '../../api/service'
import { playerStore } from '../../store/player'
import SongItem from '../../components/SongItem.vue'
import PlayerBar from '../../components/PlayerBar.vue'

const statusBarHeight = ref(20)
const navHeight = ref(56)
const keyword = ref('')
const results = ref<Song[]>([])
const history = ref<string[]>([])
const hotSearches = ref<string[]>([])
const searching = ref(false)

function loadHistory() {
  try {
    const data = uni.getStorageSync('cm_search_history')
    history.value = data ? JSON.parse(data) : []
  } catch {
    history.value = []
  }
}

function saveHistory(kw: string) {
  history.value = history.value.filter(h => h !== kw)
  history.value.unshift(kw)
  if (history.value.length > 10) history.value.pop()
  try {
    uni.setStorageSync('cm_search_history', JSON.stringify(history.value))
  } catch {}
}

async function doSearch() {
  const kw = keyword.value.trim()
  if (!kw) return
  searching.value = true
  results.value = await searchMusic(kw)
  searching.value = false
  saveHistory(kw)
}

function searchFromHistory(kw: string) {
  keyword.value = kw
  doSearch()
}

function clearSearch() {
  keyword.value = ''
  results.value = []
}

function clearHistory() {
  history.value = []
  try {
    uni.removeStorageSync('cm_search_history')
  } catch {}
}

function goBack() {
  uni.switchTab({ url: '/pages/index/index' })
}

async function loadHotSearches() {
  hotSearches.value = await fetchHotSearches()
}

onMounted(() => {
  const sys = uni.getSystemInfoSync()
  statusBarHeight.value = sys.statusBarHeight || 20
  navHeight.value = sys.statusBarHeight + 44
  loadHistory()
  loadHotSearches()
})
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
  background: #fff;
  display: flex;
  align-items: center;
  padding: 0 24rpx;
  gap: 20rpx;
  height: v-bind(navHeight + 'px');
}
.search-bar {
  flex: 1;
  display: flex;
  align-items: center;
  background-color: #f0f0f0;
  border-radius: 36rpx;
  padding: 0 24rpx;
  height: 72rpx;
  gap: 12rpx;
}
.search-icon {
  width: 36rpx;
  height: 36rpx;
  color: #999;
  flex-shrink: 0;
}
.search-input {
  flex: 1;
  font-size: 28rpx;
  color: #333;
}
.clear-btn {
  width: 36rpx;
  height: 36rpx;
  color: #ccc;
  flex-shrink: 0;
}
.nav-cancel {
  font-size: 30rpx;
  color: #666;
  flex-shrink: 0;
}
.content {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
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
.clear-history {
  width: 36rpx;
  height: 36rpx;
  color: #ccc;
}
.tags {
  display: flex;
  flex-wrap: wrap;
  gap: 16rpx;
  padding: 0 32rpx;
}
.tag {
  padding: 12rpx 28rpx;
  background-color: #fff;
  border-radius: 32rpx;
  font-size: 26rpx;
  color: #666;
}
.tag:active {
  background-color: #f0f0f0;
}
.hot-list {
  background-color: #fff;
  margin: 0 32rpx;
  border-radius: 20rpx;
  overflow: hidden;
}
.hot-item {
  display: flex;
  align-items: center;
  padding: 24rpx 32rpx;
  gap: 24rpx;
}
.hot-item:active {
  background-color: #f8f8f8;
}
.hot-rank {
  width: 40rpx;
  text-align: center;
  font-size: 32rpx;
  font-weight: 700;
  color: #ccc;
}
.hot-rank-top {
  color: #1EC8A8;
}
.hot-text {
  font-size: 30rpx;
  color: #333;
}
.result-header {
  padding: 24rpx 32rpx;
}
.result-count {
  font-size: 26rpx;
  color: #999;
}
.song-list {
  background-color: #fff;
  border-radius: 24rpx;
  margin: 0 32rpx;
  overflow: hidden;
}
.searching-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}
.searching-text {
  font-size: 28rpx;
  color: #999;
}
.empty-search {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 120rpx 0;
}
.empty-search-text {
  font-size: 28rpx;
  color: #ccc;
}
</style>
