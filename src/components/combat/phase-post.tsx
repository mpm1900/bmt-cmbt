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
import { GiCreditsCurrency } from 'react-icons/gi'

function PhasePost() {
  const { state, deleteCombat } = useGameState((s) => s)
  const playerID = usePlayerID()
  const player = state.players.find((p) => p.ID === playerID)!
  const encounter = state.players.find((p) => p.ID !== playerID)!
  const dead = isPlayerDead(state, player)

  return (
    <Card className="w-90 m-auto">
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
