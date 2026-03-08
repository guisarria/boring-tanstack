/** biome-ignore-all lint/performance/useTopLevelRegex: <a> */
import { Link, useMatches } from "@tanstack/react-router"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

function formatSegment(segment: string) {
  return segment.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())
}

export function AppHeader() {
  const matches = useMatches()

  const breadcrumbs = matches
    .filter((match) => {
      const pathname = match.pathname.replace(/\/$/, "")
      return pathname.startsWith("/dashboard") && pathname !== "/dashboard"
    })
    .map((match) => {
      const pathname = match.pathname.replace(/\/$/, "")
      const segment = pathname.split("/").pop() ?? ""
      return {
        label: formatSegment(segment),
        path: pathname,
      }
    })

  return (
    <header className="border-border border-b py-2 pl-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink render={<Link to="/dashboard" />}>
              Dashboard
            </BreadcrumbLink>
          </BreadcrumbItem>
          {breadcrumbs.map((crumb) => (
            <BreadcrumbItem key={crumb.path}>
              <BreadcrumbSeparator />
              <BreadcrumbPage className="text-foreground/90">
                {crumb.label}
              </BreadcrumbPage>
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
