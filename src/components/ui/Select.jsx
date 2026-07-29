/** Select dropdown (portaled menu) */
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/helpers'
import ScrollInset from './ScrollInset'

export default function Select({
  label,
  options = [],
  value,
  onChange,
  placeholder = 'Select',
  valuePrefix = '',
  /** Show selected value in brand blue */
  accentValue = false,
  className,
  triggerClassName,
  disabled,
  error,
}) {
  const [open, setOpen] = useState(false)
  const [menuStyle, setMenuStyle] = useState(null)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)
  const listId = useId()

  const updatePosition = () => {
    const trigger = triggerRef.current
    if (!trigger) return

    const rect = trigger.getBoundingClientRect()
    const gap = 4
    const maxHeight = 224 // max-h-56
    const spaceBelow = window.innerHeight - rect.bottom - gap
    const spaceAbove = rect.top - gap
    const openUp = spaceBelow < Math.min(maxHeight, 160) && spaceAbove > spaceBelow
    const height = Math.min(maxHeight, openUp ? spaceAbove : spaceBelow)

    setMenuStyle({
      position: 'fixed',
      left: rect.left,
      width: rect.width,
      top: openUp ? undefined : rect.bottom + gap,
      bottom: openUp ? window.innerHeight - rect.top + gap : undefined,
      maxHeight: Math.max(120, height),
      zIndex: 80,
    })
  }

  useLayoutEffect(() => {
    if (!open) {
      setMenuStyle(null)
      return
    }
    updatePosition()
  }, [open])

  useEffect(() => {
    if (!open) return

    const onDoc = (e) => {
      const inTrigger = rootRef.current?.contains(e.target)
      const inMenu = menuRef.current?.contains(e.target)
      if (!inTrigger && !inMenu) setOpen(false)
    }
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    const onReposition = () => updatePosition()

    document.addEventListener('mousedown', onDoc)
    document.addEventListener('keydown', onKey)
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)

    return () => {
      document.removeEventListener('mousedown', onDoc)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
  }, [open])

  const selected = options.find((o) => o.label === value || o.id === value)
  const display = selected?.label || value || ''

  return (
    <div className={cn('relative flex flex-col gap-1.5', className)} ref={rootRef}>
      {label ? (
        <span className="text-[13px] font-medium text-[#154F7A]">{label}</span>
      ) : null}
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => !disabled && setOpen((v) => !v)}
        className={cn(
          'flex h-11 w-full cursor-pointer items-center justify-between rounded-xl border border-border bg-white px-3 text-left text-sm transition-shadow',
          'focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20',
          !display && 'text-muted/70',
          display && 'text-ink',
          disabled && 'cursor-not-allowed opacity-60',
          open && 'border-brand-500 ring-2 ring-brand-500/20',
          error && 'border-red-400',
          triggerClassName,
        )}
      >
        <span className="truncate">
          {display ? (
            <>
              {valuePrefix ? (
                <span className="text-ink">{valuePrefix}</span>
              ) : null}
              <span
                className={
                  accentValue ? 'font-medium text-[#2b7de9]' : undefined
                }
              >
                {display}
              </span>
            </>
          ) : (
            placeholder
          )}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 shrink-0 text-brand-700 transition-transform',
            open && 'rotate-180',
          )}
        />
      </button>

      {open && menuStyle
        ? createPortal(
            <div
              ref={menuRef}
              style={{
                position: menuStyle.position,
                left: menuStyle.left,
                width: menuStyle.width,
                top: menuStyle.top,
                bottom: menuStyle.bottom,
                zIndex: menuStyle.zIndex,
              }}
              className="overflow-hidden rounded-xl border border-border bg-white shadow-lg animate-slide-up"
            >
              <ScrollInset
                id={listId}
                role="listbox"
                style={{ maxHeight: menuStyle.maxHeight }}
                className="py-1"
              >
                {options.map((opt) => {
                  const isSelected = opt.label === value || opt.id === value
                  return (
                    <button
                      key={opt.id || opt.label}
                      type="button"
                      role="option"
                      aria-selected={isSelected}
                      className={cn(
                        'flex w-full cursor-pointer items-center gap-2 px-3 py-2.5 text-left text-sm text-ink hover:bg-brand-50',
                        isSelected && 'bg-brand-50 text-brand-800',
                      )}
                      onClick={() => {
                        onChange?.(opt.label)
                        setOpen(false)
                      }}
                    >
                      <span className="flex h-4 w-4 items-center justify-center">
                        {isSelected ? (
                          <Check className="h-3.5 w-3.5 text-brand-600" />
                        ) : null}
                      </span>
                      {opt.label}
                    </button>
                  )
                })}
              </ScrollInset>
            </div>,
            document.body,
          )
        : null}
      {error ? <p className="text-xs text-red-500">{error}</p> : null}
    </div>
  )
}
