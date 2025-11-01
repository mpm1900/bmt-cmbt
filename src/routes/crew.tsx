import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/crew')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="h-screen w-screen flex flex-col items-between bg-cover bg-no-repeat">
      Hello "/crew"!
    </div>
  )
}
