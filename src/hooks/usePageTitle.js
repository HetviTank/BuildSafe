import { useEffect } from 'react'
import { company } from '../data/company'

/** Sets the browser tab title for the current page. */
export default function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${company.name}` : `${company.name} | Fire, Safety & Civil Consultancy`
  }, [title])
}
