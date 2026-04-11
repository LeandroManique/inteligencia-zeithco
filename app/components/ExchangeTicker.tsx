// app/components/ExchangeTicker.tsx
import { Exchange } from '@/lib/types'

interface Props { exchange: Exchange }

export function ExchangeTicker({ exchange }: Props) {
  const rates = [
    { label: 'USD / BRL', value: `R$ ${exchange.USD_BRL.toFixed(4)}` },
    { label: 'EUR / BRL', value: `R$ ${exchange.EUR_BRL.toFixed(4)}` },
    { label: 'USD / EUR', value: `€ ${exchange.USD_EUR.toFixed(4)}`  },
    { label: 'USD / GBP', value: `£ ${exchange.USD_GBP.toFixed(4)}`  },
  ]

  return (
    <div style={{
      background: 'var(--bg-ink)',
      padding: '0.55rem 2rem',
      display: 'flex',
      gap: '0',
      alignItems: 'center',
      overflowX: 'auto',
    }}>
      {rates.map((r, i) => (
        <div key={r.label} style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          whiteSpace: 'nowrap',
          paddingRight: '2rem',
          borderRight: i < rates.length - 1 ? '1px solid rgba(255,255,255,0.12)' : 'none',
          marginRight: i < rates.length - 1 ? '2rem' : 0,
        }}>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.65rem',
            color: 'rgba(255,255,255,0.5)',
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
          }}>
            {r.label}
          </span>
          <span style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.8rem',
            color: '#e8e0d0',
            fontWeight: 600,
            letterSpacing: '0.02em',
          }}>
            {r.value}
          </span>
        </div>
      ))}
      <span style={{
        marginLeft: 'auto',
        fontFamily: 'var(--font-mono)',
        fontSize: '0.6rem',
        color: 'rgba(255,255,255,0.3)',
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
      }}>
        {exchange.date} · open.er-api.com
      </span>
    </div>
  )
}
