/* eslint-disable @next/next/no-img-element */
"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, ChevronDown, ChevronLeft, ChevronRight, FileText, GraduationCap, MapPin, Menu, ShieldCheck, ShoppingBag, Sparkles, Target, University, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { courseCategories } from "@/lib/course-categories";
import type { Product } from "@/types/content";
import type { FreeMaterial } from "@/types/free-content";
import type { EcosystemItem } from "@/types/ecosystem";

const primaryAfterCourses = [
  ["Concursos", "/concursos"], ["Notícias", "/noticias"], ["Parceiros", "/parceiros"], ["Indique", "https://viewer.cppem.com.br/indica-o-cppem-concursos"],
] as const;
const free = [
  { label: "Editais verticalizados", href: "/editais", description: "Transforme o conteúdo programático em uma rota clara de estudo.", icon: FileText },
  { label: "Materiais gratuitos", href: "/materiais-gratuitos", description: "Cadernos, questões e ferramentas para acelerar sua evolução.", icon: BookOpen },
] as const;

const ecosystemIcons = { Alvo: Target, Graduação: GraduationCap, Diploma: University, Local: MapPin, Escudo: ShieldCheck, Loja: ShoppingBag, Estrela: Sparkles } as const;

export function SiteHeaderClient({ featuredCourses, featuredMaterials, ecosystemItems }: { featuredCourses: Product[]; featuredMaterials: FreeMaterial[]; ecosystemItems: EcosystemItem[] }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCoursesOpen, setMobileCoursesOpen] = useState(false);
  const [mobileFreeOpen, setMobileFreeOpen] = useState(false);
  const [mobileEcosystemOpen, setMobileEcosystemOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [freeOpen, setFreeOpen] = useState(false);
  const [ecosystemOpen, setEcosystemOpen] = useState(false);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [featuredMaterialIndex, setFeaturedMaterialIndex] = useState(0);
  const featured = featuredCourses[featuredIndex];
  const featuredMaterial = featuredMaterials[featuredMaterialIndex];

  useEffect(() => {
    if ((!coursesOpen && !ecosystemOpen) || featuredCourses.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = window.setTimeout(() => setFeaturedIndex((index) => (index + 1) % featuredCourses.length), 5500);
    return () => window.clearTimeout(timeout);
  }, [coursesOpen, ecosystemOpen, featuredCourses.length, featuredIndex]);

  useEffect(() => {
    if (!freeOpen || featuredMaterials.length < 2 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const timeout = window.setTimeout(() => setFeaturedMaterialIndex((index) => (index + 1) % featuredMaterials.length), 5500);
    return () => window.clearTimeout(timeout);
  }, [freeOpen, featuredMaterials.length, featuredMaterialIndex]);

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === "Escape") { setCoursesOpen(false); setFreeOpen(false); setEcosystemOpen(false); } };
    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, []);

  const closeMobile = () => { setMobileOpen(false); setMobileCoursesOpen(false); setMobileFreeOpen(false); setMobileEcosystemOpen(false); };
  const openCourses = () => {
    if (!coursesOpen) setFeaturedIndex(0);
    setFreeOpen(false);
    setEcosystemOpen(false);
    setCoursesOpen(true);
  };
  const openFree = () => {
    setCoursesOpen(false);
    setEcosystemOpen(false);
    if (!freeOpen) setFeaturedMaterialIndex(0);
    setFreeOpen(true);
  };
  const openEcosystem = () => {
    setCoursesOpen(false);
    setFreeOpen(false);
    if (!ecosystemOpen) setFeaturedIndex(0);
    setEcosystemOpen(true);
  };
  const showPrevious = () => setFeaturedIndex((index) => (index - 1 + featuredCourses.length) % featuredCourses.length);
  const showNext = () => setFeaturedIndex((index) => (index + 1) % featuredCourses.length);

  return <header className="site-header" onMouseLeave={() => { setCoursesOpen(false); setFreeOpen(false); setEcosystemOpen(false); }}>
    <div className="container site-header-inner">
      <Link href="/" className="brand-mark" aria-label="CPPEM — página inicial"><Image src="/brand/emblema-leao.webp" alt="" width={50} height={50} priority /></Link>
      <nav className="desktop-nav" aria-label="Navegação principal">
        <Link className="nav-link" href="/quem-somos">Quem somos</Link>
        <button className="nav-link nav-dropdown-trigger" type="button" aria-expanded={coursesOpen} aria-controls="courses-mega-menu" onClick={() => coursesOpen ? setCoursesOpen(false) : openCourses()} onMouseEnter={openCourses} onFocus={openCourses}>Cursos <ChevronDown size={14} aria-hidden="true" /></button>
        {primaryAfterCourses.map(([label, href]) => <Link className="nav-link" href={href} key={label}>{label}</Link>)}
        <button className="nav-link nav-dropdown-trigger" type="button" aria-expanded={ecosystemOpen} aria-controls="ecosystem-mega-menu" onClick={() => ecosystemOpen ? setEcosystemOpen(false) : openEcosystem()} onMouseEnter={openEcosystem} onFocus={openEcosystem}>Ecossistema <ChevronDown size={14} aria-hidden="true" /></button>
        <Link className="nav-link" href="/glossario">Glossário</Link>
        <button className="nav-link nav-dropdown-trigger" type="button" aria-expanded={freeOpen} aria-controls="free-mega-menu" onClick={() => freeOpen ? setFreeOpen(false) : openFree()} onMouseEnter={openFree} onFocus={openFree}>Gratuitos <ChevronDown size={14} aria-hidden="true" /></button>
      </nav>
      <div className="header-actions"><Link className="header-action" href="https://cppem.lojaintegrada.com.br">Loja</Link><Link className="header-action" href="https://mentoriaexito.tutory.com.br/login.php">Login</Link><Link className="gold-button" href="/plano-de-combate">Plano de combate</Link></div>
      <button className="mobile-toggle" type="button" aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"} aria-expanded={mobileOpen} onClick={() => setMobileOpen((value) => !value)}>{mobileOpen ? <X size={22} /> : <Menu size={22} />}</button>
    </div>

    <div className="courses-mega" id="courses-mega-menu" data-open={coursesOpen} aria-hidden={!coursesOpen}>
      <div className="container courses-mega-grid">
        <div className="courses-mega-feature">
          {featured ? <Link href={featured.href} className="courses-feature-card" tabIndex={coursesOpen ? undefined : -1}>
            <img src={featured.menuImageUrl || featured.imageUrl} alt="" /><span className="courses-feature-overlay" />
            <span className="courses-feature-copy"><small>Preparação em destaque</small><strong>{featured.name}</strong><span>Conhecer agora <ArrowRight size={15} /></span></span>
          </Link> : <Link href="/cursos" className="courses-feature-empty" tabIndex={coursesOpen ? undefined : -1}><Image src="/brand/emblema-leao.webp" alt="" width={112} height={112} /><strong>Encontre sua próxima preparação</strong><span>Ver todos os cursos <ArrowRight size={15} /></span></Link>}
          {featuredCourses.length > 1 && <div className="courses-feature-controls"><button type="button" onClick={showPrevious} aria-label="Destaque anterior" tabIndex={coursesOpen ? undefined : -1}><ChevronLeft size={16} /></button><span>{featuredIndex + 1} / {featuredCourses.length}</span><button type="button" onClick={showNext} aria-label="Próximo destaque" tabIndex={coursesOpen ? undefined : -1}><ChevronRight size={16} /></button></div>}
        </div>
        <div className="courses-mega-content">
          <div className="courses-mega-heading"><div><span className="eyebrow">Cursos por carreira</span><h2>Escolha sua <span className="gold">missão.</span></h2></div><Link href="/cursos" onClick={() => setCoursesOpen(false)} tabIndex={coursesOpen ? undefined : -1}>Ver todas as preparações <ArrowRight size={15} /></Link></div>
          <div className="courses-path-grid">
            <div className="courses-online-path">
              <div className="courses-path-label"><Users size={16} aria-hidden="true" /><span>Cursos online por carreira</span></div>
              <div className="courses-category-grid">{courseCategories.map((category, index) => <Link href={`/cursos/${category.slug}`} key={category.slug} onClick={() => setCoursesOpen(false)} tabIndex={coursesOpen ? undefined : -1}><span>{String(index + 1).padStart(2, "0")}</span><strong>{category.label}</strong><ArrowRight size={16} /></Link>)}</div>
            </div>
            <Link href="/presencial" className="courses-presential-path" onClick={() => setCoursesOpen(false)} tabIndex={coursesOpen ? undefined : -1}>
              <span className="courses-presential-icon"><MapPin size={24} aria-hidden="true" /></span>
              <small>CPPEM Caruaru</small>
              <strong>Presencial</strong>
              <p>Aulas, acompanhamento e rotina de preparação dentro da sala.</p>
              <span className="courses-presential-tags"><i>Carreiras policiais</i><i>PMPE</i></span>
              <b>Conhecer o presencial <ArrowRight size={16} aria-hidden="true" /></b>
            </Link>
          </div>
        </div>
      </div>
    </div>

    <div className="courses-mega ecosystem-mega" id="ecosystem-mega-menu" data-open={ecosystemOpen} aria-hidden={!ecosystemOpen}>
      <div className="container ecosystem-mega-grid">
        <div className="courses-mega-feature">
          {featured ? <Link href={featured.href} className="courses-feature-card" tabIndex={ecosystemOpen ? undefined : -1} onClick={() => setEcosystemOpen(false)}>
            <img src={featured.menuImageUrl || featured.imageUrl} alt="" /><span className="courses-feature-overlay" />
            <span className="courses-feature-copy"><small>Preparação em destaque</small><strong>{featured.name}</strong><span>Conhecer agora <ArrowRight size={15} /></span></span>
          </Link> : <Link href="/cursos" className="courses-feature-empty" tabIndex={ecosystemOpen ? undefined : -1} onClick={() => setEcosystemOpen(false)}><Image src="/brand/emblema-leao.webp" alt="" width={112} height={112} /><strong>Encontre sua próxima preparação</strong><span>Ver todos os cursos <ArrowRight size={15} /></span></Link>}
          {featuredCourses.length > 1 && <div className="courses-feature-controls"><button type="button" onClick={showPrevious} aria-label="Destaque anterior" tabIndex={ecosystemOpen ? undefined : -1}><ChevronLeft size={16} /></button><span>{featuredIndex + 1} / {featuredCourses.length}</span><button type="button" onClick={showNext} aria-label="Próximo destaque" tabIndex={ecosystemOpen ? undefined : -1}><ChevronRight size={16} /></button></div>}
        </div>
        <div className="ecosystem-mega-content">
          <div className="ecosystem-mega-heading"><span>Escolha seu próximo passo</span><strong>Do estudo à carreira.</strong></div>
          <div className="ecosystem-mega-links">{ecosystemItems.map((item) => {
            const Icon = ecosystemIcons[item.icon as keyof typeof ecosystemIcons] ?? Sparkles;
            return <Link href={item.href} target={item.newTab ? "_blank" : undefined} rel={item.newTab ? "noreferrer" : undefined} data-featured={item.featured} key={item.id} onClick={() => setEcosystemOpen(false)} tabIndex={ecosystemOpen ? undefined : -1}>
              <span className="ecosystem-mega-icon"><Icon size={21} /></span>
              <span><small>{item.label || item.category}</small><strong>{item.name}</strong><p>{item.description}</p></span>
              <ArrowRight size={17} />
            </Link>;
          })}</div>
        </div>
      </div>
    </div>

    <div className="courses-mega free-mega" id="free-mega-menu" data-open={freeOpen} aria-hidden={!freeOpen}>
      <div className="container free-mega-grid">
        <div className="courses-mega-feature">
          {featuredMaterial ? <Link href={`/materiais-gratuitos?material=${encodeURIComponent(featuredMaterial.id)}`} className="courses-feature-card" onClick={() => setFreeOpen(false)} tabIndex={freeOpen ? undefined : -1}>
            {featuredMaterial.imageUrl ? <img src={featuredMaterial.imageUrl} alt="" /> : <Image src="/images/bgnews.webp" alt="" fill sizes="330px" />}
            <span className="courses-feature-overlay" />
            <span className="courses-feature-copy"><small>{featuredMaterial.menuFeatured ? "Material mais baixado" : "Destaque da biblioteca"}</small><strong>{featuredMaterial.name}</strong><span>Baixar gratuitamente <ArrowRight size={15} /></span></span>
          </Link> : <Link href="/materiais-gratuitos" className="courses-feature-empty" onClick={() => setFreeOpen(false)} tabIndex={freeOpen ? undefined : -1}><Image src="/brand/emblema-leao.webp" alt="" width={112} height={112} /><strong>Defina um material em destaque</strong><span>Ver biblioteca gratuita <ArrowRight size={15} /></span></Link>}
          {featuredMaterials.length > 1 && <div className="courses-feature-controls"><button type="button" onClick={() => setFeaturedMaterialIndex((index) => (index - 1 + featuredMaterials.length) % featuredMaterials.length)} aria-label="Material anterior" tabIndex={freeOpen ? undefined : -1}><ChevronLeft size={16} /></button><span>{featuredMaterialIndex + 1} / {featuredMaterials.length}</span><button type="button" onClick={() => setFeaturedMaterialIndex((index) => (index + 1) % featuredMaterials.length)} aria-label="Próximo material" tabIndex={freeOpen ? undefined : -1}><ChevronRight size={16} /></button></div>}
        </div>
        <div className="free-mega-content">
          <div className="courses-mega-heading"><div><span className="eyebrow">Biblioteca CPPEM</span><h2>Escolha sua próxima <span className="gold">ferramenta.</span></h2></div></div>
          <div className="free-mega-links">{free.map(({ label, href, description, icon: Icon }, index) => <Link href={href} key={label} onClick={() => setFreeOpen(false)} tabIndex={freeOpen ? undefined : -1}><span className="free-mega-icon"><Icon size={22} /></span><span><small>{String(index + 1).padStart(2, "0")}</small><strong>{label}</strong><p>{description}</p></span><ArrowRight size={18} /></Link>)}</div>
        </div>
      </div>
    </div>

    <nav className="mobile-panel" data-open={mobileOpen} aria-label="Navegação móvel">
      <Link href="/quem-somos" onClick={closeMobile}>Quem somos</Link>
      <button className="mobile-course-trigger" type="button" aria-expanded={mobileCoursesOpen} onClick={() => setMobileCoursesOpen((value) => !value)}>Cursos <ChevronDown size={16} /></button>
      <div className="mobile-course-links" data-open={mobileCoursesOpen}><Link href="/cursos" onClick={closeMobile}>Todos os cursos online</Link><Link href="/presencial" onClick={closeMobile}>Presencial em Caruaru</Link>{courseCategories.map((category) => <Link href={`/cursos/${category.slug}`} key={category.slug} onClick={closeMobile}>{category.label}</Link>)}</div>
      {primaryAfterCourses.map(([label, href]) => <Link href={href} key={label} onClick={closeMobile}>{label}</Link>)}
      <button className="mobile-course-trigger" type="button" aria-expanded={mobileEcosystemOpen} onClick={() => setMobileEcosystemOpen((value) => !value)}>Ecossistema CPPEM <ChevronDown size={16} /></button>
      <div className="mobile-course-links" data-open={mobileEcosystemOpen}>{ecosystemItems.map((item) => <Link href={item.href} target={item.newTab ? "_blank" : undefined} rel={item.newTab ? "noreferrer" : undefined} key={item.id} onClick={closeMobile}>{item.name}</Link>)}</div>
      <Link href="/glossario" onClick={closeMobile}>Glossário</Link>
      <button className="mobile-course-trigger" type="button" aria-expanded={mobileFreeOpen} onClick={() => setMobileFreeOpen((value) => !value)}>Gratuitos <ChevronDown size={16} /></button>
      <div className="mobile-course-links" data-open={mobileFreeOpen}>{free.map(({ label, href }) => <Link href={href} key={label} onClick={closeMobile}>{label}</Link>)}</div>
      <Link href="https://cppem.lojaintegrada.com.br">Loja</Link><Link href="https://mentoriaexito.tutory.com.br/login.php">Login</Link><Link className="gold-button" href="/plano-de-combate">Plano de combate</Link>
    </nav>
  </header>;
}
