import { createFileRoute, Link } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
})

function App() {
  return (
    <div className="flex gap-4">
      <Link to="/battle">to battle d460048e-1012-42a7-a630-74620254ab07</Link>
    </div>
  )
}
