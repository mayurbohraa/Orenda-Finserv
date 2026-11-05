/** Co-applicant form */

import { Trash2, X } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Radio from '../ui/Radio'
import Select from '../ui/Select'
import { useApp } from '../../contexts/useApp'
import loanTypes from '../../data/loanTypes.json'
import constitutions from '../../data/constitutions.json'
import models from '../../data/models.json'
import relationships from '../../data/relationships.json'
import { formatLoanAmountInput } from '../../utils/helpers'
import useApplicantForm from '../../hooks/useApplicantForm'
import LocationFeedback from './LocationFeedback'

/** Prefill form for add or edit */
function buildInitial(caseData, existing) {
  if (existing) {
    return {
      name: existing.name || '',
      loanType: existing.loanType || '',
      constitution: existing.constitution || '',
      loanAmount: existing.loanAmount
        ? formatLoanAmountInput(String(existing.loanAmount))
        : '',
      pincode: existing.pincode || '',
      city: existing.city || '',
      state: existing.state || '',
      relationship: existing.relationship || '',
      model: existing.model || caseData.model || 'Assisted Model',
    }
  }
  return {
    name: '',
    loanType: caseData.loanType || '',
    constitution: caseData.constitution || '',
    loanAmount: caseData.loanAmount
      ? formatLoanAmountInput(String(caseData.loanAmount))
      : '',
    pincode: caseData.pincode || '',
    city: caseData.city || '',
    state: caseData.state || '',
    relationship: '',
    model: caseData.model || 'Assisted Model',
  }
}

export default function CoApplicantForm({
  caseData,
  initial = null,
  onCancel,
  onSaved,
}) {
  const { addCoApplicant, updateCoApplicant } = useApp()
  const isEdit = Boolean(initial)
  const { form, update, isValid, amountError, pincodeError, loading, retry } =
    useApplicantForm(() => buildInitial(caseData, initial), true)
  const handleCancel = () => onCancel?.()

  const handleSave = () => {
    if (!isValid) return
    if (isEdit) {
      updateCoApplicant(caseData.id, form)
    } else {
      addCoApplicant(caseData.id, form)
    }
    onSaved?.()
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-[#D1DEE8] bg-white animate-slide-up">
      <div className="flex items-center justify-between border-b border-[#D1DEE8] bg-[#eef5fc] px-5 py-3.5">
        <h3 className="text-sm font-semibold text-[#154F7A]">
          {isEdit ? 'Edit Co-Applicant' : 'Co-Applicant'}
        </h3>
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-lg p-2 text-[#2b7de9] hover:bg-red-50 hover:text-red-600"
          aria-label={isEdit ? 'Cancel edit' : 'Remove co-applicant form'}
        >
          {isEdit ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        </button>
      </div>

      <div className="space-y-4 p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Co-Applicant Name"
            placeholder="Co-Applicant Name"
            value={form.name}
            onChange={(e) => update('name', e.target.value)}
          />
          <Select
            label="Select Loan Type"
            placeholder="Select Loan Type"
            options={loanTypes}
            value={form.loanType}
            onChange={(v) => update('loanType', v)}
          />
          <Select
            label="Select Constitution"
            placeholder="Select Constitution"
            options={constitutions}
            value={form.constitution}
            onChange={(v) => update('constitution', v)}
          />
          <Input
            label="Enter Loan Amount"
            placeholder="0"
            prefix="₹"
            value={form.loanAmount}
            error={amountError}
            inputMode="numeric"
            maxLength={30}
            onChange={(e) =>
              update('loanAmount', formatLoanAmountInput(e.target.value))
            }
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <Input
            label="Enter Pincode"
            placeholder="Enter Pincode"
            value={form.pincode}
            maxLength={6}
            inputMode="numeric"
            autoComplete="postal-code"
            aria-busy={loading}
            error={
              form.pincode && form.pincode.length !== 6
                ? 'Enter a 6-digit pincode.'
                : undefined
            }
            onChange={(e) =>
              update('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))
            }
          />
          <Input label="City" value={form.city} readOnly placeholder="City" />
          <Input
            label="State"
            value={form.state}
            readOnly
            placeholder="State"
          />
        </div>

        <LocationFeedback
          loading={loading}
          error={pincodeError}
          onRetry={retry}
        />

        <Select
          label="Select Relationship"
          placeholder="Select Relationship"
          options={relationships}
          value={form.relationship}
          onChange={(v) => update('relationship', v)}
        />

        <Radio
          label="Select Model"
          name="coapp-model"
          options={models}
          value={form.model}
          onChange={(v) => update('model', v)}
        />

        <div className="flex justify-end gap-3 pt-1">
          {isEdit ? (
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
          ) : null}
          <Button disabled={!isValid} onClick={handleSave}>
            Save Details
          </Button>
        </div>
      </div>
    </div>
  )
}
