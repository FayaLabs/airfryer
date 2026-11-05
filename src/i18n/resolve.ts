import { useMemo } from 'react'
import { useLang, type Lang } from '.'
import { COPY_MARK } from './token'
import { COPY } from '../config/pages'

// Page copy is one set of blocks, rendered in whichever language the visitor
// chose. So block props don't carry baked strings — they carry tokens (see
// i18n/token.ts), and each block resolves them to the current language at
// render. A token standing alone as a value becomes COPY[lang].<path> (a string,
// or an array like `paragraphs`). Non-token values (hrefs, images, flags) pass
// through untouched.

function getPath(obj: unknown, path: string): unknown {
  return path.split('.').reduce<unknown>((acc, key) => (acc == null ? acc : (acc as Record<string, unknown>)[key]), obj)
}

function resolve(value: unknown, lang: Lang): unknown {
  if (typeof value === 'string') {
    return value.startsWith(COPY_MARK) ? getPath(COPY[lang], value.slice(1)) : value
  }
  if (Array.isArray(value)) return value.map((v) => resolve(v, lang))
  if (value && typeof value === 'object') {
    const out: Record<string, unknown> = {}
    for (const key of Object.keys(value)) out[key] = resolve((value as Record<string, unknown>)[key], lang)
    return out
  }
  return value
}

/** Resolve a block's copy tokens to the current language. */
export function useI18nProps<T>(props: T): T {
  const lang = useLang()
  return useMemo(() => resolve(props, lang) as T, [props, lang])
}
