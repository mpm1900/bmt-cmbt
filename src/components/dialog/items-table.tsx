import type { ReactNode } from 'react'
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../ui/table'
import type { SItem } from '@/game/state'
import { Ellipsis } from 'lucide-react'

function ItemsTable({
  items,
  actions,
}: {
  items: Array<SItem>
  actions: (item: SItem) => ReactNode
}) {
  const counts = items.reduce(
    (acc, item) => {
      if (acc[item.ID] !== undefined) {
        acc[item.ID] = acc[item.ID] + 1
      } else {
        acc[item.ID] = 1
      }
      return acc
    },
    {} as Record<string, number>
  )
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="flex items-center justify-end">
            <Ellipsis />
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(counts)
          .map(
            ([itemID, count]) =>
              [items.find((i) => i.ID === itemID)!, count] as const
          )
          .map(([item, count]) => (
            <TableRow key={item.ID}>
              <TableCell>{count}</TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                The quick brown fox jumps over the lazy dog.
              </TableCell>
              <TableCell className="flex justify-end gap-1">
                {actions(item)}
              </TableCell>
            </TableRow>
          ))}
      </TableBody>
      {items.length === 0 && <TableCaption>No items available.</TableCaption>}
    </Table>
  )
}

export { ItemsTable }
