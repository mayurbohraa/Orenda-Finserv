/** Modal dialog */
import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { cn } from '../../utils/helpers'
import ScrollInset from './ScrollInset'

export default function Modal({
  open,
  onClose,
  title,
  children,
  footer,
  className,
  width = 'max-w-2xl',
}) {
  const overlayRef = useRef(null)
  const dialogRef = useRef(null)
  const closeRef = useRef(onClose)
  closeRef.current = onClose
  useEffect(() => {
    if (!open) return undefined
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const siblings = [...document.body.children]
      .filter((element) => element !== overlayRef.current)
      .map((element) => [element, element.inert])
    siblings.forEach(([element]) => {
      element.inert = true
    })
    const focusable = () =>
      [
        ...overlayRef.current.querySelectorAll(
          'button:not(:disabled):not([tabindex="-1"]), input:not(:disabled), a[href], [tabindex="0"]',
        ),
      ].filter((element) => element.getClientRects().length > 0)
    const firstInput = dialogRef.current.querySelector('input:not([readonly])')
    ;(firstInput || dialogRef.current).focus()
    const onKey = (e) => {
      if (e.defaultPrevented) return
      if (e.key === 'Escape') closeRef.current?.()
      if (e.key !== 'Tab') return
      const elements = focusable()
      const first = elements[0]
      const last = elements.at(-1)
      if (!first) {
        e.preventDefault()
        dialogRef.current.focus()
      } else if (
        e.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === dialogRef.current)
      ) {
        e.preventDefault()
        last.focus()
      } else if (
        !e.shiftKey &&
        (document.activeElement === last ||
          document.activeElement === dialogRef.current)
      ) {
        e.preventDefault()
        first.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = previousOverflow
      siblings.forEach(([element, inert]) => {
        element.inert = inert
      })
      if (previousFocus?.isConnected) previousFocus.focus()
    }
  }, [open])

  if (!open) return null

  return createPortal(
    <div
      ref={overlayRef}
      data-modal-root
      className="fixed inset-0 z-50 flex items-center justify-center p-3 animate-fade-in sm:p-4"
    >
      <button
        type="button"
        aria-label="Close overlay"
        tabIndex={-1}
        className="absolute inset-0 bg-[#0a3554]/45 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 flex max-h-[min(90svh,880px)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up',
          width,
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-border px-4 py-4 sm:px-6">
          <h2 className="min-w-0 break-words text-lg font-semibold text-[#154F7A]">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-[#154F7A] hover:bg-brand-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ScrollInset className="min-h-0 flex-1 px-4 py-5 sm:px-6">
          {children}
        </ScrollInset>
        {footer ? (
          <div className="flex shrink-0 flex-wrap items-center justify-end gap-3 border-t border-border px-4 py-4 sm:px-6">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  )
}
