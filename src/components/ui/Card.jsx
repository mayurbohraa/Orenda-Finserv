/** Card container */
import { cn } from '../../utils/helpers'

export default function Card({
  children,
  className,
  title,
  action,
  padding = true,
  bodyClassName,
  headerClassName,
}) {
  return (
    <div
      className={cn(
        'overflow-hidden rounded-2xl border border-[#D1DEE8] bg-white',
        className,
      )}
    >
      {title || action ? (
        <div
          className={cn(
            'flex shrink-0 items-center justify-between border-b border-[#D1DEE8] bg-[#eef5fc] px-5 py-3.5',
            headerClassName,
          )}
        >
          {title ? (
            <h3 className="text-sm font-semibold text-[#154F7A]">{title}</h3>
          ) : (
            <span />
          )}
          {action}
        </div>
      ) : null}
      <div className={cn(padding && 'p-5', bodyClassName)}>{children}</div>
    </div>
  )
}
