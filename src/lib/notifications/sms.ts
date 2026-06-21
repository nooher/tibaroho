// sms.ts — Africa's Talking SMS adapter stub.

export interface ATConfig {
  apiKey: string
  username: string
  senderId?: string
  baseUrl?: string
}

export type AT_CONFIG = ATConfig

export async function sendSms(phone: string, body: string): Promise<{ ok: boolean; reason?: string }> {
  void phone
  void body
  return { ok: false, reason: 'SMS gateway haijaunganishwa bado — itahitaji Africa\'s Talking API key.' }
}
