import { useCallback, useEffect, useState } from 'react'
import { useApp } from '../contexts/useApp'
import { isValidPincode, isValidLoanAmount } from '../utils/helpers'

export default function useApplicantForm(initial, requireRelationship = false) {
  const { lookupPincode } = useApp()
  const [values, setValues] = useState(initial)
  const [location, setLocation] = useState(null)
  const [attempt, setAttempt] = useState(0)
  const pincode = values.pincode

  useEffect(() => {
    if (!isValidPincode(pincode)) return
    const controller = new AbortController()
    lookupPincode(pincode, controller.signal)
      .then((match) => {
        if (!controller.signal.aborted) {
          setLocation({
            pincode,
            ...match,
            error: match ? '' : 'No location found. Check the pincode.',
          })
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) {
          setLocation({
            pincode,
            error: 'Location lookup failed. Check your connection and retry.',
          })
        }
      })
    return () => controller.abort()
  }, [pincode, lookupPincode, attempt])

  // A location belongs only to the exact pincode that produced it.
  const current = location?.pincode === pincode ? location : null
  const loading = isValidPincode(pincode) && !current
  const form = {
    ...values,
    city: current?.city || '',
    state: current?.state || '',
  }
  const amountError =
    values.loanAmount && !isValidLoanAmount(values.loanAmount)
      ? 'Enter a whole-rupee amount greater than zero and within the supported range.'
      : ''
  const pincodeError =
    pincode && !isValidPincode(pincode)
      ? 'Enter a valid 6-digit Indian pincode.'
      : current?.error || ''
  const isValid = Boolean(
    (form.borrowerName ?? form.name)?.trim() &&
    form.loanType &&
    form.constitution &&
    isValidLoanAmount(form.loanAmount) &&
    form.city &&
    form.state &&
    form.model &&
    !loading &&
    !pincodeError &&
    (!requireRelationship || form.relationship),
  )

  function update(key, value) {
    if (key === 'pincode') setLocation(null)
    setValues((previous) => ({ ...previous, [key]: value }))
  }

  const reset = useCallback(() => {
    setValues(initial)
    setLocation(null)
  }, [initial])

  function retry() {
    setLocation(null)
    setAttempt((previous) => previous + 1)
  }

  return {
    form,
    update,
    reset,
    isValid,
    amountError,
    pincodeError,
    loading,
    retry,
  }
}
