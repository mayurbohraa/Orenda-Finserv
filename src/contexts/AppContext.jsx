/** Global app state (local JSON — no backend) */
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AppContext } from './useApp'
import { fetchPincode } from '../utils/pincode'
import casesData from '../data/cases.json'
import dashboardData from '../data/dashboard.json'
import userData from '../data/user.json'
import pincodes from '../data/pincodes.json'
import notificationsData from '../data/notifications.json'
import {
  formatActivityTimestamp,
  formatDocumentDate,
  formatFileSize,
  getFileTypeLabel,
  padCaseNumber,
  parseLoanAmount,
  isValidPincode,
} from '../utils/helpers'

export function AppProvider({ children }) {
  const [cases, setCases] = useState(casesData)
  const [notifications, setNotifications] = useState(notificationsData)
  const [toast, setToast] = useState(null)
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const nextCaseNumber = useRef(
    Math.max(...casesData.map((item) => Number(item.caseNumber) || 0), 0) + 1,
  )
  const documentUrls = useRef(new Set())

  useEffect(() => {
    const current = new Set(
      cases.flatMap((item) =>
        (item.documents || []).map((doc) => doc.url).filter(Boolean),
      ),
    )
    for (const url of documentUrls.current) {
      if (!current.has(url)) URL.revokeObjectURL(url)
    }
    documentUrls.current = current
  }, [cases])

  useEffect(
    () => () => {
      for (const url of documentUrls.current) URL.revokeObjectURL(url)
      documentUrls.current.clear()
    },
    [],
  )

  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications],
  )

  /** Mark one notification as read */
  const markNotificationRead = useCallback((id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    )
  }, [])

  /** Mark all notifications as read */
  const markAllNotificationsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })))
  }, [])

  /** Use known locations offline; bound external lookups and allow cancellation. */
  const lookupPincode = useCallback(async (pincode, signal) => {
    const key = String(pincode).trim()
    if (!isValidPincode(key)) return null
    if (pincodes[key]) return pincodes[key]
    return fetchPincode(key, signal)
  }, [])

  const showToast = useCallback((payload) => {
    setToast(payload)
  }, [])

  const dismissToast = useCallback(() => {
    setToast(null)
  }, [])

  const getCaseById = useCallback(
    (id) => cases.find((c) => c.id === id) || null,
    [cases],
  )

  /** Create a new case */
  const createCase = useCallback(
    (form) => {
      const nextNumber = nextCaseNumber.current++
      const padded = padCaseNumber(nextNumber)
      const amount = parseLoanAmount(form.loanAmount)
      const now = new Date()

      const newCase = {
        id: `case-${padded}`,
        caseNumber: padded,
        caseName: `${padded}-${form.borrowerName.trim()}`,
        borrowerName: form.borrowerName.trim(),
        caseCreatedBy: userData.name,
        quoteGeneratedBy: 'N/A',
        loanAmount: amount,
        loanType: form.loanType,
        constitution: form.constitution,
        status: 'pending',
        city: form.city,
        state: form.state,
        pincode: form.pincode,
        model: form.model,
        assignedCaseManager: userData.name,
        phase: 'Phase 1 of 4',
        phaseLabel: 'Personal info',
        createdAt: now.toISOString(),
        coApplicant: null,
        documents: [],
        activityLog: [
          {
            id: `act-${Date.now()}-2`,
            title: 'Personal Info Added',
            by: `${userData.name} (DSA)`,
            timestamp: formatActivityTimestamp(now),
            dateGroup: 'Today',
          },
          {
            id: `act-${Date.now()}-1`,
            title: `Case ${padded} Created`,
            by: `${userData.name} (DSA)`,
            timestamp: formatActivityTimestamp(now),
            dateGroup: 'Today',
          },
        ],
      }

      setCases((prev) => [newCase, ...prev])
      showToast({
        type: 'success',
        message: 'You have successfully created a case',
        caseId: newCase.id,
        actionLabel: 'View Case',
      })
      return newCase
    },
    [showToast],
  )

  /** Add co-applicant to a case */
  const addCoApplicant = useCallback((caseId, coApplicant) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c
        const entry = {
          id: `act-${Date.now()}`,
          title: 'Co-Applicant Added',
          by: `${userData.name} (DSA)`,
          timestamp: formatActivityTimestamp(new Date()),
          dateGroup: 'Today',
        }
        return {
          ...c,
          coApplicant: {
            name: coApplicant.name.trim(),
            loanType: coApplicant.loanType,
            constitution: coApplicant.constitution,
            loanAmount: parseLoanAmount(coApplicant.loanAmount),
            pincode: coApplicant.pincode,
            city: coApplicant.city,
            state: coApplicant.state,
            relationship: coApplicant.relationship,
            model: coApplicant.model,
          },
          activityLog: [entry, ...(c.activityLog || [])],
        }
      }),
    )
  }, [])

  /** Update applicant details */
  const updateApplicant = useCallback((caseId, form) => {
    const amount = parseLoanAmount(form.loanAmount)
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c
        const entry = {
          id: `act-${Date.now()}`,
          title: 'Applicant Details Updated',
          by: `${userData.name} (DSA)`,
          timestamp: formatActivityTimestamp(new Date()),
          dateGroup: 'Today',
        }
        return {
          ...c,
          borrowerName: form.borrowerName.trim(),
          caseName: `${c.caseNumber}-${form.borrowerName.trim()}`,
          loanType: form.loanType,
          constitution: form.constitution,
          loanAmount: amount,
          pincode: form.pincode,
          city: form.city,
          state: form.state,
          model: form.model,
          activityLog: [entry, ...(c.activityLog || [])],
        }
      }),
    )
  }, [])

  /** Update co-applicant details */
  const updateCoApplicant = useCallback((caseId, coApplicant) => {
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c
        const entry = {
          id: `act-${Date.now()}`,
          title: 'Co-Applicant Updated',
          by: `${userData.name} (DSA)`,
          timestamp: formatActivityTimestamp(new Date()),
          dateGroup: 'Today',
        }
        return {
          ...c,
          coApplicant: {
            name: coApplicant.name.trim(),
            loanType: coApplicant.loanType,
            constitution: coApplicant.constitution,
            loanAmount: parseLoanAmount(coApplicant.loanAmount),
            pincode: coApplicant.pincode,
            city: coApplicant.city,
            state: coApplicant.state,
            relationship: coApplicant.relationship,
            model: coApplicant.model,
          },
          activityLog: [entry, ...(c.activityLog || [])],
        }
      }),
    )
  }, [])

  /** Build document object from uploaded file */
  const buildDocFromFile = useCallback((file) => {
    return {
      id: `doc-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: file.name,
      type: getFileTypeLabel(file.name),
      size: formatFileSize(file.size),
      uploadedAt: formatDocumentDate(new Date()),
      uploadedBy: userData.name,
      mimeType: file.type || '',
      url: URL.createObjectURL(file),
    }
  }, [])

  /** Upload a new document */
  const addDocument = useCallback(
    (caseId, file) => {
      const doc = buildDocFromFile(file)
      const entry = {
        id: `act-${Date.now()}`,
        title: 'Document Uploaded',
        by: `${userData.name} (DSA)`,
        timestamp: formatActivityTimestamp(new Date()),
        dateGroup: 'Today',
      }
      setCases((prev) =>
        prev.map((c) =>
          c.id !== caseId
            ? c
            : {
                ...c,
                documents: [doc, ...(c.documents || [])],
                activityLog: [entry, ...(c.activityLog || [])],
              },
        ),
      )
    },
    [buildDocFromFile],
  )

  /** Replace an existing document file */
  const updateDocument = useCallback(
    (caseId, docId, file) => {
      const next = buildDocFromFile(file)
      const entry = {
        id: `act-${Date.now()}`,
        title: 'Document Updated',
        by: `${userData.name} (DSA)`,
        timestamp: formatActivityTimestamp(new Date()),
        dateGroup: 'Today',
      }
      setCases((prev) =>
        prev.map((c) => {
          if (c.id !== caseId) return c
          return {
            ...c,
            documents: (c.documents || []).map((d) => {
              if (d.id !== docId) return d
              return { ...next, id: docId }
            }),
            activityLog: [entry, ...(c.activityLog || [])],
          }
        }),
      )
    },
    [buildDocFromFile],
  )

  /** Delete a document */
  const deleteDocument = useCallback((caseId, docId) => {
    const entry = {
      id: `act-${Date.now()}`,
      title: 'Document Deleted',
      by: `${userData.name} (DSA)`,
      timestamp: formatActivityTimestamp(new Date()),
      dateGroup: 'Today',
    }
    setCases((prev) =>
      prev.map((c) => {
        if (c.id !== caseId) return c
        return {
          ...c,
          documents: (c.documents || []).filter((d) => d.id !== docId),
          activityLog: [entry, ...(c.activityLog || [])],
        }
      }),
    )
  }, [])

  const value = useMemo(
    () => ({
      user: userData,
      dashboard: dashboardData,
      cases,
      notifications,
      unreadCount,
      toast,
      sidebarCollapsed,
      setSidebarCollapsed,
      lookupPincode,
      showToast,
      dismissToast,
      getCaseById,
      createCase,
      addCoApplicant,
      updateApplicant,
      updateCoApplicant,
      addDocument,
      updateDocument,
      deleteDocument,
      markNotificationRead,
      markAllNotificationsRead,
    }),
    [
      cases,
      notifications,
      unreadCount,
      toast,
      sidebarCollapsed,
      lookupPincode,
      showToast,
      dismissToast,
      getCaseById,
      createCase,
      addCoApplicant,
      updateApplicant,
      updateCoApplicant,
      addDocument,
      updateDocument,
      deleteDocument,
      markNotificationRead,
      markAllNotificationsRead,
    ],
  )

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
