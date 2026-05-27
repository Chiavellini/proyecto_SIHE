// Supabase Edge Function — outbound "tu paquete no se pudo entregar"
// notification. Given {email, article}, looks up an image of the article
// on Wikipedia (Spanish first, English fallback) and sends an HTML email
// from delivery@estafeta.uk with the article thumbnail, instructions,
// and a CTA linking to the reschedule form.
//
// Required secrets (already configured for send-redelivery-confirmation):
//   SMTP_USER, SMTP_PASS
// Optional:
//   SMTP_HOST (default smtp.zoho.com), SMTP_PORT (default 465),
//   FROM_NAME (default Estafeta), RESCHEDULE_URL (default
//   https://estafeta.uk/reprogramar-entrega)

import { serve } from 'https://deno.land/std@0.224.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
};

const json = (status: number, body: Record<string, unknown>) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
  });

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

async function fetchWikipediaThumbnail(
  article: string,
  lang: 'es' | 'en',
): Promise<string | null> {
  const url =
    `https://${lang}.wikipedia.org/w/api.php?` +
    new URLSearchParams({
      action: 'query',
      format: 'json',
      generator: 'search',
      gsrsearch: article,
      gsrlimit: '1',
      prop: 'pageimages',
      pithumbsize: '300',
      origin: '*',
    });

  try {
    const r = await fetch(url, {
      headers: { 'User-Agent': 'estafeta-uk-mailer/1.0' },
    });
    if (!r.ok) return null;
    const data = await r.json();
    const pages = data?.query?.pages;
    if (!pages) return null;
    const first = Object.values(pages)[0] as
      | { thumbnail?: { source?: string } }
      | undefined;
    return first?.thumbnail?.source ?? null;
  } catch {
    return null;
  }
}

async function findArticleImage(article: string): Promise<string | null> {
  return (
    (await fetchWikipediaThumbnail(article, 'es')) ??
    (await fetchWikipediaThumbnail(article, 'en'))
  );
}

function buildHtmlEmail(opts: {
  article: string;
  imageUrl: string | null;
  rescheduleUrl: string;
}) {
  const articleHtml = escapeHtml(opts.article);
  const imageBlock = opts.imageUrl
    ? `<img src="${escapeHtml(opts.imageUrl)}" alt="${articleHtml}"
            width="120" height="120"
            style="display:block;border-radius:8px;object-fit:cover;
                   border:1px solid #ececec;background:#f5f5f5;" />`
    : '';
  return `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"></head>
<body style="margin:0;padding:0;background:#f5f5f5;font-family:'Helvetica Neue',Arial,sans-serif;color:#393938;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f5f5f5;padding:32px 16px;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600"
             style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #ececec;">
        <tr>
          <td style="background:#c00d0d;padding:20px 28px;color:#ffffff;">
            <div style="font-size:11px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;opacity:0.85;">Estafeta</div>
            <div style="font-size:22px;font-weight:600;margin-top:4px;">Tu paquete no se pudo entregar</div>
          </td>
        </tr>
        <tr>
          <td style="padding:28px;">
            <p style="margin:0 0 16px;font-size:15px;line-height:1.55;">
              Visitamos tu domicilio y no había nadie disponible para recibir tu pedido:
            </p>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%"
                   style="background:#f5f5f5;border-radius:10px;margin:0 0 20px;">
              <tr>
                ${
                  opts.imageUrl
                    ? `<td width="136" style="padding:16px 0 16px 16px;vertical-align:middle;">${imageBlock}</td>`
                    : ''
                }
                <td style="padding:16px;vertical-align:middle;">
                  <div style="font-size:11px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#c00d0d;">Artículo</div>
                  <div style="font-size:17px;font-weight:600;margin-top:4px;color:#393938;line-height:1.3;">${articleHtml}</div>
                </td>
              </tr>
            </table>
            <p style="margin:0 0 18px;font-size:14px;line-height:1.55;">
              Para reprogramar la entrega:
            </p>
            <ol style="margin:0 0 24px;padding-left:20px;font-size:14px;line-height:1.6;">
              <li>Ten a la mano tu número de pedido.</li>
              <li>Entra al formulario con el botón de abajo.</li>
              <li>Elige fecha y horario disponible para una nueva visita.</li>
            </ol>
            <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0;">
              <tr><td style="background:#c00d0d;border-radius:10px;">
                <a href="${escapeHtml(opts.rescheduleUrl)}"
                   style="display:inline-block;padding:13px 28px;color:#ffffff;text-decoration:none;
                          font-weight:600;font-size:14px;letter-spacing:0.02em;">
                  Reprogramar entrega
                </a>
              </td></tr>
            </table>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

async function sendMail(opts: {
  host: string;
  port: number;
  username: string;
  password: string;
  to: string;
  fromName: string;
  subject: string;
  htmlBody: string;
}) {
  const conn = await Deno.connectTls({
    hostname: opts.host,
    port: opts.port,
  });
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const buf = new Uint8Array(8192);
  let pending = '';

  const readReply = async (): Promise<string> => {
    while (true) {
      const lines = pending.split('\r\n');
      let complete = '';
      for (let i = 0; i < lines.length - 1; i++) complete += lines[i] + '\r\n';
      const remaining = lines[lines.length - 1];
      if (complete) {
        const splitLines = complete.split('\r\n').filter(Boolean);
        const lastIdx = splitLines.findIndex(
          (l) => l.length >= 4 && l[3] === ' ',
        );
        if (lastIdx !== -1) {
          const replyText = splitLines.slice(0, lastIdx + 1).join('\r\n');
          const consumed =
            splitLines.slice(0, lastIdx + 1).join('\r\n').length +
            (lastIdx + 1) * 2;
          pending = complete.slice(consumed) + remaining;
          return replyText;
        }
      }
      const n = await conn.read(buf);
      if (!n) throw new Error('connection closed');
      pending += dec.decode(buf.subarray(0, n));
    }
  };
  const write = async (line: string) => {
    await conn.write(enc.encode(line + '\r\n'));
  };
  const expect = async (codePrefix: string, label: string) => {
    const resp = await readReply();
    if (!resp.startsWith(codePrefix)) {
      throw new Error(`SMTP ${label} failed: ${resp.trim()}`);
    }
  };

  try {
    await expect('220', 'greeting');
    await write('EHLO estafeta.uk');
    await expect('250', 'EHLO');
    await write('AUTH LOGIN');
    await expect('334', 'AUTH LOGIN');
    await write(btoa(opts.username));
    await expect('334', 'username');
    await write(btoa(opts.password));
    await expect('235', 'password');
    await write(`MAIL FROM:<${opts.username}>`);
    await expect('250', 'MAIL FROM');
    await write(`RCPT TO:<${opts.to}>`);
    await expect('250', 'RCPT TO');
    await write('DATA');
    await expect('354', 'DATA');

    const date = new Date().toUTCString();
    const headers =
      [
        `From: ${opts.fromName} <${opts.username}>`,
        `To: ${opts.to}`,
        `Subject: ${opts.subject}`,
        `Date: ${date}`,
        'MIME-Version: 1.0',
        'Content-Type: text/html; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
      ].join('\r\n');
    await write(headers + '\r\n\r\n' + opts.htmlBody + '\r\n.');
    await expect('250', 'message body');
    await write('QUIT');
  } finally {
    conn.close();
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }
  if (req.method !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  let payload: { email?: string; article?: string; imageUrl?: string };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const email = (payload.email ?? '').trim();
  const article = (payload.article ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Invalid email address' });
  }
  if (!article) {
    return json(400, { error: 'Missing article' });
  }

  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');
  if (!smtpUser || !smtpPass) {
    return json(500, { error: 'SMTP credentials not configured' });
  }

  // Caller can override the image (skip Wikipedia lookup) by passing imageUrl
  const imageUrl =
    payload.imageUrl?.trim() || (await findArticleImage(article));

  const rescheduleUrl =
    Deno.env.get('RESCHEDULE_URL') ?? 'https://estafeta.uk/reprogramar-entrega';

  const htmlBody = buildHtmlEmail({ article, imageUrl, rescheduleUrl });

  try {
    await sendMail({
      host: Deno.env.get('SMTP_HOST') ?? 'smtp.zoho.com',
      port: Number(Deno.env.get('SMTP_PORT') ?? '465'),
      username: smtpUser,
      password: smtpPass,
      to: email,
      fromName: Deno.env.get('FROM_NAME') ?? 'Estafeta',
      subject: 'Tu paquete no se pudo entregar — reprograma tu entrega',
      htmlBody,
    });
  } catch (error) {
    return json(502, {
      error: 'SMTP send failed',
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  return json(200, { sent: true, imageUrl });
});
