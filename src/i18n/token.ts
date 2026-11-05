// A copy token: a marker string standing for a dotted path into COPY[lang],
// resolved at render by useI18nProps (i18n/resolve.ts). Kept dependency-free so
// config/pages.ts can build blocks with tokens without importing COPY back.

export const COPY_MARK = '§' // §

/** A token for COPY[lang] at `path`, e.g. t('home.hero.title'). */
export function t(path: string): string {
  return COPY_MARK + path
}

/** Tokens for every key of a copy object, e.g. tk('home.invite', COPY.en.home.invite). */
export function tk(base: string, shape: object): Record<string, string> {
  return Object.fromEntries(Object.keys(shape).map((k) => [k, t(`${base}.${k}`)]))
}
