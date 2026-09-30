"use client";

import { BrainCircuit, Check, Crosshair, Lightbulb, ShieldCheck } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const PILARES = [
  {
    icone: BrainCircuit,
    tag: "MDT · 01",
    titulo: "Mentalidade",
    resumo: "Construa a base psicológica do operador de elite. Sem mentalidade correta, técnica e disciplina não sustentam.",
    dica: "Pratique visualização positiva diária por 5 minutos ao acordar.",
    itens: [
      "Identidade do operador: “Eu sou aprovado”",
      "Controle da ansiedade e da pressão pré-prova",
      "Técnicas de visualização positiva",
      "Gestão de erros e resiliência",
      "Foco de identidade em vez de foco de resultado",
    ],
  },
  {
    icone: ShieldCheck,
    tag: "MDT · 02",
    titulo: "Disciplina",
    resumo: "A consistência diária supera qualquer talento. Disciplina é o que separa candidatos de aprovados.",
    dica: "Estude todos os dias no mesmo horário para ancorar o hábito no seu cérebro.",
    itens: [
      "Cronograma fixo e inegociável",
      "Ritual de início de sessão de estudo",
      "Eliminação de distrações e ambiente de guerra",
      "Sequência de dias cumpridos, com cobrança",
      "Protocolo de recuperação depois de um dia perdido",
    ],
  },
  {
    icone: Crosshair,
    tag: "MDT · 03",
    titulo: "Técnica",
    resumo: "As ferramentas certas aplicadas do jeito certo. Estudo ativo, revisão espaçada e resolução estratégica de questões.",
    dica: "Ensine o que acabou de aprender para uma parede. Isso força a retenção.",
    itens: [
      "Pomodoro adaptado: 25 minutos de foco e 5 de pausa",
      "Revisão espaçada em 1, 7 e 30 dias",
      "Aprendizado ativo: ensinar o conteúdo em voz alta",
      "Mapa mental obrigatório por assunto",
      "Resolução comentada de questões da banca",
    ],
  },
];

type Feixe = { d: string; comprimento: number };

export function MdtMethod() {
  const area = useRef<HTMLDivElement>(null);
  const nucleo = useRef<HTMLDivElement>(null);
  const cartoes = useRef<Array<HTMLElement | null>>([]);
  const [feixes, setFeixes] = useState<Feixe[]>([]);
  const [empilhado, setEmpilhado] = useState(false);
  const [aberto, setAberto] = useState(0);

  // os feixes saem da posicao real dos elementos: assim valem tanto para as
  // duas colunas do desktop quanto para a pilha do celular
  const medir = useCallback(() => {
    const caixa = area.current?.getBoundingClientRect();
    const origem = nucleo.current?.getBoundingClientRect();
    if (!caixa || !origem) return;

    const empilhado = caixa.width < 760;
    setEmpilhado(empilhado);
    // centro do hub: os feixes saem da borda do circulo, cada um apontado para o
    // seu cartao, senao os tres viram uma linha so
    const cx = origem.left + origem.width / 2 - caixa.left;
    const cy = origem.top + origem.height / 2 - caixa.top;
    const raio = origem.width / 2 + 7;

    setFeixes(cartoes.current.map((cartao) => {
      const destino = cartao?.getBoundingClientRect();
      if (!destino) return { d: "", comprimento: 0 };
      const x2 = (empilhado ? destino.left + destino.width / 2 : destino.left - 6) - caixa.left;
      const y2 = (empilhado ? destino.top - 6 : destino.top + Math.min(destino.height / 2, 44)) - caixa.top;

      const dx = x2 - cx;
      const dy = y2 - cy;
      const distancia = Math.hypot(dx, dy) || 1;
      const x1 = cx + (dx / distancia) * raio;
      const y1 = cy + (dy / distancia) * raio;

      // sai na direcao do cartao e chega nele na horizontal (ou na vertical, no celular)
      const puxada = Math.max(distancia * 0.42, 60);
      const c1x = x1 + (dx / distancia) * puxada;
      const c1y = y1 + (dy / distancia) * puxada * (empilhado ? 1 : 0.35);
      const c2x = empilhado ? x2 : x2 - puxada * 0.75;
      const c2y = empilhado ? y2 - puxada * 0.75 : y2;

      return {
        d: `M ${x1} ${y1} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${x2} ${y2}`,
        comprimento: distancia * 1.25,
      };
    }));
  }, []);

  useEffect(() => {
    medir();
    const observador = new ResizeObserver(medir);
    if (area.current) observador.observe(area.current);
    for (const cartao of cartoes.current) if (cartao) observador.observe(cartao);
    window.addEventListener("resize", medir);
    return () => { observador.disconnect(); window.removeEventListener("resize", medir); };
  }, [medir]);

  return <div className="mdt-beam" ref={area}>
    <svg className="mdt-beam-svg" aria-hidden="true" focusable="false">
      {feixes.map((feixe, indice) => feixe.d && (!empilhado || aberto === indice) && <g key={indice} data-ativo={aberto === indice}>
        <path className="mdt-beam-base" d={feixe.d} />
        {(() => {
          // o pulso e um traco curto correndo pelo caminho: o ciclo precisa ser
          // do tamanho do traco mais o vao, senao ele salta no meio da curva
          const traco = Math.max(feixe.comprimento * 0.18, 26);
          const vao = feixe.comprimento * 1.6;
          return <path className="mdt-beam-pulse" d={feixe.d} style={{
            strokeDasharray: `${traco} ${vao}`,
            animationDelay: `${indice * 0.9}s`,
            ["--corrida" as string]: `${traco + vao}`,
          }} />;
        })()}
      </g>)}
    </svg>

    <div className="about-how-copy mdt-core">
      <span className="about-how-step">03 · O método</span>
      <h3>Método <span className="gold">MDT:</span> mentalidade, disciplina e técnica.</h3>
      <p>O MDT é a forma como o CPPEM ensina. Ele parte de uma constatação simples: quem não passa raramente parou por falta de conteúdo — parou por falta de cabeça, de constância ou de direção. As três frentes são trabalhadas na mesma semana, e não uma depois da outra.</p>
      <p>Cada pilar tem entrega própria dentro da plataforma, e o painel de desempenho mostra qual deles está travando a sua evolução. Toque ou passe o mouse em um pilar para ver como ele é treinado.</p>

    </div>

    <div className="mdt-hub" ref={nucleo}>
      <span className="mdt-hub-ring" aria-hidden="true" />
      <strong>MDT</strong>
      <small>O método</small>
    </div>

    <div className="mdt-pillars">
      {PILARES.map(({ icone: Icone, tag, titulo, resumo, dica, itens }, indice) => {
        const escancarado = aberto === indice;
        return <article className="mdt-card" key={tag} data-open={escancarado}
          ref={(no) => { cartoes.current[indice] = no; }}
          onMouseEnter={() => setAberto(indice)}
          onFocus={() => setAberto(indice)}>
          <button type="button" className="mdt-card-head" aria-expanded={escancarado}
            onClick={() => setAberto(escancarado ? -1 : indice)}>
            <span className="mdt-card-icon"><Icone size={19} /></span>
            <span><small>{tag}</small><h4>{titulo}</h4></span>
          </button>
          <p className="mdt-card-resumo">{resumo}</p>
          <div className="mdt-card-detail" hidden={!escancarado}>
            <p className="mdt-card-dica"><Lightbulb size={14} aria-hidden="true" /><span><strong>Dica prática:</strong> {dica}</span></p>
            <ul>{itens.map((item) => <li key={item}><Check size={13} aria-hidden="true" />{item}</li>)}</ul>
          </div>
        </article>;
      })}
    </div>
  </div>;
}
