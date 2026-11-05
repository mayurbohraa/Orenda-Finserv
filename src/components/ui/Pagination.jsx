/** Pagination */
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '../../utils/helpers'

/** Build visible page numbers with ellipsis */
function buildPages(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  const set = new Set(
    [1, 2, 3, totalPages - 1, totalPages, page - 1, page, page + 1].filter(
      (p) => p >= 1 && p <= totalPages,
    ),
  )
  const sorted = [...set].sort((a, b) => a - b)
  const out = []
  sorted.forEach((p, idx) => {
    if (idx > 0 && p - sorted[idx - 1] > 1) out.push('…')
    out.push(p)
  })
  return out
}

export default function Pagination({ page, totalPages, onChange, className }) {
  if (totalPages <= 1) return null

  const pages = buildPages(page, totalPages)

  return (
    <nav
      className={cn(
        'flex shrink-0 flex-wrap items-center justify-center gap-1.5 pt-4',
        className,
      )}
      aria-label="Pagination"
    >
      <button
        type="button"
        disabled={page === 1}
        onClick={() => onChange(page - 1)}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#154F7A] disabled:cursor-default disabled:text-[#a8b4c2]"
      >
        <ChevronLeft className="h-4 w-4" />
        Previous
      </button>

      {pages.map((p, idx) =>
        p === '…' ? (
          <span key={`e-${idx}`} className="px-1.5 text-sm text-[#154F7A]">
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onChange(p)}
            aria-current={p === page ? 'page' : undefined}
            className={cn(
              'flex h-8 min-w-8 items-center justify-center rounded-lg px-2.5 text-sm font-medium transition-colors',
              p === page
                ? 'bg-[#154F7A] text-white'
                : 'text-[#154F7A] hover:bg-[#154F7A]/10',
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        disabled={page === totalPages}
        onClick={() => onChange(page + 1)}
        className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-sm font-medium text-[#154F7A] disabled:cursor-default disabled:text-[#a8b4c2]"
      >
        Next
        <ChevronRight className="h-4 w-4" />
      </button>
    </nav>
  )
}
