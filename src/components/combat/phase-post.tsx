import { ArrowRight } from 'lucide-react'
import { Button } from '../ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card'
import { useGameState } from '@/hooks/useGameState'
import { usePlayerID } from '@/hooks/usePlayer'
import { isPlayerDead } from '@/game/player'
import { getAliveInactiveActors } from '@/game/access'
import { newContext } from '@/game/mutations'
import { GiCreditsCurrency } from 'react-icons/gi'

function PhasePost() {
  const { state, deleteCombat } = useGameState((s) => s)
  const playerID = usePlayerID()
  const player = state.players.find((p) => p.ID === playerID)!
  const encounter = state.players.find((p) => p.ID !== playerID)!
  const context = newContext({ playerID })
  const dead = isPlayerDead(
    player,
    getAliveInactiveActors(state, context).length
  )

  return (
    <Card className="w-90 mt-16 self-center">
      <CardHeader>
        {dead ? (
          <CardTitle>You Lose.</CardTitle>
        ) : (
          <CardTitle>Victory!</CardTitle>
        )}
      </CardHeader>
      {!dead && (
        <CardContent>
          <p>Rewards:</p>
          <span className="inline-flex items-center">
            {encounter.credits} <GiCreditsCurrency />
          </span>
          <ul>
            {encounter.items.map((item) => (
              <li key={item.ID}>{item.name}</li>
            ))}
          </ul>
        </CardContent>
      )}
      <CardFooter className="justify-end">
        {!dead && (
          <Button
            onClick={() => {
              deleteCombat()
            }}
          >
            Continue
            <ArrowRight />
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

export { PhasePost }
