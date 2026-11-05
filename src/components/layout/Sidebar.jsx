/** Sidebar navigation */
import { NavLink } from 'react-router-dom'
import {
  ChevronsLeft,
  ChevronsRight,
  Folder,
  Home,
  LifeBuoy,
} from 'lucide-react'
import { useApp } from '../../contexts/useApp'
import { cn } from '../../utils/helpers'
import ScrollInset from '../ui/ScrollInset'

function OrendaLogo({ collapsed }) {
  if (collapsed) {
    return (
      <img
        src="/logo-mark.svg"
        alt="Orenda"
        className="mx-auto h-8 w-8 object-contain"
      />
    )
  }

  return (
    <img
      src="/logo-full.svg"
      alt="Orenda — Finances Simplified"
      className="h-10 w-auto max-w-[175px] object-contain object-left"
    />
  )
}

const navItems = [
  { to: '/', label: 'Home', icon: Home, end: true },
  { to: '/cases', label: 'Cases', icon: Folder },
]

export default function Sidebar() {
  const { sidebarCollapsed, setSidebarCollapsed, showToast } = useApp()

  return (
    <aside
      className={cn(
        'relative z-20 flex h-full shrink-0 flex-col border-r border-[#D1DEE8] bg-white transition-[width] duration-200',
        'w-14 sm:w-[72px]',
        sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[240px]',
      )}
    >
      <div className="flex items-center justify-between gap-2 px-2 py-4 lg:px-3">
        <div className="min-w-0 flex-1">
          <div className="lg:hidden">
            <OrendaLogo collapsed />
          </div>
          <div className="hidden lg:block">
            <OrendaLogo collapsed={sidebarCollapsed} />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setSidebarCollapsed((v) => !v)}
          className="hidden rounded-md p-1.5 text-muted hover:bg-brand-50 hover:text-brand-800 lg:block"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronsRight className="h-4 w-4" />
          ) : (
            <ChevronsLeft className="h-4 w-4" />
          )}
        </button>
      </div>

      <ScrollInset
        as="nav"
        className="mt-1 flex min-h-0 flex-1 flex-col gap-1 px-2 lg:px-3"
      >
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              title={item.label}
              aria-label={item.label}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium transition-colors lg:justify-start lg:px-3',
                  isActive
                    ? 'bg-[#154F7A] text-white'
                    : 'text-[#4a5d70] hover:bg-brand-50',
                  sidebarCollapsed && 'justify-center px-2',
                )
              }
            >
              <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
              {!sidebarCollapsed ? (
                <span className="hidden lg:inline">{item.label}</span>
              ) : null}
            </NavLink>
          )
        })}
      </ScrollInset>

      <div className="mt-auto border-t border-[#D1DEE8] px-2 py-4 lg:px-3">
        <button
          type="button"
          onClick={() =>
            showToast({
              type: 'info',
              message:
                'Support is unavailable in this demo. No support request has been sent.',
            })
          }
          aria-label="Support"
          className={cn(
            'flex w-full items-center justify-center gap-3 rounded-lg px-2 py-2.5 text-sm font-medium text-[#4a5d70] hover:bg-brand-50 lg:justify-start lg:px-3',
            sidebarCollapsed && 'justify-center px-2',
          )}
          title="Support"
        >
          <LifeBuoy className="h-[18px] w-[18px] shrink-0" strokeWidth={1.75} />
          {!sidebarCollapsed ? (
            <span className="hidden lg:inline">Support</span>
          ) : null}
        </button>
      </div>
    </aside>
  )
}
