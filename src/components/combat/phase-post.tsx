import { useGameUI } from '@/hooks/useGameUI'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useGameState } from '@/hooks/useGameState'

function PhasePost() {
  const { set } = useGameUI((s) => s)
  const { deleteCombat } = useGameState((s) => s)
  return (
    <Card>
      <CardHeader>
        <CardTitle>The battle is over</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => {
            set({ view: 'dialog' })
            deleteCombat()
          }}
        >
          continue
        </Button>
      </CardContent>
    </Card>
  )
}

export { PhasePost }
