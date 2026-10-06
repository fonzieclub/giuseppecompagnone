// Keeps the Supabase free-tier project from pausing due to inactivity.
export default async function handler(req, res) {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY;

  if (!url || !key) {
    return res.status(500).json({ ok: false, error: 'Missing Supabase env vars' });
  }

  const headers = {
    apikey: key,
    Authorization: `Bearer ${key}`,
  };

  try {
    const [authRes, restRes] = await Promise.all([
      fetch(`${url}/auth/v1/health`, { headers }),
      fetch(`${url}/rest/v1/profiles?select=id&limit=1`, { headers }),
    ]);

    return res.status(200).json({
      ok: authRes.ok && restRes.ok,
      auth: authRes.status,
      rest: restRes.status,
      at: new Date().toISOString(),
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: error.message,
      at: new Date().toISOString(),
    });
  }
}
