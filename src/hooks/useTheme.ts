import { useCallback, useEffect, useState } from 'react'

export type Theme = 'light' | 'dark'

/** 主题偏好持久化 key，与 i18nextLng / elderly-mode 相互独立 */
export const THEME_STORAGE_KEY = 'theme'
/** 浅色主题下的 theme-color，与 index.html 初始值一致 */
export const THEME_COLOR_LIGHT = '#fbf5ea'
/** 深色主题下的 theme-color，与深色页面底色（charcoal-900）一致 */
export const THEME_COLOR_DARK = '#211f1c'

/**
 * 主题（浅色 / 夜间模式）状态管理 hook。
 * 优先级：localStorage > 默认浅色（不跟随系统偏好）。
 * localStorage 不可用时降级为内存态，不报错不阻塞。
 */
export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    const initial = getInitialTheme()
    applyTheme(initial)
    return initial
  })

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === 'dark' ? 'light' : 'dark'
      try {
        localStorage.setItem(THEME_STORAGE_KEY, next)
      } catch {
        // localStorage 不可用时降级为内存态，不报错
      }
      return next
    })
  }, [])

  return { theme, toggle }
}

function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY)
    if (stored === 'dark') return 'dark'
    if (stored === 'light') return 'light'
  } catch {
    // localStorage 不可用时降级为默认浅色
  }
  return 'light'
}

function applyTheme(theme: Theme) {
  const root = document.documentElement
  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  const meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', theme === 'dark' ? THEME_COLOR_DARK : THEME_COLOR_LIGHT)
}
