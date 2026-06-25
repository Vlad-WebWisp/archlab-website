import type { APIRoute } from 'astro';

export const prerender = false;

interface Row {
  id: number;
  name: string;
  email: string;
  role: string;
  created_at: string;
}

const unauthorized = () =>
  new Response(JSON.stringify({ ok: false, error: 'Unauthorized.' }), {
    status: 401,
    headers: { 'Content-Type': 'application/json' },
  });

function passwordOk(request: Request, expected: string | undefined): boolean {
  if (!expected) return false;
  const header = request.headers.get('authorization') || '';
  const provided = header.replace(/^Bearer\s+/i, '');
  // Length-aware constant-ish comparison.
  if (provided.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= provided.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}

function toCsv(rows: Row[]): string {
  const esc = (v: unknown) => {
    const s = String(v ?? '');
    return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
  };
  const header = 'id,name,email,role,created_at';
  const lines = rows.map((r) => [r.id, r.name, r.email, r.role, r.created_at].map(esc).join(','));
  return [header, ...lines].join('\n');
}

export const GET: APIRoute = async ({ request, locals, url }) => {
  const env = locals.runtime?.env;
  if (!passwordOk(request, env?.ADMIN_PASSWORD)) return unauthorized();

  const db = env?.DB;
  if (!db) {
    return new Response(JSON.stringify({ ok: false, error: 'Database is not configured.' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { results } = await db
    .prepare('SELECT id, name, email, role, created_at FROM waitlist ORDER BY created_at DESC')
    .all<Row>();
  const rows = results ?? [];

  if (url.searchParams.get('format') === 'csv') {
    return new Response(toCsv(rows), {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="archlab-waitlist.csv"',
      },
    });
  }

  return new Response(JSON.stringify({ ok: true, count: rows.length, signups: rows }), {
    headers: { 'Content-Type': 'application/json' },
  });
};
