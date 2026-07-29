/** Button */
import { cn } from '../../utils/helpers'

const variants = {
  primary:
    'bg-[#154F7A] text-white hover:bg-[#0F3D5E] disabled:bg-[#c5ced8] disabled:text-white disabled:cursor-not-allowed',
  secondary:
    'bg-white text-[#154F7A] border border-[#154F7A] hover:bg-brand-50 disabled:opacity-50',
  tertiary:
    'bg-transparent text-link hover:text-brand-700 hover:underline disabled:opacity-50',
  ghost:
    'bg-white text-[#2b7de9] border border-[#2b7de9] hover:bg-brand-50 rounded-full',
  danger:
    'bg-transparent text-red-600 hover:bg-red-50',
}

const sizes = {
  sm: 'h-8 px-3 text-xs rounded-full gap-1.5',
  md: 'h-10 px-5 text-sm rounded-full gap-2',
  lg: 'h-11 px-6 text-sm rounded-full gap-2',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  leftIcon,
  rightIcon,
  type = 'button',
  disabled,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={cn(
        'inline-flex cursor-pointer items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500/40',
        variants[variant],
        sizes[size],
        className,
      )}
      {...props}
    >
      {leftIcon}
      {children}
      {rightIcon}
    </button>
  )
}
