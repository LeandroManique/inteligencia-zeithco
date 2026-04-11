// app/[date]/page.tsx
import { getEditionByDate } from '@/lib/getEdition'
import { Masthead } from '../components/Masthead'
import { ExchangeTicker } from '../components/ExchangeTicker'
import { HeroSection } from '../components/HeroSection'
import { SectionCard } from '../components/SectionCard'
import { GitHubRepos } from '../components/GitHubRepos'
import { notFound } from 'next/navigation'

export const dynamic = 'force-static'

interface Props { params: Promise<{ date: string }> }

export default async function DatePage({ params }: Props) {
  const { date } = await params
  const edition = await getEditionByDate(date, 'pt')
  if (!edition) notFound()

  const githubSection = edition.sections.find(s => s.key === 'github')
  const otherSections = edition.sections.filter(s => s.key !== 'github')

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <ExchangeTicker exchange={edition.exchange} />
      <Masthead currentLang="pt" currentDate={edition.date_display} />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <HeroSection edition={edition} />
        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          {otherSections.map(s => <SectionCard key={s.key} section={s} />)}
        </div>
        {githubSection && (
          <div style={{ borderTop: '1px solid var(--border)', padding: '3rem 0' }}>
            <GitHubRepos section={githubSection} />
          </div>
        )}
      </div>
      <footer style={{ borderTop: '2px solid var(--border-strong)', marginTop: '4rem',
                       padding: '2rem', background: 'var(--bg-subtle)', textAlign: 'center' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem',
                    color: 'var(--text-tertiary)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
          ZEITH Co · Curado por IA, atualizado às 06h · {edition.date_display}
        </p>
      </footer>
    </main>
  )
}
