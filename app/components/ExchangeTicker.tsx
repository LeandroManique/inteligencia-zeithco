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
    <div style={{ background: 'var(--accent)', padding: '0.4rem 2rem',
                  display: 'flex', gap: '2.5rem', alignItems: 'center',
                  overflowX: 'auto' }}>
      {rates.map(r => (
        <div key={r.label} style={{ display: 'flex', gap: '0.5rem',
                                     alignItems: 'center', whiteSpace: 'nowrap' }}>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.48rem',
                         color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase',
                         letterSpacing: '0.08em' }}>
            {r.label}
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.55rem',
                         color: '#fff', fontWeight: 500 }}>
            {r.value}
          </span>
        </div>
      ))}
      <span style={{ marginLeft: 'auto', fontFamily: 'var(--font-mono)',
                     fontSize: '0.45rem', color: 'rgba(255,255,255,0.4)',
                     letterSpacing: '0.06em', textTransform: 'uppercase',
                     whiteSpace: 'nowrap' }}>
        {exchange.date} · open.er-api.com
      </span>
    </div>
  )
}
