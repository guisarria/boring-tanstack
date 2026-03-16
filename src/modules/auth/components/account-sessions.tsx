import { useRouter } from "@tanstack/react-router"
import {
  AlertCircle,
  LaptopIcon,
  LogOut,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react"
import { startTransition, useMemo } from "react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"

import { ActionButton } from "@/components/ui/action-button"
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
  const os = userAgent?.getOS()

  const deviceName = device?.model || os?.name || "Unknown Device"
  const browserName = browser?.name || "Unknown Browser"

  async function revokeAction(): Promise<{
    error: boolean
    message?: string
  }> {
    if (isCurrent) {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: async () => {
            toast.success("Signed out")
            startTransition(() => {
              void router.invalidate({ sync: true })
            })
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

    toast.success("Session revoked")
    startTransition(() => {
      void router.invalidate({ sync: true })
    })
    return { error: false }
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="flex items-start gap-x-3">
          <div className="bg-secondary rounded-md p-2">
            {getDeviceIcon(device?.type ?? "laptop")}
          </div>

          <div className="flex flex-col">
            <p className="font-medium">
              {browserName} on {deviceName}
            </p>

            {isCurrent && (
              <span className="text-success-text -mt-1 flex items-center justify-start gap-x-1">
                <span className="-mt-1 -ml-px text-2xl">•</span> Current session
              </span>
            )}

            <p className="text-muted-foreground mt-1 text-xs tabular-nums">
              {session.createdAt.toLocaleDateString(undefined, {
                dateStyle: "medium",
              })}
            </p>
          </div>
        </div>

        <ActionButton
          action={revokeAction}
          areYouSureDescription="This will sign out the device & require re-authentication."
          requireAreYouSure={isCurrent}
          size="sm"
          actionTag="Sign Out"
          variant="destructive-outline"
        >
          <LogOut className="mb-0.5" />
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

    toast.success("All sessions revoked")
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
      areYouSureDescription="This signs you out of all devices. Sign in again on each device to continue."
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
        <CardTitle>Active Sessions</CardTitle>
        <CardDescription>
          Manage your active sessions across devices
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="text-muted-foreground mb-2 h-10 w-10" />
            <p className="text-muted-foreground">
              No active sessions to display
            </p>
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
        <p className="text-muted-foreground text-xs tabular-nums">
          Last checked:{" "}
          {new Date().toLocaleDateString(undefined, { dateStyle: "medium" })}
        </p>
        <RevokeAllDialog disabled={sessions.length === 0} />
      </CardFooter>
    </Card>
  )
}
