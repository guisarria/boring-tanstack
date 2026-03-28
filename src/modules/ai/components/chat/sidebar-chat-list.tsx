import { useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useLocation, useNavigate } from "@tanstack/react-router"
import {
  MessageSquare,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
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
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { chatListQueryOptions, chatQueryKeys } from "../../query-options"
import {
  DeleteAllDialog,
  DeleteDialog,
  RenameDialog,
  type ChatTarget,
} from "./chat-dialogs"

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

  const activeConversationId = getConversationIdFromSearch(location.search)

  const chatHistoryQuery = useQuery(chatListQueryOptions())
  const chatHistory = chatHistoryQuery.data?.chats ?? []
  const isHistoryLoading = chatHistoryQuery.isPending

  const [renameTarget, setRenameTarget] = useState<ChatTarget | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<ChatTarget | null>(null)
  const [showDeleteAll, setShowDeleteAll] = useState(false)

  function startNewChat() {
    const conversationId = crypto.randomUUID()
    void navigate({ to: "/chat", search: { conversationId } })
  }

  function refreshChats() {
    void queryClient.invalidateQueries({
      queryKey: chatQueryKeys.all,
      exact: true,
    })
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

      <SidebarGroup className="h-full pt-2">
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
                  >
                    <MessageSquare
                      className="text-muted-foreground"
                      strokeWidth={1.5}
                    />
                    <Tooltip>
                      <TooltipTrigger
                        render={
                          <span className="text-sm text-foreground/90">
                            {chat.title}
                          </span>
                        }
                      />
                      <TooltipContent>{chat.title}</TooltipContent>
                    </Tooltip>
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
        {chatHistory.length > 0 && (
          <Button
            type="button"
            onClick={() => setShowDeleteAll(true)}
            aria-label="Delete all chats"
            className="mt-auto mb-2 flex gap-x-2 place-self-end"
            variant="destructive-outline"
          >
            <span>Delete All</span>
            <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
          </Button>
        )}
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

      <DeleteAllDialog
        open={showDeleteAll}
        onClose={() => setShowDeleteAll(false)}
        onDeletedAll={startNewChat}
      />
    </>
  )
}
