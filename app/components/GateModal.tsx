"use client";

import { useState, useEffect, useRef } from "react";
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

export default function GateModal({
  children,
}: {
  children: React.ReactNode;
}) {
  const [status, setStatus] = useState<"loading" | "gate" | "open">("loading");
  const [step, setStep] = useState<1 | 2>(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const [form, setForm] = useState({
    nome: "",
    email: "",
    cargo: "",
    empresa: "",
    segmento: "",
    tamanho: "",
  });

  useEffect(() => {
    const registered = localStorage.getItem(STORAGE_KEY);
    setStatus(registered ? "open" : "gate");
  }, []);

  const set = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nome.trim() || !form.email.trim() || !form.cargo) {
      setError("Preencha nome, email e cargo para continuar.");
      return;
    }
    setError("");
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");

    const { error: err } = await supabase
      .from("inteligencia_cadastros")
      .insert({
        nome: form.nome.trim(),
        email: form.email.trim().toLowerCase(),
        cargo: form.cargo,
        empresa: form.empresa.trim() || null,
        segmento: form.segmento || null,
        tamanho: form.tamanho || null,
      });

    setSending(false);

    if (err) {
      if (err.code === "23505") {
        // email já existe — libera mesmo assim
        localStorage.setItem(STORAGE_KEY, "1");
        setStatus("open");
        return;
      }
      setError("Erro ao salvar. Tente novamente.");
      return;
    }

    localStorage.setItem(STORAGE_KEY, "1");
    setStatus("open");
  };

  if (status === "loading") {
    return (
      <div
        style={{ background: "#0a0a0a", minHeight: "100vh", display: "flex" }}
      />
    );
  }

  if (status === "open") return <>{children}</>;

  return (
    <>
      {/* Overlay com conteúdo desfocado atrás */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 50,
          background: "rgba(10,10,10,0.92)",
          backdropFilter: "blur(12px)",
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
          {/* Header */}
          <div style={{ marginBottom: "2rem" }}>
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
                marginBottom: "0.75rem",
              }}
            >
              {step === 1
                ? "Acesso gratuito para líderes"
                : "Nos conte um pouco mais"}
            </h2>
            <p
              style={{
                fontSize: "0.875rem",
                color: "var(--text-secondary)",
                lineHeight: 1.6,
              }}
            >
              {step === 1
                ? "Inteligência estratégica diária, curada por IA. Sem custo, sem spam."
                : "Opcional — ajuda a personalizar o conteúdo futuro."}
            </p>
          </div>

          {/* Step indicators */}
          <div
            style={{
              display: "flex",
              gap: "0.5rem",
              marginBottom: "1.75rem",
            }}
          >
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

          {/* Step 1 */}
          {step === 1 && (
            <form onSubmit={handleStep1} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Field label="Nome completo *">
                <Input
                  type="text"
                  value={form.nome}
                  onChange={(v) => set("nome", v)}
                  placeholder="Leandro Manique"
                  autoFocus
                />
              </Field>

              <Field label="Email profissional *">
                <Input
                  type="email"
                  value={form.email}
                  onChange={(v) => set("email", v)}
                  placeholder="leandro@empresa.com"
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

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <SubmitBtn>Continuar →</SubmitBtn>
            </form>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "1.25rem" }}>
              <Field label="Empresa">
                <Input
                  type="text"
                  value={form.empresa}
                  onChange={(v) => set("empresa", v)}
                  placeholder="Zeith Co"
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

              {error && <ErrorMsg>{error}</ErrorMsg>}

              <div style={{ display: "flex", gap: "0.75rem" }}>
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  style={{
                    flex: "0 0 auto",
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
                onClick={handleSubmit}
                style={{
                  background: "none",
                  border: "none",
                  color: "var(--text-tertiary)",
                  fontSize: "0.8125rem",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontFamily: "var(--font-sans)",
                  padding: 0,
                }}
              >
                Pular e acessar sem preencher
              </button>
            </form>
          )}
        </div>
      </div>

      {/* Conteúdo desfocado atrás (preview) */}
      <div style={{ filter: "blur(4px)", pointerEvents: "none", userSelect: "none" }}>
        {children}
      </div>
    </>
  );
}

// ── Sub-components ──────────────────────────────────────────────────────────

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
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
  type,
  value,
  onChange,
  placeholder,
  autoFocus,
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
  value,
  onChange,
  options,
  placeholder,
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
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o} style={{ background: "#0f0f0f", color: "#f0eee9" }}>
          {o}
        </option>
      ))}
    </select>
  );
}

function SubmitBtn({
  children,
  disabled,
  style,
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
    <p
      style={{
        fontSize: "0.8125rem",
        color: "#f87171",
        margin: 0,
      }}
    >
      {children}
    </p>
  );
}
