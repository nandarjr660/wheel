'use client'

import { useState, useRef, useEffect } from 'react'
import { Check, Copy, Share2 } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

function useClickOutside(ref: React.RefObject<HTMLElement | null>, handler: () => void) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) handler()
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [ref, handler])
}

function shareWA() {
  window.open(`https://wa.me/?text=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener')
}

function shareFB() {
  window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`, '_blank', 'noopener')
}

async function handleCopy() {
  await navigator.clipboard.writeText(window.location.href)
}

export default function SocialButton() {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useClickOutside(ref, () => setIsOpen(false))

  const onCopy = async () => {
    await handleCopy()
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div ref={ref} className="fixed bottom-4 right-4 z-40 flex flex-col items-center">
      <div className="relative flex flex-col items-center">
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="flex flex-col items-center gap-1.5 pb-2"
              initial={{ opacity: 0, y: 24, scale: 0.5 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 24, scale: 0.5 }}
              transition={{ type: 'spring', stiffness: 400, damping: 22 }}
            >
              <button
                className="btn-social-copy flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer bg-[#25D366]/20 border-[#25D366]/40 text-[#25D366] hover:bg-[#25D366]/35"
                onClick={(e) => { e.stopPropagation(); shareWA() }}
                type="button"
                title="Bagikan ke WhatsApp"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
              </button>

              <button
                className="btn-social-copy flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer bg-[#1877F2]/20 border-[#1877F2]/40 text-[#1877F2] hover:bg-[#1877F2]/35"
                onClick={(e) => { e.stopPropagation(); shareFB() }}
                type="button"
                title="Bagikan ke Facebook"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </button>

              <button
                className={`btn-social-copy flex h-10 w-10 items-center justify-center rounded-full border transition-colors cursor-pointer ${
                  copied
                    ? 'border-brand-green/50 bg-brand-green/20 text-brand-green'
                    : 'border-white/20 bg-white/15 text-slate-300 hover:bg-white/25 hover:text-white'
                }`}
                onClick={(e) => { e.stopPropagation(); onCopy() }}
                type="button"
                title="Salin tautan"
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <button
          className="btn-social-main flex h-11 w-11 items-center justify-center rounded-full border text-white transition-all duration-200 cursor-pointer backdrop-blur-xl"
          onClick={() => setIsOpen((prev) => !prev)}
          type="button"
          title="Bagikan"
          aria-label="Bagikan aplikasi"
        >
          <Share2 className="h-5 w-5" />
        </button>
      </div>
    </div>
  )
}
