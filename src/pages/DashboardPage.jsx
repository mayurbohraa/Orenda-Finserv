/** Dashboard page */
import { useMemo, useState } from 'react'
import { Download, Plus } from 'lucide-react'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import Search from '../components/ui/Search'
import Select from '../components/ui/Select'
import Pagination from '../components/ui/Pagination'
import ScrollInset from '../components/ui/ScrollInset'
import CasesTable from '../components/cases/CasesTable'
import AddCaseModal from '../components/cases/AddCaseModal'
import Sparkline from '../components/cases/Sparkline'
import { useApp } from '../contexts/AppContext'
import statusOptions from '../data/status.json'
import { cn, formatWelcomeDate } from '../utils/helpers'

const PAGE_SIZE = 5

/** KPI metric column */
function MetricColumn({ metric }) {
  const up = metric.trendDirection === 'up'
  return (
    <div className="min-w-0 flex-1 px-5 py-4 md:px-6 md:py-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm font-medium text-[#4a5d70]">{metric.label}</p>
        <span
          className={cn(
            'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold',
            up
              ? 'bg-[#e8f8ef] text-[#16a34a]'
              : 'bg-[#fde8e8] text-[#ef4444]',
          )}
        >
          <span aria-hidden>{up ? '↑' : '↓'}</span>
          {metric.trend}%
        </span>
      </div>
      <p className="mt-2 text-[32px] font-bold leading-none tracking-tight text-ink">
        {metric.value}
      </p>
      <p className="mt-1 text-sm text-muted">{metric.subtitle}</p>
      <div className="mt-3 border-t border-border pt-2.5">
        <Sparkline
          points={metric.chart.points}
          color={metric.chart.color}
          labels={metric.chart.labels}
        />
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { user, dashboard, cases } = useApp()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState('All')
  const [page, setPage] = useState(1)
  const [modalOpen, setModalOpen] = useState(false)

  const filterOptions = useMemo(
    () => [{ id: 'all', label: 'All' }, ...statusOptions],
    [],
  )

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return cases.filter((c) => {
      const matchesQuery =
        !q ||
        c.caseName.toLowerCase().includes(q) ||
        c.borrowerName.toLowerCase().includes(q) ||
        c.caseCreatedBy.toLowerCase().includes(q)
      const matchesStatus =
        status === 'All' ||
        statusOptions.find((s) => s.label === status)?.id === c.status
      return matchesQuery && matchesStatus
    })
  }, [cases, query, status])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const paged = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  return (
    <>
      <Header breadcrumb="Home" />
      <ScrollInset as="main" className="min-h-0 flex-1 p-4 pb-8 md:p-6 md:pb-8">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#154F7A] md:text-[28px]">
              Welcome {user.firstName}!
            </h1>
            <p className="mt-1 text-sm text-muted">{formatWelcomeDate()}</p>
          </div>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setModalOpen(true)}
          >
            Create Case
          </Button>
        </div>

        <div className="overflow-hidden rounded-2xl border border-[#D1DEE8] bg-white">
          <div className="flex flex-col md:flex-row">
            <MetricColumn metric={dashboard.totalLoanAmount} />
            <div className="my-8 hidden w-px shrink-0 self-stretch bg-[#D1DEE8] md:block" />
            <div className="mx-5 h-px bg-[#D1DEE8] md:hidden" />
            <MetricColumn metric={dashboard.totalRecords} />
          </div>
        </div>

        <section className="mt-6 rounded-2xl border border-[#D1DEE8] bg-white">
          <div className="p-4 md:p-5">
            <div className="mb-4">
              <h2 className="text-lg font-semibold text-[#154F7A]">All Cases</h2>
              <p className="text-sm text-muted">
                Track the status and progress of every case.
              </p>
            </div>

            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Search
                value={query}
                onChange={(v) => {
                  setQuery(v)
                  setPage(1)
                }}
                className="w-full sm:max-w-xs lg:max-w-sm"
              />
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <Select
                  options={filterOptions}
                  value={status}
                  onChange={(v) => {
                    setStatus(v)
                    setPage(1)
                  }}
                  valuePrefix="Status: "
                  placeholder="Status: All"
                  accentValue
                  className="w-full sm:w-40"
                  triggerClassName="!h-10 border-transparent bg-transparent px-2 shadow-none focus:ring-0"
                />
                <Button
                  variant="secondary"
                  size="md"
                  leftIcon={<Download className="h-4 w-4" />}
                  className="h-10 whitespace-nowrap"
                >
                  Download CSV
                </Button>
              </div>
            </div>

            <CasesTable
              cases={paged}
              className="w-full"
              startIndex={(page - 1) * PAGE_SIZE}
            />

            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </div>
        </section>
      </ScrollInset>

      <AddCaseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
