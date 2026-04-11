'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { LANG_LABELS, type Lang } from '@/lib/types'

interface MastheadProps {
  currentLang: Lang
  currentDate: string
}

const WORDS = ['ARTIFICIAL', 'REAL']
const INTERVAL_MS = 2800

export function Masthead({ currentLang, currentDate }: MastheadProps) {
  const word0Ref = useRef<HTMLSpanElement>(null)
  const word1Ref = useRef<HTMLSpanElement>(null)
  const idxRef   = useRef(0)

  useEffect(() => {
    const words = [word0Ref.current, word1Ref.current]
    if (!words[0] || !words[1]) return

    const tick = () => {
      const curr = idxRef.current
      const next = (curr + 1) % WORDS.length

      words[curr]!.style.transform = 'translateY(-110%)'
      words[curr]!.style.opacity   = '0'

      words[next]!.style.transition = 'none'
      words[next]!.style.transform  = 'translateY(110%)'
      words[next]!.style.opacity    = '0'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          words[next]!.style.transition = 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease'
          words[next]!.style.transform  = 'translateY(0)'
          words[next]!.style.opacity    = '1'
        })
      })
      idxRef.current = next
    }

    const interval = setInterval(tick, INTERVAL_MS)
    return () => clearInterval(interval)
  }, [])

  const langs = (['pt', 'en', 'es', 'zh'] as Lang[])

  return (
    <header>
      {/* ── Faixa superior ─────────────────────────────────────── */}
      <div style={{
        borderBottom: '1px solid var(--border)',
        padding: '0.45rem 2rem',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '100%',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
        }}>
          Inteligência Prática Para Empreendedores · Publicado às 06h BRT
        </span>
        <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'center' }}>
          <Link href="/arquivo" style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            textDecoration: 'none',
          }}>
            Arquivo
          </Link>
          <div style={{ display: 'flex', gap: '0.3rem' }}>
            {langs.map(lang => (
              <Link
                key={lang}
                href={lang === 'pt' ? '/' : `/${lang}`}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.62rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  padding: '0.2rem 0.5rem',
                  border: `1px solid ${lang === currentLang ? 'var(--accent)' : 'var(--border)'}`,
                  borderRadius: '2px',
                  background: lang === currentLang ? 'var(--accent)' : 'transparent',
                  color: lang === currentLang ? '#fff' : 'var(--text-tertiary)',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                {LANG_LABELS[lang]}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Masthead principal ─────────────────────────────────── */}
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        padding: '1.75rem 2rem 1.5rem',
        textAlign: 'center',
        position: 'relative',
      }}>
        <Link href={currentLang === 'pt' ? '/' : `/${currentLang}`} style={{ textDecoration: 'none' }}>
          {/* Linha 1: ZEITH CO */}
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            fontWeight: 700,
            color: 'var(--text-tertiary)',
            letterSpacing: '0.35em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}>
            ZEITH CO
          </div>

          {/* Linha 2: título principal animado */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 0,
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1.6rem, 4vw, 2.6rem)',
            fontWeight: 700,
            color: 'var(--text-primary)',
            letterSpacing: '-0.01em',
            lineHeight: 1.1,
          }}>
            <span>INTELIGÊNCIA&nbsp;</span>

            {/* Slot animado — 7em cobre ARTIFICIAL em qualquer tamanho de fonte */}
            <span style={{
              position: 'relative',
              display: 'inline-block',
              overflow: 'hidden',
              height: '1.15em',
              width: '7em',
              verticalAlign: 'middle',
            }}>
              <span ref={word0Ref} style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                color: 'var(--accent)',
                transition: 'transform 0.5s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease',
              }}>
                {WORDS[0]}
              </span>
              <span ref={word1Ref} style={{
                position: 'absolute', top: 0, left: 0, right: 0,
                color: 'var(--accent)', opacity: 0, transform: 'translateY(110%)',
              }}>
                {WORDS[1]}
              </span>
            </span>

            <span>&nbsp;DIÁRIA</span>
          </div>
        </Link>

        {/* Data */}
        {currentDate && (
          <div style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.7rem',
            color: 'var(--text-tertiary)',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            marginTop: '0.75rem',
          }}>
            {currentDate}
          </div>
        )}
      </div>

      {/* ── Linha dupla inferior ───────────────────────────────── */}
      <div style={{ borderTop: '3px solid var(--border-strong)', borderBottom: '1px solid var(--border)' }}>&nbsp;</div>
    </header>
  )
}
