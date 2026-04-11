// app/en/page.tsx
import { getLatestEdition } from '@/lib/getEdition'
import { Masthead } from '../components/Masthead'
import { ExchangeTicker } from '../components/ExchangeTicker'
import { HeroSection } from '../components/HeroSection'
import { SectionCard } from '../components/SectionCard'
import { GitHubRepos } from '../components/GitHubRepos'

export const revalidate = 3600

export default async function EnPage() {
  const edition = await getLatestEdition('en')
  if (!edition) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex',
                   alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-tertiary)' }}>
        Edition not available yet. Check back at 06:00 BRT.
      </p>
    </main>
  )

  const githubSection = edition.sections.find(s => s.key === 'github')
  const otherSections = edition.sections.filter(s => s.key !== 'github')

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <ExchangeTicker exchange={edition.exchange} />
      <Masthead currentLang="en" currentDate={edition.date_display} />
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
    </main>
  )
}
