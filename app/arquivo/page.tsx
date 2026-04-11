// app/arquivo/page.tsx
import { getArchive } from '@/lib/getEdition'
import { Masthead } from '../components/Masthead'
import { ArchiveGrid } from '../components/ArchiveGrid'

export const revalidate = 3600

export default async function ArquivoPage() {
  const { editions, total } = await getArchive('pt', 1, 30)

  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh' }}>
      <Masthead currentLang="pt" currentDate="" />
      <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '3rem 2rem' }}>
        <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem',
                     color: 'var(--text-primary)', fontWeight: 700,
                     marginBottom: '0.5rem' }}>
          Arquivo
        </h1>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-tertiary)',
                    marginBottom: '2.5rem' }}>
          {total} edições publicadas
        </p>
        <ArchiveGrid editions={editions as any} />
      </div>
    </main>
  )
}
