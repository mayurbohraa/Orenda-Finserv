/** Applicant summary card */
import {
  Building2,
  CreditCard,
  FileText,
  Headphones,
  Landmark,
  MapPin,
  Pencil,
  UserRound,
} from 'lucide-react'
import Button from '../ui/Button'
import Card from '../ui/Card'
import { formatIndianCurrency } from '../../utils/helpers'

/** Labeled field with icon */
function Field({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-2.5">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[#9aa8b8]" strokeWidth={1.75} />
      <div className="min-w-0">
        <p className="text-xs text-muted">{label}</p>
        <p className="mt-0.5 text-sm font-semibold text-ink">{value}</p>
      </div>
    </div>
  )
}

export default function ApplicantPreview({ caseData, onEdit }) {
  return (
    <Card
      title="Applicant"
      action={
        <Button
          variant="ghost"
          size="sm"
          leftIcon={<Pencil className="h-3.5 w-3.5" />}
          onClick={onEdit}
        >
          Edit Details
        </Button>
      }
      padding={false}
      bodyClassName="p-5"
    >
      <div className="grid gap-x-6 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field icon={UserRound} label="Borrower Name" value={caseData.borrowerName} />
        <Field icon={FileText} label="Case Number" value={caseData.caseNumber} />
        <Field icon={Landmark} label="Type of Loan" value={caseData.loanType} />
        <Field icon={Building2} label="Constitution" value={caseData.constitution} />
        <Field
          icon={CreditCard}
          label="Loan requirement"
          value={formatIndianCurrency(caseData.loanAmount)}
        />
        <Field
          icon={MapPin}
          label="Location"
          value={`${caseData.city}, ${caseData.state}`}
        />
        <Field
          icon={Headphones}
          label="Assigned Case Manager"
          value={caseData.assignedCaseManager}
        />
      </div>
    </Card>
  )
}
