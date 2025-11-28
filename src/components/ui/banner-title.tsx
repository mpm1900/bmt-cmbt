import { cn } from '@/lib/utils'

function BannerTitle({ className, children }: React.ComponentProps<'div'>) {
  return (
    <div className={cn('h-10 -mt-6 -ml-4 relative', className)}>
      <div className="triangle border-t-yellow-950/50 absolute -bottom-4 -left-0.5 z-0"></div>
      <div className="px-8 title text-2xl bg-yellow-950 border border-yellow-900/50 leading-10 rounded-xs relative text-shadow-xl shadow-xl z-10 ring ring-black">
        {children}
      </div>
    </div>
  )
}

export { BannerTitle }
