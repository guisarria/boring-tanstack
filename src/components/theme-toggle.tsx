import { Moon, Sun } from "lucide-react"
import { Activity } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useTheme } from "./providers/theme-provider"

export function ThemeToggle({
  variant = "outline",
  size = "icon",
  className,
  label = false,
}: {
  variant?: "outline" | "ghost" | "default" | "destructive"
  size?: "default" | "lg" | "sm" | "icon-sm" | "icon" | "icon-lg"
  className?: string
  label?: boolean
}) {
  const { theme, setTheme } = useTheme()

  return (
    <Button
      className={cn("text-muted-foreground", className)}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size={size}
      variant={variant}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
      <Activity mode={label ? "visible" : "hidden"}>
        <span>Toggle theme</span>
      </Activity>
    </Button>
  )
}
