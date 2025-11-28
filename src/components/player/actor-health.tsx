import * as React from 'react'

import { Gauge } from '../gauge'

function ActorHealth({
  showHealthNumbers,
  health,
  maxHealth,
  children,
}: React.ComponentProps<'div'> & {
  showHealthNumbers: boolean
  health: number
  maxHealth: number
  children?: React.ReactNode
}) {
  const value = maxHealth === 0 ? 0 : (health * 100) / maxHealth

  return (
    <Gauge value={value}>
      {showHealthNumbers && (
        <div className="absolute top-0.5 right-1 z-10 leading-4 title text-xl text-foreground text-shadow-md">
          {children || (
            <>
              {Math.max(health, 0)}/{maxHealth}
            </>
          )}
        </div>
      )}
    </Gauge>
  )
}

export { ActorHealth }
