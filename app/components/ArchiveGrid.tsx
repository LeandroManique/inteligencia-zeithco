// app/components/ArchiveGrid.tsx
import Link from 'next/link'
import Image from 'next/image'
import { Edition } from '@/lib/types'

interface Props { editions: Edition[] }

export function ArchiveGrid({ editions }: Props) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                  gap: '1.5rem' }}>
      {editions.map(ed => (
        <Link
          key={ed.id}
          href={`/${ed.date}`}
          style={{ textDecoration: 'none', display: 'block',
                   border: '1px solid var(--border)', borderRadius: '2px',
                   overflow: 'hidden', transition: 'border-color 0.2s' }}
        >
          {ed.hero_image && (
            <div style={{ position: 'relative', aspectRatio: '16/9' }}>
              <Image src={ed.hero_image} alt={`Edição ${ed.edition_num}`}
                     fill style={{ objectFit: 'cover' }} sizes="280px" />
            </div>
          )}
          <div style={{ padding: '1rem' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                        color: 'var(--text-tertiary)', textTransform: 'uppercase',
                        letterSpacing: '0.1em', marginBottom: '0.4rem' }}>
              Edição {ed.edition_num} · {ed.date_display}
            </p>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.95rem',
                        color: 'var(--text-primary)', lineHeight: 1.4,
                        display: '-webkit-box', WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
              {ed.parecer?.slice(0, 120)}...
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}
