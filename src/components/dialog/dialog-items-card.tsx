import { useGameState } from '@/hooks/useGameState'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { usePlayerID } from '@/hooks/usePlayer'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import { MiniDropdown } from '../mini-dropdown'

function DialogItemsCard() {
  const state = useGameState((s) => s.state)
  const playerID = usePlayerID()
  const player = state.players.find((p) => p.ID === playerID)

  if (!player) return null
  return (
    <Card className="h-140 w-172">
      <CardHeader>
        <CardTitle>Items</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-end">...</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {player.items.map((item) => (
              <TableRow key={item.ID}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="flex justify-end gap-1">
                  {(item.use || item.consumable) && (
                    <MiniDropdown>Use</MiniDropdown>
                  )}
                  {item.actions && <MiniDropdown>Equip</MiniDropdown>}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}

export { DialogItemsCard }
