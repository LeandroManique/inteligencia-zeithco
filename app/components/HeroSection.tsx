// app/components/HeroSection.tsx
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Edition } from '@/lib/types'

interface Props { edition: Edition }

export function HeroSection({ edition }: Props) {
  return (
    <section style={{ padding: '3.5rem 0 2.5rem' }} className="fade-up delay-1">

      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.55rem',
                  color: 'var(--accent)', fontWeight: 700, letterSpacing: '0.18em',
                  textTransform: 'uppercase', marginBottom: '1.25rem' }}>
        Edição {edition.edition_num} · Análise Principal
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: edition.hero_image ? '1fr 1fr' : '1fr',
                    gap: '3rem', alignItems: 'start' }}>

        {/* Texto */}
        <div>
          <div className="prose">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {edition.parecer}
            </ReactMarkdown>
          </div>

          {edition.frase && (
            <blockquote style={{ borderLeft: '3px solid var(--accent)',
                                  paddingLeft: '1.25rem', marginTop: '2rem' }}>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
                           color: 'var(--text-primary)', lineHeight: 1.55,
                           fontStyle: 'italic' }}>
                {edition.frase}
              </p>
            </blockquote>
          )}
        </div>

        {/* Imagem hero */}
        {edition.hero_image && (
          <div>
            <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden',
                          borderRadius: '2px', border: '1px solid var(--border)' }}>
              <Image
                src={edition.hero_image}
                alt="Imagem da análise principal"
                fill
                style={{ objectFit: 'cover' }}
                sizes="(max-width: 1100px) 50vw, 500px"
                priority
              />
            </div>
            {edition.hero_credit && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.45rem',
                           color: 'var(--text-tertiary)', marginTop: '0.4rem',
                           letterSpacing: '0.04em' }}>
                {edition.hero_credit}
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
