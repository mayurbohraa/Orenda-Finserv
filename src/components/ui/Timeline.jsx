/** Activity timeline */
import { CalendarDays, Check } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function Timeline({ items = [], className }) {
  const grouped = items.reduce((acc, item) => {
    const key = item.dateGroup || 'Today'
    if (!acc[key]) acc[key] = []
    acc[key].push(item)
    return acc
  }, {})

  return (
    <div className={cn('space-y-6', className)}>
      {Object.entries(grouped).map(([group, groupItems]) => (
        <div key={group}>
          <div className="relative mb-5 flex items-center gap-2.5">
            {/* Timeline line to first event */}
            {groupItems.length > 0 ? (
              <span
                aria-hidden
                className="absolute left-[9px] top-5 h-[calc(100%+12px)] w-px bg-[#D1DEE8]"
              />
            ) : null}
            <span className="relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center bg-white">
              <CalendarDays className="h-4 w-4 text-[#8a9aab]" strokeWidth={1.75} />
            </span>
            <span className="rounded-full border border-[#D1DEE8] bg-white px-2.5 py-0.5 text-xs font-medium text-[#4a5d70]">
              {group}
            </span>
          </div>

          <ul className="space-y-6">
            {groupItems.map((item, index) => {
              const hasNext = index < groupItems.length - 1
              return (
                <li key={item.id} className="relative flex gap-3">
                  {/* Line to next event */}
                  {hasNext ? (
                    <span
                      aria-hidden
                      className="absolute left-[9px] top-5 h-[calc(100%+24px)] w-px bg-[#D1DEE8]"
                    />
                  ) : null}
                  <span className="relative z-10 flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full bg-[#22C55E] text-white">
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </span>
                  <div className="min-w-0 flex-1 pt-px">
                    <p className="text-sm font-semibold leading-snug text-[#1a2b3c]">
                      {item.title}
                    </p>
                    <p className="mt-1.5 flex items-center gap-1.5 text-xs text-[#6b7c8f]">
                      <span>By</span>
                      <span
                        aria-hidden
                        className="inline-block h-3.5 w-3.5 shrink-0 rounded-full bg-[#8B6B4A]"
                      />
                      <span className="font-medium text-[#1a2b3c]">{item.by}</span>
                    </p>
                    <p className="mt-1 text-xs text-[#8a9aab]">{item.timestamp}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
      ))}
    </div>
  )
}
