import clsx from 'clsx'

export default function Card({ children, className, padded = true, ...rest }) {
  return (
    <div
      className={clsx(
        'bg-white rounded-card shadow-soft',
        padded && 'p-4',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}
