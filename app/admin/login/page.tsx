import Link from "next/link";
import { loginAction } from "@/app/admin/actions";

export default async function AdminLoginPage({searchParams}:{searchParams:Promise<{erro?:string}>}) {
  const {erro}=await searchParams;
  return <main className="admin-shell" style={{display:"grid",placeItems:"center",padding:"1rem"}}><section className="detail-panel" style={{width:"min(100%,420px)",padding:"2rem"}}><span className="eyebrow">Área restrita</span><h1 className="product-name" style={{fontSize:"2rem"}}>CPPEM Admin</h1><p className="product-description">Entre com o usuário cadastrado no Supabase Auth.</p>{erro && <p style={{color:"#ff8d82"}}>Não foi possível entrar. Verifique as credenciais e a configuração.</p>}<form action={loginAction} style={{display:"grid",gap:"1rem",marginTop:"1.5rem"}}><label className="form-label">E-mail<input className="field" name="email" type="email" required/></label><label className="form-label">Senha<input className="field" name="password" type="password" required/></label><button className="gold-button" type="submit">Entrar</button></form><p style={{textAlign:"center",marginTop:"1rem"}}><Link className="map-hint" href="/">Voltar ao site</Link></p></section></main>;
}
