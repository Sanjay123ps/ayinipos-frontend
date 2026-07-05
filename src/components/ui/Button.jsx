import clsx from 'clsx'

const variants = {
  primary: 'bg-emerald-600 text-white active:bg-emerald-700 shadow-soft',
  accent: 'bg-turmeric-500 text-ink active:bg-turmeric-600 shadow-soft',
  ghost: 'bg-mist text-ink active:bg-mist/70',
  outline: 'bg-transparent border border-mist text-ink active:bg-mist/40',
  danger: 'bg-chili-50 text-chili-600 active:bg-chili-50/70',
}

const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2.5 text-sm',
  lg: 'px-5 py-3.5 text-base',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  full,
  ...rest
}) {
  return (
    <button
      className={clsx(
        'inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-colors disabled:opacity-40 disabled:pointer-events-none',
        variants[variant],
        sizes[size],
        full && 'w-full',
        className
      )}
      {...rest}
    >
      {children}
    </button>
  )
}
