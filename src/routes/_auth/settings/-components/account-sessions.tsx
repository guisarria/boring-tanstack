import { useRouter } from "@tanstack/react-router"
import {
  AlertCircle,
  LaptopIcon,
  LogOut,
  Shield,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react"
import { useMemo } from "react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"

import { ActionButton } from "@/components/ui/action-button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/modules/auth/auth-client"
import type { ActiveSessions } from "@/modules/auth/schema"

const DEVICE_ICONS = {
  mobile: SmartphoneIcon,
  tablet: TabletIcon,
} as const

function getDeviceIcon(type: string) {
  const Icon = DEVICE_ICONS[type as keyof typeof DEVICE_ICONS] ?? LaptopIcon
  return <Icon className="h-4 w-4" />
}

function SessionItem({
  session,
  isCurrent,
}: {
  session: ActiveSessions[number]
  isCurrent: boolean
}) {
  const router = useRouter()

  const userAgent = useMemo(
    () => (session.userAgent ? new UAParser(session.userAgent) : null),
    [session.userAgent],
  )

  const device = userAgent?.getDevice()
  const browser = userAgent?.getBrowser()

  async function revokeAction(): Promise<{
    error: boolean
    message?: string
  }> {
    if (isCurrent) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Signed out")
            await router.invalidate({ sync: true })
          },
        },
      })
      return { error: false }
    }

    const { error } = await authClient.revokeSession({
      token: session.token,
    })

    if (error) {
      return { error: true, message: error.message }
    }

    toast.success("Session revoked successfully")
    void router.invalidate({ sync: true })
    return { error: false }
  }

  return (
    <div>
      <div className="flex max-w-sm items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="bg-secondary rounded-md p-2">
            {getDeviceIcon(device?.type ?? "laptop")}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-x-2">
              <p className="font-medium">
                {device?.model} ({device?.vendor ?? "Unknown"})
              </p>
              {isCurrent && (
                <Badge className="text-xs" variant="outline">
                  Current
                </Badge>
              )}
            </div>
            <p className="text-muted-foreground mt-1 text-sm">
              {browser?.name} • {browser?.version}
            </p>
            <p className="text-muted-foreground mt-1 text-xs">
              IP: {session.ipAddress ?? "Unknown"} •{" "}
              {session.createdAt.toDateString()}
            </p>
          </div>
        </div>
        <ActionButton
          action={revokeAction}
          areYouSureDescription="Are you sure you want to revoke this session? This will sign out the device and require re-authentication."
          requireAreYouSure={!isCurrent}
          size="sm"
          variant="destructive-outline"
        >
          <LogOut />
          Revoke
        </ActionButton>
      </div>
      <Separator className="mt-4" />
    </div>
  )
}

function RevokeAllDialog({ disabled }: { disabled: boolean }) {
  const router = useRouter()

  async function revokeAllAction(): Promise<{
    error: boolean
    message?: string
  }> {
    const { error } = await authClient.revokeSessions()

    if (error) {
      return { error: true, message: error.message }
    }

    toast.success("All sessions revoked successfully")
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
          toast.success("Signed out")
          void router.invalidate()
        },
      },
    })
    return { error: false }
  }

  return (
    <ActionButton
      action={revokeAllAction}
      areYouSureDescription="This will sign you out from all devices. You'll need to sign in again on those devices."
      disabled={disabled}
      requireAreYouSure
      size="sm"
      variant="destructive-outline"
    >
      Revoke All Sessions
    </ActionButton>
  )
}

export function AccountSessions({
  sessions,
  sessionId,
}: {
  sessions: ActiveSessions
  sessionId: string | undefined
}) {
  return (
    <Card className="ring-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage your active sessions across devices
            </CardDescription>
          </div>
          <Shield className="text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="text-muted-foreground mb-2 h-10 w-10" />
            <p className="text-muted-foreground">No active sessions found</p>
          </div>
        ) : (
          sessions.map((session) => (
            <SessionItem
              isCurrent={sessionId === session.token}
              key={session.id}
              session={session}
            />
          ))
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-muted-foreground text-xs">
          Last checked: {new Date().toDateString()}
        </p>
        <RevokeAllDialog disabled={sessions.length === 0} />
      </CardFooter>
    </Card>
  )
}
