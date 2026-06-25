import type { APIRoute } from 'astro';

// Runs on-demand on the Cloudflare edge (the rest of the site stays static).
export const prerender = false;

const ALLOWED_ROLES = [
  'Architect',
  'Interior Designer',
  'Architecture Firm Owner',
  'Architecture Student',
  'Real Estate Developer',
  'Contractor / Builder',
  'Other',
];

// Pragmatic email check — good enough to reject obvious junk without
// rejecting valid-but-unusual addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

export const POST: APIRoute = async ({ request, locals }) => {
  const db = locals.runtime?.env?.DB;
  if (!db) {
    return json({ ok: false, error: 'Database is not configured.' }, 500);
  }

  // Accept JSON or classic form posts.
  let name = '';
  let email = '';
  let role = '';
  try {
    const ct = request.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = (await request.json()) as Record<string, unknown>;
      name = String(body.name ?? '');
      email = String(body.email ?? '');
      role = String(body.role ?? '');
    } else {
      const form = await request.formData();
      name = String(form.get('name') ?? '');
      email = String(form.get('email') ?? '');
      role = String(form.get('role') ?? '');
    }
  } catch {
    return json({ ok: false, error: 'Could not read submission.' }, 400);
  }

  name = name.trim();
  email = email.trim();
  role = role.trim();

  if (!name || !email || !role) {
    return json({ ok: false, error: 'Please fill in every field.' }, 400);
  }
  if (name.length > 120 || email.length > 254) {
    return json({ ok: false, error: 'That looks too long — please check your details.' }, 400);
  }
  if (!EMAIL_RE.test(email)) {
    return json({ ok: false, error: 'Please enter a valid email address.' }, 400);
  }
  if (!ALLOWED_ROLES.includes(role)) {
    return json({ ok: false, error: 'Please choose a role from the list.' }, 400);
  }

  try {
    await db
      .prepare('INSERT INTO waitlist (name, email, role) VALUES (?, ?, ?)')
      .bind(name, email, role)
      .run();
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    // Unique index on lower(email) -> already signed up. Treat as success.
    if (msg.includes('UNIQUE') || msg.includes('constraint')) {
      return json({ ok: true, alreadyOnList: true });
    }
    return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
  }

  return json({ ok: true });
};

// Anything other than POST.
export const ALL: APIRoute = () =>
  json({ ok: false, error: 'Method not allowed.' }, 405);
