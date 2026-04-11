// app/components/GitHubRepos.tsx
import { Section, GitHubRepo } from '@/lib/types'

interface Props { section: Section }

function RepoCard({ repo }: { repo: GitHubRepo }) {
  return (
    <a
      href={repo.url}
      target="_blank"
      rel="noopener noreferrer"
      style={{ display: 'block', padding: '1.25rem', textDecoration: 'none',
               border: '1px solid var(--border)', borderRadius: '2px',
               transition: 'border-color 0.2s, background 0.2s' }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--accent)'
        ;(e.currentTarget as HTMLElement).style.background = 'var(--accent-light)'
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLElement).style.borderColor = 'var(--border)'
        ;(e.currentTarget as HTMLElement).style.background = 'transparent'
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between',
                    alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem',
                    color: 'var(--accent)', fontWeight: 500 }}>
          {repo.name}
        </p>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                         color: 'var(--text-tertiary)' }}>
            {repo.stars.toLocaleString()} stars
          </span>
          {repo.stars_today > 0 && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.5rem',
                           color: '#2a7a4a', fontWeight: 600 }}>
              +{repo.stars_today} hoje
            </span>
          )}
        </div>
      </div>
      <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)',
                  lineHeight: 1.55, marginBottom: '0.5rem' }}>
        {repo.description}
      </p>
      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                     color: 'var(--text-tertiary)', fontWeight: 500,
                     padding: '0.15rem 0.5rem', border: '1px solid var(--border)',
                     borderRadius: '2px' }}>
        {repo.language}
      </span>
    </a>
  )
}

export function GitHubRepos({ section }: Props) {
  const repos = (section.github_repos ?? []) as GitHubRepo[]
  if (repos.length === 0) return null

  return (
    <div>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.52rem',
                  color: 'var(--text-tertiary)', fontWeight: 700,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  marginBottom: '1.5rem' }}>
        Repositórios em Destaque
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem' }}>
        {repos.map(repo => (
          <RepoCard key={repo.name} repo={repo} />
        ))}
      </div>
    </div>
  )
}
