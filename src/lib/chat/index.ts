// chat/index.ts — channels & messages with localStorage fallback. Supabase
// Realtime is sketched but optional — the API works fully offline.

export type ChannelKind = 'patient_provider' | 'peer_group' | 'mwenza'

export interface ChatChannel {
  id: string
  kind: ChannelKind
  participants: string[]
  unread: number
  title_sw?: string
}

export interface ChatMessage {
  id: string
  channelId: string
  senderId: string
  body: string
  ts: number
  readBy: string[]
}

const CHAN_KEY = 'tumaini.chat.channels'
const MSGS_KEY = 'tumaini.chat.messages'
const TYPING_KEY = 'tumaini.chat.typing'

function readChannels(): ChatChannel[] {
  try {
    const raw = localStorage.getItem(CHAN_KEY)
    if (!raw) return seedChannels()
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed as ChatChannel[]
    return seedChannels()
  } catch {
    return seedChannels()
  }
}

function writeChannels(items: ChatChannel[]): void {
  try {
    localStorage.setItem(CHAN_KEY, JSON.stringify(items))
  } catch {
    // ignore
  }
}

function readMessages(): ChatMessage[] {
  try {
    const raw = localStorage.getItem(MSGS_KEY)
    if (!raw) return []
    const parsed: unknown = JSON.parse(raw)
    if (Array.isArray(parsed)) return parsed as ChatMessage[]
  } catch {
    // ignore
  }
  return []
}

function writeMessages(items: ChatMessage[]): void {
  try {
    localStorage.setItem(MSGS_KEY, JSON.stringify(items.slice(-2000)))
  } catch {
    // ignore
  }
}

function seedChannels(): ChatChannel[] {
  const seeded: ChatChannel[] = [
    { id: 'ch_provider_1', kind: 'patient_provider', participants: ['me', 'dr_amina'], unread: 0, title_sw: 'Dkt. Amina (Mtaalamu wako)' },
    { id: 'ch_group_1', kind: 'peer_group', participants: ['me', 'rafiki_1', 'rafiki_2'], unread: 0, title_sw: 'Kikundi cha Tumaini' },
    { id: 'ch_mwenza_1', kind: 'mwenza', participants: ['me', 'mwenza'], unread: 0, title_sw: 'Rafiki wako' },
  ]
  try {
    localStorage.setItem(CHAN_KEY, JSON.stringify(seeded))
  } catch {
    // ignore
  }
  return seeded
}

export function listChannels(userId: string): ChatChannel[] {
  return readChannels().filter((c) => c.participants.includes(userId))
}

export function listMessages(channelId: string): ChatMessage[] {
  return readMessages().filter((m) => m.channelId === channelId).sort((a, b) => a.ts - b.ts)
}

export function sendMessage(channelId: string, senderId: string, body: string): ChatMessage {
  const msg: ChatMessage = {
    id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    channelId,
    senderId,
    body,
    ts: Date.now(),
    readBy: [senderId],
  }
  const all = readMessages()
  all.push(msg)
  writeMessages(all)
  // bump channel unread counters for others
  const chans = readChannels().map((c) => {
    if (c.id !== channelId) return c
    return { ...c, unread: c.participants.length > 1 ? c.unread + 1 : c.unread }
  })
  writeChannels(chans)
  // Best-effort Supabase Realtime broadcast (skeleton — silent on failure).
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    void import('../supabase').then((mod: unknown) => {
      const m = mod as { supabase?: { channel?: (n: string) => { send?: (p: unknown) => void } } }
      m.supabase?.channel?.(`chat:${channelId}`)?.send?.({ type: 'broadcast', event: 'message', payload: msg })
    }).catch(() => {})
  } catch {
    // ignore
  }
  return msg
}

export function markRead(channelId: string, userId: string, msgId: string): void {
  const all = readMessages().map((m) => {
    if (m.id !== msgId) return m
    if (m.readBy.includes(userId)) return m
    return { ...m, readBy: [...m.readBy, userId] }
  })
  writeMessages(all)
  const chans = readChannels().map((c) => (c.id === channelId ? { ...c, unread: 0 } : c))
  writeChannels(chans)
}

export function setTyping(channelId: string, userId: string, on: boolean): void {
  try {
    const raw = localStorage.getItem(TYPING_KEY)
    const map: Record<string, Record<string, boolean>> = raw ? (JSON.parse(raw) as Record<string, Record<string, boolean>>) : {}
    if (!map[channelId]) map[channelId] = {}
    if (on) map[channelId][userId] = true
    else delete map[channelId][userId]
    localStorage.setItem(TYPING_KEY, JSON.stringify(map))
  } catch {
    // ignore
  }
}

export function getTyping(channelId: string): string[] {
  try {
    const raw = localStorage.getItem(TYPING_KEY)
    if (!raw) return []
    const map = JSON.parse(raw) as Record<string, Record<string, boolean>>
    const inner = map[channelId] ?? {}
    return Object.keys(inner).filter((k) => inner[k])
  } catch {
    return []
  }
}
