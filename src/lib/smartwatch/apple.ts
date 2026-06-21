import type { WatchAdapter, WatchSample } from './index'
import { isConnected, setConnected } from './index'

export const appleHealthAdapter: WatchAdapter = {
  id: 'apple_health',
  label_sw: 'Apple Health',
  label_en: 'Apple Health',
  scopes: ['hr', 'hrv', 'sleep', 'steps', 'spo2', 'skin_temp', 'menstrual', 'activity', 'calories'],
  async connect() {
    return {
      ok: false,
      reason: 'Apple HealthKit haijaunganishwa bado — inahitaji uthibitisho wa OAuth na programu ya iOS.',
    }
  },
  disconnect() {
    setConnected('apple_health', false)
  },
  status() {
    return isConnected('apple_health') ? 'connected' : 'disconnected'
  },
  async pull(): Promise<WatchSample[]> {
    return []
  },
}
