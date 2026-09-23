const highlights = [
  "Mentoria individual",
  "Videoaulas",
  "Simulados",
  "Minissimulados",
  "Questões comentadas",
  "Resumos bizurados",
  "Mapas mentais",
  "Redações",
  "Presencial em Caruaru",
  "Presencial em casa",
  "Plataforma CPPEM",
  "Cronograma personalizado",
  "Plano de estudos",
  "Plano de Combate",
  "Missões diárias",
  "Desempenho operacional",
  "TAF e psicotécnico",
] as const;

export function AboutTicker() {
  return <div className="about-ticker">
    <h2 className="sr-only">O que você encontra no CPPEM</h2>
    <div className="about-ticker-track">
      {[0, 1].map((copy) => <ul key={copy} aria-hidden={copy === 1 ? true : undefined}>
        {highlights.map((item) => <li key={item}>{item}</li>)}
      </ul>)}
    </div>
  </div>;
}
