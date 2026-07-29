/** Shared helpers — formatting, validation, status styles */
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

/** Merge class names (Tailwind-safe) */
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

/** Format as Indian Rupee (₹7,25,000) */
export function formatIndianCurrency(amount) {
  if (amount === null || amount === undefined || amount === '') return ''
  const num =
    typeof amount === 'string'
      ? Number(String(amount).replace(/,/g, ''))
      : amount
  if (Number.isNaN(num)) return ''
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(num)
}

/** Format loan amount while typing */
export function formatLoanAmountInput(value) {
  const digits = String(value).replace(/[^\d]/g, '')
  if (!digits) return ''
  return Number(digits).toLocaleString('en-IN')
}

/** Parse formatted loan amount to number */
export function parseLoanAmount(value) {
  if (!value) return 0
  return Number(String(value).replace(/[^\d]/g, '')) || 0
}

/** True if pincode is 6 digits */
export function isValidPincode(pincode) {
  return /^\d{6}$/.test(String(pincode || '').trim())
}

/** Pad case number to 3 digits */
export function padCaseNumber(num) {
  return String(num).padStart(3, '0')
}

/** Activity timestamp: "28 June · 9:15 PM" */
export function formatActivityTimestamp(date = new Date()) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const day = date.getDate()
  const month = months[date.getMonth()]
  let hours = date.getHours()
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const ampm = hours >= 12 ? 'PM' : 'AM'
  hours = hours % 12 || 12
  return `${day} ${month} · ${hours}:${minutes} ${ampm}`
}

/** Document date: "28 June 2026" */
export function formatDocumentDate(date = new Date()) {
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`
}

/** File size label from bytes */
export function formatFileSize(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

/** File type from filename extension */
export function getFileTypeLabel(filename = '') {
  const ext = String(filename).split('.').pop()?.toUpperCase() || 'FILE'
  return ext
}

/** Welcome date: "Wednesday, 29th July 2026" */
export function formatWelcomeDate(date = new Date()) {
  const weekdays = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]
  const months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ]
  const day = date.getDate()
  const j = day % 10
  const k = day % 100
  let suffix = 'th'
  if (j === 1 && k !== 11) suffix = 'st'
  else if (j === 2 && k !== 12) suffix = 'nd'
  else if (j === 3 && k !== 13) suffix = 'rd'

  return `${weekdays[date.getDay()]}, ${day}${suffix} ${months[date.getMonth()]} ${date.getFullYear()}`
}

/** Status badge label, colors, and icon */
export function getStatusMeta(statusId) {
  const map = {
    pending: {
      label: 'Pending',
      className:
        'bg-status-pending-bg text-status-pending-fg border border-[#c5ced8]',
      icon: 'clock',
    },
    analysis_completed: {
      label: 'Analysis Completed',
      className:
        'bg-status-analysis-bg text-status-analysis-fg border border-[#b6d0f7]',
      icon: 'file',
    },
    quote_generated: {
      label: 'Quote Generated',
      className:
        'bg-status-quote-bg text-status-quote-fg border border-[#f0d2a0]',
      icon: 'file-pen',
    },
    disbursed: {
      label: 'Disbursed',
      className:
        'bg-status-disbursed-bg text-status-disbursed-fg border border-[#a8dfbf]',
      icon: 'check-circle',
    },
  }
  return (
    map[statusId] || {
      label: statusId || 'Unknown',
      className: 'bg-gray-100 text-gray-600 border border-gray-200',
      icon: 'clock',
    }
  )
}
