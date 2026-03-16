import { type LucideIcon, Monitor, Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { useTheme } from "./providers/theme-provider"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"
import { Item, ItemActions, ItemContent, ItemTitle } from "./ui/item"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select"

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
      aria-label="Toggle theme"
      className={cn("items-center", className)}
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size={size}
      variant={variant}
    >
      <Sun className="dark:hidden" />
      <Moon className="hidden dark:block" />
      {label && <span>Toggle theme</span>}
    </Button>
  )
}

const items = [
  {
    label: "Light",
    value: "light",
    icon: Sun,
    richClassName:
      "text-amber-400 group-hover:text-amber-500 dark:text-amber-500 dark:group-hover:text-amber-400",
  },
  {
    label: "Dark",
    value: "dark",
    icon: Moon,
    richClassName:
      "text-indigo-400 group-hover:text-indigo-500 dark:text-indigo-500 dark:group-hover:text-indigo-400",
  },
  {
    label: "System",
    value: "system",
    icon: Monitor,
    richClassName: "text-foreground/80 group-hover:text-muted-foreground",
  },
] satisfies {
  label: string
  value: string
  icon: LucideIcon
  richClassName: string
}[]

export function ThemeSelect({ richColors = false }: { richColors?: boolean }) {
  const { theme, setTheme } = useTheme()

  const activeItem = items.find((item) => item.value === theme)
  const ActiveIcon: LucideIcon | undefined = activeItem?.icon

  return (
    <Select onValueChange={(value) => value && setTheme(value)} value={theme}>
      <SelectTrigger>
        <SelectValue className="flex w-16 items-center gap-x-2">
          {ActiveIcon && (
            <ActiveIcon
              className={cn(
                "size-3",
                richColors
                  ? activeItem?.richClassName
                  : "text-muted-foreground",
              )}
            />
          )}
          {activeItem?.label}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {items.map((item) => (
            <SelectItem key={item.value} className="group" value={item.value}>
              <div className="flex items-center gap-x-1.5">
                <item.icon
                  className={cn(
                    "size-3",
                    richColors ? item.richClassName : "text-muted-foreground",
                  )}
                />
                {item.label}
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}

export function ThemeItem() {
  const { setTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Item variant="outline">
            <ItemContent>
              <ItemTitle>Change Theme</ItemTitle>
            </ItemContent>
            <ItemActions className="[&_svg]:size-4">
              <Sun className="dark:hidden" />
              <Moon className="hidden dark:block" />
            </ItemActions>
          </Item>
        }
      />
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
