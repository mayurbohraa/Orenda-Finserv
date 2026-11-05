/** Toast notification */
import { useEffect } from 'react'
import { Check, Info, X } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../../contexts/useApp'

export default function Toast() {
  const { toast, dismissToast } = useApp()

  useEffect(() => {
    if (!toast) return undefined
    const timer = setTimeout(() => dismissToast(), 4000)
    return () => clearTimeout(timer)
  }, [toast, dismissToast])

  if (!toast) return null
  const Icon = toast.type === 'info' ? Info : Check

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed bottom-4 right-4 z-[60] w-[calc(100%-2rem)] max-w-[440px] animate-toast-in"
    >
      <div className="pointer-events-auto flex items-center gap-3 rounded-lg border border-[#9ad4b3] bg-[#e8f8ef] px-4 py-3 shadow-md">
        <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#22a45c]">
          <Icon className="h-3 w-3 text-white" strokeWidth={3} />
        </span>
        <p className="flex-1 text-sm font-medium text-[#1a7a45]">
          {toast.message}
        </p>
        {toast.caseId ? (
          <Link
            to={`/cases/${toast.caseId}`}
            onClick={dismissToast}
            className="shrink-0 text-sm font-semibold text-[#1a7a45] hover:underline"
          >
            {toast.actionLabel || 'View Case'}
          </Link>
        ) : null}
        <button
          type="button"
          onClick={dismissToast}
          className="shrink-0 rounded p-0.5 text-[#1a7a45] hover:bg-[#d4f0e0]"
          aria-label="Dismiss"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  )
}
