type EventCallback = (res?: any) => void

export class H5AudioManager {
  private audio: HTMLAudioElement
  private _title = ''
  private _singer = ''
  private _coverImgUrl = ''
  private _src = ''

  private playCbs: EventCallback[] = []
  private pauseCbs: EventCallback[] = []
  private stopCbs: EventCallback[] = []
  private endedCbs: EventCallback[] = []
  private timeUpdateCbs: EventCallback[] = []
  private errorCbs: EventCallback[] = []
  private canplayCbs: EventCallback[] = []
  private waitingCbs: EventCallback[] = []
  private nextCbs: EventCallback[] = []
  private prevCbs: EventCallback[] = []

  constructor() {
    this.audio = new Audio()
    this.audio.preload = 'auto'

    this.audio.addEventListener('play', () => {
      this.playCbs.forEach(cb => cb())
    })
    this.audio.addEventListener('pause', () => {
      this.pauseCbs.forEach(cb => cb())
    })
    this.audio.addEventListener('ended', () => {
      this.endedCbs.forEach(cb => cb())
    })
    this.audio.addEventListener('timeupdate', () => {
      this.timeUpdateCbs.forEach(cb => cb())
    })
    this.audio.addEventListener('error', (e) => {
      console.error('[H5Audio] error:', e)
      this.errorCbs.forEach(cb => cb(e))
    })
    this.audio.addEventListener('canplay', () => {
      this.canplayCbs.forEach(cb => cb())
    })
    this.audio.addEventListener('waiting', () => {
      this.waitingCbs.forEach(cb => cb())
    })
  }

  get src(): string {
    return this._src
  }

  set src(url: string) {
    this._src = url
    if (url) {
      this.audio.src = url
      this.audio.play().catch((e) => {
        console.warn('[H5Audio] play interrupted:', e)
      })
    } else {
      this.audio.removeAttribute('src')
    }
  }

  get title(): string { return this._title }
  set title(v: string) { this._title = v }

  get singer(): string { return this._singer }
  set singer(v: string) { this._singer = v }

  get coverImgUrl(): string { return this._coverImgUrl }
  set coverImgUrl(v: string) { this._coverImgUrl = v }

  get currentTime(): number { return this.audio.currentTime || 0 }
  get duration(): number {
    const d = this.audio.duration
    return (d && !isNaN(d)) ? d : 0
  }
  get buffered(): number { return this.audio.buffered.length > 0 ? this.audio.buffered.end(0) : 0 }
  get paused(): boolean { return this.audio.paused }

  play(): void {
    this.audio.play().catch((e) => {
      console.warn('[H5Audio] play failed:', e)
    })
  }

  pause(): void {
    this.audio.pause()
  }

  stop(): void {
    this.audio.pause()
    this.audio.currentTime = 0
    this.stopCbs.forEach(cb => cb())
  }

  seek(time: number): void {
    this.audio.currentTime = time
  }

  onPlay(cb: EventCallback): void { this.playCbs.push(cb) }
  onPause(cb: EventCallback): void { this.pauseCbs.push(cb) }
  onStop(cb: EventCallback): void { this.stopCbs.push(cb) }
  onEnded(cb: EventCallback): void { this.endedCbs.push(cb) }
  onTimeUpdate(cb: EventCallback): void { this.timeUpdateCbs.push(cb) }
  onError(cb: EventCallback): void { this.errorCbs.push(cb) }
  onCanplay(cb: EventCallback): void { this.canplayCbs.push(cb) }
  onWaiting(cb: EventCallback): void { this.waitingCbs.push(cb) }
  onNext(cb: EventCallback): void { this.nextCbs.push(cb) }
  onPrev(cb: EventCallback): void { this.prevCbs.push(cb) }
}
