/** Applicant edit form */
import { useEffect, useMemo, useState } from 'react'
import { X } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Radio from '../ui/Radio'
import Select from '../ui/Select'
import { useApp } from '../../contexts/AppContext'
import loanTypes from '../../data/loanTypes.json'
import constitutions from '../../data/constitutions.json'
import models from '../../data/models.json'
import {
  formatLoanAmountInput,
  isValidPincode,
} from '../../utils/helpers'

/** Prefill form from case data */
function buildInitial(caseData) {
  return {
    borrowerName: caseData.borrowerName || '',
    loanType: caseData.loanType || '',
    constitution: caseData.constitution || '',
    loanAmount: caseData.loanAmount
      ? formatLoanAmountInput(String(caseData.loanAmount))
      : '',
    pincode: caseData.pincode || '',
    city: caseData.city || '',
    state: caseData.state || '',
    model: caseData.model || 'Assisted Model',
  }
}

export default function ApplicantForm({ caseData, onCancel, onSaved }) {
  const { updateApplicant, lookupPincode, setSaveStatus } = useApp()
  const [form, setForm] = useState(() => buildInitial(caseData))

  useEffect(() => {
    setSaveStatus('saving')
    return () => setSaveStatus('saved')
  }, [setSaveStatus])

  useEffect(() => {
    let cancelled = false
    if (!isValidPincode(form.pincode)) {
      setForm((prev) =>
        prev.city || prev.state ? { ...prev, city: '', state: '' } : prev,
      )
      return
    }
    ;(async () => {
      const match = await lookupPincode(form.pincode)
      if (cancelled) return
      if (match) {
        setForm((prev) => ({ ...prev, city: match.city, state: match.state }))
      } else {
        setForm((prev) =>
          prev.city || prev.state ? { ...prev, city: '', state: '' } : prev,
        )
      }
    })()
    return () => {
      cancelled = true
    }
  }, [form.pincode, lookupPincode])

  const isValid = useMemo(() => {
    return (
      form.borrowerName.trim() &&
      form.loanType &&
      form.constitution &&
      form.loanAmount &&
      isValidPincode(form.pincode) &&
      form.city &&
      form.state &&
      form.model
    )
  }, [form])

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }))

  const handleCancel = () => {
    setSaveStatus('saved')
    onCancel?.()
  }

  const handleSave = () => {
    if (!isValid) return
    updateApplicant(caseData.id, form)
    onSaved?.()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#D1DEE8] bg-white animate-slide-up">
      <div className="flex items-center justify-between border-b border-[#D1DEE8] bg-[#eef5fc] px-5 py-3.5">
        <h3 className="text-sm font-semibold text-[#154F7A]">Edit Applicant</h3>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg p-1.5 text-[#154F7A] hover:bg-brand-50"
          aria-label="Cancel edit"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Borrower Name"
            placeholder="Enter Borrower Name"
            value={form.borrowerName}
            onChange={(e) => update('borrowerName', e.target.value)}
          />
          <Input
            label="Case Number"
            value={caseData.caseNumber}
            readOnly
          />
          <Select
            label="Loan Type"
            placeholder="Select Loan Type"
            options={loanTypes}
            value={form.loanType}
            onChange={(v) => update('loanType', v)}
          />
          <Select
            label="Constitution"
            placeholder="Select Constitution"
            options={constitutions}
            value={form.constitution}
            onChange={(v) => update('constitution', v)}
          />
          <Input
            label="Loan requirement"
            placeholder="0"
            prefix="₹"
            value={form.loanAmount}
            onChange={(e) =>
              update('loanAmount', formatLoanAmountInput(e.target.value))
            }
          />
          <Input
            label="Assigned Case Manager"
            value={caseData.assignedCaseManager}
            readOnly
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Pincode"
            placeholder="Enter Pincode"
            value={form.pincode}
            maxLength={6}
            onChange={(e) =>
              update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
            }
          />
          <Input label="City" value={form.city} readOnly placeholder="City" />
          <Input label="State" value={form.state} readOnly placeholder="State" />
        </div>

        <Radio
          label="Select Model"
          name="applicant-edit-model"
          options={models}
          value={form.model}
          onChange={(v) => update('model', v)}
        />

        <div className="flex justify-end gap-3 pt-1">
          <Button variant="secondary" onClick={handleCancel}>
            Cancel
          </Button>
          <Button disabled={!isValid} onClick={handleSave}>
            Save Details
          </Button>
        </div>
      </div>
    </div>
  )
}
