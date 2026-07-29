/** App layout — sidebar + page content */
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Toast from '../ui/Toast'

export default function AppLayout() {
  return (
    <div className="flex h-svh max-h-svh overflow-hidden bg-surface">
      <Sidebar />
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Outlet />
      </div>
      <Toast />
    </div>
  )
}
