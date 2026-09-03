/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import type { Product } from "@/types/content";

export function ProductCard({ product, clone = false }: { product: Product; clone?: boolean }) {
  return <article className="product-card" data-clone={clone || undefined} aria-hidden={clone || undefined}>
    <div className="product-card-media"><img src={product.imageUrl} alt={clone ? "" : product.name}/></div>
    <div className="product-card-body">
      <span className="product-category">{product.acronym || product.category}{product.featured ? " • destaque" : ""}</span>
      <h3 className="product-name">{product.name}</h3>
      {product.modality && <span className="product-modality">{product.modality}</span>}
      {product.description && <p className="product-description">{product.description}</p>}
      {product.price && <p className="product-price">{product.price}{product.oldPrice && <span className="old-price">{product.oldPrice}</span>}</p>}
      <Link className="gold-button" href={product.href} tabIndex={clone ? -1 : undefined}>Conhecer preparação</Link>
    </div>
  </article>;
}

export function ProductCarousel({ products }: { products: Product[] }) {
  if (!products.length) return null;
  return <div className="product-carousel-viewport" aria-label="Preparações e materiais em destaque">
    <div className="product-carousel-track">
      {products.map((product) => <ProductCard product={product} key={product.id}/>)}
      {products.map((product) => <ProductCard product={product} clone key={`${product.id}-clone`}/>)}
    </div>
  </div>;
}
