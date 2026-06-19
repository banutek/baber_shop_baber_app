import type React from 'react'
import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'

export interface IConfirmTooltipProps {
  message?: string
  confirmLabel?: string
  cancelLabel?: string
  children: React.ReactNode
  onConfirm: () => void
  disabled?: boolean
  className?: string
}

export const ConfirmTooltip: React.FC<IConfirmTooltipProps> = ({
  message = 'Êtes-vous sûr de vouloir effectuer cette action ?',
  confirmLabel = 'Oui',
  cancelLabel = 'Non',
  children,
  onConfirm,
  disabled = false,
  className = '',
}) => {
  const [showConfirm, setShowConfirm] = useState(false)
  const [position, setPosition] = useState({ top: 0, left: 0 })
  const [arrowOnTop, setArrowOnTop] = useState(false)
  const [arrowLeft, setArrowLeft] = useState(0)
  const triggerRef = useRef<HTMLDivElement>(null)
  const popupRef = useRef<HTMLDivElement>(null)

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !popupRef.current) return
    const tr = triggerRef.current.getBoundingClientRect()
    const pw = popupRef.current.offsetWidth
    const ph = popupRef.current.offsetHeight
    const gap = 8
    const pad = 8

    // --- Horizontal ---
    const triggerCenterX = tr.left + tr.width / 2
    let popupLeft = triggerCenterX - pw / 2
    popupLeft = Math.max(pad, Math.min(window.innerWidth - pw - pad, popupLeft))

    // Arrow offset from popup left edge, clamped inside popup
    let arrowX = triggerCenterX - popupLeft
    arrowX = Math.max(12, Math.min(pw - 12, arrowX))

    // --- Vertical ---
    const spaceAbove = tr.top - gap
    const spaceBelow = window.innerHeight - tr.bottom - gap

    let popupTop: number
    let arrowTop: boolean

    if (ph <= spaceAbove) {
      // Enough room above
      popupTop = tr.top - ph - gap
      arrowTop = false // arrow at bottom, points down ▼
    } else if (ph <= spaceBelow) {
      // Not enough above, enough below
      popupTop = tr.bottom + gap
      arrowTop = true // arrow at top, points up ▲
    } else {
      // Not enough either way — prefer above, clamped
      popupTop = Math.max(pad, tr.top - ph - gap)
      arrowTop = false
    }

    setPosition({ top: popupTop, left: popupLeft })
    setArrowOnTop(arrowTop)
    setArrowLeft(arrowX)
  }, [])

  useEffect(() => {
    if (!showConfirm) return
    requestAnimationFrame(() => {
      updatePosition()
      // Double measure for browsers that need a reflow
      requestAnimationFrame(updatePosition)
    })

    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (triggerRef.current?.contains(target)) return
      if (popupRef.current?.contains(target)) return
      setShowConfirm(false)
    }
    const handleResizeOrScroll = () => {
      if (showConfirm) updatePosition()
    }

    document.addEventListener('mousedown', handleClickOutside, true)
    window.addEventListener('resize', handleResizeOrScroll)
    window.addEventListener('scroll', handleResizeOrScroll, true)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside, true)
      window.removeEventListener('resize', handleResizeOrScroll)
      window.removeEventListener('scroll', handleResizeOrScroll, true)
    }
  }, [showConfirm, updatePosition])

  const handleMainClick = () => {
    if (disabled) return
    setShowConfirm(true)
  }

  const handleConfirm = () => {
    setShowConfirm(false)
    onConfirm()
  }

  return (
    <div ref={triggerRef} className={`relative ${className}`}>
      <div onClick={handleMainClick} className="w-full">
        {children}
      </div>

      {showConfirm &&
        createPortal(
          <div
            ref={popupRef}
            className="fixed z-[99999] animate-slideUp"
            style={{ top: position.top, left: position.left }}
          >
            <div className="bg-gray-900 text-white rounded-xl px-4 py-3 shadow-2xl min-w-[200px] max-w-[280px] max-sm:max-w-[calc(100vw-16px)]">
              <p className="text-xs leading-relaxed mb-3 text-center text-gray-200">{message}</p>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={() => setShowConfirm(false)}
                  className="px-4 py-1.5 rounded-lg bg-gray-700 text-white text-xs font-semibold hover:bg-gray-600 transition-colors"
                >
                  {cancelLabel}
                </button>
                <button
                  onClick={handleConfirm}
                  className="px-4 py-1.5 rounded-lg bg-amber-600 text-white text-xs font-semibold hover:bg-amber-500 transition-colors"
                >
                  {confirmLabel}
                </button>
              </div>
            </div>
            {/* Flèche — toujours pointée vers le centre du bouton */}
            <div
              className={`absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent ${
                arrowOnTop
                  ? 'bottom-full border-b-[6px] border-b-gray-900'
                  : 'top-full border-t-[6px] border-t-gray-900'
              }`}
              style={{ left: arrowLeft, transform: 'translateX(-50%)' }}
            />
          </div>,
          document.body,
        )}
    </div>
  )
}
