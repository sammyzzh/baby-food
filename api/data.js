export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  const KEY = 'baby_food_v1';

  if (req.method === 'GET') {
    try {
      const { kv } = await import('@vercel/kv');
      const data = await kv.get(KEY);
      return res.status(200).json({ ok: true, data: data || null });
    } catch (e) {
      return res.status(200).json({ ok: true, data: null });
    }
  }

  if (req.method === 'POST') {
    try {
      const { kv } = await import('@vercel/kv');
      await kv.set(KEY, req.body.data);
      return res.status(200).json({ ok: true });
    } catch (e) {
      return res.status(200).json({ ok: false, error: String(e) });
    }
  }

  return res.status(405).end();
}
