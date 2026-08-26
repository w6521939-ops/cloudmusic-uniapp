// H5 开发环境使用 Vite 代理绕过 CORS，其他环境直连
// #ifdef H5
const BASE_URL = import.meta.env.DEV ? '/netease-api' : 'https://music163.xuanmou.com.cn'
// #endif
// #ifndef H5
const BASE_URL = 'https://music163.xuanmou.com.cn'
// #endif

interface RequestOptions {
  url: string
  method?: 'GET' | 'POST'
  data?: Record<string, any>
  showLoading?: boolean
}

interface ApiResponse<T = any> {
  code: number
  [key: string]: any
  data?: T
}

export async function request<T = any>(options: RequestOptions): Promise<T> {
  const { url, method = 'POST', data = {}, showLoading = false } = options

  if (showLoading) {
    uni.showLoading({ title: '加载中...', mask: true })
  }

  return new Promise<T>((resolve, reject) => {
    uni.request({
      url: BASE_URL + url,
      method,
      data: {
        ...data,
        timestamp: Date.now()
      },
      header: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      success: (res) => {
        const body = res.data as ApiResponse<T>
        if (body && (body.code === 200 || body.code === 0)) {
          resolve(body as T)
        } else {
          console.warn('[API] response error:', body)
          reject(new Error(body?.message || 'API response error'))
        }
      },
      fail: (err) => {
        console.error('[API] request failed:', err)
        reject(new Error(err.errMsg || 'Network error'))
      },
      complete: () => {
        if (showLoading) {
          uni.hideLoading()
        }
      }
    })
  })
}
