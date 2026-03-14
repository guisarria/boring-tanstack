import { Link } from "@tanstack/react-router"

import { Button } from "./ui/button"

export function DefaultNotFound() {
  return (
    <div className="space-y-2 p-2">
      <p>The page you are looking for does not exist.</p>
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={() => window.history.back()} type="button">
          Go back
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
