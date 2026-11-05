/** Search input */
import { Search as SearchIcon } from 'lucide-react'
import { cn } from '../../utils/helpers'

export default function Search({
  value,
  onChange,
  placeholder = 'Type or search...',
  className,
}) {
  return (
    <div className={cn('relative', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
      <input
        type="search"
        aria-label="Search cases"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-xl border border-border bg-white pl-10 pr-3 text-sm text-ink placeholder:text-muted/70 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
      />
    </div>
  )
}
