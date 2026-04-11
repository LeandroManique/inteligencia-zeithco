// app/components/SectionCard.tsx
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Section } from '@/lib/types'

interface Props { section: Section }

// Seeded fallback images per section (no API key needed)
const SECTION_SEEDS: Record<string, string> = {
  ia_tecnologia:     'ai-technology',
  status_ia:         'artificial-intelligence',
  negocios_smb:      'small-business',
  saas_produto:      'software-product',
  venture_estrategia:'startup-strategy',
  investimentos:     'finance-economy',
  regulatorio:       'law-regulation',
  github:            'open-source-code',
  hacker_news:       'technology-community',
  reddit:            'internet-forum',
}

// Color accent per section
const SECTION_COLORS: Record<string, string> = {
  ia_tecnologia:     '#1a3a5c',
  status_ia:         '#2d5a27',
  negocios_smb:      '#7a3e00',
  saas_produto:      '#4a1a6b',
  venture_estrategia:'#1a4a6b',
  investimentos:     '#6b1a1a',
  regulatorio:       '#3d3d00',
  github:            '#1a1a1a',
  hacker_news:       '#c0392b',
  reddit:            '#c0392b',
}

function getSectionImage(section: Section): string | null {
  if (section.image_url) return section.image_url
  const seed = SECTION_SEEDS[section.key] || section.key
  return `https://picsum.photos/seed/${seed}/800/500`
}

export function SectionCard({ section }: Props) {
  const img = getSectionImage(section)
  const accentColor = SECTION_COLORS[section.key] || 'var(--accent)'

  return (
    <section style={{
      padding: '3rem 0',
      borderBottom: '1px solid var(--border)',
    }} className="fade-up delay-2">

      {/* ── Header da seção ─────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '1.75rem',
      }}>
        <span style={{
          display: 'inline-block',
          width: '8px', height: '8px',
          borderRadius: '50%',
          background: accentColor,
          flexShrink: 0,
        }} />
        <h2 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.7rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.14em',
          textTransform: 'uppercase',
        }}>
          {section.title}
        </h2>
      </div>

      {/* ── Grid: imagem + conteúdo ─────────────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: img ? '1fr 300px' : '1fr',
        gap: '2.5rem',
        alignItems: 'start',
      }}>

        {/* Conteúdo */}
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {section.content}
          </ReactMarkdown>
        </div>

        {/* Imagem */}
        {img && (
          <div style={{ position: 'sticky', top: '2rem' }}>
            <div style={{
              position: 'relative',
              aspectRatio: '4/3',
              overflow: 'hidden',
              borderRadius: '2px',
              border: '1px solid var(--border)',
            }}>
              <Image
                src={img}
                alt={section.title}
                fill
                style={{ objectFit: 'cover' }}
                sizes="300px"
                unoptimized={img.includes('picsum')}
              />
            </div>
            {section.image_credit && (
              <p style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.6rem',
                color: 'var(--text-tertiary)',
                marginTop: '0.4rem',
                letterSpacing: '0.04em',
              }}>
                {section.image_credit}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
