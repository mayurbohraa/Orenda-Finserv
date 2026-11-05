/** Header — breadcrumb, points, notifications, profile */
import { useEffect, useRef, useState } from 'react'
import {
  Bell,
  ChevronDown,
  FileText,
  LogOut,
  Mail,
  Star,
  UserRound,
} from 'lucide-react'
import { useApp } from '../../contexts/useApp'
import { cn } from '../../utils/helpers'
import ScrollInset from '../ui/ScrollInset'

export default function Header({ breadcrumb }) {
  const {
    user,
    showToast,
    notifications,
    unreadCount,
    markNotificationRead,
    markAllNotificationsRead,
  } = useApp()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const menuRef = useRef(null)
  const notifRef = useRef(null)

  const handleMenuKeys = (event) => {
    if (!['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(event.key)) return
    event.preventDefault()
    const items = [
      ...event.currentTarget.querySelectorAll('button:not(:disabled)'),
    ]
    const current = items.indexOf(document.activeElement)
    const next =
      event.key === 'Home'
        ? 0
        : event.key === 'End'
          ? items.length - 1
          : (current + (event.key === 'ArrowDown' ? 1 : -1) + items.length) %
            items.length
    items[next]?.focus()
  }

  useEffect(() => {
    if (menuOpen) menuRef.current?.querySelector('[role="menuitem"]')?.focus()
    if (notifOpen) notifRef.current?.querySelector('[role="menuitem"]')?.focus()
  }, [menuOpen, notifOpen])

  useEffect(() => {
    if (!menuOpen && !notifOpen) return undefined

    const onPointerDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false)
      }
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false)
      }
    }
    const onKey = (e) => {
      if (e.key === 'Escape') {
        if (menuOpen) menuRef.current?.querySelector('[aria-haspopup]')?.focus()
        if (notifOpen)
          notifRef.current?.querySelector('[aria-haspopup]')?.focus()
        setMenuOpen(false)
        setNotifOpen(false)
      }
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menuOpen, notifOpen])

  const handleLogout = () => {
    setMenuOpen(false)
    showToast({
      type: 'info',
      message:
        'This demo has no sign-in session. Your data stays available until you refresh.',
    })
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-[#D1DEE8] bg-white px-3 md:px-6">
      <div className="min-w-0 truncate text-sm text-muted">
        {typeof breadcrumb === 'string' ? (
          <span className="font-medium text-[#154F7A]">{breadcrumb}</span>
        ) : (
          breadcrumb
        )}
      </div>

      <div className="flex shrink-0 items-center">
        <div
          className="flex items-center gap-1.5 pr-2 md:pr-5"
          aria-label={`${user.rewardPoints} reward points`}
        >
          <span className="flex h-[18px] w-[18px] items-center justify-center rounded-full border border-[#154F7A] text-[#154F7A]">
            <Star className="h-[10px] w-[10px] fill-current" strokeWidth={0} />
          </span>
          <span className="text-sm font-semibold leading-none text-[#1a2b3c]">
            {user.rewardPoints}
          </span>
        </div>

        <div className="hidden h-7 w-px bg-[#d5dee8] sm:block" />

        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setNotifOpen((open) => !open)
              setMenuOpen(false)
            }}
            className="relative px-2 py-2 text-[#154F7A] hover:opacity-80 md:px-5"
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : 'Notifications'
            }
            aria-haspopup="menu"
            aria-expanded={notifOpen}
          >
            <Bell className="h-5 w-5" strokeWidth={1.75} />
            {unreadCount > 0 ? (
              <span
                className="absolute right-2 top-1 h-2 w-2 rounded-full bg-[#ef4444] md:right-5"
                aria-hidden
              />
            ) : null}
          </button>

          {notifOpen ? (
            <div
              role="menu"
              aria-label="Notifications"
              onKeyDown={handleMenuKeys}
              className="fixed left-3 right-3 top-[72px] z-50 overflow-hidden rounded-xl border border-[#D1DEE8] bg-white shadow-lg animate-slide-up sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+8px)] sm:w-[360px]"
            >
              <div className="flex items-center justify-between border-b border-[#D1DEE8] px-4 py-3">
                <div>
                  <p className="text-sm font-semibold text-[#154F7A]">
                    Notifications
                  </p>
                  <p className="text-xs text-[#6b7c8f]">
                    {unreadCount > 0
                      ? `${unreadCount} unread`
                      : 'All caught up'}
                  </p>
                </div>
                {unreadCount > 0 ? (
                  <button
                    type="button"
                    role="menuitem"
                    onClick={markAllNotificationsRead}
                    className="text-xs font-semibold text-[#2b7de9] hover:underline"
                  >
                    Mark all read
                  </button>
                ) : null}
              </div>

              <ScrollInset className="max-h-80">
                <ul>
                  {notifications.length === 0 ? (
                    <li className="px-4 py-8 text-center text-sm text-[#6b7c8f]">
                      No notifications yet
                    </li>
                  ) : (
                    notifications.map((item) => (
                      <li
                        key={item.id}
                        className="border-b border-[#EEF2F6] last:border-b-0"
                      >
                        <button
                          type="button"
                          role="menuitem"
                          onClick={() => markNotificationRead(item.id)}
                          className={cn(
                            'flex w-full gap-3 px-4 py-3 text-left hover:bg-[#F7FAFC]',
                            !item.read && 'bg-[#F0F7FF]',
                          )}
                        >
                          <span
                            className={cn(
                              'mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full',
                              item.read
                                ? 'bg-[#EEF2F6] text-[#6b7c8f]'
                                : 'bg-[#e8f3fa] text-[#154F7A]',
                            )}
                          >
                            {item.type === 'document' ? (
                              <FileText
                                className="h-4 w-4"
                                strokeWidth={1.75}
                              />
                            ) : (
                              <Bell className="h-4 w-4" strokeWidth={1.75} />
                            )}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex items-start justify-between gap-2">
                              <span
                                className={cn(
                                  'text-sm text-[#1a2b3c]',
                                  !item.read && 'font-semibold',
                                )}
                              >
                                {item.title}
                              </span>
                              {!item.read ? (
                                <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#2b7de9]" />
                              ) : null}
                            </span>
                            <span className="mt-0.5 block text-xs text-[#6b7c8f]">
                              {item.message}
                            </span>
                            <span className="mt-1 block text-[11px] text-[#8a9aab]">
                              {item.time}
                            </span>
                          </span>
                        </button>
                      </li>
                    ))
                  )}
                </ul>
              </ScrollInset>
            </div>
          ) : null}
        </div>

        <div className="hidden h-7 w-px bg-[#d5dee8] sm:block" />

        <div ref={menuRef} className="relative">
          <button
            type="button"
            onClick={() => {
              setMenuOpen((open) => !open)
              setNotifOpen(false)
            }}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label={`${user.name}, profile`}
            className="flex items-center gap-2.5 py-1 pl-2 pr-0 hover:opacity-90 md:pl-5"
          >
            <span
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-semibold text-white"
              style={{ backgroundColor: user.avatarBg }}
            >
              {user.initials}
            </span>
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-sm font-semibold text-[#154F7A]">
                {user.name}
              </span>
              <span className="block text-xs text-[#6b7c8f]">{user.role}</span>
            </span>
            <ChevronDown
              className={cn(
                'hidden h-4 w-4 text-[#154F7A] transition-transform sm:block',
                menuOpen && 'rotate-180',
              )}
            />
          </button>

          {menuOpen ? (
            <div
              role="menu"
              aria-label="Profile"
              onKeyDown={handleMenuKeys}
              className="fixed left-3 right-3 top-[72px] z-50 overflow-hidden rounded-xl border border-[#D1DEE8] bg-white py-2 shadow-lg animate-slide-up sm:absolute sm:left-auto sm:right-0 sm:top-[calc(100%+8px)] sm:w-64"
            >
              <div className="border-b border-[#D1DEE8] px-4 pb-3 pt-2">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white"
                    style={{ backgroundColor: user.avatarBg }}
                  >
                    {user.initials}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#154F7A]">
                      {user.name}
                    </p>
                    <p className="truncate text-xs text-[#6b7c8f]">
                      {user.role}
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-1 px-2 py-2">
                <div className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#4a5d70]">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#8a9aab]" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a9aab]">
                      Email
                    </p>
                    <p className="truncate font-medium text-[#1a2b3c]">
                      {user.email}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5 rounded-lg px-2.5 py-2 text-sm text-[#4a5d70]">
                  <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#8a9aab]" />
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium uppercase tracking-wide text-[#8a9aab]">
                      Role
                    </p>
                    <p className="font-medium text-[#1a2b3c]">{user.role}</p>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#D1DEE8] px-2 pt-2">
                <button
                  type="button"
                  role="menuitem"
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2.5 text-sm font-medium text-[#dc2626] hover:bg-red-50"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  )
}
