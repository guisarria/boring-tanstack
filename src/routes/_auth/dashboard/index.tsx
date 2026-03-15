import { createFileRoute } from "@tanstack/react-router"
import { useState } from "react"

import { LexicalEditor } from "@/components/lexical-editor"

export const Route = createFileRoute("/_auth/dashboard/")({
  component: RouteComponent,
})

function RouteComponent() {
  const [value, setValue] = useState("")

  return (
    <LexicalEditor
      onChange={setValue}
      placeholder="Type something..."
      value={value}
    />
  )
}
