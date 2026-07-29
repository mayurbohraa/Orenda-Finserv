/** Add Case modal */
import { useEffect, useMemo, useState } from 'react'
import Button from '../ui/Button'
import Input from '../ui/Input'
import Modal from '../ui/Modal'
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
  const { createCase, lookupPincode } = useApp()
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (open) setForm(emptyForm)
  }, [open])

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

  const update = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!isValid) return
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
