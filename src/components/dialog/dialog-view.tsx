import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { useGameUI } from '@/hooks/useGameUI'

function DialogView() {
  const { createCombat } = useGameState((s) => s)
  const { set } = useGameUI((s) => s)
  return (
    <div className="flex-1 flex items-center justify-center px-16">
      <div className="flex flex-1 gap-4 items-center justify-center max-w-252">
        <Card>
          <CardContent>
            <Button
              onClick={() => {
                createCombat()
                set({ view: 'actions' })
              }}
            >
              Create Combat
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export { DialogView }
