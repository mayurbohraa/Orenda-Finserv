/** Case detail page */
import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRight, Check, Pencil, UserPlus } from 'lucide-react'
import Header from '../components/layout/Header'
import Button from '../components/ui/Button'
import ScrollInset from '../components/ui/ScrollInset'
import ApplicantPreview from '../components/applicant/ApplicantPreview'
import ApplicantForm from '../components/applicant/ApplicantForm'
import CoApplicantPreview from '../components/applicant/CoApplicantPreview'
import CoApplicantForm from '../components/applicant/CoApplicantForm'
import ActivityLogPanel from '../components/applicant/ActivityLogPanel'
import DocumentsPanel from '../components/cases/DocumentsPanel'
import { useApp } from '../contexts/useApp'
import { formatIndianCurrency } from '../utils/helpers'

export default function CaseDetailPage() {
  const { id } = useParams()
  return <CaseDetails key={id} id={id} />
}

function CaseDetails({ id }) {
  const { getCaseById } = useApp()
  const caseData = getCaseById(id)
  const [addingCoApp, setAddingCoApp] = useState(false)
  const [editingApplicant, setEditingApplicant] = useState(false)
  const [editingCoApp, setEditingCoApp] = useState(false)
  const [activeTab, setActiveTab] = useState('applicant')
  const editing = editingApplicant || editingCoApp || addingCoApp

  if (!caseData) {
    return (
      <>
        <Header
          breadcrumb={
            <span>
              <Link to="/cases" className="hover:text-ink">
                Cases
              </Link>
              <span className="mx-1.5">/</span>
              <span className="font-medium text-ink">Not found</span>
            </span>
          }
        />
        <main className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <p className="text-lg font-semibold text-ink">Case not found</p>
            <Link to="/cases" className="mt-2 inline-block text-sm text-link">
              Back to Cases
            </Link>
          </div>
        </main>
      </>
    )
  }

  // Loan type label: "Personal loan"
  const loanLabel = String(caseData.loanType || '').replace(/ Loan$/i, ' loan')

  return (
    <>
      <Header
        breadcrumb={
          <span className="truncate">
            <Link to="/cases" className="hover:text-ink">
              Cases
            </Link>
            <span className="mx-1.5">/</span>
            <span className="font-medium text-ink">
              {caseData.borrowerName}
            </span>
          </span>
        }
      />

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <ScrollInset className="min-h-0 flex-1 p-4 pb-6 md:p-6">
          <div className="rounded-2xl border border-[#D1DEE8] bg-white p-4 md:p-5">
            <div className="mb-4">
              <h1 className="break-words text-2xl font-bold text-[#154F7A] md:text-[28px]">
                {caseData.borrowerName}
              </h1>
              <p className="mt-1 text-sm text-[#6b7c8f]">
                CASE-{caseData.caseNumber} | {loanLabel}:{' '}
                {formatIndianCurrency(caseData.loanAmount)}
              </p>
              <p className="mt-1.5 flex items-center gap-2 text-sm text-[#6b7c8f]">
                <span className="h-2 w-2 shrink-0 rounded-full bg-[#2b7de9]" />
                <span>
                  [{caseData.phase}] · {caseData.phaseLabel}
                </span>
              </p>
            </div>

            <div className="mb-5 flex gap-6 border-b border-[#D1DEE8]">
              {[
                { id: 'applicant', label: 'Applicant Details' },
                { id: 'documents', label: 'Documents' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  disabled={editing && tab.id !== activeTab}
                  aria-pressed={activeTab === tab.id}
                  className={
                    activeTab === tab.id
                      ? 'border-b-2 border-[#154F7A] pb-3 text-sm font-semibold text-[#154F7A]'
                      : 'pb-3 text-sm font-medium text-[#6b7c8f] hover:text-ink'
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {activeTab === 'applicant' ? (
              <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_300px] xl:grid-cols-[minmax(0,1fr)_320px]">
                <div className="min-w-0">
                  {editingApplicant ? (
                    <ApplicantForm
                      caseData={caseData}
                      onCancel={() => setEditingApplicant(false)}
                      onSaved={() => setEditingApplicant(false)}
                    />
                  ) : (
                    <ApplicantPreview
                      caseData={caseData}
                      onEdit={() => {
                        setEditingApplicant(true)
                        setAddingCoApp(false)
                        setEditingCoApp(false)
                      }}
                    />
                  )}
                </div>

                <aside className="relative min-h-[220px] max-h-72 lg:min-h-0 lg:max-h-none">
                  <div className="h-full max-h-72 lg:absolute lg:inset-0 lg:max-h-none">
                    <ActivityLogPanel items={caseData.activityLog} />
                  </div>
                </aside>

                {!editingApplicant && !caseData.coApplicant && !addingCoApp ? (
                  <div className="min-w-0 lg:col-start-1">
                    <Button
                      variant="tertiary"
                      size="sm"
                      leftIcon={<UserPlus className="h-4 w-4" />}
                      className="!px-0 ml-1 text-[#154F7A] hover:text-[#0F3D5E]"
                      onClick={() => {
                        setAddingCoApp(true)
                        setEditingCoApp(false)
                      }}
                    >
                      Add co-applicant
                    </Button>
                  </div>
                ) : null}

                {caseData.coApplicant && !editingCoApp ? (
                  <div className="min-w-0 lg:col-start-1">
                    <CoApplicantPreview
                      caseData={caseData}
                      coApplicant={caseData.coApplicant}
                      onEdit={() => {
                        setEditingCoApp(true)
                        setAddingCoApp(false)
                        setEditingApplicant(false)
                      }}
                    />
                  </div>
                ) : null}

                {caseData.coApplicant && editingCoApp ? (
                  <div className="min-w-0 lg:col-start-1">
                    <CoApplicantForm
                      caseData={caseData}
                      initial={caseData.coApplicant}
                      onCancel={() => setEditingCoApp(false)}
                      onSaved={() => setEditingCoApp(false)}
                    />
                  </div>
                ) : null}

                {!caseData.coApplicant && addingCoApp ? (
                  <div className="min-w-0 lg:col-start-1">
                    <CoApplicantForm
                      caseData={caseData}
                      onCancel={() => setAddingCoApp(false)}
                      onSaved={() => setAddingCoApp(false)}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <DocumentsPanel caseData={caseData} />
            )}
          </div>
        </ScrollInset>

        <footer className="flex shrink-0 flex-col items-stretch justify-end gap-3 border-t sm:flex-row sm:items-center sm:gap-4 border-[#D1DEE8] bg-white px-4 py-4 md:px-6">
          <div
            className="flex items-center gap-2 text-xs sm:text-sm"
            role="status"
          >
            {editing ? (
              <>
                <Pencil className="h-4 w-4 shrink-0 text-muted" />
                <span className="text-muted">
                  Save or cancel your edits to continue
                </span>
              </>
            ) : (
              <>
                <Check className="h-4 w-4 shrink-0 text-[#16a34a]" />
                <span className="font-medium text-[#16a34a]">
                  Saved for this session
                </span>
              </>
            )}
          </div>
          {activeTab === 'applicant' ? (
            <Button
              rightIcon={<ArrowRight className="h-4 w-4" />}
              onClick={() => setActiveTab('documents')}
              disabled={editing}
            >
              Continue to Documents
            </Button>
          ) : (
            <Button
              variant="secondary"
              onClick={() => setActiveTab('applicant')}
            >
              Back to Applicant Details
            </Button>
          )}
        </footer>
      </main>
    </>
  )
}
