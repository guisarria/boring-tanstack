import {
  CheckIcon,
  Frame,
  InboxIcon,
  MapIcon,
  PieChart,
  ScanIcon,
  Settings2,
} from "lucide-react"
import {
  Avatar,
  AvatarBadge,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Empty, EmptyTitle } from "@/components/ui/empty"
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item"
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"

const navGroups = [
  {
    label: "Main",
    items: [
      { title: "Inbox", icon: InboxIcon, isActive: true },
      { title: "My Issues", icon: ScanIcon },
      { title: "Account", icon: Settings2 },
    ],
  },
  {
    label: "Projects",
    items: [
      { title: "Design Engineering", icon: Frame },
      { title: "Sales & Marketing", icon: PieChart },
      { title: "Travel", icon: MapIcon },
    ],
  },
]

const emails = [
  {
    title: "Midnight City Lights",
    description: "Neon Dreams",
  },
  {
    title: "Coffee Shop Conversations",
    description: "The Morning Brew",
  },
  {
    title: "Digital Rain",
    description: "Cyber Symphony",
  },
]

export function DashboardMockup() {
  return (
    <div className="relative w-full max-w-5xl overflow-hidden rounded-xl border border-border bg-background shadow-2xl">
      <div className="h-[600px] overflow-hidden">
        <SidebarProvider className="h-full">
          <Sidebar
            className="h-full border-border border-r"
            collapsible="none"
            variant="inset"
          >
            <SidebarHeader className="px-4 pt-4">
              <div className="mb-4 flex items-center gap-2">
                <div className="h-8 w-8 rounded-lg bg-primary" />
                <div className="flex flex-col">
                  <span className="font-semibold text-sm">Boring Inc.</span>
                  <span className="text-[10px] text-muted-foreground">
                    Pro Plan
                  </span>
                </div>
              </div>
            </SidebarHeader>
            <SidebarContent className="px-2">
              {navGroups.map((group) => (
                <SidebarGroup key={group.label}>
                  <SidebarGroupLabel className="px-2">
                    {group.label}
                  </SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => (
                        <SidebarMenuItem key={item.title}>
                          <SidebarMenuButton
                            className="w-full"
                            isActive={item.isActive}
                          >
                            <item.icon className="size-4" />
                            <span>{item.title}</span>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              ))}
            </SidebarContent>
          </Sidebar>

          <SidebarInset className="bg-background">
            <header className="flex h-14 items-center gap-4 border-border border-b px-6">
              <SidebarTrigger className="size-8" />
              <div className="h-4 w-px bg-border" />
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Dashboard</span>
                <span className="text-muted-foreground">/</span>
                <span className="font-medium">Inbox</span>
              </div>
            </header>

            <main className="flex-1 overflow-hidden">
              <ResizablePanelGroup className="h-full" orientation="horizontal">
                <ResizablePanel
                  className="border-border border-r"
                  defaultSize={40}
                  minSize={30}
                >
                  <ItemGroup className="h-full space-y-2 overflow-auto p-4">
                    {emails.map((mail, i) => (
                      <Item
                        className={cn(
                          "cursor-default transition-colors hover:bg-muted",
                          i === 0 && "bg-muted"
                        )}
                        key={mail.title}
                      >
                        <ItemMedia>
                          <Avatar className="h-8 w-8">
                            <AvatarImage
                              src={`https://avatar.vercel.sh/${mail.title}`}
                            />
                            <AvatarFallback>{mail.title[0]}</AvatarFallback>
                            {i === 0 && (
                              <AvatarBadge>
                                <CheckIcon className="size-2" />
                              </AvatarBadge>
                            )}
                          </Avatar>
                        </ItemMedia>
                        <ItemContent>
                          <ItemTitle className="text-sm">
                            {mail.title}
                          </ItemTitle>
                          <ItemDescription className="line-clamp-1 text-xs">
                            {mail.description}
                          </ItemDescription>
                        </ItemContent>
                      </Item>
                    ))}
                  </ItemGroup>
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={60}>
                  <div className="flex h-full flex-col items-center justify-center bg-muted/30">
                    <Empty className="text-center">
                      <InboxIcon className="mx-auto mb-4 size-12 text-muted-foreground/50" />
                      <EmptyTitle className="text-muted-foreground">
                        Select an item to view
                      </EmptyTitle>
                    </Empty>
                  </div>
                </ResizablePanel>
              </ResizablePanelGroup>
            </main>
          </SidebarInset>
        </SidebarProvider>
      </div>
    </div>
  )
}
