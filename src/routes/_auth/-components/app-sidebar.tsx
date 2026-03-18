import { useQuery, useQueryClient } from "@tanstack/react-query"
import {
  Link,
  useLocation,
  useNavigate,
  useRouteContext,
} from "@tanstack/react-router"
import {
  CornerUpLeftIcon,
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { useEffect, useMemo, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenu,
  SidebarRail,
} from "@/components/ui/sidebar"
import { deleteChat, renameChat } from "@/modules/ai/functions"
import { chatListQueryOptions, chatQueryKeys } from "@/modules/ai/query-options"
import { UserDropdown } from "@/modules/auth/components/user-dropdown"

import { type NavItem, SidebarNavGroup } from "./sidebar-nav-group"

export type NavGroup = {
  label: string
  items: NavItem[]
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getConversationIdFromSearch(search: unknown): string | null {
  if (!isRecord(search)) return null

  const conversationId = search.conversationId
  return typeof conversationId === "string" ? conversationId : null
}

export function AppSidebar({
  navGroups,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navGroups: NavGroup[]
}) {
  const { user } = useRouteContext({ from: "/_auth" })
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()
  const isChatRoute = location.pathname.startsWith("/chat")

  const activeConversationId = useMemo(() => {
    return getConversationIdFromSearch(location.search)
  }, [location.search])
  const chatHistoryQuery = useQuery({
    ...chatListQueryOptions(),
    enabled: isChatRoute,
  })

  const chatHistory = chatHistoryQuery.data?.chats ?? []
  const isHistoryLoading = isChatRoute && chatHistoryQuery.isPending

  const [renameTarget, setRenameTarget] = useState<{
    id: string
    title: string
  } | null>(null)
  const [renameTitle, setRenameTitle] = useState("")
  const renameInputRef = useRef<HTMLInputElement | null>(null)
  const [isRenaming, startRenaming] = useTransition()

  const [deleteTarget, setDeleteTarget] = useState<{
    id: string
    title: string
  } | null>(null)
  const [isDeleting, startDeleting] = useTransition()

  useEffect(() => {
    if (!renameTarget) return
    const t = setTimeout(() => {
      renameInputRef.current?.focus()
      renameInputRef.current?.select()
    }, 0)
    return () => clearTimeout(t)
  }, [renameTarget])

  function startNewChat() {
    const conversationId = crypto.randomUUID()

    void navigate({
      to: "/chat",
      search: { conversationId },
    })
  }

  function getErrorMessage(err: unknown) {
    if (err instanceof Error) return err.message
    if (typeof err === "string") return err
    return "Something went wrong"
  }

  function openRename(chat: { id: string; title: string }) {
    setRenameTarget(chat)
    setRenameTitle(chat.title)
  }

  function submitRename() {
    const target = renameTarget
    const title = renameTitle.trim()
    if (!target) return
    if (!title) {
      toast.error("Chat name can't be empty")
      return
    }

    startRenaming(() => {
      void (async () => {
        try {
          await renameChat({ data: { id: target.id, title } })
          setRenameTarget(null)
          await queryClient.invalidateQueries({
            queryKey: chatQueryKeys.all,
          })
        } catch (err) {
          toast.error(getErrorMessage(err))
        }
      })()
    })
  }

  function confirmDelete() {
    const target = deleteTarget
    if (!target) return

    const wasViewingDeletedChat =
      location.pathname === "/chat" && activeConversationId === target.id

    startDeleting(() => {
      void (async () => {
        try {
          await deleteChat({ data: { id: target.id } })
          setDeleteTarget(null)

          await queryClient.invalidateQueries({
            queryKey: chatQueryKeys.all,
          })

          if (wasViewingDeletedChat) {
            startNewChat()
          }
        } catch (err) {
          toast.error(getErrorMessage(err))
        }
      })()
    })
  }

  return (
    <Sidebar className="px-0 pt-0" variant="inset" {...props}>
      <SidebarHeader className="pt-1 pb-0">
        <SidebarMenuButton
          render={user ? <UserDropdown label /> : undefined}
          size={"lg"}
        />
      </SidebarHeader>

      <SidebarContent>
        {!location.pathname.startsWith("/dashboard") && (
          <div className="text-xs text-muted-foreground px-2 pt-2">
            <SidebarMenuItem>
              <SidebarMenuButton render={<Link to="/dashboard" />}>
                <CornerUpLeftIcon
                  className="text-muted-foreground"
                  strokeWidth={1.5}
                />
                Dashboard
              </SidebarMenuButton>
            </SidebarMenuItem>
          </div>
        )}

        {location.pathname.startsWith("/chat") && (
          <>
            <div className="text-xs text-muted-foreground px-2 pt-2">
              <SidebarMenuButton
                onClick={startNewChat}
                tooltip="New chat"
                variant="outline"
              >
                <Plus className="text-muted-foreground" strokeWidth={1.5} />
                <span className="text-foreground/90 text-sm">New chat</span>
              </SidebarMenuButton>
            </div>
            <SidebarGroup className="pt-2">
              <SidebarGroupLabel>Chats</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {isHistoryLoading ? (
                    <>
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                      <SidebarMenuSkeleton showIcon />
                    </>
                  ) : chatHistory.length ? (
                    chatHistory.map((chat) => (
                      <SidebarMenuItem key={chat.id}>
                        <SidebarMenuButton
                          render={
                            <Link
                              to="/chat"
                              search={{ conversationId: chat.id }}
                            />
                          }
                          isActive={
                            location.pathname === "/chat" &&
                            activeConversationId === chat.id
                          }
                          tooltip={chat.title}
                        >
                          <MessageSquare
                            className="text-muted-foreground"
                            strokeWidth={1.5}
                          />
                          <span className="text-foreground/90 text-sm">
                            {chat.title}
                          </span>
                        </SidebarMenuButton>

                        <DropdownMenu>
                          <DropdownMenuTrigger
                            render={
                              <SidebarMenuAction
                                aria-label="Chat actions"
                                showOnHover
                                type="button"
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                }}
                              >
                                <MoreHorizontal className="text-muted-foreground" />
                              </SidebarMenuAction>
                            }
                          />
                          <DropdownMenuContent
                            align="end"
                            side="right"
                            sideOffset={8}
                            className="w-40"
                          >
                            <DropdownMenuItem onClick={() => openRename(chat)}>
                              <Pencil />
                              Rename
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              variant="destructive"
                              onClick={() => setDeleteTarget(chat)}
                            >
                              <Trash2 />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </SidebarMenuItem>
                    ))
                  ) : (
                    <div className="px-2 py-2 text-xs text-muted-foreground">
                      No chats yet
                    </div>
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}

        {navGroups.map((group) => (
          <SidebarNavGroup
            items={group.items}
            key={group.label}
            label={group.label}
          />
        ))}
      </SidebarContent>

      <SidebarRail />

      <Dialog
        open={Boolean(renameTarget)}
        onOpenChange={(open) => {
          if (!open) setRenameTarget(null)
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Rename chat</DialogTitle>
            <DialogDescription>
              Choose a new title for this conversation.
            </DialogDescription>
          </DialogHeader>

          <form
            className="grid gap-3"
            onSubmit={(e) => {
              e.preventDefault()
              submitRename()
            }}
          >
            <Input
              ref={renameInputRef}
              value={renameTitle}
              maxLength={80}
              onChange={(e) => setRenameTitle(e.target.value)}
              placeholder="Chat title"
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                disabled={isRenaming}
                onClick={() => setRenameTarget(null)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isRenaming || renameTitle.trim().length === 0}
              >
                Save
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={Boolean(deleteTarget)}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete chat?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <span className="font-medium text-foreground">
                {deleteTarget?.title ?? "this chat"}
              </span>
              .
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              disabled={isDeleting}
              variant="destructive"
              onClick={confirmDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Sidebar>
  )
}
