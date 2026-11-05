export default function LocationFeedback({ loading, error, onRetry }) {
  return (
    <div className="mt-2 text-xs text-muted" role="status" aria-live="polite">
      {loading ? 'Looking up city and state…' : null}
      {error ? (
        <span className="text-red-600">
          {error}{' '}
          <button
            type="button"
            onClick={onRetry}
            className="font-semibold underline"
          >
            Retry lookup
          </button>
        </span>
      ) : null}
    </div>
  )
}
