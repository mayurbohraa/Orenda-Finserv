/** Applicant edit form */

import { X } from 'lucide-react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Radio from '../ui/Radio'
import Select from '../ui/Select'
import { useApp } from '../../contexts/useApp'
import loanTypes from '../../data/loanTypes.json'
import constitutions from '../../data/constitutions.json'
import models from '../../data/models.json'
import { formatLoanAmountInput } from '../../utils/helpers'
import useApplicantForm from '../../hooks/useApplicantForm'
import LocationFeedback from './LocationFeedback'

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
  const { updateApplicant } = useApp()
  const { form, update, isValid, amountError, pincodeError, loading, retry } =
    useApplicantForm(() => buildInitial(caseData))
  const handleCancel = () => onCancel?.()

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
          <Input label="Case Number" value={caseData.caseNumber} readOnly />
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
            error={amountError}
            inputMode="numeric"
            maxLength={30}
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
