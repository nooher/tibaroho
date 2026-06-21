import type { WatchAdapter, WatchSample } from './index'
import { isConnected, setConnected } from './index'

export const googleFitAdapter: WatchAdapter = {
  id: 'google_fit',
  label_sw: 'Google Fit',
  label_en: 'Google Fit',
  scopes: ['hr', 'sleep', 'steps', 'activity', 'calories'],
  async connect() {
    return {
      ok: false,
      reason: 'Google Fit haijaunganishwa bado — inahitaji idhini ya OAuth ya Google.',
    }
  },
  disconnect() {
    setConnected('google_fit', false)
  },
  status() {
    return isConnected('google_fit') ? 'connected' : 'disconnected'
  },
  async pull(): Promise<WatchSample[]> {
    return []
  },
}
