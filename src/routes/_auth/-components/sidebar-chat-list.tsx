import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { useMemo, useState } from "react"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
} from "@/components/ui/sidebar"
import { chatListQueryOptions, chatQueryKeys } from "@/modules/ai"

import { DeleteDialog } from "./chat-delete-dialog"
import { RenameDialog } from "./chat-rename-dialog"
import type { ChatTarget } from "./types"

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function getConversationIdFromSearch(search: unknown): string | null {
  if (!isRecord(search)) return null
  const conversationId = search.conversationId
  return typeof conversationId === "string" ? conversationId : null
}

export function SidebarChatList() {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const location = useLocation()

  const activeConversationId = useMemo(() => {
    return getConversationIdFromSearch(location.search)
  }, [location.search])

  const chatHistoryQuery = useQuery(chatListQueryOptions())
  const chatHistory = chatHistoryQuery.data?.chats ?? []
  const isHistoryLoading = chatHistoryQuery.isPending

  const [renameTarget, setRenameTarget] = useState<ChatTarget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ChatTarget | null>(null)

  function startNewChat() {
    const conversationId = crypto.randomUUID()
    void navigate({ to: "/chat", search: { conversationId } })
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
                      <Link to="/chat" search={{ conversationId: chat.id }} />
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
                      <DropdownMenuItem onClick={() => setRenameTarget(chat)}>
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
    </>
  )
}
