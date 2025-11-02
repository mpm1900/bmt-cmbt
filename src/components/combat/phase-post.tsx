import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { useGameState } from '@/hooks/useGameState'

function PhasePost() {
  const { deleteCombat, state } = useGameState((s) => s)
  return (
    <Card>
      <CardHeader>
        <CardTitle>The battle is over</CardTitle>
      </CardHeader>
      <CardContent>
        <Button
          onClick={() => {
            deleteCombat(state.dialog.activeNodeID!)
          }}
        >
          continue
        </Button>
      </CardContent>
    </Card>
  )
}

export { PhasePost }
