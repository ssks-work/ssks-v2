const json = (data, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: {
    'content-type': 'application/json; charset=utf-8',
    'cache-control': 'no-store'
  }
});

const clean = (value, maxLength) => String(value || '').trim().slice(0, maxLength);
const escapeHtml = (value) => clean(value, 5000)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

export async function onRequestPost(context) {
  const { request, env } = context;

  if (!env.RESEND_API_KEY) {
    return json({ message: 'メール送信設定が完了していません。' }, 503);
  }

  const contentType = request.headers.get('content-type') || '';
  if (!contentType.includes('multipart/form-data') && !contentType.includes('application/x-www-form-urlencoded')) {
    return json({ message: '不正な送信形式です。' }, 415);
  }

  const contentLength = Number(request.headers.get('content-length') || 0);
  if (contentLength > 50_000) return json({ message: '送信内容が大きすぎます。' }, 413);

  const data = await request.formData();
  if (clean(data.get('website'), 200)) return json({ ok: true });

  const name = clean(data.get('name'), 100);
  const company = clean(data.get('company'), 150);
  const email = clean(data.get('email'), 254);
  const message = clean(data.get('message'), 5000);

  if (!name || !email || !message) return json({ message: '必須項目をご確認ください。' }, 400);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ message: 'メールアドレスの形式をご確認ください。' }, 400);

  const from = env.CONTACT_FROM || 'SSKS Website <website@send.ssks.work>';
  const to = env.CONTACT_TO || 'info@ssks.work';
  const subject = `【SSKS】${name}様からのお問い合わせ`;
  const text = [
    'SSKS Webサイトからお問い合わせが届きました。',
    '',
    `お名前：${name}`,
    `会社名：${company || '未入力'}`,
    `メールアドレス：${email}`,
    '',
    'お問い合わせ内容：',
    message
  ].join('\n');
  const html = `
    <h2>SSKS Webサイトからのお問い合わせ</h2>
    <table cellpadding="8" cellspacing="0" border="1" style="border-collapse:collapse;border-color:#ddd">
      <tr><th align="left">お名前</th><td>${escapeHtml(name)}</td></tr>
      <tr><th align="left">会社名</th><td>${escapeHtml(company || '未入力')}</td></tr>
      <tr><th align="left">メール</th><td>${escapeHtml(email)}</td></tr>
    </table>
    <h3>お問い合わせ内容</h3>
    <p style="white-space:pre-wrap">${escapeHtml(message)}</p>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'authorization': `Bearer ${env.RESEND_API_KEY}`,
      'content-type': 'application/json',
      'idempotency-key': crypto.randomUUID()
    },
    body: JSON.stringify({ from, to: [to], reply_to: email, subject, text, html })
  });

  if (!response.ok) {
    console.error('Resend error', response.status, await response.text());
    return json({ message: '送信に失敗しました。時間をおいて再度お試しください。' }, 502);
  }

  return json({ ok: true });
}

export function onRequest() {
  return json({ message: 'Method Not Allowed' }, 405);
}
