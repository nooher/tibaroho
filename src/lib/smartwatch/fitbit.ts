import type { WatchAdapter, WatchSample } from './index'
import { isConnected, setConnected } from './index'

export const fitbitAdapter: WatchAdapter = {
  id: 'fitbit',
  label_sw: 'Fitbit',
  label_en: 'Fitbit',
  scopes: ['hr', 'hrv', 'sleep', 'steps', 'spo2', 'skin_temp', 'activity', 'calories'],
  async connect() {
    return {
      ok: false,
      reason: 'Fitbit haijaunganishwa bado — inahitaji uthibitisho wa OAuth wa Fitbit Web API.',
    }
  },
  disconnect() {
    setConnected('fitbit', false)
  },
  status() {
    return isConnected('fitbit') ? 'connected' : 'disconnected'
  },
  async pull(): Promise<WatchSample[]> {
    return []
  },
}
