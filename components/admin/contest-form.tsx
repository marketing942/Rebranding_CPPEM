import { saveContestAction } from "@/app/admin/actions";
import { northeastStates, statusLabels } from "@/lib/constants";
import { contestStatuses } from "@/types/content";

type Row = Record<string,unknown> & { contest_locations?:Array<{state_code:string}>; contest_products?:Array<{product_id:string}> };

export function ContestForm({ contest, products=[] }: { contest?:Row; products?:Array<{id:string;name:string}> }) {
  const value=(key:string,fallback="") => String(contest?.[key] ?? fallback);
  const linesValue=(key:string) => Array.isArray(contest?.[key]) ? (contest?.[key] as string[]).join("\n") : "";
  return <form className="admin-form" action={saveContestAction}>
    {Boolean(contest?.id) && <input type="hidden" name="id" value={String(contest?.id)}/>}<Field name="title" label="Título" defaultValue={value("title")} required/><Field name="slug" label="Slug" defaultValue={value("slug")} placeholder="gerado pelo título"/><Field name="acronym" label="Sigla" defaultValue={value("acronym")} required/><Field name="organization" label="Órgão" defaultValue={value("organization")} required/><Field name="career" label="Carreira" defaultValue={value("career")} required/>
    <label className="form-label">Status<select className="field" name="status" defaultValue={value("status","previsto")}>{contestStatuses.map((status)=><option value={status} key={status}>{statusLabels[status]}</option>)}</select></label>
    <label className="form-label">Abrangência<select className="field" name="scope" defaultValue={value("scope","estadual")}><option value="estadual">Estadual</option><option value="federal">Federal</option><option value="nacional">Nacional</option></select></label>
    <Field name="states" label="Estados (siglas separadas por vírgula)" defaultValue={contest?.contest_locations?.map((item)=>item.state_code).join(", ") ?? "PE"} placeholder={northeastStates.join(", ")}/><Field name="openings_label" label="Vagas" defaultValue={value("openings_label","A definir")} required/><Field name="salary_label" label="Remuneração" defaultValue={value("salary_label","A definir")} required/><Field name="exam_board" label="Banca" defaultValue={value("exam_board","A definir")} required/>
    <TextArea name="summary" label="Resumo" defaultValue={value("summary")} required/><TextArea name="content_md" label="Conteúdo em Markdown" defaultValue={value("content_md")} required/>
    <TextArea name="positions" label="Cargos (um por linha)" defaultValue={linesValue("positions")}/><TextArea name="requirements" label="Requisitos (um por linha)" defaultValue={linesValue("requirements")}/><TextArea name="stages" label="Etapas (uma por linha)" defaultValue={linesValue("stages")}/>
    <Field name="source_label" label="Nome da fonte oficial" defaultValue={value("source_label")} required/><Field name="source_url" label="URL oficial HTTPS" type="url" defaultValue={value("source_url")} required/><Field name="last_verified_at" label="Última verificação" type="date" defaultValue={value("last_verified_at",new Date().toISOString().slice(0,10))} required/>
    <label className="form-label">Preparação vinculada<select className="field" name="product_id" defaultValue={contest?.contest_products?.[0]?.product_id ?? ""}><option value="">Nenhuma</option>{products.map((product)=><option value={product.id} key={product.id}>{product.name}</option>)}</select></label>
    <label className="form-label full" style={{display:"flex",gridAutoFlow:"column",justifyContent:"start",alignItems:"center"}}><input type="checkbox" name="published" defaultChecked={Boolean(contest?.published)}/> Publicar concurso</label>
    <div className="full"><button className="gold-button" type="submit">Salvar concurso</button></div>
  </form>;
}

function Field({label,name,type="text",defaultValue,placeholder,required}:{label:string;name:string;type?:string;defaultValue?:string;placeholder?:string;required?:boolean}) { return <label className="form-label">{label}<input className="field" name={name} type={type} defaultValue={defaultValue} placeholder={placeholder} required={required}/></label>; }
function TextArea({label,name,defaultValue,required}:{label:string;name:string;defaultValue?:string;required?:boolean}) { return <label className="form-label full">{label}<textarea className="field" name={name} rows={5} defaultValue={defaultValue} required={required}/></label>; }
