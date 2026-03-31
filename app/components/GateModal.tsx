"use client";

import { useState, useEffect } from "react";
import { supabase } from "../../lib/supabase";

const STORAGE_KEY = "zeith_intel_acesso";

const CARGOS = [
  "CEO / Co-founder",
  "Founder / Empreendedor",
  "Diretor Executivo (C-Level)",
  "VP / Head",
  "Consultor Estratégico",
  "Investidor / VC",
  "Outro",
];

const SEGMENTOS = [
  "Tecnologia / SaaS",
  "Varejo / E-commerce",
  "Saúde / Healthtech",
  "Serviços / Consultoria",
  "Indústria / Manufatura",
  "Finanças / Fintech",
  "Educação / Edtech",
  "Alimentação / Food",
  "Outro",
];

const TAMANHOS = [
  "1–10 pessoas",
  "11–50 pessoas",
  "51–200 pessoas",
  "201–500 pessoas",
  "500+ pessoas",
];

const FAIXAS_ETARIAS = [
  "Até 18 anos",
  "18 a 30 anos",
  "30 a 55 anos",
  "55 anos ou mais",
];

const GENEROS = [
  "Homem",
  "Mulher",
  "Não-binário",
  "Prefiro não informar",
];

export default function GateModal({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<"loading" | "gate" | "returning" | "open">("loading");
  const [step, setStep] = useState<1 | 2>(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [returnEmail, setReturnEmail] = useState("");
  const [count, setCount] = useState<number | null>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cargo: "",
    whatsapp: "",
    empresa: "",
    segmento: "",
    tamanho: "",
    faixa_etaria: "",
    genero: "",
  });

  useEffect(() => {
    setStatus(localStorage.getItem(STORAGE_KEY) ? "open" : "gate");
    supabase
      .from("inteligencia_cadastros")
      .select("*", { count: "exact", head: true })
      .then(({ count: n }) => { if (n) setCount(n); });
  }, []);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim() || !form.cargo) {
      setError("Email e cargo são obrigatórios.");
      return;
    }
    setError("");
    setStep(2);
  };

  const save = async (skip = false) => {
    setSending(true);
    setError("");

    const { error: err } = await supabase.from("inteligencia_cadastros").insert({
      nome: form.nome.trim() || null,
      email: form.email.trim().toLowerCase(),
      cargo: form.cargo,
      whatsapp: form.whatsapp.trim() || null,
      empresa: skip ? null : form.empresa.trim() || null,
      segmento: skip ? null : form.segmento || null,
      tamanho: skip ? null : form.tamanho || null,
      faixa_etaria: skip ? null : form.faixa_etaria || null,
      genero: skip ? null : form.genero || null,
    });

    setSending(false);

    if (err && err.code !== "23505") {
      setError("Erro ao salvar. Tente novamente.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, "1");
    setStatus("open");
  };

  const handleReturn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnEmail.trim()) {
      setError("Digite seu email.");
      return;
    }
    setSending(true);
    setError("");

    const { error: err } = await supabase.from("inteligencia_cadastros").insert({
      email: returnEmail.trim().toLowerCase(),
      cargo: "Retorno",
    });

    setSending(false);

    // 23505 = email já existe (usuário cadastrado) — acesso liberado
    if (!err || err.code === "23505") {
      localStorage.setItem(STORAGE_KEY, "1");
      setStatus("open");
      return;
    }

    setError("Email não encontrado. Faça o cadastro completo.");
    setStatus("gate");
  };

  if (status === "loading") {
    return <div style={{ background: "#0a0a0a", minHeight: "100vh" }} />;
  }

  if (status === "open") return <>{children}</>;

  if (status === "returning") {
    return (
      <>
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 50,
            background: "rgba(10,10,10,0.93)",
            backdropFilter: "blur(14px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "1.5rem",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "460px",
              background: "#0f0f0f",
              border: "1px solid #1e1e1e",
              borderRadius: "6px",
              padding: "2.5rem",
            }}
          >
            <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.6875rem", color: "var(--accent)", textTransform: "uppercase", letterSpacing: "0.2em", marginBottom: "1rem" }}>
              Zeith Co · Inteligência
            </p>
            <h2 style={{ fontFamily: "var(--font-serif)", fontSize: "1.625rem", fontWeight: "normal", color: "var(--text-primary)", lineHeight: 1.2, letterSpacing: "-0.02em", marginBottom: "0.625rem" }}>
              Bem-vindo de volta
            </h2>
            <p style={{ fontSize: "0.875rem", color: "var(--text-secondary)", lineHeight: 1.6, marginBottom: "1.75rem" }}>
              Digite seu email para acessar.
            </p>
            <form onSubmit={handleReturn} style={{ display: "flex", flexDirection: "column", gap: "1.375rem" }}>
              <Field label="Email">
                <Input
                  type="email"
                  value={returnEmail}
                  onChange={(v) => setReturnEmail(v)}
                  placeholder="seu@email.com"
                  autoFocus
                />
              </Field>
              {error && <ErrorMsg>{error}</ErrorMsg>}
              <SubmitBtn disabled={sending}>
                {sending ? "Verificando..." : "Acessar →"}
              </SubmitBtn>
              <button
                type="button"
                onClick={() => { setStatus("gate"); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--text-tertiary)", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "var(--font-sans)", padding: 0, textAlign: "left" }}
              >
                Primeiro acesso? Cadastre-se aqui
              </button>
            </form>
          </div>
        </div>
        <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
          {children}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Overlay */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(10,10,10,0.93)",
          backdropFilter: "blur(14px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "1.5rem",
          overflowY: "auto",
        }}
      >
        <div
          style={{
            width: "100%",
            maxWidth: "460px",
            background: "#0f0f0f",
            border: "1px solid #1e1e1e",
            borderRadius: "6px",
            padding: "2.5rem",
            margin: "auto",
          }}
        >
          {/* Header */}
          <p
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "0.6875rem",
              color: "var(--accent)",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              marginBottom: "1rem",
            }}
          >
            Zeith Co · Inteligência
          </p>

          <h2
            style={{
              fontFamily: "var(--font-serif)",
              fontSize: "1.625rem",
              fontWeight: "normal",
              color: "var(--text-primary)",
              lineHeight: 1.2,
              letterSpacing: "-0.02em",
              marginBottom: "0.625rem",
            }}
          >
            {step === 1 ? "Acesso gratuito para líderes" : "Perfil completo"}
          </h2>

          <p
            style={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "1.75rem",
            }}
          >
            {step === 1
              ? (count && count > 0
                  ? `${count.toLocaleString("pt-BR")} líderes já acessam. Sem custo.`
                  : "Inteligência estratégica diária, curada por IA. Sem custo.")
              : "Opcional — ajuda a calibrar o conteúdo para o seu perfil."}
          </p>

          {/* Progress bar */}
          <div style={{ display: "flex", gap: "0.5rem", marginBottom: "2rem" }}>
            {[1, 2].map((s) => (
              <div
                key={s}
                style={{
                  height: "2px",
                  flex: 1,
                  borderRadius: "2px",
                  background: s <= step ? "var(--accent)" : "#1e1e1e",
                  transition: "background 0.3s",
                }}
              />
            ))}
          </div>

          {/* ── Step 1 ── */}
          {step === 1 && (
            <form
              onSubmit={handleStep1}
              style={{ display: "flex", flexDirection: "column", gap: "1.375rem" }}
            >
              <Field label="Nome (opcional)">
                <Input
                  type="text"
                  value={form.nome}
                  onChange={(v) => set("nome", v)}
                  placeholder="Como prefere ser chamado"
                  autoFocus
                />
              </Field>

              <Field label="Email *">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  placeholder="seu@email.com"
                />
              </Field>

              <Field label="Cargo *">
                <Select
                  value={form.cargo}
                  onChange={(v) => set("cargo", v)}
                  options={CARGOS}
                  placeholder="Selecione seu cargo"
                />
              </Field>

              <Field label="WhatsApp (opcional)">
                <Input
                  type="tel"
                  value={form.whatsapp}
                  onChange={(v) => set("whatsapp", v)}
                  placeholder="+55 51 9 9999-9999"
                />
                <p
                  style={{
                    fontSize: "0.75rem",
                    color: "var(--text-tertiary)",
                    marginTop: "0.375rem",
                    lineHeight: 1.5,
                  }}
                >
                  Para ser avisado de novas ferramentas e iniciativas Zeith Co.
                </p>
              </Field>

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <SubmitBtn>Continuar →</SubmitBtn>

              <button
                type="button"
                onClick={() => { setStatus("returning"); setError(""); }}
                style={{ background: "none", border: "none", color: "var(--text-tertiary)", fontSize: "0.8125rem", cursor: "pointer", fontFamily: "var(--font-sans)", padding: 0, textAlign: "left" }}
              >
                Já me cadastrei → Entrar com email
              </button>

              {/* Disclaimer */}
              <Disclaimer />
            </form>
          )}

          {/* ── Step 2 ── */}
          {step === 2 && (
            <form
              onSubmit={(e) => { e.preventDefault(); save(); }}
              style={{ display: "flex", flexDirection: "column", gap: "1.375rem" }}
            >
              <Field label="Empresa">
                <Input
                  type="text"
                  value={form.empresa}
                  onChange={(v) => set("empresa", v)}
                  placeholder="Nome da empresa"
                  autoFocus
                />
              </Field>

              <Field label="Segmento">
                <Select
                  value={form.segmento}
                  onChange={(v) => set("segmento", v)}
                  options={SEGMENTOS}
                  placeholder="Área de atuação"
                />
              </Field>

              <Field label="Tamanho da empresa">
                <Select
                  value={form.tamanho}
                  onChange={(v) => set("tamanho", v)}
                  options={TAMANHOS}
                  placeholder="Número de colaboradores"
                />
              </Field>

              <Field label="Faixa etária">
                <Select
                  value={form.faixa_etaria}
                  onChange={(v) => set("faixa_etaria", v)}
                  options={FAIXAS_ETARIAS}
                  placeholder="Selecione"
                />
              </Field>

              <Field label="Gênero com que se identifica">
                <Select
                  value={form.genero}
                  onChange={(v) => set("genero", v)}
                  options={GENEROS}
                  placeholder="Selecione"
                />
              </Field>

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    padding: "0.75rem 1.25rem",
                    background: "transparent",
                    border: "1px solid #2a2a2a",
                    borderRadius: "3px",
                    color: "var(--text-secondary)",
                    fontSize: "0.875rem",
                    cursor: "pointer",
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  ←
                </button>
                <SubmitBtn disabled={sending} style={{ flex: 1 }}>
                  {sending ? "Salvando..." : "Acessar agora"}
                </SubmitBtn>
              </div>

              <button
                type="button"
                onClick={() => save(true)}
                disabled={sending}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-tertiary)",
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "var(--font-sans)",
                  padding: 0,
                  textAlign: "left",
                }}
              >
                Pular e acessar sem preencher
              </button>

              <Disclaimer />
            </form>
          )}
        </div>
      </div>

      {/* Conteúdo desfocado atrás */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Disclaimer() {
  return (
    <p
      style={{
        fontSize: "0.75rem",
        color: "var(--text-tertiary)",
        lineHeight: 1.6,
        borderTop: "1px solid #1a1a1a",
        paddingTop: "1rem",
      }}
    >
      🔒 Seus dados são utilizados exclusivamente para entendermos o perfil do
      nosso público e calibrar o conteúdo. Não compartilhamos com terceiros,
      não usamos para publicidade e não enviamos spam.
    </p>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      <label
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "0.6875rem",
          color: "var(--text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.12em",
        }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

function Input({
  type, value, onChange, placeholder, autoFocus,
}: {
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  autoFocus?: boolean;
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      autoFocus={autoFocus}
      style={{
        background: "transparent",
        border: "none",
        borderBottom: "1px solid #2a2a2a",
        padding: "0.625rem 0",
        color: "var(--text-primary)",
        fontSize: "0.9375rem",
        fontFamily: "var(--font-sans)",
        outline: "none",
        width: "100%",
        transition: "border-color 0.2s",
      }}
      onFocus={(e) => (e.target.style.borderBottomColor = "var(--accent)")}
      onBlur={(e) => (e.target.style.borderBottomColor = "#2a2a2a")}
    />
  );
}

function Select({
  value, onChange, options, placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={{
        background: "#0f0f0f",
        border: "none",
        borderBottom: "1px solid #2a2a2a",
        padding: "0.625rem 0",
        color: value ? "var(--text-primary)" : "var(--text-tertiary)",
        fontSize: "0.9375rem",
        fontFamily: "var(--font-sans)",
        outline: "none",
        width: "100%",
        cursor: "pointer",
        appearance: "none",
      }}
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#0f0f0f", color: "#f0eee9" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

function SubmitBtn({
  children, disabled, style,
}: {
  children: React.ReactNode;
  disabled?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <button
      type="submit"
      disabled={disabled}
      style={{
        background: disabled ? "#2a2a2a" : "var(--accent)",
        color: disabled ? "var(--text-tertiary)" : "#0a0a0a",
        border: "none",
        borderRadius: "3px",
        padding: "0.875rem 1.5rem",
        fontSize: "0.9375rem",
        fontWeight: 600,
        fontFamily: "var(--font-sans)",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "opacity 0.2s",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

function ErrorMsg({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: "0.8125rem", color: "#f87171", margin: 0 }}>
      {children}
    </p>
  );
}
