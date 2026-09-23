# Banco de questões

Questões objetivas de concursos anteriores, extraídas diretamente dos cadernos de prova e
dos gabaritos oficiais definitivos publicados pelas bancas. Um arquivo por órgão e banca,
conforme o nome que a própria banca usava no caderno.

| Arquivo | Órgão | Banca | Provas | Questões |
| --- | --- | --- | --- | --- |
| `prf-cebraspe.json` | PRF | CEBRASPE | 2021 (geral, inglês e espanhol) e 2019 | 232 |
| `prf-cespe.json` | PRF | CESPE/UnB | 2013 | 108 |
| `prf-com-figura.json` | PRF | ambas | itens que dependem de figura | 28 |
| `pcpe-cebraspe.json` | PC-PE | CEBRASPE | 2024 e 2016 | 334 |
| `pcpe-com-figura.json` | PC-PE | CEBRASPE | itens que dependem de figura | 6 |
| `pf-cebraspe.json` | PF | CEBRASPE | 2025, 2021, 2018 e 2014 | 1.482 |
| `pf-cespe.json` | PF | CESPE/UnB | 2013, 2012 e 2009 | 667 |
| `pf-com-figura.json` | PF | ambas | itens que dependem de figura | 131 |

A PRF e a PF são de certo/errado (`question_type: "true_false"`); a PC-PE, de múltipla
escolha (`"multiple_choice"`). As seções abaixo detalham cada órgão.

## PRF

> CESPE/UnB e CEBRASPE são a mesma instituição: o CESPE era o centro de seleção da UnB e,
> a partir de 2013, passou a operar como Cebraspe. A separação aqui é pelo nome que consta
> no caderno de prova — registrado em `exam_board_label`.

Os arquivos por banca contêm **apenas questões que se sustentam só no texto**. Os 28 itens
que precisam de gráfico, mapa ou desenho ficam em `prf-com-figura.json`, com as imagens
recortadas dos PDFs oficiais em `public/questoes/figuras/` e referenciadas no campo
`figures`.

### Provas incluídas

| `exam_slug` | Ano | Aplicação | Caderno | Itens | Estrutura |
| --- | --- | --- | --- | --- | --- |
| `prf-2021` | 2021 | 09/05/2021 | `578_PRF_001_01` | 9 a 120 | Bloco I (55), II (30), III (35) |
| `prf-2021-ingles` | 2021 | 09/05/2021 | `578_PRF_ING_01` | 1 a 8 | Bloco I — Língua Estrangeira |
| `prf-2021-espanhol` | 2021 | 09/05/2021 | `578_PRF_ESP_02` | 1 a 8 | Bloco I — Língua Estrangeira |
| `prf-2019` | 2019 | 03/02/2019 | `440_PRF_001_00` | 1 a 120 | Bloco I (50), II (40), III (30) |
| `prf-2013` | 2013 | 11/08/2013 | `DPRF13_001_01` | 1 a 120 | Básicos (50), Específicos (70) |

Em 2021 o candidato escolhia inglês **ou** espanhol; por isso os itens 1 a 8 aparecem em
duas versões, em cadernos separados. Todas as provas são de itens **certo/errado**
(`question_type: "true_false"`) — o formato usado pela banca em todo o período.

A prova de 2013 **não** tinha Legislação de Trânsito na prova objetiva; a disciplina passa
a figurar como bloco próprio a partir de 2019.

### Campos

| Campo | Conteúdo |
| --- | --- |
| `id` | `<exam_slug>-<número com 3 dígitos>` |
| `exam_board` / `exam_board_label` | Banca normalizada / como aparece no caderno |
| `year`, `applied_at`, `booklet` | Ano, data de aplicação e código do caderno |
| `block`, `subject`, `number` | Bloco do caderno, disciplina e número do item |
| `support_text` | Texto de apoio do bloco de itens, corrido (pode ser `null`) |
| `support_lines` | O mesmo texto linha a linha, com a numeração do caderno |
| `instruction` | Comando ao qual o item está vinculado |
| `statement` | Enunciado do item |
| `answer` | `C`, `E` ou `null` quando anulado |
| `annulled` | Item anulado no gabarito definitivo |
| `needs_figure` / `figures` | Item depende de figura / caminhos dos PNGs |
| `options` | Alternativas `A`–`E` (só múltipla escolha; `null` em certo/errado) |
| `explanations` | Justificativa oficial da banca por alternativa (só PC-PE 2024) |
| `topic` | Item do edital cobrado, segundo a banca (só PC-PE 2024) |
| `needs_review` | Extração possivelmente degradada — revisar antes de publicar |
| `source_exam_url` / `source_answer_url` | PDFs oficiais da prova e do gabarito |

### Itens com figura

Cada PNG é **só a figura**: o desenho, a foto ou a tela, com os rótulos e legendas dela
("vista frontal", "Figura 1A9-I", eixos do gráfico, crédito do mapa), sem o texto corrido
da prova nem o número da questão. É feito para ser exibido junto do enunciado, que continua
em texto. Resolução de 300 dpi.

Muitas figuras destes cadernos são desenhos vetoriais, não imagens embutidas, então não dá
para extraí-las com `pdfimages`. O recorte é feito pela caixa real dos objetos gráficos da
página, ampliada para abranger os rótulos que ficam dentro dela ou colados nela. Figura que
ocupa as duas colunas (a tela do navegador de 2013) é recortada inteira.

Uma mesma figura costuma servir a vários itens, então `figures` é uma lista e o mesmo PNG
aparece em mais de um item. São 18 imagens para 28 itens, em `public/questoes/figuras/`:

| Prova | Itens | Figuras |
| --- | --- | --- |
| `prf-2021` | 43, 44 | bloco e mola (mecânica) |
| `prf-2019` | 24-26, 35-37, 45, 46, 82-87 | vistas de sólido, tiro ao alvo, mapa rodoviário, amarração de cargas |
| `prf-2013` | 18-23, 46-50, 117 | gráfico de acidentes, telas do BrOffice/Google, bloco e bala |

### Numeração de linha do texto de apoio

Muitos itens de Língua Portuguesa citam uma linha do texto (`(ℓ.27)`, `(R.8)`). O caderno
imprime o número na margem, de três em três linhas; `support_lines` reconstrói a numeração
linha a linha, incluindo as que o caderno não marca:

```json
"support_lines": [
  { "n": 1, "text": "A vida humana só viceja sob algum tipo de luz, de" },
  { "n": 2, "text": "preferência a do sol, tão óbvia quanto essencial. Somos" }
]
```

São 35 questões com texto numerado, e todas as 20 que citam linha resolvem a referência.
Linhas de crédito da fonte entram com `"n": null`.

### Procedência e limitações

Os enunciados e gabaritos vêm dos PDFs oficiais (links em `source_exam_url` e
`source_answer_url`), extraídos pelas coordenadas das palavras no PDF — o que preserva a
separação entre texto de apoio, comando e enunciado. Os gabaritos conferem item a item com
o gabarito definitivo: as 368 questões têm resposta ou estão marcadas como anuladas.

Índices e expoentes são reconstruídos pelo corpo e pela baseline de cada palavra, então
`t₁`, `(3π)²` e `qₙ` saem com a notação correta em vez de `t 1`, `(3π) 2` e `q n`.

Três trechos foram transcritos à mão, lendo a página renderizada, porque o PDF não os
entrega como texto:

- **2013, itens 118 e 119:** a fração de dois andares do comando,
  `x(t) = 6,0cos[3πt + π/3]`.
- **2013, item 47:** os ícones de tecla, transcritos como "tecla Ctrl e teclar B".
- **2013, item 48:** a tecla Enter e dois ícones de botão do BrOffice Calc, transcritos
  como "botão Copiar" e "botão Colar". Aqui há interpretação do ícone; a captura de tela da
  planilha continua anexada em `figures`.

Nenhum item fica com `needs_review`.

A divisão em blocos vem do próprio caderno. A disciplina de cada faixa de itens foi
determinada pelo comando que encabeça o bloco; para 2021 ela confere com a distribuição do
edital (Bloco I com 55 itens, II com 30, III com 35).

## PC-PE

| `exam_slug` | Cargo | Aplicação | Cadernos | Questões |
| --- | --- | --- | --- | --- |
| `pcpe-2024-agente` | Agente de Polícia | 25/02/2024 | `MATRIZ_954PC_PECB1_00` (1–20) + `MATRIZ_954PC_PE001_00` (21–60) | 60 |
| `pcpe-2024-escrivao` | Escrivão de Polícia | 25/02/2024 | `MATRIZ_954PC_PECB2_00` (1–20) + `MATRIZ_954PC_PE002_00` (21–60) | 60 |
| `pcpe-2016-agente` | Agente de Polícia | 12/06/2016 | `258_SDS_PE_CG1_01` (1–20) + `258_SDS_PE_001_01` (21–60) | 60 |
| `pcpe-2016-escrivao` | Escrivão de Polícia | 12/06/2016 | `258_SDS_PE_CG1_01` (1–20) + `258_SDS_PE_002_01` (21–60) | 60 |
| `pcpe-2016-delegado` | Delegado de Polícia | 19/06/2016 | `257_SDS_PE_001_01` | 100 |

- **Banca.** Os dois cadernos trazem "CEBRASPE" (2024) e "CESPE | CEBRASPE" (2016); pelo
  mesmo critério da PRF 2019, os dois ficam no arquivo `cebraspe`.
- **Conhecimentos Gerais de 2016.** O caderno `258_SDS_PE_CG1_01` é o mesmo para Agente e
  Escrivão. Ele entra nas duas provas, para cada uma ficar completa de 1 a 60; são 20
  questões repetidas com `id` diferente (340 registros, 320 questões distintas).
- **Delegado 2024 não está incluído.** No CDN do concurso (`pc_pe_23`) só encontrei a
  prova discursiva de Delegado; o caderno objetivo não apareceu sob nenhum dos nomes de
  arquivo testados.
- **Gabarito.** Vem do gabarito oficial definitivo, lido letra a letra pela posição na
  tabela e conferido visualmente contra a imagem de cada tabela. São 21 questões anuladas.

### Justificativas e tópico (2024)

Os cadernos MATRIZ de 2024 trazem, para cada alternativa, a justificativa da banca e o item
do edital cobrado. `explanations` guarda a justificativa; `topic`, o item do edital.

O MATRIZ é do gabarito **preliminar**. Em 3 questões a banca mudou a resposta no recurso
(agente 8, 48 e 49): ali a justificativa defenderia a alternativa errada, então
`explanations` fica vazio. O mesmo vale para a escrivão 42, em que o MATRIZ marca duas
alternativas como corretas, e para as anuladas.

### Disciplina

- **2024:** vem do item do edital que a própria banca cita na justificativa, casado com a
  seção do edital em que ele aparece. Onde a justificativa não traz o item (anuladas ou
  formato irregular), a disciplina sai da vizinhança — as disciplinas vêm em blocos contíguos
  na ordem do edital.
- **2016:** não há justificativa. As disciplinas vêm em blocos contíguos na ordem do edital;
  as fronteiras foram marcadas lendo as questões de transição.

Um classificador automático pelo conteúdo do edital acertou só 85% em 2024 (confunde
Raciocínio Lógico com Informática) e por isso **não** foi usado para rotular.

### Questões com figura

6 questões de 2024, com 5 imagens recortadas como na PRF (só a figura, 300 dpi):

| Questão | Figura |
| --- | --- |
| `pcpe-2024-agente-037` | as duas planilhas do Excel |
| `pcpe-2024-agente-054` | tabela de uma linha com a amostra |
| `pcpe-2024-agente-055` | gráfico de linha da taxa de 2004 a 2021 |
| `pcpe-2024-agente-059` | tabela dos estratos |
| `pcpe-2024-escrivao-048` e `-049` | tabela do texto 2A4-II (imagem compartilhada) |

O texto que está dentro da figura (células de tabela, legendas, crédito do gráfico) sai do
enunciado e do texto de apoio, porque já aparece na imagem e extraído como texto sai
embaralhado.

### Fórmulas transcritas

Em 5 questões de 2024 o problema não é figura: as fórmulas foram compostas numa fonte de
equação sem mapeamento de caractere, e o texto extraído sai como `(cid:17)`. Elas foram
transcritas lendo a página renderizada e ficam no arquivo principal, sem imagem:

- Agente 56 e 57: probabilidade, com `P(E₁ ∩ E₂|E₁)`, `A ∩ B ∩ C ∩ D`;
- Escrivão 39: alternativas em fração (`1/13⁴`, `1/52`, …);
- Escrivão 42: `T(t) = T_A + (T_I − T_A) · (4/5)^(kt)`;
- Escrivão 43: `x₁, x₂, x₃ e x₄`.

Também transcritos: os ícones de tecla da alternativa C da Agente 37 ("Ctrl + Alt + T") e
a variável `X` da Agente 54. Nenhum item fica com `needs_review`.

### Conferência

Cada enunciado e cada alternativa foram buscados, trecho a trecho, no texto que o
`pdftotext` (extrator independente) tira do mesmo PDF. Todos batem, exceto justamente as
questões com fórmula, tabela ou tela, tratadas acima.

## PF

19 provas objetivas das carreiras policiais da Polícia Federal, de 2009 a 2025, com 120
itens cada — **2.280 questões**, todas de certo/errado. Os cadernos e os gabaritos
definitivos vêm da própria PF, em
[Provas e gabaritos de concursos anteriores](https://www.gov.br/pf/pt-br/acesso-a-informacao/servidores/concursos/provas-e-gabaritos-de-concursos-anteriores).

| `exam_slug` | Cargo | Aplicação | Caderno | Anulados | Com figura |
| --- | --- | --- | --- | --- | --- |
| `pf-2025-agente` | Agente | 27/07/2025 | Básicos Bloco I + Bloco II + Específicos cargo 16 | 10 | 7 |
| `pf-2025-escrivao` | Escrivão | 27/07/2025 | Básicos Bloco I + Bloco II + Específicos cargo 15 | 8 | 3 |
| `pf-2025-papiloscopista` | Papiloscopista | 27/07/2025 | Básicos Bloco I + Bloco II + Específicos cargo 17 | 8 | 4 |
| `pf-2025-delegado` | Delegado | 27/07/2025 | Específicos cargo 1 | 6 | 0 |
| `pf-2021-agente` | Agente | 23/05/2021 | Prova do cargo 2 | 5 | 11 |
| `pf-2021-escrivao` | Escrivão | 23/05/2021 | Prova do cargo 3 | 5 | 6 |
| `pf-2021-papiloscopista` | Papiloscopista | 23/05/2021 | Prova do cargo 4 | 4 | 8 |
| `pf-2021-delegado` | Delegado | 23/05/2021 | Prova do cargo 1 | 4 | 0 |
| `pf-2018-agente` | Agente | 16/09/2018 | `Matriz_408_DGPPF012` | 6 | 9 |
| `pf-2018-escrivao` | Escrivão | 16/09/2018 | `Matriz_408_DGPPF013` | 2 | 7 |
| `pf-2018-papiloscopista` | Papiloscopista | 16/09/2018 | `Matriz_408_DGPPF014` | 0 | 16 |
| `pf-2018-delegado` | Delegado | 16/09/2018 | Conhecimentos específicos | 4 | 1 |
| `pf-2014-agente` | Agente | 21/12/2014 | Prova de APF | 7 | 6 |
| `pf-2013-escrivao` | Escrivão | 21/07/2013 | `DPF13ESC_001_01` | 11 | 5 |
| `pf-2013-delegado` | Delegado | 21/07/2013 | Caderno de questões | 13 | 0 |
| `pf-2012-agente` | Agente | 06/05/2012 | Prova de APF | 8 | 7 |
| `pf-2012-papiloscopista` | Papiloscopista | 06/05/2012 | `DPF12_PAP_002_01` | 6 | 15 |
| `pf-2009-agente` | Agente | 13/09/2009 | Caderno de prova | 9 | 11 |
| `pf-2009-escrivao` | Escrivão | 13/09/2009 | `DPF09ESCRIVAO_001_1` | 11 | 15 |

São 127 itens anulados no gabarito definitivo, com `annulled: true` e `answer: null`.

### Cadernos compartilhados e itens repetidos

Em 2025 os Conhecimentos Básicos (itens 1 a 96) saíram em **dois cadernos comuns** a
Agente, Escrivão e Papiloscopista; em 2021 cada cargo tem caderno próprio, mas os itens 1
a 96 são os mesmos nos três. Cada prova entra completa, de 1 a 120, então esses itens
aparecem uma vez por cargo, com `id` diferente. Quem quiser só as questões distintas pode
deduplicar por `statement`.

### Escrivão e Delegado "de 2012"

No site da PF os cadernos de Escrivão e de Delegado estão na pasta de 2012, mas são do
concurso **aplicado em 21/07/2013** — por isso o `exam_slug` é `pf-2013-*`. Os de Agente e
Papiloscopista, na mesma pasta, são de fato de 06/05/2012.

### Provas que ficaram de fora

Perito Criminal Federal e as provas de 2004 não foram incluídas. Ambas estão publicadas no
mesmo endereço e podem ser acrescentadas depois, com o mesmo processo.

### Gabaritos

Sempre o **definitivo**. A tabela do PDF é lida pela posição de cada letra, casando a
coluna do número do item com a da resposta — a leitura em modo texto perde as linhas com
menos de cinco itens e embaralha letras coladas. Cada tabela foi conferida também na
imagem renderizada. As 2.280 questões têm resposta ou estão marcadas como anuladas.

### Disciplina

Vem do comando que encabeça cada bloco de itens ("A respeito de licitações..., julgue os
itens"). Onde o comando é genérico ("Considerando essa situação hipotética..."), a
disciplina foi decidida lendo o texto de apoio e o primeiro item do bloco. As faixas cobrem
1 a 120 sem buraco e trocam de disciplina sempre no começo de um bloco — a única exceção é
2018, em que o item 35 abre Processual Penal dentro do bloco de Penal, como no caderno.

### Itens com figura

131 itens, 69 imagens, no mesmo formato da PRF e da PC-PE: só o desenho, com os rótulos e
legendas dele, a 300 dpi, em `public/questoes/figuras/` como `pf-<prova>-fig-NN.png`. Uma
mesma figura costuma servir a vários itens do bloco, então `figures` é uma lista.

O recorte sai da caixa real dos objetos gráficos da página, e não de `pdfimages`: boa parte
destas figuras são desenhos vetoriais (circuitos, moléculas, gráficos), que não existem
como imagem embutida. Três casos destes cadernos exigiram tratamento próprio:

- **Figura que atravessa as duas colunas** (a tabela de propriedades do iodo e o esquema de
  reação de 2012) sai inteira, uma vez só. A régua entre colunas tem uns 6 pt, então a
  página só é tratada como faixa única quando algum traço realmente cruza o corte.
- **Legenda em coluna ao lado do desenho** (o gráfico de pizza de 2021) entra na imagem;
  sem isso sairia o gráfico com os quadradinhos da legenda e sem os textos — e os itens 77
  e 78 dependem dela.
- **Mobiliário da página** — a régua que separa blocos, a tarja "PROVA OBJETIVA — BLOCO I"
  e a marca d'água do caderno — nunca entra. A régua de 2025 tem 3 pt de altura e chegava a
  grudar no traço da raiz quadrada do item vizinho (`S/√V`), transformando o item inteiro em
  figura.

### Trechos transcritos à mão

Em 29 itens a fórmula foi composta numa fonte de equação sem mapeamento de caractere e o
PDF entrega `(cid:3404)` no lugar do símbolo; em outros, o ícone de tecla é um desenho. Os
trechos abaixo foram lidos na página renderizada e transcritos; ficam no arquivo principal,
como texto, sem imagem:

| Prova | Itens | O que foi transcrito |
| --- | --- | --- |
| 2021, os três cargos | 37 a 48 (Estatística) | `f(x) = γ(x − 12)²`, `f(x, y) = x + y`, `P(X ≤ x) = 1 − (β/x)²`, `Ŷ = 5 − 0,1 × T` e os enunciados com fórmula |
| 2021, Papiloscopista | 119 (Química) | `K = ([Fe³⁺]ʸ [H₂O]ᶻ) / ([Fe₂O₃][H⁺]ˣ)` |
| 2025, Bloco I | 45 a 52 (Estatística) | `S = X₁ + X₂ + X₃ + X₄`, `S/√V`, `VL = 0,5 + 1,1 × VP` |
| 2025, Papiloscopista | 105 a 110 (Física) | `I = V/k`, `E(x) = −A · x`, `2π√(m/(q·A))`, `V²/(9·R)`, `θ₂ = θ₁/2` |
| 2012, Agente | 29 | ícone da tecla Enter |
| 2009, Agente e Escrivão | 46/40, 47/41 | ícones das teclas Ctrl, C e Enter |
| 2009, Agente e Escrivão | 68/70 | `10⁻⁵` (fração de dois andares) |

Nenhum item fica com `needs_review`: não sobrou nenhum `(cid:` nos textos.

### Conferência

Além do gabarito, cada prova passou por: contagem e sequência de 1 a 120; detector de
enunciado truncado (item que não termina em pontuação final); comparação do texto com o que
o `pdftotext` (extrator independente) tira do mesmo PDF; e conferência visual de todas as
69 figuras em folhas de contato.

Os índices e expoentes são reconstruídos pelo corpo e pela baseline de cada palavra
(`n₁`, `10⁻⁵`, `H₀`). Variáveis compostas na fonte de equação viram a letra comum, para o
mesmo símbolo não aparecer de duas formas no banco.

## Carga no Supabase

```bash
# schema
supabase migration up   # 0002_question_bank.sql

# dados
node scripts/seed-exam-questions.mjs
```

O seed faz `upsert` por `id`, então pode ser rodado de novo depois de corrigir um arquivo.
As questões entram com `published = false`: a RLS só as expõe publicamente depois que um
editor publicar.
