import Link from "next/link";
import type { ReactNode } from "react";
import { logoutAction } from "@/app/admin/actions";
import type { UserRole } from "@/types/content";

export function AdminShell({ children, profile }: { children:ReactNode; profile:{name:string;role:UserRole}|null }) {
  return <div className="admin-shell"><header className="admin-header"><div className="container admin-header-inner"><Link href="/admin" className="ui-label gold-text">CPPEM Admin</Link><nav className="admin-nav"><Link className="nav-link" href="/admin/concursos">Concursos</Link><Link className="nav-link" href="/admin/homepage">Homepage</Link>{profile?.role === "admin" && <Link className="nav-link" href="/admin/usuarios">Usuários</Link>}</nav><span className="map-hint">{profile?.name || "Modo demonstração"}</span>{profile && <form action={logoutAction}><button className="ghost-button" type="submit">Sair</button></form>}</div></header><main className="container admin-main">{children}</main></div>;
}
