/** Co-applicant summary card */
import {
  Building2,
  CreditCard,
  FileText,
  Heart,
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

export default function CoApplicantPreview({ caseData, coApplicant, onEdit }) {
  return (
    <Card
      title="Co-Applicant"
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
    >
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        <Field icon={UserRound} label="Co-Applicant Name" value={coApplicant.name} />
        <Field icon={FileText} label="Case Number" value={caseData.caseNumber} />
        <Field icon={Landmark} label="Type of Loan" value={coApplicant.loanType} />
        <Field icon={Building2} label="Constitution" value={coApplicant.constitution} />
        <Field
          icon={CreditCard}
          label="Loan requirement"
          value={formatIndianCurrency(coApplicant.loanAmount)}
        />
        <Field
          icon={MapPin}
          label="Location"
          value={`${coApplicant.city}, ${coApplicant.state}`}
        />
        <Field icon={Heart} label="Relationship" value={coApplicant.relationship} />
      </div>
    </Card>
  )
}
