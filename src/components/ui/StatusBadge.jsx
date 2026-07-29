/** Case status badge */
import {
  CheckCircle2,
  FileCheck2,
  FileText,
  History,
} from 'lucide-react'
import { cn, getStatusMeta } from '../../utils/helpers'

const icons = {
  clock: History,
  file: FileCheck2,
  'file-pen': FileText,
  'check-circle': CheckCircle2,
}

export default function StatusBadge({ status }) {
  const meta = getStatusMeta(status)
  const Icon = icons[meta.icon] || History

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium whitespace-nowrap',
        meta.className,
      )}
    >
      <Icon className="h-3.5 w-3.5" strokeWidth={2} />
      {meta.label}
    </span>
  )
}
