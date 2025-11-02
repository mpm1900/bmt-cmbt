import type { ComponentProps } from 'react'
import { Card } from '../ui/card'
import { cn } from '@/lib/utils'

function DialogCard({ className, ...props }: ComponentProps<typeof Card>) {
  return <Card className={cn('h-152 w-172 gap-3', className)} {...props} />
}

export { DialogCard }
