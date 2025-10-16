import type { ComponentProps } from 'react'
import { Button } from './ui/button'
import { cn } from '@/lib/utils'

type ItemButtonProps = ComponentProps<typeof Button>

function ItemButton({ className, ...props }: ItemButtonProps) {
  return <Button {...props} className={cn('h-auto p-4', className)} />
}

export { ItemButton }
