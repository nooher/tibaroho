// crossProducts.ts — Laetoli cross-product targets for referrals & SSO bridges.
export const CROSS_PRODUCTS = ['TibaFigo', 'TibaAfya', 'TibaMama', 'THOS'] as const
export type CrossProduct = (typeof CROSS_PRODUCTS)[number]
