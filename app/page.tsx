// app/page.tsx
import { getLatestEdition } from '@/lib/getEdition'
import { Masthead } from './components/Masthead'
import { ExchangeTicker } from './components/ExchangeTicker'
import { HeroSection } from './components/HeroSection'
import { SectionCard } from './components/SectionCard'
import { GitHubRepos } from './components/GitHubRepos'
import GateModal from './components/GateModal'
import { Edition } from '@/lib/types'

export const revalidate = 3600  // fallback ISR 1h (on-demand via webhook)

function NoContent() {
  return (
    <div style={{ maxWidth: '820px', margin: '0 auto', padding: '6rem 2rem', textAlign: 'center' }}>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--text-tertiary)' }}>
        A edição de hoje está sendo preparada.
      </p>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)', marginTop: '1rem' }}>
        Publicamos diariamente às 06h00 BRT.
      </p>
    </div>
  )
}

function PageContent({ edition }: { edition: Edition }) {
  const githubSection = edition.sections.find(s => s.key === 'github')
  const otherSections = edition.sections.filter(s => s.key !== 'github')

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <ExchangeTicker exchange={edition.exchange} />
      <Masthead currentLang="pt" currentDate={edition.date_display} />

      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '0 2rem' }}>
        <HeroSection edition={edition} />

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '3rem' }}>
          {otherSections.map(section => (
            <SectionCard key={section.key} section={section} />
          ))}
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

export default async function HomePage() {
  const edition = await getLatestEdition('pt')
  const content = edition ? <PageContent edition={edition} /> : <NoContent />
  return <GateModal>{content}</GateModal>
}
