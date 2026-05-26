// Supabase Edge Function — sends a confirmation email through Zoho SMTP
// when a redelivery request is submitted.
//
// Lightweight inline SMTP client (no external libraries) to stay under the
// Edge Function memory/CPU limits.

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

async function sendMail(opts: {
  host: string;
  port: number;
  username: string;
  password: string;
  to: string;
  fromName: string;
  subject: string;
  body: string;
}) {
  const conn = await Deno.connectTls({
    hostname: opts.host,
    port: opts.port,
  });
  const enc = new TextEncoder();
  const dec = new TextDecoder();
  const buf = new Uint8Array(8192);
  let pending = '';

  // Read until we have a complete SMTP reply. SMTP multi-line replies look
  // like "250-LINE1\r\n250-LINE2\r\n250 LASTLINE\r\n" — the final line has a
  // space after the 3-digit code instead of a dash.
  const readReply = async (): Promise<string> => {
    while (true) {
      const lines = pending.split('\r\n');
      // keep everything before the last (possibly incomplete) line
      let complete = '';
      for (let i = 0; i < lines.length - 1; i++) complete += lines[i] + '\r\n';
      const remaining = lines[lines.length - 1];
      if (complete) {
        // find the line whose 4th char is ' ' (terminal line of a reply)
        const splitLines = complete.split('\r\n').filter(Boolean);
        const lastIdx = splitLines.findIndex(
          (l) => l.length >= 4 && l[3] === ' ',
        );
        if (lastIdx !== -1) {
          const replyText = splitLines.slice(0, lastIdx + 1).join('\r\n');
          // keep anything past the terminal line as pending
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
    return resp;
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
    const message =
      [
        `From: ${opts.fromName} <${opts.username}>`,
        `To: ${opts.to}`,
        `Subject: ${opts.subject}`,
        `Date: ${date}`,
        'MIME-Version: 1.0',
        'Content-Type: text/plain; charset=UTF-8',
        'Content-Transfer-Encoding: 8bit',
        '',
        opts.body,
        '.',
      ].join('\r\n') + '\r\n';
    await write(message);
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

  let payload: {
    email?: string;
    orderNumber?: string;
    dateLabel?: string;
    timeLabel?: string;
  };
  try {
    payload = await req.json();
  } catch {
    return json(400, { error: 'Invalid JSON body' });
  }

  const email = (payload.email ?? '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return json(400, { error: 'Invalid email address' });
  }

  const orderNumber = (payload.orderNumber ?? 'Sin especificar').trim();
  const dateLabel = (payload.dateLabel ?? 'Sin especificar').trim();
  const timeLabel = (payload.timeLabel ?? 'Sin especificar').trim();

  const smtpUser = Deno.env.get('SMTP_USER');
  const smtpPass = Deno.env.get('SMTP_PASS');
  if (!smtpUser || !smtpPass) {
    return json(500, { error: 'SMTP credentials not configured' });
  }

  const body =
    'Tu solicitud de reprogramación quedó registrada.\n\n' +
    `• Número de pedido: ${orderNumber}\n` +
    `• Fecha: ${dateLabel}\n` +
    `• Horario: ${timeLabel}\n\n` +
    '— Estafeta';

  try {
    await sendMail({
      host: Deno.env.get('SMTP_HOST') ?? 'smtp.zoho.com',
      port: Number(Deno.env.get('SMTP_PORT') ?? '465'),
      username: smtpUser,
      password: smtpPass,
      to: email,
      fromName: Deno.env.get('FROM_NAME') ?? 'Estafeta',
      subject: 'Entrega reprogramada exitosamente',
      body,
    });
  } catch (error) {
    return json(502, {
      error: 'SMTP send failed',
      detail: error instanceof Error ? error.message : String(error),
    });
  }

  return json(200, { sent: true });
});
