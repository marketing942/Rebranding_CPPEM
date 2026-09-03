/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ArrowRight,
  Award,
  Banknote,
  BookOpenCheck,
  BriefcaseBusiness,
  CalendarDays,
  ChevronDown,
  Dumbbell,
  FilePenLine,
  GraduationCap,
  Landmark,
  ReceiptText,
  SearchX,
  X,
} from "lucide-react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { courseCategories } from "@/lib/course-categories";
import type { CourseAnswer, CourseProduct } from "@/types/content";

type CardOrigin = { left: number; top: number; width: number; height: number };

function AnswerBadge({ value }: { value: CourseAnswer }) {
  return <span className="course-answer" data-answer={value}>{value}</span>;
}

export function CourseCatalog({ products, activeSlug }: { products: CourseProduct[]; activeSlug?: string }) {
  const [selected, setSelected] = useState<CourseProduct | null>(null);
  const [origin, setOrigin] = useState<CardOrigin | null>(null);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const previewRef = useRef<HTMLElement>(null);
  const panelRef = useRef<HTMLElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useLayoutEffect(() => {
    const preview = previewRef.current;
    if (!selected || !origin || !preview || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const destination = preview.getBoundingClientRect();
    const animation = preview.animate([
      {
        transform: `translate(${origin.left - destination.left}px, ${origin.top - destination.top}px) scale(${origin.width / destination.width}, ${origin.height / destination.height})`,
        transformOrigin: "top left",
        opacity: 0.82,
      },
      { transform: "translate(0, 0) scale(1)", transformOrigin: "top left", opacity: 1 },
    ], { duration: 560, easing: "cubic-bezier(.22,1,.36,1)", fill: "both" });
    return () => animation.cancel();
  }, [origin, selected]);

  useEffect(() => {
    if (!selected) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusFrame = requestAnimationFrame(() => closeButtonRef.current?.focus());
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") setSelected(null); };
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      cancelAnimationFrame(focusFrame);
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [selected]);

  useEffect(() => {
    const panel = panelRef.current;
    if (!selected || !panel) return;
    const updateScrollHint = () => {
      const hasContentBelow = panel.scrollHeight - panel.scrollTop - panel.clientHeight > 32;
      setShowScrollHint(hasContentBelow);
    };
    const initialFrame = requestAnimationFrame(updateScrollHint);
    const resizeObserver = new ResizeObserver(updateScrollHint);
    resizeObserver.observe(panel);
    panel.addEventListener("scroll", updateScrollHint, { passive: true });
    return () => {
      cancelAnimationFrame(initialFrame);
      resizeObserver.disconnect();
      panel.removeEventListener("scroll", updateScrollHint);
    };
  }, [selected]);

  const openCourse = (course: CourseProduct, element: HTMLElement) => {
    const rect = element.getBoundingClientRect();
    setOrigin({ left: rect.left, top: rect.top, width: rect.width, height: rect.height });
    setSelected(course);
  };

  const scrollPanel = () => {
    const panel = panelRef.current;
    if (!panel) return;
    panel.scrollBy({
      top: panel.clientHeight * 0.62,
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  };

  const details = selected ? [
    { label: "Nº de vagas", value: selected.openings, Icon: BriefcaseBusiness },
    { label: "Salário", value: selected.salary, Icon: Banknote },
    { label: "Data de inscrição", value: selected.registrationDate, Icon: CalendarDays },
    { label: "Taxa de inscrição", value: selected.registrationFee, Icon: ReceiptText },
    { label: "Escolaridade", value: selected.education, Icon: GraduationCap },
    { label: "Data da prova", value: selected.examDate, Icon: CalendarDays },
    { label: "TAF", value: selected.taf, Icon: Dumbbell, answer: true },
    { label: "Redação discursiva", value: selected.discursiveEssay, Icon: FilePenLine, answer: true },
    { label: "Banca", value: selected.examBoard, Icon: Landmark },
    { label: "Prova de títulos", value: selected.titleExam, Icon: Award, answer: true },
  ] : [];

  return <>
    <nav className="course-category-nav" aria-label="Filtrar cursos por carreira">
      <Link href="/cursos" data-active={!activeSlug}>Todos</Link>
      {courseCategories.map((category) => <Link href={`/cursos/${category.slug}`} data-active={activeSlug === category.slug} key={category.slug}>{category.shortLabel}<span>{category.label}</span></Link>)}
    </nav>

    {products.length ? <div className="course-catalog-grid" data-dimmed={Boolean(selected)}>
      {products.map((product) => <button className="course-select-card" type="button" onClick={(event) => openCourse(product, event.currentTarget)} key={product.id}>
        <span className="course-select-media"><img src={product.imageUrl} alt="" /></span>
        <span className="course-select-body">
          <small>{product.acronym || product.career}</small>
          <strong>{product.name}</strong>
          {product.modality && <span>{product.modality}</span>}
          {product.description && <p>{product.description}</p>}
          {product.price && <b>{product.price}{product.oldPrice && <del>{product.oldPrice}</del>}</b>}
          <span className="gold-button">Ver detalhes <ArrowRight size={15} /></span>
        </span>
      </button>)}
    </div> : <div className="course-empty-state">
      <SearchX size={34} aria-hidden="true" /><h2>Novas preparações em organização.</h2>
      <p>Ainda não há um curso ativo nesta carreira. Assim que uma preparação for publicada no Notion, ela aparecerá aqui automaticamente.</p>
      <Link className="ghost-button" href="/cursos">Ver todas as preparações</Link>
    </div>}

    {selected && <div className="course-detail-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelected(null); }}>
      <div className="course-detail-dialog" role="dialog" aria-modal="true" aria-labelledby="course-detail-title">
        <article className="course-detail-preview" ref={previewRef}>
          <div className="course-detail-preview-image"><img src={selected.imageUrl} alt="" /></div>
          <div className="course-detail-preview-copy">
            <small>{selected.acronym || selected.career}</small>
            <h2>{selected.name}</h2>
            <span>{selected.modality}</span>
            {selected.price && <strong>{selected.price}{selected.oldPrice && <del>{selected.oldPrice}</del>}</strong>}
            <Link className="gold-button" href={selected.href}>Conhecer preparação <ArrowRight size={16} /></Link>
          </div>
        </article>

        <div className="course-detail-panel-shell">
        <section className="course-detail-panel" ref={panelRef}>
          <button ref={closeButtonRef} className="course-detail-close" type="button" aria-label="Fechar detalhes" onClick={() => setSelected(null)}><X size={20} /></button>
          <div className="course-detail-heading">
            <span className="eyebrow">Panorama do concurso</span>
            <h2 id="course-detail-title">{selected.acronym || selected.name}</h2>
            <span className="course-contest-status">{selected.contestStatus}</span>
          </div>

          <div className="course-detail-facts">{details.map(({ label, value, Icon, answer: isAnswer }) => <div className="course-detail-fact" key={label}>
            <span><Icon size={17} />{label}</span>
            {isAnswer ? <AnswerBadge value={value as CourseAnswer} /> : <strong>{value}</strong>}
          </div>)}</div>

          {(selected.contestDescription || selected.description) && <div className="course-detail-description"><BookOpenCheck size={20} /><div><h3>Sobre esta preparação</h3><p>{selected.contestDescription || selected.description}</p></div></div>}

          <div className="course-related-section">
            <div><span className="eyebrow">Materiais complementares</span><h3>Preparações para este concurso</h3></div>
            {selected.relatedProducts.length ? <div className="course-related-grid">{selected.relatedProducts.map((product) => <Link href={product.href} className="course-related-card" key={product.id}>
              <img src={product.imageUrl} alt="" /><span><small>{product.category}</small><strong>{product.name}</strong>{product.price && <b>{product.price}</b>}</span><ArrowRight size={17} />
            </Link>)}</div> : <p className="course-related-empty">Nenhum material complementar vinculado no momento.</p>}
          </div>
        </section>
        {showScrollHint && <button className="course-scroll-hint" type="button" onClick={scrollPanel} aria-label="Rolar para ver mais informações">
          <span>Ver mais</span><ChevronDown size={20} />
        </button>}
        </div>
      </div>
    </div>}
  </>;
}
