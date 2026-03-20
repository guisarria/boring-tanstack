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
import {
  useEffect,
  useMemo,
  useState,
  useTransition,
  type SubmitEvent,
} from "react"
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
import { chatListQueryOptions, chatQueryKeys } from "@/modules/ai"
import { deleteChat, renameChat } from "@/modules/ai"
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

type ChatTarget = { id: string; title: string }

interface RenameDialogProps {
  target: ChatTarget | null
  onClose: () => void
  onRenamed: () => void
}

function RenameDialog({ target, onClose, onRenamed }: RenameDialogProps) {
  const [title, setTitle] = useState("")
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()

  const isOpen = Boolean(target)

  useEffect(() => {
    if (target) setTitle(target.title)
  }, [target])

  function submitRename(e: SubmitEvent) {
    e.preventDefault()
    const newTitle = title.trim()
    if (!target || !newTitle) {
      toast.error("Chat name can't be empty")
      return
    }

    startTransition(() => {
      void (async () => {
        try {
          queryClient.setQueryData<{
            chats: Array<{ id: string; title: string }>
          }>(chatListQueryOptions().queryKey, (old) => {
            if (!old) return old
            return {
              ...old,
              chats: old.chats.map((c) =>
                c.id === target.id ? { ...c, title: newTitle } : c,
              ),
            }
          })
          onRenamed()
          await renameChat({ data: { id: target.id, title: newTitle } })
          onClose()
        } catch (err) {
          void queryClient.invalidateQueries({ queryKey: chatQueryKeys.all })
          toast.error(
            err instanceof Error ? err.message : "Something went wrong",
          )
        }
      })()
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Rename chat</DialogTitle>
          <DialogDescription>
            Choose a new title for this conversation.
          </DialogDescription>
        </DialogHeader>

        <form className="grid gap-3" onSubmit={submitRename}>
          <Input
            autoFocus
            value={title}
            maxLength={80}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Chat title"
          />

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              disabled={isPending}
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isPending || title.trim().length === 0}
            >
              Save
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteDialogProps {
  target: ChatTarget | null
  onClose: () => void
  onDeleted: (deletedId: string) => void
}

function DeleteDialog({ target, onClose, onDeleted }: DeleteDialogProps) {
  const [isPending, startTransition] = useTransition()
  const queryClient = useQueryClient()
  const isOpen = Boolean(target)

  function confirmDelete() {
    if (!target) return

    startTransition(() => {
      void (async () => {
        try {
          queryClient.setQueryData<{ chats: Array<{ id: string }> }>(
            chatListQueryOptions().queryKey,
            (old) => {
              if (!old) return old
              return {
                ...old,
                chats: old.chats.filter((c) => c.id !== target.id),
              }
            },
          )
          const deletedId = target.id
          onClose()
          onDeleted(deletedId)
          await deleteChat({ data: { id: target.id } })
        } catch (err) {
          void queryClient.invalidateQueries({ queryKey: chatQueryKeys.all })
          toast.error(
            err instanceof Error ? err.message : "Something went wrong",
          )
        }
      })()
    })
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete chat?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete{" "}
            <span className="font-medium text-foreground">
              {target?.title ?? "this chat"}
            </span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isPending}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            variant="destructive"
            onClick={confirmDelete}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

export function AppSidebar({
  navGroups,
  ...props
}: React.ComponentProps<typeof Sidebar> & {
  navGroups?: NavGroup[]
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

  const [renameTarget, setRenameTarget] = useState<ChatTarget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ChatTarget | null>(null)

  function startNewChat() {
    const conversationId = crypto.randomUUID()

    void navigate({
      to: "/chat",
      search: { conversationId },
    })
  }

  function refreshChats() {
    void queryClient.invalidateQueries({ queryKey: chatQueryKeys.all })
  }

  function handleDeleted(deletedId: string) {
    if (location.pathname === "/chat" && activeConversationId === deletedId) {
      startNewChat()
    }
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
          <div className="px-2 pt-2 text-xs text-muted-foreground">
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

        {isChatRoute && (
          <>
            <div className="px-2 pt-2 text-xs text-muted-foreground">
              <SidebarMenuButton
                onClick={startNewChat}
                tooltip="New chat"
                variant="outline"
              >
                <Plus className="text-muted-foreground" strokeWidth={1.5} />
                <span className="text-sm text-foreground/90">New chat</span>
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
                          <span className="text-sm text-foreground/90">
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
                            <DropdownMenuItem
                              onClick={() => setRenameTarget(chat)}
                            >
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

        {!location.pathname.startsWith("/chat") &&
          navGroups?.map((group) => (
            <SidebarNavGroup
              items={group.items}
              key={group.label}
              label={group.label}
            />
          ))}
      </SidebarContent>

      <SidebarRail />

      <RenameDialog
        target={renameTarget}
        onClose={() => setRenameTarget(null)}
        onRenamed={refreshChats}
      />

      <DeleteDialog
        target={deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onDeleted={handleDeleted}
      />
    </Sidebar>
  )
}
