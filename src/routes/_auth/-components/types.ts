import type { NavItem } from "./sidebar-nav-group"

export type ChatTarget = { id: string; title: string }

export type NavGroup = {
  label: string
  items: NavItem[]
}
