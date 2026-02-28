import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useTheme } from "./theme-provider"

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size="icon-sm"
      variant="outline"
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
