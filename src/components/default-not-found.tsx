import { Link } from "@tanstack/react-router"

import { Button } from "./ui/button"

export function DefaultNotFound() {
  return (
    <div className="space-y-2 p-2">
      <p>This page doesn&apos;t exist. Try heading back or returning home.</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => window.history.back()} type="button">
          Go Back
        </Button>
        <Button
          nativeButton={false}
          render={<Link to="/" />}
          variant="secondary"
        >
          Home
        </Button>
      </div>
    </div>
  )
}
