# 云音 · CloudMusic

基于 UniApp + Vue 3 + TypeScript 的跨端音乐播放器，参考 GitHub 上的经典 UniApp 音乐项目（UniMusic、NcxMusicUniapp）构建。

## 技术栈

- **UniApp 3.x** - 跨端框架，支持 H5 / 微信小程序 / App
- **Vue 3** - 组合式 API + `<script setup>` 语法
- **TypeScript** - 类型安全
- **Vite 5** - 构建工具
- **SCSS** - 样式预处理

## 核心功能

- **全局音频播放** - 基于 `uni.getBackgroundAudioManager()` 实现跨页面无缝续播
- **底部播放栏** - 全局悬浮 PlayerBar，显示当前歌曲和进度
- **全屏播放器** - 唱片旋转动画、歌词同步滚动、进度拖拽
- **歌词解析** - 自定义 LRC 格式解析器，时间戳精准同步
- **播放模式** - 顺序播放、单曲循环、随机播放
- **收藏与历史** - 本地存储收藏歌曲和播放记录
- **搜索** - 支持歌曲/歌手/专辑搜索，带历史记录和热门搜索

## 页面结构

```
首页 index/     Banner 轮播 + 快捷入口 + 推荐歌单 + 热门歌曲
搜索 search/    搜索框 + 搜索历史 + 热门搜索 + 搜索结果
播放器 player/  全屏播放 + 封面旋转 + 歌词同步 + 进度控制
我的 my/        用户卡片 + 收藏统计 + 播放历史 + 设置菜单
```

## 项目结构

```
src/
├── api/
│   └── data.ts          # Mock 数据（歌曲、歌单、热搜）
├── store/
│   └── player.ts        # 全局播放状态管理（reactive store）
├── utils/
│   └── lrc.ts           # LRC 歌词解析器
├── components/
│   ├── PlayerBar.vue    # 全局底部播放栏
│   └── SongItem.vue     # 歌曲列表项
├── pages/
│   ├── index/index.vue  # 首页
│   ├── search/search.vue # 搜索页
│   ├── player/player.vue # 播放器页
│   └── my/my.vue        # 个人中心
├── static/
│   └── icons.css        # SVG mask 图标
├── App.vue
├── main.ts
├── pages.json
└── manifest.json
```

## 快速开始

```bash
# 安装依赖
npm install

# H5 开发
npm run dev:h5

# 微信小程序开发
npm run dev:mp-weixin

# H5 构建
npm run build:h5

# 微信小程序构建
npm run build:mp-weixin
```

## 设计亮点

- 浅色主题，主色 `#1EC8A8` 青绿色
- SVG mask 图标系统，无需图片资源
- CSS 动画：唱片旋转、播放波形条
- 毛玻璃效果：底部播放栏 backdrop-filter
- 响应式状态栏适配
- 组件化设计，SongItem 和 PlayerBar 可复用

## 参考项目

- [UniMusic](https://github.com/FOXfys/uniapp-music) - 暗黑赛博朋克风格音乐播放器
- [NcxMusicUniapp](https://github.com/xingonliu/NcxMusicUniapp) - iOS 风格 Vue3 + TS 音乐应用

## License

MIT
