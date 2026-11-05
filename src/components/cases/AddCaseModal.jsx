/** Add Case modal */
import { useEffect, useRef } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
import Radio from '../ui/Radio'
import Select from '../ui/Select'
import { useApp } from '../../contexts/useApp'
import loanTypes from '../../data/loanTypes.json'
import constitutions from '../../data/constitutions.json'
import models from '../../data/models.json'
import { formatLoanAmountInput } from '../../utils/helpers'
import useApplicantForm from '../../hooks/useApplicantForm'
import LocationFeedback from '../applicant/LocationFeedback'

const emptyForm = {
  borrowerName: '',
  loanType: '',
  constitution: '',
  loanAmount: '',
  pincode: '',
  city: '',
  state: '',
  model: 'Assisted Model',
}

export default function AddCaseModal({ open, onClose, onCreated }) {
  const submitted = useRef(false)
  const { createCase } = useApp()
  const {
    form,
    update,
    reset,
    isValid,
    amountError,
    pincodeError,
    loading,
    retry,
  } = useApplicantForm(emptyForm)

  useEffect(() => {
    if (open) {
      submitted.current = false
      reset()
    }
  }, [open, reset])

  const handleSubmit = () => {
    if (!isValid || submitted.current) return
    submitted.current = true
    const created = createCase(form)
    onClose?.()
    onCreated?.(created)
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add Case"
      width="max-w-[640px]"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button disabled={!isValid} onClick={handleSubmit}>
            Submit
          </Button>
        </>
      }
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <Input
          label="Borrower Name"
          placeholder="Enter Borrower Name"
          value={form.borrowerName}
          onChange={(e) => update('borrowerName', e.target.value)}
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
          label="Requested Loan Amount"
          placeholder="0"
          prefix="₹"
          value={form.loanAmount}
          error={amountError}
          inputMode="numeric"
          maxLength={30}
          onChange={(e) =>
            update('loanAmount', formatLoanAmountInput(e.target.value))
          }
          inputClassName="pl-7"
        />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Input
          label="Borrower's City Pincode"
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
        <Input
          label="City"
          placeholder="Enter City Name"
          value={form.city}
          readOnly
        />
        <Input
          label="State"
          placeholder="Enter State Name"
          value={form.state}
          readOnly
        />
      </div>

      <LocationFeedback
        loading={loading}
        error={pincodeError}
        onRetry={retry}
      />

      <div className="mt-5">
        <Radio
          label="Select Model"
          name="case-model"
          options={models}
          value={form.model}
          onChange={(v) => update('model', v)}
        />
      </div>
    </Modal>
  )
}
