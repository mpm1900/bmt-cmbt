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
import { groupItems } from '@/game/player'

function ItemsTable({
  items,
  actionHeader,
  actions,
}: {
  items: Array<SItem>
  actionHeader?: ReactNode
  actions: (item: SItem) => ReactNode
}) {
  const counts = groupItems(items)
  return (
    <Table>
      <TableHeader>
        <TableRow className="pointer-events-none">
          <TableHead></TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="flex items-center justify-end">
            {actionHeader ?? <Ellipsis />}
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {Object.entries(counts)
          .map(
            ([name, count]) =>
              [items.find((i) => i.name === name)!, count] as const
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
