import { cn } from '@/lib/utils'
import type { ComponentProps } from 'react'

function ButtonGrid({
  className,
  grid,
  ...props
}: ComponentProps<'div'> & {
  grid: [number, number]
}) {
  const [rows, cols] = grid

  return (
    <div
      className={cn(
        `grid grid-cols-${cols} grid-rows-${rows}`,
        `[&>*]:rounded-none [&>*:first-child]:rounded-tl-lg [&>*:last-child]:rounded-br-lg`,
        className
      )}
      {...props}
    ></div>
  )
}

export { ButtonGrid }
