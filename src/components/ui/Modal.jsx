/** Modal dialog */
import { useEffect } from 'react'
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
  useEffect(() => {
    if (!open) return undefined
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
      <button
        type="button"
        aria-label="Close overlay"
        className="absolute inset-0 bg-[#0a3554]/45 backdrop-blur-[1px]"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'relative z-10 flex max-h-[min(90svh,880px)] w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl animate-slide-up',
          width,
          className,
        )}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-[#154F7A]">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-[#154F7A] hover:bg-brand-50"
            aria-label="Close"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <ScrollInset className="min-h-0 flex-1 px-6 py-5">
          {children}
        </ScrollInset>
        {footer ? (
          <div className="flex shrink-0 items-center justify-end gap-3 border-t border-border px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>
  )
}
