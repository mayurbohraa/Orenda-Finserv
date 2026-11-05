/** Cases list page */
import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import Search from '../components/ui/Search'
import Select from '../components/ui/Select'
import Pagination from '../components/ui/Pagination'
import ScrollInset from '../components/ui/ScrollInset'
import CasesTable from '../components/cases/CasesTable'
import AddCaseModal from '../components/cases/AddCaseModal'
import { useApp } from '../contexts/useApp'
import statusOptions from '../data/status.json'

const PAGE_SIZE = 15

export default function CasesPage() {
  const { cases } = useApp()
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
      <Header breadcrumb="Cases" />
      <ScrollInset as="main" className="min-h-0 flex-1 p-4 pb-4 md:p-6 md:pb-5">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-[#154F7A] md:text-[28px]">
              Cases
            </h1>
            <p className="mt-1 text-sm text-muted">
              All your customer cases, organized in one place.
            </p>
          </div>
          <Button
            leftIcon={<Plus className="h-4 w-4" />}
            onClick={() => setModalOpen(true)}
          >
            Add Case
          </Button>
        </div>

        <section className="flex min-h-[560px] flex-col overflow-hidden rounded-2xl border border-[#D1DEE8] bg-white lg:min-h-[660px]">
          <div className="flex shrink-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between md:p-5">
            <Search
              value={query}
              onChange={(v) => {
                setQuery(v)
                setPage(1)
              }}
              className="w-full sm:max-w-md lg:max-w-lg"
            />
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
              className="w-full sm:w-44"
              triggerClassName="!h-10 border-transparent bg-transparent px-2 shadow-none focus:ring-0"
            />
          </div>

          <div className="min-h-[420px] flex-1 px-4 md:px-5 lg:min-h-[520px]">
            <CasesTable
              cases={paged}
              className="h-full min-h-0 w-full"
              startIndex={(page - 1) * PAGE_SIZE}
            />
          </div>

          <div className="shrink-0 px-4 py-4 md:px-5">
            <Pagination
              page={page}
              totalPages={totalPages}
              onChange={setPage}
            />
          </div>
        </section>
      </ScrollInset>

      <AddCaseModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  )
}
