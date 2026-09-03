# CPPEM — novo site institucional

Aplicação Next.js 16, TypeScript e Tailwind CSS para a nova identidade do CPPEM. Inclui Homepage, mapa interativo de concursos, biblioteca filtrável, páginas SEO por concurso e CMS interno com Supabase.

## Desenvolvimento

```bash
npm install
Copy-Item .env.example .env.local
npm run dev
```

Sem as variáveis do Supabase, as páginas públicas usam dados de demonstração de `lib/mock-data.ts`. O painel informa que o backend ainda precisa ser configurado.

## Supabase

1. Crie ou selecione um projeto Supabase.
2. Aplique `supabase/migrations/0001_initial_cms.sql`.
3. Configure `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY` e `SUPABASE_SERVICE_ROLE_KEY`.
4. Crie o primeiro usuário no Supabase Auth.
5. Promova manualmente esse primeiro perfil:

```sql
update public.profiles set role = 'admin' where id = '<uuid-do-usuario>';
```

Depois disso, o administrador pode convidar usuários e alterná-los entre `admin` e `editor` em `/admin/usuarios`. A service role é usada somente no servidor para o envio desses convites.

O bucket público `site-media`, suas políticas, as tabelas, os gatilhos de auditoria e o histórico de slugs são criados pela migration.

## Verificação

```bash
npm test
npm run lint
npm run build
```

Antes da troca de domínio, configure `NEXT_PUBLIC_SITE_URL` com a URL final e confirme sitemap, canonical, Open Graph e redirecionamentos.
