import { cn } from '../../utils/helpers'
import ScrollInset from './ScrollInset'

/** Table with sticky header */
export default function Table({
  columns = [],
  rows = [],
  className,
  emptyMessage = 'No cases found.',
}) {
  return (
    <ScrollInset
      className={cn(
        'min-h-0 rounded-xl border border-[#D1DEE8] bg-white',
        className,
      )}
    >
      <table className="w-full min-w-[960px] table-fixed border-collapse text-left text-sm">
        <colgroup>
          {columns.map((col) => (
            <col
              key={col.key}
              style={{ width: col.width || `${100 / columns.length}%` }}
            />
          ))}
        </colgroup>

        <thead className="sticky top-0 z-10">
          <tr>
            {columns.map((col, colIdx) => (
              <th
                key={col.key}
                scope="col"
                className={cn(
                  'border-b border-[#D1DEE8] bg-[#F0F7FF] px-4 py-3.5 text-left text-[12px] font-semibold text-[#5a6a7a]',
                  colIdx > 0 && 'border-l border-[#D1DEE8]',
                  col.className,
                )}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-muted"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            rows.map((row, idx) => (
              <tr key={row.id || idx} className="bg-white hover:bg-[#F0F7FF]/40">
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      'px-4 py-4 align-middle text-left text-ink',
                      col.cellClassName,
                    )}
                  >
                    {col.render ? col.render(row, idx) : row[col.key]}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </ScrollInset>
  )
}
