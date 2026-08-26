<script setup lang="ts">
import { onLaunch, onShow } from '@dcloudio/uni-app'
import { playerStore } from './store/player'

onLaunch(() => {
  playerStore.init()
})

onShow(() => {
  if (playerStore.state.audioManager) {
    playerStore.state.audioManager.play()
  }
})
</script>

<style>
@import './static/icons.css';

page {
  background-color: #f5f5f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', sans-serif;
  font-size: 28rpx;
  color: #333;
  -webkit-font-smoothing: antialiased;
}

view, text, scroll-view, image {
  box-sizing: border-box;
}

::-webkit-scrollbar {
  display: none;
}
</style>
