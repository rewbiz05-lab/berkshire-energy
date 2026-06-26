'use client'

import { useEffect, useState } from 'react'
import { IconArrow } from './icons'

/**
 * Floating "Get my free quote" button. Slides in once the visitor scrolls
 * past the hero and follows them down the page — then gets out of the way
 * when the quote form itself comes into view.
 */
export function FloatingQuoteCTA() {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const quote = document.getElementById('quote')
      const formInView = quote
        ? quote.getBoundingClientRect().top < window.innerHeight * 0.85
        : false
      setShow(window.scrollY > 560 && !formInView)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  return (
    <a
      href="#quote"
      aria-label="Get my free quote"
      className="btn btn-solar fixed bottom-5 left-4 z-40 shadow-2xl sm:bottom-6 sm:left-6"
      style={{
        opacity: show ? 1 : 0,
        transform: show ? 'translateY(0)' : 'translateY(20px)',
        pointerEvents: show ? 'auto' : 'none',
        transition:
          'opacity .45s cubic-bezier(0.22,1,0.36,1), transform .45s cubic-bezier(0.22,1,0.36,1)',
      }}
    >
      Get my free quote
      <IconArrow className="h-[18px] w-[18px]" />
    </a>
  )
}
