import clsx from 'clsx'

const variants = {
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-turmeric-50 text-turmeric-600',
  danger: 'bg-chili-50 text-chili-600',
  neutral: 'bg-mist text-ledger',
}

export default function Badge({ children, variant = 'neutral', className }) {
  return (
    <span
      className={clsx(
        'inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium',
        variants[variant],
        className
      )}
    >
      {children}
    </span>
  )
}
