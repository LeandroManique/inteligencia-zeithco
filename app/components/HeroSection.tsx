// app/components/HeroSection.tsx
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Edition } from '@/lib/types'

interface Props { edition: Edition }

// Section images per section key (seeded Picsum fallback)
const SECTION_IMAGES: Record<string, string> = {
  default: 'https://picsum.photos/seed/zeith-hero/1400/700',
}

export function HeroSection({ edition }: Props) {
  const heroImg = edition.hero_image || SECTION_IMAGES.default

  return (
    <section style={{ padding: '3rem 0 0' }} className="fade-up delay-1">

      {/* ── Label ─────────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          fontWeight: 700,
          color: '#fff',
          background: 'var(--accent)',
          padding: '0.25rem 0.6rem',
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          Edição {String(edition.edition_num).padStart(3, '0')}
        </span>
        <span style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.65rem',
          color: 'var(--text-tertiary)',
          letterSpacing: '0.1em',
          textTransform: 'uppercase',
        }}>
          Análise Principal
        </span>
      </div>

      {/* ── Imagem hero ───────────────────────────────────────── */}
      <div style={{
        position: 'relative',
        width: '100%',
        aspectRatio: '21/8',
        overflow: 'hidden',
        marginBottom: '2.5rem',
        background: 'var(--accent)',
      }}>
        <Image
          src={heroImg}
          alt="Capa da edição"
          fill
          style={{ objectFit: 'cover', opacity: 0.85 }}
          sizes="(max-width: 1100px) 100vw, 1100px"
          priority
          unoptimized={heroImg.includes('picsum')}
        />
        {/* Overlay gradiente no bottom */}
        <div style={{
          position: 'absolute', inset: 0,
          background: 'linear-gradient(to bottom, transparent 50%, rgba(26,26,26,0.65) 100%)',
        }} />
        {edition.hero_credit && (
          <span style={{
            position: 'absolute', bottom: '0.6rem', right: '0.75rem',
            fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
            color: 'rgba(255,255,255,0.5)', letterSpacing: '0.04em',
          }}>
            {edition.hero_credit}
          </span>
        )}
      </div>

      {/* ── Conteúdo: texto + quote ───────────────────────────── */}
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
            paddingTop: '0.25rem',
          }}>
            <p style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '1.2rem',
              fontStyle: 'italic',
              color: 'var(--text-primary)',
              lineHeight: 1.6,
              marginBottom: '0.75rem',
            }}>
              &ldquo;{edition.frase}&rdquo;
            </p>
            <p style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
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
