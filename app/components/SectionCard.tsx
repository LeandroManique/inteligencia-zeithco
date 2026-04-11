// app/components/SectionCard.tsx
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Section } from '@/lib/types'

interface Props { section: Section }

// Cor por seção — aparece no dot e na borda
const SECTION_COLORS: Record<string, string> = {
  ia_tecnologia:     '#1a3a5c',
  status_ia:         '#2d5a27',
  negocios_smb:      '#8B4513',
  saas_produto:      '#4a1a6b',
  venture_estrategia:'#1a4a6b',
  investimentos:     '#8B1A1A',
  regulatorio:       '#4a4a00',
  github:            '#1a1a1a',
  hacker_news:       '#c0392b',
  reddit:            '#c0392b',
}

export function SectionCard({ section }: Props) {
  const color = SECTION_COLORS[section.key] || 'var(--accent)'

  return (
    <section style={{
      padding: '3rem 0',
      borderBottom: '1px solid var(--border)',
    }} className="fade-up delay-2">

      {/* ── Header ─────────────────────────────────────────── */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        marginBottom: '2rem',
        paddingBottom: '1rem',
        borderBottom: `2px solid ${color}`,
      }}>
        <h2 style={{
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          fontWeight: 700,
          color: 'var(--text-primary)',
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
        }}>
          {section.title}
        </h2>
      </div>

      {/* ── Conteúdo ────────────────────────────────────────── */}
      <div className="prose">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>
          {section.content}
        </ReactMarkdown>
      </div>
    </section>
  )
}
