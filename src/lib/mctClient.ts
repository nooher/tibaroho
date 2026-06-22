/**
 * Medical Council of Tanganyika (MCT) license verification adapter.
 *
 * Honesty: MCT does NOT publish an open verification API as of the most
 * recent check. Verification today is a manual lookup against the public
 * registry (mct.go.tz). This module provides a single seam for that step
 * so when an MCT MoU lands and they expose an endpoint, only this file
 * changes — every caller (Ndani admin inbox, /sajili-kama-mtaalam) keeps
 * working unchanged.
 *
 * Until the MoU lands, callers receive a structured `pending` verdict
 * with a deep-link to the MCT public registry for the admin to inspect
 * manually. The admin then approves / rejects in Ndani as before.
 */

export interface MctLicenseVerdict {
  status: 'verified' | 'rejected' | 'expired' | 'pending' | 'unknown'
  /** The canonical reference returned by MCT, if any. */
  reference?: string
  /** Practitioner display name as held in the registry. */
  registryName?: string
  /** ISO date the licence expires, if available. */
  expiresAt?: string
  /** Public registry URL the admin can open to verify manually. */
  inspectUrl?: string
  /** Verbatim message to surface to the admin. */
  message: string
  /** Path the caller should take next. */
  nextAction:
    | 'admin-approve'        // adapter says everything looks good
    | 'admin-reject'         // adapter says explicitly invalid
    | 'manual-inspect'       // admin must visit inspectUrl
    | 'retry-later'          // transient error from upstream
}

interface MctLookupInput {
  licenseNumber: string
  displayName?: string
  authority?: string         // e.g. 'MCT' | 'TCDA' | 'BAKWATA' | 'NACTE' | 'TANGO'
}

const MCT_PUBLIC_REGISTRY = 'https://mct.go.tz/registry/'

function buildInspectUrl(licenseNumber: string): string {
  return `${MCT_PUBLIC_REGISTRY}?q=${encodeURIComponent(licenseNumber)}`
}

/**
 * Hit whatever upstream endpoint is configured. With no endpoint set, we
 * fall back to a `pending` verdict that guides the admin to verify manually.
 */
export async function verifyMctLicense(input: MctLookupInput): Promise<MctLicenseVerdict> {
  const upstream = (import.meta.env.VITE_MCT_API_URL as string | undefined)?.trim()
  const token    = (import.meta.env.VITE_MCT_API_TOKEN as string | undefined)?.trim()
  const number   = input.licenseNumber.trim()
  const authority = (input.authority ?? 'MCT').toUpperCase()

  if (!number) {
    return {
      status: 'unknown',
      message: 'Tafadhali ingiza namba ya leseni.',
      nextAction: 'manual-inspect',
      inspectUrl: MCT_PUBLIC_REGISTRY,
    }
  }

  // Only MCT clinician licences have a known canonical authority that this
  // adapter can fetch from. Lay-counsellor / faith / school / NGO references
  // always go through manual inspection.
  if (authority !== 'MCT') {
    return {
      status: 'pending',
      reference: number,
      message: `Mamlaka ya ${authority} haina API ya umma. Mtaalam wa Ndani anatakiwa kuhakiki.`,
      nextAction: 'manual-inspect',
      inspectUrl: buildInspectUrl(number),
    }
  }

  // No upstream configured — return pending with a manual inspect URL.
  if (!upstream || !token) {
    return {
      status: 'pending',
      reference: number,
      message: 'MCT API haijaunganishwa bado (MoU inasubiriwa). Hakiki kwa registry ya umma.',
      nextAction: 'manual-inspect',
      inspectUrl: buildInspectUrl(number),
    }
  }

  try {
    const res = await fetch(`${upstream.replace(/\/$/, '')}/licences/${encodeURIComponent(number)}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
    if (res.status === 404) {
      return {
        status: 'rejected',
        reference: number,
        message: 'Namba ya leseni haipo MCT registry.',
        nextAction: 'admin-reject',
        inspectUrl: buildInspectUrl(number),
      }
    }
    if (!res.ok) {
      return {
        status: 'unknown',
        reference: number,
        message: `MCT API imeshindwa (HTTP ${res.status}). Jaribu tena baadaye.`,
        nextAction: 'retry-later',
        inspectUrl: buildInspectUrl(number),
      }
    }
    const data: {
      status?: string
      practitioner_name?: string
      expires_at?: string
    } = await res.json()
    const expired = data.expires_at && new Date(data.expires_at).getTime() < Date.now()
    if (expired) {
      return {
        status: 'expired',
        reference: number,
        registryName: data.practitioner_name,
        expiresAt: data.expires_at,
        message: 'Leseni hii imekwisha muda wake.',
        nextAction: 'admin-reject',
        inspectUrl: buildInspectUrl(number),
      }
    }
    if (data.status === 'active') {
      return {
        status: 'verified',
        reference: number,
        registryName: data.practitioner_name,
        expiresAt: data.expires_at,
        message: 'Leseni ni hai kwenye MCT registry.',
        nextAction: 'admin-approve',
        inspectUrl: buildInspectUrl(number),
      }
    }
    return {
      status: 'unknown',
      reference: number,
      registryName: data.practitioner_name,
      message: `Hali isiyojulikana kutoka MCT: ${data.status ?? '—'}`,
      nextAction: 'manual-inspect',
      inspectUrl: buildInspectUrl(number),
    }
  } catch (e) {
    return {
      status: 'unknown',
      reference: number,
      message: `Hitilafu ya mtandao: ${e instanceof Error ? e.message : String(e)}`,
      nextAction: 'retry-later',
      inspectUrl: buildInspectUrl(number),
    }
  }
}
