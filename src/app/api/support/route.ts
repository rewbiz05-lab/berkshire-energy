import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const FIELDS = ['name', 'contact', 'message'] as const

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const msg: Record<string, string> = {}
  for (const f of FIELDS) {
    const v = body[f]
    if (typeof v === 'string') msg[f] = v.trim()
  }

  if (!msg.message) {
    return Response.json({ error: 'Please enter a message.' }, { status: 422 })
  }
  if (!msg.contact) {
    return Response.json({ error: 'Please add a phone or email so we can reply.' }, { status: 422 })
  }

  const record = { ...msg, receivedAt: new Date().toISOString() }

  try {
    const dir = path.join(process.cwd(), 'data')
    await mkdir(dir, { recursive: true })
    await appendFile(path.join(dir, 'support.jsonl'), JSON.stringify(record) + '\n', 'utf8')
  } catch {
    // Local file persistence is best-effort; serverless hosts have a read-only FS.
  }

  await emailSupport(record)

  console.log('[support] new message', record)
  return Response.json({ ok: true })
}

async function emailSupport(record: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY
  // LEAD_EMAIL may be a single address or a comma-separated list.
  const to = (process.env.LEAD_EMAIL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (!apiKey || to.length === 0) {
    console.warn('[support] email not sent — RESEND_API_KEY or LEAD_EMAIL is missing')
    return
  }

  const rows = (['name', 'contact', 'message'] as const)
    .filter((f) => record[f])
    .map((f) => `${f[0].toUpperCase() + f.slice(1)}: ${record[f]}`)
    .join('\n')

  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env.LEAD_FROM ?? 'Berkshire Energy <onboarding@resend.dev>',
        to,
        subject: `Support chat — ${record.name || record.contact}`,
        text: `${rows}\n\nReceived: ${record.receivedAt}`,
      }),
    })
    if (!res.ok) {
      console.error('[support] email send failed', res.status, await res.text())
    }
  } catch (err) {
    console.error('[support] email send error', err)
  }
}
