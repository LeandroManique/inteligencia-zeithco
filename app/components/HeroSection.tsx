// app/components/HeroSection.tsx
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Edition } from '@/lib/types'

interface Props { edition: Edition }

export function HeroSection({ edition }: Props) {
  return (
    <section style={{ padding: '3rem 0 0' }} className="fade-up delay-1">

      {/* ── Label ───────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2.25rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          fontWeight: 700,
          color: '#fff',
          background: 'var(--accent)',
          padding: '0.28rem 0.65rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Edição {String(edition.edition_num).padStart(3, '0')}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.68rem',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Análise Principal
        </span>
      </div>

      {/* ── Banner de marca (sem foto aleatória) ─────────────── */}
      {edition.hero_image ? (
        <div style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '21/8',
          overflow: 'hidden',
          marginBottom: '2.5rem',
        }}>
          <Image
            src={edition.hero_image}
            alt="Capa da edição"
            fill
            style={{ objectFit: 'cover' }}
            sizes="(max-width: 1100px) 100vw, 1100px"
            priority
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, transparent 40%, rgba(26,26,26,0.6) 100%)',
          }} />
          {edition.hero_credit && (
            <span style={{
              position: 'absolute', bottom: '0.6rem', right: '0.75rem',
              fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
              color: 'rgba(255,255,255,0.45)', letterSpacing: '0.04em',
            }}>
              {edition.hero_credit}
            </span>
          )}
        </div>
      ) : (
        /* Banner tipográfico — sem imagem de banco de dados aleatório */
        <div style={{
          width: '100%',
          background: 'var(--accent)',
          padding: '2.5rem 3rem',
          marginBottom: '2.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '2rem',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Textura geométrica sutil */}
          <div style={{
            position: 'absolute', right: '-2rem', top: '-2rem',
            width: '200px', height: '200px',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute', right: '3rem', top: '-4rem',
            width: '300px', height: '300px',
            border: '1px solid rgba(255,255,255,0.05)',
            borderRadius: '50%',
          }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.4rem, 3vw, 2rem)',
              fontWeight: 700,
              color: '#fff',
              lineHeight: 1.25,
              marginBottom: '0.5rem',
            }}>
              O que muda no seu negócio hoje.
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              color: 'rgba(255,255,255,0.55)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              {edition.date_display?.split('—')[0]?.trim()} · ZEITH Co.
            </p>
          </div>

          <div style={{
            position: 'relative', zIndex: 1,
            textAlign: 'right', flexShrink: 0,
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(3rem, 6vw, 5rem)',
              fontWeight: 700,
              color: 'rgba(255,255,255,0.12)',
              lineHeight: 1,
              letterSpacing: '-0.03em',
            }}>
              {String(edition.edition_num).padStart(3, '0')}
            </p>
          </div>
        </div>
      )}

      {/* ── Conteúdo: análise + quote ─────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: edition.frase ? '3fr 1fr' : '1fr',
        gap: '3.5rem',
        alignItems: 'start',
        paddingBottom: '3rem',
        borderBottom: '1px solid var(--border)',
      }}>

        {/* Texto principal */}
        <div className="prose-hero">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {edition.parecer}
          </ReactMarkdown>
        </div>

        {/* Quote lateral */}
        {edition.frase && (
          <div style={{
            position: 'sticky',
            top: '2rem',
            borderLeft: '3px solid var(--accent)',
            paddingLeft: '1.5rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.15rem',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              lineHeight: 1.65,
              marginBottom: '0.75rem',
            }}>
              &ldquo;{edition.frase}&rdquo;
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              color: 'var(--text-tertiary)',
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
            }}>
              ZEITH Co · {edition.date_display?.split('—')[0]?.trim()}
            </p>
          </div>
        )}
      </div>
    </section>
  )
}
