export interface Song {
  id: string
  name: string
  artist: string
  album: string
  cover: string
  audio: string
  duration: number
  lrc: string
}

export interface Playlist {
  id: string
  name: string
  cover: string
  desc: string
  tags: string[]
  songIds: string[]
}

export interface Banner {
  id: string
  title: string
  subtitle: string
  gradient: string
  tag: string
  image?: string
}

const audioBase = 'https://www.soundhelix.com/examples/mp3'
const coverBase = 'https://picsum.photos/seed'

export const banners: Banner[] = [
  { id: 'b1', title: '每日推荐', subtitle: '30 首精选好歌', gradient: 'linear-gradient(135deg, #667eea, #764ba2)', tag: '编辑推荐' },
  { id: 'b2', title: '云音热榜', subtitle: '本周最热单曲', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)', tag: '热门' },
  { id: 'b3', title: '夜听电音', subtitle: '沉浸式电子音乐', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)', tag: '电子' }
]

export const songs: Song[] = [
  {
    id: 's1',
    name: '夏日微风',
    artist: 'SoundHelix',
    album: 'Summer Breeze',
    cover: `${coverBase}/song1/400/400`,
    audio: `${audioBase}/SoundHelix-Song-1.mp3`,
    duration: 372,
    lrc: '[00:00.00] 夏日微风\n[00:15.00] 阳光洒落在窗台\n[00:30.00] 微风轻拂过脸颊\n[00:45.00] 夏天的味道在空气中弥漫\n[01:00.00] 每一个瞬间都值得珍惜\n[01:15.00] 让我们一起追逐夏日的风\n[01:30.00] 感受这份温暖和自由\n[01:45.00] 夏日微风 永不停歇\n[02:00.00] 在这美好的季节里\n[02:15.00] 我们一起飞翔\n[02:30.00] 夏日微风 带来希望\n[02:45.00] 每一天都是新的开始\n[03:00.00] 让心灵随风飘扬\n[03:15.00] 夏日微风 温柔如你\n[03:30.00] 在这金色的午后\n[03:45.00] 我们一起歌唱\n[04:00.00] 夏日的记忆 永不褪色'
  },
  {
    id: 's2',
    name: '夜空中的星',
    artist: 'SoundHelix',
    album: 'Night Sky',
    cover: `${coverBase}/song2/400/400`,
    audio: `${audioBase}/SoundHelix-Song-2.mp3`,
    duration: 426,
    lrc: '[00:00.00] 夜空中的星\n[00:20.00] 仰望无尽的星空\n[00:40.00] 寻找属于我的那颗星\n[01:00.00] 夜风轻拂 万籁俱寂\n[01:20.00] 星光指引着前行的方向\n[01:40.00] 在这浩瀚的宇宙中\n[02:00.00] 我并不孤单\n[02:20.00] 因为有星光作伴\n[02:40.00] 夜空中的星 永远闪烁\n[03:00.00] 照亮每一个黑暗的角落\n[03:20.00] 给我勇气和力量\n[03:40.00] 去追寻心中的梦想\n[04:00.00] 夜空中的星 你是我的光'
  },
  {
    id: 's3',
    name: '城市漫步',
    artist: 'SoundHelix',
    album: 'City Walk',
    cover: `${coverBase}/song3/400/400`,
    audio: `${audioBase}/SoundHelix-Song-3.mp3`,
    duration: 348,
    lrc: '[00:00.00] 城市漫步\n[00:15.00] 穿梭在钢筋水泥的丛林\n[00:30.00] 霓虹灯闪烁如星河\n[00:45.00] 每个转角都有新的故事\n[01:00.00] 脚步声回荡在空旷的街道\n[01:15.00] 城市的脉搏在跳动\n[01:30.00] 节奏从未停歇\n[01:45.00] 从清晨到日暮\n[02:00.00] 这座城市永不停转\n[02:15.00] 我在其中找到了自己\n[02:30.00] 城市漫步 每一步都是冒险\n[02:45.00] 每一天都值得记录\n[03:00.00] 让我们继续前行\n[03:15.00] 在这城市的海洋中\n[03:30.00] 寻找属于自己的节奏'
  },
  {
    id: 's4',
    name: '深海蓝调',
    artist: 'SoundHelix',
    album: 'Deep Blue',
    cover: `${coverBase}/song4/400/400`,
    audio: `${audioBase}/SoundHelix-Song-4.mp3`,
    duration: 295,
    lrc: '[00:00.00] 深海蓝调\n[00:15.00] 潜入无尽的深蓝\n[00:30.00] 寂静中只有心跳声\n[00:45.00] 光线渐渐消散\n[01:00.00] 在黑暗中寻找光明\n[01:15.00] 深海的低语 温柔而神秘\n[01:30.00] 每一次下沉 都是新的发现\n[01:45.00] 蓝色的世界 没有边界\n[02:00.00] 让自己沉浸其中\n[02:15.00] 感受水的拥抱\n[02:30.00] 深海蓝调 诉说千年故事\n[02:45.00] 在这安静的角落\n[03:00.00] 找到内心的平静\n[03:15.00] 深海蓝调 永恒的旋律'
  },
  {
    id: 's5',
    name: '晨曦之光',
    artist: 'SoundHelix',
    album: 'Dawn Light',
    cover: `${coverBase}/song5/400/400`,
    audio: `${audioBase}/SoundHelix-Song-5.mp3`,
    duration: 381,
    lrc: '[00:00.00] 晨曦之光\n[00:15.00] 第一缕阳光穿过窗帘\n[00:30.00] 唤醒沉睡的大地\n[00:45.00] 新的一天充满希望\n[01:00.00] 露珠在叶尖闪烁\n[01:15.00] 鸟儿开始了晨歌\n[01:30.00] 世界重新变得明亮\n[01:45.00] 每一个清晨都是礼物\n[02:00.00] 珍惜眼前的美好\n[02:15.00] 让阳光温暖心房\n[02:30.00] 晨曦之光 照亮前方\n[02:45.00] 不论昨天如何\n[03:00.00] 今天是全新的开始\n[03:15.00] 带着微笑出发\n[03:30.00] 迎接每一个可能\n[03:45.00] 晨曦之光 永远在路上'
  },
  {
    id: 's6',
    name: '雨后彩虹',
    artist: 'SoundHelix',
    album: 'After Rain',
    cover: `${coverBase}/song6/400/400`,
    audio: `${audioBase}/SoundHelix-Song-6.mp3`,
    duration: 405,
    lrc: '[00:00.00] 雨后彩虹\n[00:15.00] 雨滴还挂在花瓣上\n[00:30.00] 阳光已穿透云层\n[00:45.00] 七种颜色横跨天际\n[01:00.00] 风雨过后的美丽\n[01:15.00] 更加令人珍惜\n[01:30.00] 每一滴雨都是铺垫\n[01:45.00] 为了那道绚烂的光\n[02:00.00] 雨后彩虹 短暂而耀眼\n[02:15.00] 就像生活中的惊喜\n[02:30.00] 在最不经意时出现\n[02:45.00] 让人心存感激\n[03:00.00] 雨后彩虹 给予希望\n[03:15.00] 告诉我们黑暗之后\n[03:30.00] 总有光明在等待\n[03:45.00] 雨后彩虹 美丽的承诺'
  },
  {
    id: 's7',
    name: '森林之歌',
    artist: 'SoundHelix',
    album: 'Forest Song',
    cover: `${coverBase}/song7/400/400`,
    audio: `${audioBase}/SoundHelix-Song-7.mp3`,
    duration: 356,
    lrc: '[00:00.00] 森林之歌\n[00:15.00] 走进翠绿的深处\n[00:30.00] 古木参天 遮蔽天空\n[00:45.00] 落叶铺成柔软的路\n[01:00.00] 鸟鸣在枝头回荡\n[01:15.00] 小溪潺潺流过\n[01:30.00] 万物和谐共生\n[01:45.00] 呼吸最纯净的空气\n[02:00.00] 感受大地的脉动\n[02:15.00] 森林之歌 古老而悠远\n[02:30.00] 每一片树叶都在诉说\n[02:45.00] 时间在这里变慢\n[03:00.00] 灵魂得到安宁\n[03:15.00] 森林之歌 永恒的旋律\n[03:30.00] 在这片绿色天堂\n[03:45.00] 找到回家的路'
  },
  {
    id: 's8',
    name: '星际旅行',
    artist: 'SoundHelix',
    album: 'Star Journey',
    cover: `${coverBase}/song8/400/400`,
    audio: `${audioBase}/SoundHelix-Song-8.mp3`,
    duration: 418,
    lrc: '[00:00.00] 星际旅行\n[00:20.00] 启动引擎 冲破大气层\n[00:40.00] 蓝色星球渐渐变小\n[01:00.00] 穿越星云 探索未知\n[01:20.00] 星尘在舷窗外飞舞\n[01:40.00] 光年只是坐标上的数字\n[02:00.00] 寂静中听到自己的心跳\n[02:20.00] 在无垠的宇宙中漂浮\n[02:40.00] 星际旅行 寻找新世界\n[03:00.00] 每一颗星都是可能\n[03:20.00] 不畏惧前方黑暗\n[03:40.00] 因为心中有光\n[04:00.00] 星际旅行 永不返航'
  },
  {
    id: 's9',
    name: '古老钟楼',
    artist: 'SoundHelix',
    album: 'Old Tower',
    cover: `${coverBase}/song9/400/400`,
    audio: `${audioBase}/SoundHelix-Song-9.mp3`,
    duration: 333,
    lrc: '[00:00.00] 古老钟楼\n[00:15.00] 钟声在夜空中回响\n[00:30.00] 每一声都在诉说故事\n[00:45.00] 千年的风雨刻在石壁\n[01:00.00] 岁月在这里凝固\n[01:15.00] 登上螺旋的阶梯\n[01:30.00] 俯瞰整座古城\n[01:45.00] 钟楼见证了兴衰\n[02:00.00] 时光如潮水般退去\n[02:15.00] 只有钟声不变\n[02:30.00] 古老钟楼 守望时光\n[02:45.00] 每一刻都是永恒\n[03:00.00] 在钟声中找到宁静\n[03:15.00] 古老钟楼 永恒的回响'
  },
  {
    id: 's10',
    name: '沙漠之花',
    artist: 'SoundHelix',
    album: 'Desert Bloom',
    cover: `${coverBase}/song10/400/400`,
    audio: `${audioBase}/SoundHelix-Song-10.mp3`,
    duration: 390,
    lrc: '[00:00.00] 沙漠之花\n[00:15.00] 在无边的黄沙中\n[00:30.00] 一抹颜色悄然绽放\n[00:45.00] 顽强的生命力\n[01:00.00] 在最贫瘠的土地上\n[01:15.00] 开出最美的花\n[01:30.00] 沙漠之花 孤独而坚强\n[01:45.00] 不需要甘霖滋润\n[02:00.00] 只凭一缕阳光\n[02:15.00] 就能点亮整个荒原\n[02:30.00] 沙漠之花 是希望的象征\n[02:45.00] 告诉我们不放弃\n[03:00.00] 不论环境多么恶劣\n[03:15.00] 生命总能找到出路\n[03:30.00] 沙漠之花 绽放光芒\n[03:45.00] 在最不可能的地方\n[04:00.00] 创造最美丽的奇迹'
  },
  {
    id: 's11',
    name: '雪国列车',
    artist: 'SoundHelix',
    album: 'Snow Train',
    cover: `${coverBase}/song11/400/400`,
    audio: `${audioBase}/SoundHelix-Song-11.mp3`,
    duration: 312,
    lrc: '[00:00.00] 雪国列车\n[00:15.00] 汽笛声划破寒冬\n[00:30.00] 列车穿越白茫茫的旷野\n[00:45.00] 窗外雪花纷飞\n[01:00.00] 车厢内温暖如春\n[01:15.00] 旅客们各怀心事\n[01:30.00] 向着远方前行\n[01:45.00] 雪国列车 不停歇\n[02:00.00] 穿过山川和河流\n[02:15.00] 带着思念和期盼\n[02:30.00] 奔向温暖的南方\n[02:45.00] 雪国列车 载着梦想\n[03:00.00] 在冰冷的世界中\n[03:15.00] 保持前行的勇气\n[03:30.00] 雪国列车 永不停止'
  },
  {
    id: 's12',
    name: '海风轻语',
    artist: 'SoundHelix',
    album: 'Sea Breeze',
    cover: `${coverBase}/song12/400/400`,
    audio: `${audioBase}/SoundHelix-Song-12.mp3`,
    duration: 367,
    lrc: '[00:00.00] 海风轻语\n[00:15.00] 站在悬崖边眺望\n[00:30.00] 海浪拍打着礁石\n[00:45.00] 海风带着咸味扑面而来\n[01:00.00] 远处帆影点点\n[01:15.00] 海鸥盘旋在天际\n[01:30.00] 大海无边无际\n[01:45.00] 包容着所有的情绪\n[02:00.00] 海风轻语 诉说秘密\n[02:15.00] 只有用心才能听懂\n[02:30.00] 浪花是她的文字\n[02:45.00] 潮汐是她的节拍\n[03:00.00] 海风轻语 让人释怀\n[03:15.00] 所有烦恼都被带走\n[03:30.00] 消失在蔚蓝的远方\n[03:45.00] 海风轻语 温柔的安慰'
  }
]

export const playlists: Playlist[] = [
  {
    id: 'p1',
    name: '每日推荐',
    cover: `${coverBase}/playlist1/400/400`,
    desc: '根据你的口味精选 30 首好歌',
    tags: ['推荐', '流行'],
    songIds: ['s1', 's3', 's5', 's7', 's9', 's11']
  },
  {
    id: 'p2',
    name: '夜听电音',
    cover: `${coverBase}/playlist2/400/400`,
    desc: '沉浸式电子音乐 合上眼去旅行',
    tags: ['电子', '氛围'],
    songIds: ['s2', 's4', 's6', 's8', 's10', 's12']
  },
  {
    id: 'p3',
    name: '华语经典',
    cover: `${coverBase}/playlist3/400/400`,
    desc: '穿越时光的旋律 永恒的经典',
    tags: ['经典', '华语'],
    songIds: ['s1', 's2', 's3', 's4', 's5', 's6']
  },
  {
    id: 'p4',
    name: '工作专注',
    cover: `${coverBase}/playlist4/400/400`,
    desc: '轻音乐助你进入心流状态',
    tags: ['轻音乐', '专注'],
    songIds: ['s7', 's8', 's9', 's10', 's11', 's12']
  },
  {
    id: 'p5',
    name: '周末派对',
    cover: `${coverBase}/playlist5/400/400`,
    desc: '让节奏点燃你的周末之夜',
    tags: ['舞曲', '派对'],
    songIds: ['s2', 's4', 's6', 's8', 's10', 's12']
  },
  {
    id: 'p6',
    name: '深夜电台',
    cover: `${coverBase}/playlist6/400/400`,
    desc: '献给每一个失眠的夜晚',
    tags: ['治愈', '深夜'],
    songIds: ['s1', 's5', 's7', 's9', 's11', 's12']
  }
]

export const hotSearches: string[] = [
  '夏日微风', '夜空中的星', '深海蓝调', '晨曦之光', '雨后彩虹',
  '森林之歌', '星际旅行', '沙漠之花', '海风轻语', '雪国列车'
]

export function getSongById(id: string): Song | undefined {
  return songs.find(s => s.id === id)
}

export function getSongsByIds(ids: string[]): Song[] {
  return ids.map(id => getSongById(id)).filter(Boolean) as Song[]
}

export function searchSongs(keyword: string): Song[] {
  if (!keyword.trim()) return []
  const kw = keyword.toLowerCase().trim()
  return songs.filter(s =>
    s.name.toLowerCase().includes(kw) ||
    s.artist.toLowerCase().includes(kw) ||
    s.album.toLowerCase().includes(kw)
  )
}
