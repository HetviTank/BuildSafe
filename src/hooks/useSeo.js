import { useEffect } from 'react'
import { getPageMeta } from '../seo/meta'
import { applyHead } from '../seo/head'

/** Keeps the <head> (title, description, canonical, social tags, JSON-LD) in sync with the URL. */
export default function useSeo(pathname) {
  useEffect(() => {
    applyHead(getPageMeta(pathname))
  }, [pathname])
}
