/// <reference types="astro/client" />

type D1Database = import('@cloudflare/workers-types').D1Database;

// Bindings available at runtime via Astro.locals.runtime.env
interface Env {
  /** D1 database binding (see wrangler.jsonc -> d1_databases) */
  DB: D1Database;
  /** Password gate for the /admin signups page (set as a Cloudflare secret) */
  ADMIN_PASSWORD: string;
}

type CfRuntime = import('@astrojs/cloudflare').Runtime<Env>;

declare namespace App {
  interface Locals extends CfRuntime {}
}
