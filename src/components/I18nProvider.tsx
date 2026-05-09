'use client'

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { type Locale, type TranslationKey, t } from '@/lib/i18n'

interface I18nContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const I18nContext = createContext<I18nContextValue | null>(null)

function getCookie(name: string): string | null {
  if (typeof document === 'undefined') return null
  const match = document.cookie.match(new RegExp('(^| )' + name + '=([^;]+)'))
  return match ? decodeURIComponent(match[2]) : null
}

function setCookie(name: string, value: string) {
  const maxAge = 365 * 24 * 60 * 60 // 1 year
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAge}; SameSite=Lax`
}

function detectLocale(): Locale {
  // 1. Check cookie first
  const cookie = getCookie('NEXT_LOCALE')
  if (cookie === 'zh' || cookie === 'en') return cookie

  // 2. Check browser language
  if (typeof navigator !== 'undefined') {
    const lang = navigator.language || (navigator as any).userLanguage || ''
    if (lang.startsWith('zh')) return 'zh'
    if (lang.startsWith('en')) return 'en'
  }

  // 3. Default to zh (this is a Chinese-first blog)
  return 'zh'
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('zh')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setLocaleState(detectLocale())
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    setCookie('NEXT_LOCALE', newLocale)
    // Also update html lang attribute
    document.documentElement.lang = newLocale === 'zh' ? 'zh-CN' : 'en'
  }, [])

  const translate = useCallback(
    (key: TranslationKey): string => {
      return t(key, locale)
    },
    [locale]
  )

  // During SSR and before hydration, use 'zh' as default to avoid mismatch
  const value: I18nContextValue = {
    locale: mounted ? locale : 'zh',
    setLocale,
    t: mounted ? translate : (key: TranslationKey) => t(key, 'zh'),
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    // Fallback for SSR / outside provider
    return {
      locale: 'zh',
      setLocale: () => {},
      t: (key: TranslationKey) => t(key, 'zh'),
    }
  }
  return ctx
}
