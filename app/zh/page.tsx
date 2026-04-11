// app/zh/page.tsx
import { getLatestEdition } from '@/lib/getEdition'
import { Masthead } from '../components/Masthead'
import { ExchangeTicker } from '../components/ExchangeTicker'
import { HeroSection } from '../components/HeroSection'
import { SectionCard } from '../components/SectionCard'
import { GitHubRepos } from '../components/GitHubRepos'
import GateModal from '../components/GateModal'

export const revalidate = 3600

export default async function ZhPage() {
  const edition = await getLatestEdition('zh')
  if (!edition) return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', display: 'flex',
                   alignItems: 'center', justifyContent: 'center' }}>
      <p style={{ fontFamily: 'var(--font-serif)', color: 'var(--text-tertiary)' }}>
        今日版本尚未准备好。请在北京时间 17:00 后查看。
      </p>
    </main>
  )

  const githubSection = edition.sections.find(s => s.key === 'github')
  const otherSections = edition.sections.filter(s => s.key !== 'github')

  const content = (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <ExchangeTicker exchange={edition.exchange} />
      <Masthead currentLang="zh" currentDate={edition.date_display} />
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

  return <GateModal>{content}</GateModal>
}
