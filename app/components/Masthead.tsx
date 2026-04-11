'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'
import { LANG_LABELS, type Lang } from '@/lib/types'

interface MastheadProps {
  currentLang: Lang
  currentDate: string   // "2026-04-10"
}

const WORDS = ['ARTIFICIAL', 'REAL']
const INTERVAL_MS = 2500

export function Masthead({ currentLang, currentDate }: MastheadProps) {
  const word0Ref = useRef<HTMLSpanElement>(null)
  const word1Ref = useRef<HTMLSpanElement>(null)
  const idxRef = useRef(0)

  useEffect(() => {
    const words = [word0Ref.current, word1Ref.current]
    if (!words[0] || !words[1]) return

    const tick = () => {
      const curr = idxRef.current
      const next = (curr + 1) % WORDS.length

      // Saída: slide para cima + fade
      words[curr]!.style.transform = 'translateY(-110%)'
      words[curr]!.style.opacity   = '0'

      // Entrada: vem de baixo
      words[next]!.style.transition = 'none'
      words[next]!.style.transform  = 'translateY(110%)'
      words[next]!.style.opacity    = '0'

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          words[next]!.style.transition = 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.45s ease'
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
    <div style={{ borderBottom: '3px double var(--border-strong)', background: 'var(--bg)' }}>
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0.875rem 2rem',
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

        {/* Logo + nome animado */}
        <Link href={currentLang === 'pt' ? '/' : `/${currentLang}`}
              style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700,
                         color: 'var(--text-primary)', letterSpacing: '0.07em', textTransform: 'uppercase' }}>
            ZEITH CO
          </span>
          <span style={{ color: 'var(--border)', fontWeight: 300, fontSize: '1rem' }}>|</span>
          <span style={{ fontFamily: 'var(--font-sans)', fontSize: '0.8rem', fontWeight: 700,
                         letterSpacing: '0.07em', textTransform: 'uppercase',
                         display: 'flex', alignItems: 'center', gap: 0 }}>
            <span style={{ color: 'var(--text-primary)' }}>INTELIGÊNCIA&nbsp;</span>
            {/* Slide-up container */}
            <span style={{ position: 'relative', display: 'inline-block',
                           width: '7.5rem', height: '1.1em', overflow: 'hidden',
                           verticalAlign: 'middle' }}>
              <span ref={word0Ref} style={{ position: 'absolute', top: 0, left: 0,
                                            color: 'var(--accent)',
                                            transition: 'transform 0.45s cubic-bezier(0.4,0,0.2,1), opacity 0.35s ease' }}>
                {WORDS[0]}
              </span>
              <span ref={word1Ref} style={{ position: 'absolute', top: 0, left: 0,
                                            color: 'var(--accent)', opacity: 0, transform: 'translateY(110%)' }}>
                {WORDS[1]}
              </span>
            </span>
            <span style={{ color: 'var(--text-primary)' }}>&nbsp;DIÁRIA</span>
          </span>
        </Link>

        {/* Direita: seletor de idioma + data */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          <div style={{ display: 'flex', gap: '0.35rem' }}>
            {langs.map(lang => (
              <Link
                key={lang}
                href={lang === 'pt' ? '/' : `/${lang}`}
                style={{
                  fontFamily: 'var(--font-sans)',
                  fontSize: '0.5rem', fontWeight: 700,
                  letterSpacing: '0.08em', textTransform: 'uppercase',
                  padding: '0.15rem 0.4rem',
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
          {currentDate && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                           color: 'var(--text-tertiary)', letterSpacing: '0.04em',
                           textTransform: 'uppercase' }}>
              {currentDate}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}
