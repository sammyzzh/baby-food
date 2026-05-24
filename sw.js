// api/data.js — Vercel Serverless Function
// 使用 Vercel KV 存储共享数据（需在 Vercel 控制台开启 KV）

const KV_KEY = 'baby_food_data_v1';

// 读取数据
async function getData() {
  try {
    const { kv } = await import('@vercel/kv');
    const data = await kv.get(KV_KEY);
    return data || null;
  } catch (e) {
    // KV 未配置时返回 null，前端使用本地默认数据
    return null;
  }
}

// 写入数据
async function setData(data) {
  try {
    const { kv } = await import('@vercel/kv');
    await kv.set(KV_KEY, data);
    return true;
  } catch (e) {
    return false;
  }
}

export default async function handler(req, res) {
  // 允许跨域
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'GET') {
    const data = await getData();
    return res.status(200).json({ ok: true, data });
  }

  if (req.method === 'POST') {
    const body = req.body;
    if (!body || !body.data) {
      return res.status(400).json({ ok: false, error: 'Missing data' });
    }
    const ok = await setData(body.data);
    return res.status(200).json({ ok });
  }

  return res.status(405).json({ ok: false, error: 'Method not allowed' });
}
