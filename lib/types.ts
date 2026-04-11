// lib/types.ts

export interface Exchange {
  USD_BRL: number
  EUR_BRL: number
  USD_EUR: number
  USD_GBP: number
  date: string
}

export interface GitHubRepo {
  name: string          // "openai/swarm"
  description: string
  stars: number
  stars_today: number
  language: string
  url: string
}

export interface Section {
  id: string
  key: string
  title: string
  content: string       // markdown
  image_url: string | null
  image_credit: string | null
  github_repos: GitHubRepo[] | null
  position: number
}

export interface Edition {
  id: string
  date: string          // "2026-04-10"
  lang: 'pt' | 'en' | 'es' | 'zh'
  date_display: string
  edition_num: number
  parecer: string       // markdown
  frase: string | null
  books: string | null  // markdown
  exchange: Exchange
  hero_image: string | null
  hero_credit: string | null
  sections: Section[]
}

export type Lang = 'pt' | 'en' | 'es' | 'zh'

export const LANG_LABELS: Record<Lang, string> = {
  pt: 'PT',
  en: 'EN',
  es: 'ES',
  zh: 'ZH',
}

export const LANG_NAMES: Record<Lang, string> = {
  pt: 'Português',
  en: 'English',
  es: 'Español',
  zh: '中文',
}
