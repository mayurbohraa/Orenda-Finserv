/** Radio group — model selection */
import { cn } from '../../utils/helpers'

export default function Radio({
  label,
  name,
  options = [],
  value,
  onChange,
  className,
}) {
  return (
    <fieldset className={cn('flex flex-col gap-4', className)}>
      {label ? (
        <legend className="text-[13px] font-semibold text-[#1a2b3c]">
          {label}
        </legend>
      ) : null}
      <div className="mt-1 flex w-full flex-wrap items-center justify-between gap-y-3">
        {options.map((opt) => {
          const selected = value === opt.label
          return (
            <label
              key={opt.id || opt.label}
              className="inline-flex cursor-pointer items-center gap-3 rounded-md text-sm text-[#1a2b3c] focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brand-500"
            >
              <span
                className={cn(
                  'relative flex h-[18px] w-[18px] items-center justify-center rounded-full border transition-colors',
                  selected
                    ? 'border-[1.5px] border-[#154F7A]'
                    : 'border-[1.5px] border-[#B7D0E5] hover:border-[#154F7A]',
                )}
              >
                {selected ? (
                  <span className="h-2.5 w-2.5 rounded-full bg-[#154F7A]" />
                ) : null}
              </span>
              <input
                type="radio"
                name={name}
                value={opt.label}
                className="sr-only"
                checked={selected}
                onChange={() => onChange?.(opt.label)}
              />
              {opt.label}
            </label>
          )
        })}
      </div>
    </fieldset>
  )
}
