# Inteligência IA — Portal Rebuild Design Spec
**Data:** 2026-04-10  
**Projeto:** inteligencia-zeithco  
**Autor:** Leandro (ZEITH Co) + Claude  
**Status:** Aprovado para implementação

---

## 1. Visão e Posicionamento

**Nome do portal:** ZEITH CO | INTELIGÊNCIA ARTIFICIAL/REAL DIÁRIA  
*(A palavra ARTIFICIAL troca com REAL via animação slide-up no masthead)*

**Missão:** O maior portal de informações sobre IA para negócios locais do mundo — atualizado diariamente às 06h00 BRT, em 4 idiomas, com linguagem acessível e prática para donos e gestores de negócios físicos.

**Público-alvo:** Donos de negócios locais (brick-and-mortar), gestores de PME, empreendedores brasileiros e latino-americanos que precisam entender e aplicar IA nos seus negócios — sem jargão técnico, sem enrolação.

**Tom de voz:** Direto, sem frescura, inteligente. Rony Meisler. Fala com o dono da empresa como se fosse um sócio que entende de tecnologia. Zero emoji. Zero "clique aqui para saber mais". Vai direto ao ponto e diz o que importa.

---

## 2. Decisões de Design Aprovadas

| Decisão | Escolha |
|---|---|
| Modelo de portal | Newspaper — arquivo histórico com URL por data |
| Banco de dados | Supabase compartilhado com ZeithBoost (projeto czgvtlyn) |
| Automação | GitHub Actions cron 09:00 UTC / 06:00 BRT — sem PC |
| Design | Off-white (#faf8f4), serif (Playfair Display), navy accent (#1a3a5c) |
| Emojis | Zero — categorias por label texto uppercase |
| Gate | Mantido — cadastro obrigatório antes de acessar |
| Imagens | Combinação OpenGraph + Unsplash — só imagens excelentes (≥1200px) |
| Idiomas | PT-BR · EN · ES · ZH (gerados pelo pipeline na mesma execução) |
| Animação masthead | Slide Up — ARTIFICIAL sobe, REAL aparece, ciclo 2.5s |
| GitHub repos | Seção dedicada com cards estruturados (JSON, não markdown) |

---

## 3. Arquitetura do Sistema

```
GitHub Actions (cron 09:00 UTC = 06:00 BRT)
└── digest.py
    ├── Busca fontes: RSS, X/Nitter, GitHub Trending, HN, Reddit
    ├── Gera conteúdo PT via Groq (llama-3.3-70b) / Claude fallback
    ├── Traduz PT → EN, ES, ZH em paralelo via Groq
    ├── Busca imagens: OpenGraph das fontes → Unsplash fallback
    │   └── Filtro: só ≥1200px largura, sem logos, sem screenshots
    ├── Estrutura GitHub repos como JSON (não markdown)
    └── Grava no Supabase via service role key
        └── POST /api/revalidate → Vercel on-demand ISR

Supabase (czgvtlyn — compartilhado ZeithBoost)
├── inteligencia_editions    (uma linha por date + lang)
├── inteligencia_sections    (seções de cada edição + imagens + github_repos)
├── inteligencia_images      (cache de imagens aprovadas)
└── inteligencia_cadastros   (já existe — gate de cadastro)

Next.js 16 App Router (Vercel)
├── /                   → edição PT de hoje (ISR on-demand)
├── /[date]             → edição PT por data (force-static)
├── /arquivo            → lista paginada de edições (ISR 1h)
├── /en /es /zh         → edição do idioma hoje
└── /[lang]/[date]      → edição por idioma + data (force-static)
```

---

## 4. Banco de Dados

### 4.1 Tabela `inteligencia_editions`
```sql
CREATE TABLE inteligencia_editions (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  date          date NOT NULL,
  lang          text NOT NULL CHECK (lang IN ('pt','en','es','zh')),
  date_display  text NOT NULL,
  edition_num   integer NOT NULL,
  parecer       text NOT NULL,       -- análise principal (markdown)
  frase         text,                -- citação do dia
  books         text,                -- leituras da semana (markdown)
  exchange      jsonb NOT NULL,      -- { USD_BRL, EUR_BRL, USD_EUR, USD_GBP, date }
  hero_image    text,                -- URL da imagem principal
  hero_credit   text,                -- crédito da imagem
  created_at    timestamptz DEFAULT now(),
  UNIQUE (date, lang)
);
```

### 4.2 Tabela `inteligencia_sections`
```sql
CREATE TABLE inteligencia_sections (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  edition_id    uuid REFERENCES inteligencia_editions(id) ON DELETE CASCADE,
  key           text NOT NULL,       -- ia_tecnologia | status_ia | saas_produto | ...
  title         text NOT NULL,
  content       text NOT NULL,       -- markdown
  image_url     text,
  image_credit  text,
  github_repos  jsonb,               -- array de repos (só na seção "github")
  position      integer NOT NULL,
  UNIQUE (edition_id, key)
);

-- Estrutura de github_repos:
-- [{ "name": "openai/swarm", "description": "...", "stars": 18420,
--    "stars_today": 342, "language": "Python", "url": "https://..." }]
```

### 4.3 Tabela `inteligencia_images`
```sql
CREATE TABLE inteligencia_images (
  id            uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  query         text NOT NULL UNIQUE,
  url           text NOT NULL,
  source        text NOT NULL CHECK (source IN ('unsplash','opengraph')),
  credit        text,
  width         integer,
  cached_at     timestamptz DEFAULT now()
);
```

### 4.4 RLS
- `inteligencia_editions`, `inteligencia_sections`, `inteligencia_images`: SELECT público (anon key), INSERT/UPDATE/DELETE apenas service role
- `inteligencia_cadastros`: sem mudança

---

## 5. Frontend — Estrutura de Arquivos

```
app/
├── layout.tsx                    # RootLayout: fontes, PostHog, metadata global
├── globals.css                   # Design system tokens
├── page.tsx                      # Homepage: edição PT de hoje
├── [date]/page.tsx               # Edição PT por data
├── arquivo/page.tsx              # Arquivo paginado
├── [lang]/page.tsx               # Idioma: edição de hoje
├── [lang]/[date]/page.tsx        # Idioma + data
├── api/revalidate/route.ts       # Webhook ISR (secret token)
└── components/
    ├── Masthead.tsx              # ZEITH CO | INTELIGÊNCIA ARTIFICIAL↕REAL DIÁRIA
    ├── Nav.tsx                   # Categorias + seletor de idioma + data
    ├── ExchangeTicker.tsx        # Câmbio: banda fina acima do masthead
    ├── HeroSection.tsx           # Análise principal + imagem hero full-width
    ├── SectionCard.tsx           # Card de seção: título + imagem + markdown
    ├── GitHubRepos.tsx           # Cards de repositórios GitHub do dia
    ├── ArchiveGrid.tsx           # Grid de edições anteriores
    ├── LangSwitcher.tsx          # PT / EN / ES / ZH
    └── GateModal.tsx             # Gate de cadastro (sem mudança)
```

---

## 6. Design System

### Tokens CSS
```css
:root {
  --bg:             #faf8f4;   /* off-white creme */
  --bg-subtle:      #f3f0e8;
  --border:         #e0dbd2;
  --border-strong:  #1a1a1a;
  --accent:         #1a3a5c;   /* navy */
  --text-primary:   #1a1a1a;
  --text-secondary: #555555;
  --text-tertiary:  #999999;
  --font-serif:     'Playfair Display', Georgia, serif;
  --font-sans:      'Inter', system-ui, sans-serif;
  --font-mono:      'JetBrains Mono', monospace;  /* só câmbio e datas */
}
```

### Tipografia
| Uso | Fonte | Peso | Tamanho |
|---|---|---|---|
| Masthead | Inter | 700 | 0.85rem uppercase |
| Headline principal | Playfair Display | 700 | clamp(1.75rem, 4vw, 2.75rem) |
| Headlines secundárias | Playfair Display | 600 | 1.1–1.4rem |
| Body text | Inter | 400 | 1rem (16px mínimo) |
| Labels de categoria | Inter | 700 | 0.6rem uppercase tracking-wide |
| Câmbio/datas | JetBrains Mono | 400–500 | 0.75–0.875rem |

### Regras visuais
- Zero emojis em toda a interface
- Separadores: linhas `1px solid var(--border)` ou `3px double var(--border-strong)` no masthead
- Categorias identificadas por label uppercase: `INTELIGÊNCIA ARTIFICIAL · NEGÓCIOS LOCAIS · MERCADO`
- Imagens sempre com `aspect-ratio: 16/9` ou `3/2`, nunca cortadas arbitrariamente
- Crédito de imagem sempre exibido (Unsplash/@autor ou fonte original)

---

## 7. Masthead — Animação Slide-Up

```tsx
// Componente Masthead.tsx
// ZEITH CO | INTELIGÊNCIA [ARTIFICIAL↕REAL] DIÁRIA
// A palavra troca a cada 2.5s com slide-up suave

const words = ['ARTIFICIAL', 'REAL']

// CSS:
// .slide-word: overflow hidden, position relative, height 1.1em
// .word: position absolute, transition transform + opacity 0.45s cubic-bezier
// .word.current: translateY(0), opacity 1
// .word.exit: translateY(-110%), opacity 0
// Entrada: translateY(110%) → translateY(0)
```

---

## 8. Seções do Portal (ordem de exibição)

| # | Chave | Título | Diferencial |
|---|---|---|---|
| 01 | `parecer` | Análise Principal | Hero com imagem full-width, markdown longo |
| 02 | `exchange` | Câmbio do Dia | Ticker acima do masthead + tabela na página |
| 03 | `ia_tecnologia` | IA Aplicada — O que Usar Hoje | Foco em ferramentas práticas para PME |
| 04 | `status_ia` | Novos Modelos & Ferramentas | Lançamentos da semana |
| 05 | `negocios_smb` | Negócios Locais & Tecnologia | Casos reais de negócios físicos com IA |
| 06 | `saas_produto` | Produtos & Oportunidades SaaS | Oportunidades para founders |
| 07 | `venture_estrategia` | Startups & Investimentos | Rodadas, aquisições, movimentos de mercado |
| 08 | `investimentos` | Economia & Mercado | Macro economia com impacto em negócios locais |
| 09 | `regulatorio` | Regulação & Impacto | Leis e marcos regulatórios relevantes |
| 10 | `github` | Repositórios em Destaque | Cards estruturados: nome, stars, stars hoje, linguagem |
| 11 | `hacker_news` | Discussões Técnicas | O que os desenvolvedores estão debatendo |
| 12 | `books` | Leitura da Semana | 5 indicações editoriais |

---

## 9. Estratégia de Imagens

### Fluxo de busca
1. **OpenGraph:** ao raspar cada fonte RSS, extrair `og:image` se disponível e dimensões ≥ 1200px
2. **Unsplash fallback:** gerar query com palavras-chave extraídas do título da seção → buscar via API (`/search/photos?query=...&orientation=landscape`)
3. **Filtros de qualidade:** width ≥ 1200px, sem logos, sem screenshots (heurística: ratio e palavras no alt)
4. **Cache:** gravar URL aprovada em `inteligencia_images` com query como chave — evitar rebuscar

### Variáveis de ambiente necessárias
- `UNSPLASH_ACCESS_KEY` — free tier: 50 req/hora (suficiente: ~15 seções × 4 idiomas = 60 req/dia com cache)

---

## 10. Pipeline — GitHub Actions

```yaml
# .github/workflows/daily-digest.yml
name: Daily Digest
on:
  schedule:
    - cron: '0 9 * * *'   # 09:00 UTC = 06:00 BRT
  workflow_dispatch:        # permite rodar manualmente

jobs:
  generate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with: { python-version: '3.12' }
      - run: pip install -r projetos/daily-digest/requirements.txt
      - run: python projetos/daily-digest/digest.py
        env:
          GROQ_API_KEY:              ${{ secrets.GROQ_API_KEY }}
          ANTHROPIC_API_KEY:         ${{ secrets.ANTHROPIC_API_KEY }}
          SUPABASE_URL:              ${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_KEY:      ${{ secrets.SUPABASE_SERVICE_KEY }}
          UNSPLASH_ACCESS_KEY:       ${{ secrets.UNSPLASH_ACCESS_KEY }}
          VERCEL_REVALIDATE_SECRET:  ${{ secrets.VERCEL_REVALIDATE_SECRET }}
          OPEN_ER_API_KEY:           ${{ secrets.OPEN_ER_API_KEY }}
```

**Estimativa de uso:** ~5 min/execução × 30 dias = 150 min/mês (free tier: 2.000 min — 87% de folga)

---

## 11. Multilíngue — Estratégia

- O pipeline gera PT primeiro (conteúdo completo via Groq)
- Em seguida, 3 chamadas paralelas traduzem PT → EN, ES, ZH
- Custo marginal: ~$0.001/edição extra (Groq é gratuito nos limites)
- Rota de idioma: prefixo de URL `/en/`, `/es/`, `/zh/` — URLs limpas e indexáveis
- Seletor de idioma no Nav: `PT · EN · ES · ZH` — texto simples, sem bandeiras

---

## 12. O que NÃO muda

- `inteligencia_cadastros` — gate de cadastro mantido exatamente como está
- Lógica do GateModal — nenhuma alteração
- Supabase project ID — compartilhado, zero custo adicional
- Domínio `inteligencia-zeithco.vercel.app` — mesma URL

---

## 13. Fora de Escopo (v1)

- Busca full-text no arquivo
- Comentários ou interação do leitor
- Newsletter por email (captura de leads é via gate, não email marketing)
- App mobile
- Paywall / conteúdo premium

---

## 14. Dependências Novas

```json
{
  "dependencies": {
    "@supabase/supabase-js": "já instalado",
    "recharts": "^2.x — gráficos de câmbio",
    "framer-motion": "^11.x — animação slide-up masthead"
  }
}
```

```python
# requirements.txt — adições ao digest.py
supabase          # cliente Python para gravar no banco
httpx             # requisições async para Unsplash + OpenGraph
beautifulsoup4    # extração og:image das fontes
```
