const { getStore } = require('@netlify/blobs');

const ADMIN_PASS = 'osmanli2026';
const STORE = 'devlet-aliye-members';

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, x-admin-secret',
    'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers, body: '' };

  const store = getStore(STORE);

  if (event.httpMethod === 'GET') {
    if (event.headers['x-admin-secret'] !== ADMIN_PASS)
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    const data = await store.get('members', { type: 'json' }) || [];
    return { statusCode: 200, headers, body: JSON.stringify({ success: true, data }) };
  }

  if (event.httpMethod === 'POST') {
    const b = JSON.parse(event.body);
    const current = await store.get('members', { type: 'json' }) || [];
    current.push({
      id: Date.now() + '-' + Math.random().toString(36).slice(2, 6),
      tarih: new Date().toLocaleString('tr-TR'),
      ad: b.ad || '', soyad: b.soyad || '', email: b.email || '', telefon: b.telefon || ''
    });
    await store.set('members', JSON.stringify(current));
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  if (event.httpMethod === 'DELETE') {
    if (event.headers['x-admin-secret'] !== ADMIN_PASS)
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Unauthorized' }) };
    const { id } = JSON.parse(event.body);
    const current = await store.get('members', { type: 'json' }) || [];
    await store.set('members', JSON.stringify(current.filter(m => m.id !== id)));
    return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
};
