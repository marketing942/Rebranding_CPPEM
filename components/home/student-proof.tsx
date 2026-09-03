/* eslint-disable @next/next/no-img-element */

export function StudentProof({ images }: { images: string[] }) {
  const repeated = [...images, ...images];
  return <div className="testimonials-viewport" aria-label="Alunos do CPPEM">
    <div className="testimonials-track">
      {repeated.map((imageUrl, index) => <figure className="proof-image-card" key={`${imageUrl}-${index}`} aria-hidden={index >= images.length}>
        <img src={imageUrl} alt={index < images.length ? `Aluno do CPPEM ${index + 1}` : ""}/>
      </figure>)}
    </div>
  </div>;
}
