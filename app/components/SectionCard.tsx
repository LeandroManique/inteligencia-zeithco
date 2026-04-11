// app/components/SectionCard.tsx
import Image from 'next/image'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Section } from '@/lib/types'

interface Props { section: Section }

export function SectionCard({ section }: Props) {
  return (
    <section style={{ padding: '2.5rem 0',
                      borderBottom: '1px solid var(--border)',
                      display: 'grid',
                      gridTemplateColumns: section.image_url ? '1fr 280px' : '1fr',
                      gap: '2.5rem', alignItems: 'start' }}>

      {/* Conteúdo */}
      <div>
        <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.52rem',
                    color: 'var(--text-tertiary)', fontWeight: 700,
                    letterSpacing: '0.18em', textTransform: 'uppercase',
                    marginBottom: '0.875rem' }}>
          {section.title}
        </p>
        <div className="prose">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>
            {section.content}
          </ReactMarkdown>
        </div>
      </div>

      {/* Imagem da seção */}
      {section.image_url && (
        <div style={{ position: 'sticky', top: '2rem' }}>
          <div style={{ position: 'relative', aspectRatio: '3/2', overflow: 'hidden',
                        borderRadius: '2px', border: '1px solid var(--border)' }}>
            <Image
              src={section.image_url}
              alt={section.title}
              fill
              style={{ objectFit: 'cover' }}
              sizes="280px"
            />
          </div>
          {section.image_credit && (
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.42rem',
                         color: 'var(--text-tertiary)', marginTop: '0.35rem' }}>
              {section.image_credit}
            </p>
          )}
        </div>
      )}
    </section>
  )
}
