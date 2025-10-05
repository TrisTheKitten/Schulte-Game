import { forwardRef } from 'react'
import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

type ScrollAreaProps = HTMLAttributes<HTMLDivElement>

export const ScrollArea = forwardRef<HTMLDivElement, ScrollAreaProps>(function ScrollArea(
  { className, ...props },
  ref
) {
  return (
    <div
      ref={ref}
      className={cn(
        'overflow-y-auto overscroll-contain [mask-image:linear-gradient(to_bottom,transparent,black_16%,black_84%,transparent)]',
        className
      )}
      {...props}
    />
  )
})
