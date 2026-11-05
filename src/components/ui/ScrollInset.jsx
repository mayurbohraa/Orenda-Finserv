/** Custom scroll area — navy thumb shows while scrolling */
import { useCallback, useEffect, useRef, useState } from 'react'
import { cn } from '../../utils/helpers'

const OUTER_RE =
  /^(flex-1|flex-auto|flex-none|w-full|h-full|min-h-0|self-\S+|mt-\S+|mb-\S+|ml-\S+|mr-\S+|max-h-\S+|min-h-\S+|h-\S+|rounded\S*|border\S*|bg-\S+)$/

const OUTER_RESPONSIVE_RE =
  /^(sm|md|lg|xl):(flex-1|w-full|h-full|min-h-0|max-h-\S+|min-h-\S+|h-\S+|mt-\S+|mb-\S+|rounded\S*|border\S*|bg-\S+)$/

/** Split layout classes (outer) from content classes (inner) */
function splitClasses(className = '') {
  const outer = []
  const inner = []

  for (const token of className.split(/\s+/).filter(Boolean)) {
    if (/^(scroll-inset|overflow\S*|overscroll\S*)$/.test(token)) continue
    if (OUTER_RE.test(token) || OUTER_RESPONSIVE_RE.test(token)) {
      outer.push(token)
      // Also apply max-height on the scroll viewport
      if (/(^|:)max-h-/.test(token)) inner.push(token)
      continue
    }
    inner.push(token)
  }

  return { outer: outer.join(' '), inner: inner.join(' ') }
}

export default function ScrollInset({
  as: Comp = 'div',
  className,
  children,
  style,
  viewportProps,
  ...props
}) {
  const viewportRef = useRef(null)
  const trackRef = useRef(null)
  const hideTimer = useRef(null)
  const [scrolling, setScrolling] = useState(false)
  const [thumb, setThumb] = useState({ visible: false, top: 0, height: 0 })

  const { outer, inner } = splitClasses(className)
  const maxHeight = style?.maxHeight
  const constrained = Boolean(maxHeight) || /\bmax-h-/.test(inner)

  const updateThumb = useCallback(() => {
    const el = viewportRef.current
    const track = trackRef.current
    if (!el) return

    const { scrollTop, scrollHeight, clientHeight } = el
    const overflow = scrollHeight - clientHeight
    const trackH = track?.clientHeight || clientHeight

    if (overflow <= 1 || trackH <= 0) {
      setThumb({ visible: false, top: 0, height: 0 })
      return
    }

    const height = Math.max(20, (clientHeight / scrollHeight) * trackH)
    const maxTop = Math.max(0, trackH - height)
    const top = maxTop === 0 ? 0 : (scrollTop / overflow) * maxTop

    setThumb({ visible: true, top, height })
  }, [])

  const markScrolling = useCallback(() => {
    updateThumb()
    setScrolling(true)
    clearTimeout(hideTimer.current)
    hideTimer.current = setTimeout(() => setScrolling(false), 1000)
  }, [updateThumb])

  useEffect(() => {
    const el = viewportRef.current
    if (!el) return

    updateThumb()

    const onScroll = () => markScrolling()
    const onWheel = () => markScrolling()
    const onTouchMove = () => markScrolling()

    el.addEventListener('scroll', onScroll, { passive: true })
    el.addEventListener('wheel', onWheel, { passive: true })
    el.addEventListener('touchmove', onTouchMove, { passive: true })

    const ro = new ResizeObserver(updateThumb)
    ro.observe(el)
    if (trackRef.current) ro.observe(trackRef.current)
    if (el.firstElementChild) ro.observe(el.firstElementChild)

    return () => {
      el.removeEventListener('scroll', onScroll)
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('touchmove', onTouchMove)
      ro.disconnect()
      clearTimeout(hideTimer.current)
    }
  }, [updateThumb, markScrolling, children])

  const showThumb = thumb.visible && scrolling

  return (
    <Comp
      {...props}
      style={style}
      className={cn('relative min-h-0 overflow-hidden', outer)}
    >
      <div
        {...viewportProps}
        ref={viewportRef}
        className={cn(
          'scrollbar-none overflow-auto overscroll-contain',
          constrained ? null : 'h-full max-h-full',
          inner,
        )}
        style={maxHeight ? { maxHeight } : undefined}
      >
        {children}
      </div>

      <div
        ref={trackRef}
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-[2px] z-20 w-[5px]"
      >
        {thumb.visible ? (
          <div
            className={cn(
              'absolute left-0 right-0 rounded-full bg-[#154F7A] transition-opacity duration-200',
              showThumb ? 'opacity-100' : 'opacity-0',
            )}
            style={{ height: thumb.height, top: thumb.top }}
          />
        ) : null}
      </div>
    </Comp>
  )
}
