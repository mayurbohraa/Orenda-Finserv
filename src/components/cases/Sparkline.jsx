/** Sparkline chart for KPIs */
export default function Sparkline({
  points = [],
  color = 'green',
  labels = [],
}) {
  const stroke = color === 'green' ? '#16a34a' : '#ef4444'
  const fillId = `fill-${color}-${points.join('-').slice(0, 12)}`

  const width = 100
  const height = 40
  const padX = 2
  const padY = 5

  if (!points.length) return null

  const min = Math.min(...points)
  const max = Math.max(...points)
  const range = max - min || 1

  const coords = points.map((p, i) => {
    const x = padX + (i / (points.length - 1)) * (width - padX * 2)
    const value = Math.max(p, min)
    const y = height - padY - ((value - min) / range) * (height - padY * 2)
    return { x, y }
  })

  const start = coords[0]
  const end = coords[coords.length - 1]
  const baselineY = Math.max(...coords.map((c) => c.y))

  const line = coords
    .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
    .join(' ')

  const area = `${line} L ${end.x.toFixed(2)} ${baselineY.toFixed(2)} L ${start.x.toFixed(2)} ${baselineY.toFixed(2)} Z`

  const startLeft = `${(start.x / width) * 100}%`
  const startTop = `${(start.y / height) * 100}%`
  const endLeft = `${(end.x / width) * 100}%`
  const endTop = `${(end.y / height) * 100}%`

  return (
    <div className="w-full">
      <div className="relative h-[72px] w-full sm:h-[80px]">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="absolute inset-0 block h-full w-full"
          preserveAspectRatio="none"
          aria-hidden
        >
          <defs>
            <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={stroke} stopOpacity="0.28" />
              <stop offset="100%" stopColor={stroke} stopOpacity="0.04" />
            </linearGradient>
          </defs>
          <path d={area} fill={`url(#${fillId})`} />
          {/* Dashed baseline under the trend — full chart width */}
          <line
            x1={padX}
            x2={width - padX}
            y1={baselineY}
            y2={baselineY}
            stroke="#94a3b8"
            strokeWidth="1.25"
            strokeDasharray="3.5 2.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d={line}
            fill="none"
            stroke={stroke}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            vectorEffect="non-scaling-stroke"
          />
        </svg>

        {/* Hollow start / solid end */}
        <span
          className="pointer-events-none absolute h-3 w-3 rounded-full border-[2.5px] bg-white"
          style={{
            left: startLeft,
            top: startTop,
            borderColor: stroke,
            transform: 'translate(-50%, -50%)',
          }}
        />
        <span
          className="pointer-events-none absolute h-3 w-3 rounded-full border-[2.5px]"
          style={{
            left: endLeft,
            top: endTop,
            borderColor: stroke,
            backgroundColor: stroke,
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>

      {labels.length ? (
        <div className="mt-1.5 flex w-full justify-between">
          {labels.map((label) => (
            <div key={`${label.value}-${label.caption}`} className="leading-tight">
              <p className="text-sm font-semibold text-ink">{label.value}</p>
              <p className="text-xs text-muted">{label.caption}</p>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  )
}
