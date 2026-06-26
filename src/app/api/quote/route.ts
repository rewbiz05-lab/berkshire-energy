import { appendFile, mkdir } from 'node:fs/promises'
import path from 'node:path'

const FIELDS = ['name', 'phone', 'email', 'address', 'bill', 'notes'] as const

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return Response.json({ error: 'Invalid request body' }, { status: 400 })
  }

  const lead: Record<string, string> = {}
  for (const f of FIELDS) {
    const v = body[f]
    if (typeof v === 'string') lead[f] = v.trim()
  }

  if (!lead.name || !lead.phone || !lead.email || !lead.address) {
    return Response.json({ error: 'Please fill in name, phone, email, and address.' }, { status: 422 })
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(lead.email)) {
    return Response.json({ error: 'Please enter a valid email address.' }, { status: 422 })
  }

  const record = { ...lead, receivedAt: new Date().toISOString() }

  try {
    const dir = path.join(process.cwd(), 'data')
    await mkdir(dir, { recursive: true })
    await appendFile(path.join(dir, 'leads.jsonl'), JSON.stringify(record) + '\n', 'utf8')
  } catch {
    // Local file persistence is best-effort; serverless hosts have a read-only FS.
  }

  await emailLead(record)

  console.log('[quote] new lead', record)
  return Response.json({ ok: true })
}

async function emailLead(record: Record<string, string>) {
  const apiKey = process.env.RESEND_API_KEY
  // LEAD_EMAIL may be a single address or a comma-separated list.
  const to = (process.env.LEAD_EMAIL ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  if (!apiKey || to.length === 0) {
    console.warn('[quote] email not sent — RESEND_API_KEY or LEAD_EMAIL is missing')
    return
  }

  const rows = (['name', 'phone', 'email', 'address', 'bill', 'notes'] as const)
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
        reply_to: record.email,
        subject: `New quote request — ${record.name}`,
        text: `${rows}\n\nReceived: ${record.receivedAt}`,
      }),
    })
    if (!res.ok) {
      console.error('[quote] email send failed', res.status, await res.text())
    }
  } catch (err) {
    console.error('[quote] email send error', err)
  }
}
