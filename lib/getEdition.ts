// lib/getEdition.ts
import { createServerClient } from './supabase'
import { Edition, Lang } from './types'

export async function getEditionByDate(
  date: string,   // "2026-04-10" ou "today"
  lang: Lang = 'pt'
): Promise<Edition | null> {
  const client = createServerClient()

  const targetDate = date === 'today'
    ? new Date().toISOString().split('T')[0]
    : date

  const { data: edition, error } = await client
    .from('inteligencia_editions')
    .select('*')
    .eq('date', targetDate)
    .eq('lang', lang)
    .single()

  if (error || !edition) return null

  const { data: sections } = await client
    .from('inteligencia_sections')
    .select('*')
    .eq('edition_id', edition.id)
    .order('position', { ascending: true })

  return { ...edition, sections: sections ?? [] }
}

export async function getLatestEdition(lang: Lang = 'pt'): Promise<Edition | null> {
  const client = createServerClient()

  const { data: edition, error } = await client
    .from('inteligencia_editions')
    .select('*')
    .eq('lang', lang)
    .order('date', { ascending: false })
    .limit(1)
    .single()

  if (error || !edition) return null

  const { data: sections } = await client
    .from('inteligencia_sections')
    .select('*')
    .eq('edition_id', edition.id)
    .order('position', { ascending: true })

  return { ...edition, sections: sections ?? [] }
}

export async function getArchive(
  lang: Lang = 'pt',
  page: number = 1,
  perPage: number = 20
): Promise<{ editions: Edition[]; total: number }> {
  const client = createServerClient()
  const from   = (page - 1) * perPage
  const to     = from + perPage - 1

  const { data, count } = await client
    .from('inteligencia_editions')
    .select('id, date, date_display, edition_num, hero_image, parecer', { count: 'exact' })
    .eq('lang', lang)
    .order('date', { ascending: false })
    .range(from, to)

  return {
    editions: (data ?? []) as unknown as Edition[],
    total: count ?? 0,
  }
}
