/** Documents tab — view, upload, update, delete */
import { useRef, useState } from 'react'
import {
  Eye,
  FileText,
  FileImage,
  File,
  Pencil,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react'
import Button from '../ui/Button'
import Modal from '../ui/Modal'
import { useApp } from '../../contexts/useApp'
import { cn } from '../../utils/helpers'

/** Icon for file type */
function fileIcon(type = '') {
  const t = type.toUpperCase()
  if (t === 'JPG' || t === 'JPEG' || t === 'PNG' || t === 'WEBP')
    return FileImage
  if (t === 'PDF') return FileText
  return File
}

function isImageDoc(doc) {
  const t = String(doc.type || '').toUpperCase()
  if (['JPG', 'JPEG', 'PNG', 'WEBP', 'GIF'].includes(t)) return true
  return String(doc.mimeType || '').startsWith('image/')
}

function isPdfDoc(doc) {
  const t = String(doc.type || '').toUpperCase()
  if (t === 'PDF') return true
  return String(doc.mimeType || '') === 'application/pdf'
}

/** Document preview content for the view modal */
function DocumentPreview({ doc }) {
  if (doc.url && isImageDoc(doc)) {
    return (
      <div className="flex min-h-[320px] items-center justify-center rounded-xl bg-[#f4f7fb] p-4">
        <img
          src={doc.url}
          alt={doc.name}
          className="max-h-[min(70svh,640px)] max-w-full rounded-lg object-contain shadow-sm"
        />
      </div>
    )
  }

  if (doc.url && isPdfDoc(doc)) {
    return (
      <iframe
        title={doc.name}
        src={doc.url}
        className="h-[min(70svh,640px)] w-full rounded-xl border border-[#D1DEE8] bg-white"
      />
    )
  }

  if (doc.url) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-xl bg-[#f4f7fb] px-6 py-16 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white text-[#154F7A] shadow-sm">
          <File className="h-6 w-6" strokeWidth={1.75} />
        </span>
        <div>
          <p className="text-sm font-semibold text-[#1a2b3c]">{doc.name}</p>
          <p className="mt-1 text-xs text-[#6b7c8f]">
            Preview is not available for this file type. Open it in a new tab.
          </p>
        </div>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => window.open(doc.url, '_blank', 'noopener,noreferrer')}
        >
          Open file
        </Button>
      </div>
    )
  }

  const Icon = fileIcon(doc.type)
  return (
    <div className="overflow-hidden rounded-xl border border-[#D1DEE8] bg-[#f4f7fb]">
      <div className="flex items-center gap-3 border-b border-[#D1DEE8] bg-white px-4 py-3">
        <span
          className={cn(
            'flex h-9 w-9 items-center justify-center rounded-lg',
            isPdfDoc(doc)
              ? 'bg-[#FEE2E2] text-[#DC2626]'
              : 'bg-[#eef5fc] text-[#154F7A]',
          )}
        >
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#1a2b3c]">
            {doc.name}
          </p>
          <p className="text-xs text-[#6b7c8f]">
            {doc.type} · {doc.size}
          </p>
        </div>
      </div>
      <div className="space-y-3 px-6 py-10">
        <div className="mx-auto max-w-md rounded-lg border border-[#D1DEE8] bg-white p-5 shadow-sm">
          <div className="mb-4 h-2.5 w-2/5 rounded bg-[#D1DEE8]" />
          <div className="space-y-2">
            <div className="h-2 w-full rounded bg-[#E8EEF4]" />
            <div className="h-2 w-[92%] rounded bg-[#E8EEF4]" />
            <div className="h-2 w-[85%] rounded bg-[#E8EEF4]" />
            <div className="h-2 w-[96%] rounded bg-[#E8EEF4]" />
            <div className="h-2 w-[70%] rounded bg-[#E8EEF4]" />
          </div>
          <div className="mt-6 space-y-2">
            <div className="h-2 w-full rounded bg-[#E8EEF4]" />
            <div className="h-2 w-[88%] rounded bg-[#E8EEF4]" />
            <div className="h-2 w-[78%] rounded bg-[#E8EEF4]" />
          </div>
        </div>
        <p className="text-center text-xs text-[#6b7c8f]">
          Sample document preview
          {doc.uploadedBy ? ` · Uploaded by ${doc.uploadedBy}` : ''}
          {doc.uploadedAt ? ` · ${doc.uploadedAt}` : ''}
        </p>
      </div>
    </div>
  )
}

export default function DocumentsPanel({ caseData }) {
  const { addDocument, updateDocument, deleteDocument, showToast } = useApp()
  const addInputRef = useRef(null)
  const replaceInputRef = useRef(null)
  const replaceIdRef = useRef(null)
  const [viewing, setViewing] = useState(null)

  const documents = caseData.documents || []
  const isEmpty = documents.length === 0

  const handleAddClick = () => addInputRef.current?.click()

  const handleAddFiles = (e) => {
    const files = Array.from(e.target.files || [])
    e.target.value = ''
    if (!files.length) return
    files.forEach((file) => addDocument(caseData.id, file))
    showToast({
      type: 'success',
      message:
        files.length === 1
          ? 'Document uploaded successfully'
          : `${files.length} documents uploaded successfully`,
    })
  }

  const handleReplaceClick = (docId) => {
    replaceIdRef.current = docId
    replaceInputRef.current?.click()
  }

  const handleReplaceFile = (e) => {
    const file = e.target.files?.[0]
    const docId = replaceIdRef.current
    e.target.value = ''
    replaceIdRef.current = null
    if (!file || !docId) return
    updateDocument(caseData.id, docId, file)
    showToast({
      type: 'success',
      message: 'Document updated successfully',
    })
  }

  const handleDelete = (doc) => {
    if (viewing?.id === doc.id) setViewing(null)
    deleteDocument(caseData.id, doc.id)
    showToast({
      type: 'success',
      message: `"${doc.name}" deleted successfully`,
    })
  }

  return (
    <>
      <div className="overflow-hidden rounded-2xl border border-[#D1DEE8] bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#D1DEE8] bg-[#eef5fc] px-5 py-3.5">
          <div>
            <h3 className="text-sm font-semibold text-[#154F7A]">Documents</h3>
            <p className="mt-0.5 text-xs text-[#6b7c8f]">
              {isEmpty
                ? 'Upload supporting documents for this case'
                : `${documents.length} document${documents.length === 1 ? '' : 's'} uploaded`}
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus className="h-3.5 w-3.5" />}
            onClick={handleAddClick}
          >
            Add Document
          </Button>
          <input
            ref={addInputRef}
            type="file"
            className="hidden"
            multiple
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={handleAddFiles}
          />
          <input
            ref={replaceInputRef}
            type="file"
            className="hidden"
            accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
            onChange={handleReplaceFile}
          />
        </div>

        {isEmpty ? (
          <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#eef5fc] text-[#154F7A]">
              <Upload className="h-6 w-6" strokeWidth={1.75} />
            </span>
            <p className="text-base font-semibold text-[#1a2b3c]">
              No document added yet
            </p>
            <p className="mt-1 max-w-sm text-sm text-[#6b7c8f]">
              Add KYC, bank statements, or other supporting files for this case.
            </p>
            <Button
              className="mt-5"
              size="sm"
              leftIcon={<Plus className="h-3.5 w-3.5" />}
              onClick={handleAddClick}
            >
              Add Document
            </Button>
          </div>
        ) : (
          <ul className="divide-y divide-[#E8EEF4]">
            {documents.map((doc) => {
              const Icon = fileIcon(doc.type)
              return (
                <li
                  key={doc.id}
                  className="flex flex-col gap-3 px-5 py-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <span
                      className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                        doc.type === 'PDF'
                          ? 'bg-[#FEE2E2] text-[#DC2626]'
                          : 'bg-[#eef5fc] text-[#154F7A]',
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={1.75} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-[#1a2b3c]">
                        {doc.name}
                      </p>
                      <p className="mt-0.5 text-xs text-[#6b7c8f]">
                        {doc.type} · {doc.size}
                        {doc.uploadedAt ? ` · ${doc.uploadedAt}` : ''}
                      </p>
                      {doc.uploadedBy ? (
                        <p className="mt-0.5 text-xs text-[#8a9aab]">
                          Uploaded by {doc.uploadedBy}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <div className="flex shrink-0 flex-wrap items-center gap-2 sm:pl-4">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Eye className="h-3.5 w-3.5" />}
                      onClick={() => setViewing(doc)}
                    >
                      View
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      leftIcon={<Pencil className="h-3.5 w-3.5" />}
                      onClick={() => handleReplaceClick(doc.id)}
                    >
                      Update
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      leftIcon={<Trash2 className="h-3.5 w-3.5" />}
                      onClick={() => handleDelete(doc)}
                      className="!rounded-full border border-red-200 hover:border-red-300"
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </div>

      <Modal
        open={Boolean(viewing)}
        onClose={() => setViewing(null)}
        title={viewing?.name || 'Document'}
        width="max-w-4xl"
        footer={
          <>
            {viewing?.url ? (
              <Button
                variant="secondary"
                onClick={() =>
                  window.open(viewing.url, '_blank', 'noopener,noreferrer')
                }
              >
                Open in new tab
              </Button>
            ) : null}
            <Button onClick={() => setViewing(null)}>Close</Button>
          </>
        }
      >
        {viewing ? <DocumentPreview doc={viewing} /> : null}
      </Modal>
    </>
  )
}
