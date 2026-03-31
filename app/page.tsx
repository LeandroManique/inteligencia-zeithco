import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import data from "../public/latest.json";
import GateModal from "./components/GateModal";

// ── Types ──────────────────────────────────────────────────────────────────
interface Section {
  title: string;
  emoji: string;
  content: string;
}

interface DigestData {
  date: string;
  date_display: string;
  exchange: {
    USD_BRL: number;
    EUR_BRL: number;
    USD_EUR: number;
    USD_GBP: number;
    date: string;
  };
  parecer: string;
  frase: string;
  sections: Record<string, Section>;
  books: string;
}

const digest = data as DigestData;

// ── Helpers ────────────────────────────────────────────────────────────────
function formatRate(val: number, decimals = 4) {
  return val?.toFixed(decimals) ?? "—";
}

function Md({ children }: { children: string }) {
  return (
    <div className="prose">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{children}</ReactMarkdown>
    </div>
  );
}

// ── Components ─────────────────────────────────────────────────────────────
function Nav() {
  return (
    <nav
      style={{
        borderBottom: "1px solid var(--border)",
        padding: "1.25rem 0",
        marginBottom: "5rem",
      }}
    >
      <div
        style={{
          maxWidth: "820px",
          margin: "0 auto",
          padding: "0 2rem",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
          <span
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
              color: "var(--text-primary)",
              letterSpacing: "-0.02em",
            }}
          >
            Zeith Co
          </span>
          <span
            style={{
              width: "1px",
              height: "1rem",
              background: "var(--border)",
              display: "inline-block",
            }}
          />
          <span
            style={{
              fontSize: "0.75rem",
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.12em",
              fontFamily: "var(--font-mono)",
            }}
          >
            Inteligência
          </span>
        </div>
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.75rem",
            color: "var(--text-tertiary)",
          }}
        >
          {digest.date_display}
        </span>
      </div>
    </nav>
  );
}

function Hero() {
  return (
    <section
      style={{ maxWidth: "820px", margin: "0 auto", padding: "0 2rem 6rem" }}
    >
      <div className="fade-up delay-1">
        <p
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: "0.6875rem",
            color: "var(--accent)",
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: "1.5rem",
          }}
        >
          01 — Parecer Estratégico
        </p>
        <h1
          style={{
            fontFamily: "var(--font-serif)",
            fontSize: "clamp(2.25rem, 5vw, 3.25rem)",
            fontWeight: "normal",
            color: "var(--text-primary)",
            lineHeight: 1.15,
            letterSpacing: "-0.02em",
            marginBottom: "2.5rem",
            maxWidth: "640px",
          }}
        >
          Inteligência{" "}
          <em style={{ color: "var(--accent)", fontStyle: "italic" }}>
            estratégica
          </em>{" "}
          para quem decide.
        </h1>
        <p
          style={{
            fontSize: "0.9375rem",
            color: "var(--text-secondary)",
            lineHeight: 1.75,
            maxWidth: "560px",
            marginBottom: "3rem",
          }}
        >
          Todo dia, nossa IA vasculha centenas de fontes — tecnologia, IA, SaaS,
          investimentos, câmbio e tendências globais — e entrega um briefing
          estratégico para você tomar decisões com mais clareza e menos ruído.
        </p>
      </div>

      <div
        className="fade-up delay-2"
        style={{
          borderLeft: "2px solid var(--accent)",
          paddingLeft: "1.5rem",
          marginBottom: "3rem",
        }}
      >
        <Md>{digest.parecer}</Md>
      </div>

      {digest.frase && digest.frase !== '""' && (
        <div
          className="fade-up delay-3"
          style={{
            background: "var(--accent-dim2)",
            border: "1px solid var(--accent-dim)",
            borderRadius: "4px",
            padding: "1.5rem 2rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.125rem",
              color: "var(--text-primary)",
              lineHeight: 1.6,
              fontStyle: "italic",
            }}
          >
            {digest.frase}
          </p>
        </div>
      )}
    </section>
  );
}

function ExchangeSection() {
  const { exchange } = digest;
  const rates = [
    { label: "USD → BRL", value: `R$ ${formatRate(exchange.USD_BRL, 4)}`, flag: "US" },
    { label: "EUR → BRL", value: `R$ ${formatRate(exchange.EUR_BRL, 4)}`, flag: "EU" },
    { label: "USD → EUR", value: `€ ${formatRate(exchange.USD_EUR, 4)}`, flag: "EU" },
    { label: "USD → GBP", value: `£ ${formatRate(exchange.USD_GBP, 4)}`, flag: "GB" },
  ];

  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "4rem 2rem",
        maxWidth: "820px",
        margin: "0 auto",
      }}
    >
      <SectionLabel number="02" label="Câmbio do Dia" />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "1px",
          background: "var(--border)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          overflow: "hidden",
          marginTop: "2rem",
        }}
      >
        {rates.map((r) => (
          <div
            key={r.label}
            style={{
              background: "var(--bg)",
              padding: "1.5rem",
            }}
          >
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "0.6875rem",
                color: "var(--text-secondary)",
                textTransform: "uppercase",
                letterSpacing: "0.1em",
                marginBottom: "0.5rem",
              }}
            >
              {r.label}
            </p>
            <p
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: "1.375rem",
                color: "var(--text-primary)",
                fontWeight: 500,
                letterSpacing: "-0.02em",
              }}
            >
              {r.value}
            </p>
          </div>
        ))}
      </div>
      <p
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6875rem",
          color: "var(--text-tertiary)",
          marginTop: "0.75rem",
        }}
      >
        Referência: {exchange.date} · open.er-api.com
      </p>
    </section>
  );
}

function SectionLabel({
  number,
  label,
}: {
  number: string;
  label: string;
}) {
  return (
    <p
      style={{
        fontFamily: "var(--font-mono)",
        fontSize: "0.6875rem",
        color: "var(--text-tertiary)",
        textTransform: "uppercase",
        letterSpacing: "0.15em",
        marginBottom: "0.5rem",
      }}
    >
      <span style={{ color: "var(--accent)" }}>{number}</span> — {label}
    </p>
  );
}

function NewsGrid() {
  const priority = [
    "ia_tecnologia",
    "status_ia",
    "saas_produto",
    "venture_estrategia",
    "investimentos",
    "regulatorio",
    "negocios_smb",
  ];

  const sectionNums = ["03", "04", "05", "06", "07", "08", "09"];

  return (
    <>
      {priority.map((key, i) => {
        const sec = digest.sections[key];
        if (!sec) return null;
        return (
          <section
            key={key}
            style={{
              borderTop: "1px solid var(--border)",
              padding: "4rem 2rem",
              maxWidth: "820px",
              margin: "0 auto",
            }}
          >
            <SectionLabel
              number={sectionNums[i]}
              label={`${sec.emoji} ${sec.title}`}
            />
            <div style={{ marginTop: "1.75rem" }}>
              <Md>{sec.content}</Md>
            </div>
          </section>
        );
      })}
    </>
  );
}

function GitHubSection() {
  const sec = digest.sections["github"];
  if (!sec) return null;
  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "4rem 2rem",
        maxWidth: "820px",
        margin: "0 auto",
      }}
    >
      <SectionLabel number="10" label={`${sec.emoji} ${sec.title}`} />
      <div
        style={{
          marginTop: "1.75rem",
          background: "var(--bg-subtle)",
          border: "1px solid var(--border)",
          borderRadius: "4px",
          padding: "1.5rem 2rem",
          fontFamily: "var(--font-mono)",
        }}
      >
        <Md>{sec.content}</Md>
      </div>
    </section>
  );
}

function HackerNewsSection() {
  const sec = digest.sections["hacker_news"];
  if (!sec) return null;
  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "4rem 2rem",
        maxWidth: "820px",
        margin: "0 auto",
      }}
    >
      <SectionLabel number="11" label="🔶 Hacker News" />
      <div style={{ marginTop: "1.75rem" }}>
        <Md>{sec.content}</Md>
      </div>
    </section>
  );
}

function BooksSection() {
  return (
    <section
      style={{
        borderTop: "1px solid var(--border)",
        padding: "4rem 2rem",
        maxWidth: "820px",
        margin: "0 auto",
      }}
    >
      <SectionLabel number="12" label="📚 Leitura da Semana — 5 Indicações" />
      <div style={{ marginTop: "1.75rem" }}>
        <Md>{digest.books}</Md>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer style={{ marginTop: "4rem" }}>

      {/* ── CTA Zeith Co ── */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          padding: "4rem 2rem",
          background: "var(--bg-subtle)",
        }}
      >
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.15em",
              marginBottom: "1.5rem",
            }}
          >
            Quem faz este briefing
          </p>
          <p
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "clamp(1.5rem, 3vw, 2rem)",
              color: "var(--text-primary)",
              marginBottom: "1.25rem",
              letterSpacing: "-0.02em",
              lineHeight: 1.2,
            }}
          >
            Seu negócio precisa de tecnologia e IA.
            <br />
            <em style={{ color: "var(--accent)" }}>A gente constrói.</em>
          </p>
          <p
            style={{
              fontSize: "0.9375rem",
              color: "var(--text-secondary)",
              lineHeight: 1.7,
              maxWidth: "520px",
              margin: "0 auto 2rem",
            }}
          >
            A Zeith Co cria sites, landing pages, automações com IA e sistemas sob medida
            para empresas brasileiras. Do briefing ao ar em dias, não semanas.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
            <a
              href="https://www.zeithco.com/br"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                background: "var(--accent)",
                color: "#0a0a0a",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                fontWeight: 600,
                padding: "0.75rem 1.75rem",
                borderRadius: "3px",
                textDecoration: "none",
              }}
            >
              Conhecer a Zeith Co
            </a>
            <a
              href="https://wa.me/5551982994623?text=Vi%20o%20briefing%20da%20Zeith%20e%20quero%20saber%20mais"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "inline-block",
                border: "1px solid var(--border)",
                color: "var(--text-primary)",
                fontFamily: "var(--font-sans)",
                fontSize: "0.9375rem",
                fontWeight: 500,
                padding: "0.75rem 1.75rem",
                borderRadius: "3px",
                textDecoration: "none",
              }}
            >
              Falar no WhatsApp
            </a>
          </div>
        </div>
      </div>

      {/* ── Serviços grid ── */}
      <div
        style={{
          borderTop: "1px solid var(--border)",
          borderBottom: "1px solid var(--border)",
          padding: "3rem 2rem",
        }}
      >
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
            gap: "2rem",
          }}
        >
          {[
            { name: "Landing Page", price: "R$ 2.000", detail: "Pronta em 48h" },
            { name: "Automação com IA", price: "R$ 3.000", detail: "Chatbots, emails, workflows" },
            { name: "Site Institucional", price: "R$ 5.000", detail: "Multi-páginas, responsivo" },
            { name: "Software sob Medida", price: "R$ 15.000", detail: "Produto digital customizado" },
          ].map((s) => (
            <a
              key={s.name}
              href="https://www.zeithco.com/br"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                textDecoration: "none",
                padding: "1.25rem",
                border: "1px solid var(--border)",
                borderRadius: "4px",
                transition: "border-color 0.2s",
              }}
            >
              <p
                style={{
                  fontFamily: "var(--font-sans)",
                  fontSize: "0.9375rem",
                  color: "var(--text-primary)",
                  fontWeight: 600,
                  marginBottom: "0.25rem",
                }}
              >
                {s.name}
              </p>
              <p
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: "0.8125rem",
                  color: "var(--accent)",
                  marginBottom: "0.25rem",
                }}
              >
                a partir de {s.price}
              </p>
              <p
                style={{
                  fontSize: "0.75rem",
                  color: "var(--text-tertiary)",
                }}
              >
                {s.detail}
              </p>
            </a>
          ))}
        </div>
      </div>

      {/* ── Rodapé mínimo ── */}
      <div style={{ padding: "1.5rem 2rem" }}>
        <div
          style={{
            maxWidth: "820px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "0.5rem",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--text-tertiary)",
            }}
          >
            Zeith Co · Curado pela nossa IA, todo dia
          </p>
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--text-tertiary)",
            }}
          >
            {digest.date_display}
          </p>
        </div>
      </div>

    </footer>
  );
}

// ── Page ───────────────────────────────────────────────────────────────────
export default function HomePage() {
  const content = (
    <main style={{ background: "var(--bg)", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <ExchangeSection />
      <NewsGrid />
      <GitHubSection />
      <HackerNewsSection />
      <BooksSection />
      <Footer />
    </main>
  );

  return <GateModal>{content}</GateModal>;
}
