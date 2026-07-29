/** Activity log panel */
import Card from '../ui/Card'
import Timeline from '../ui/Timeline'
import ScrollInset from '../ui/ScrollInset'
import { cn } from '../../utils/helpers'

export default function ActivityLogPanel({ items = [], className }) {
  return (
    <Card
      title="Activity Log"
      className={cn('flex h-full min-h-0 flex-col', className)}
      padding={false}
      bodyClassName="flex min-h-0 flex-1 flex-col overflow-hidden"
      headerClassName="bg-[#eef5fc]"
    >
      <ScrollInset className="min-h-0 flex-1 px-4 py-4 pr-3">
        <Timeline items={items} />
      </ScrollInset>
    </Card>
  )
}
