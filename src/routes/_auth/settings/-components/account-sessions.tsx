import { useRouter } from "@tanstack/react-router"
import {
  AlertCircle,
  LaptopIcon,
  LogOut,
  Shield,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { UAParser } from "ua-parser-js"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { LoadingSwap } from "@/components/ui/loading-swap"
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
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  const userAgent = session.userAgent ? new UAParser(session.userAgent) : null

  function handleRevoke() {
    if (isCurrent) {
      startTransition(async () => {
        await authClient.signOut({
          fetchOptions: {
            onSuccess: () => {
              toast.success("Signed out")
              router.invalidate({ sync: true })
            },
          },
        })
      })
      return setConfirmOpen(false)
    }
    setConfirmOpen(true)
  }

  function confirmRevoke() {
    startTransition(async () => {
      const { error } = await authClient.revokeSession({
        token: session.token,
      })
      if (error) {
        toast.error(error.message)
      } else {
        toast.success("Session revoked successfully")
        router.invalidate({ sync: true })
      }
    })
  }

  return (
    <div>
      <div className="flex max-w-sm items-start justify-between">
        <div className="flex items-start gap-3">
          <div className="rounded-md bg-secondary p-2">
            {getDeviceIcon(userAgent?.getDevice().type ?? "laptop")}
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-x-2">
              <p className="font-medium">
                {userAgent?.getDevice().model} (
                {userAgent?.getDevice().vendor ?? "Unknown"})
              </p>
              {isCurrent && (
                <Badge className="text-xs" variant="outline">
                  Current
                </Badge>
              )}
            </div>
            <p className="mt-1 text-muted-foreground text-sm">
              {userAgent?.getBrowser().name} • {userAgent?.getBrowser().version}
            </p>
            <p className="mt-1 text-muted-foreground text-xs">
              IP: {session.ipAddress ?? "Unknown"} •{" "}
              {session.createdAt.toDateString()}
            </p>
          </div>
        </div>
        <AlertDialog
          onOpenChange={(open) => !open && setConfirmOpen(false)}
          open={confirmOpen}
        >
          <AlertDialogTrigger
            render={
              <Button
                disabled={isPending}
                onClick={handleRevoke}
                size="sm"
                variant="destructive-outline"
              />
            }
          >
            <LoadingSwap isLoading={isPending}>
              <span className="flex items-center gap-x-1">
                <LogOut />
                Revoke
              </span>
            </LoadingSwap>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Revoke Session</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to revoke this session? This will sign out
                the device and require re-authentication.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                disabled={isPending}
                onClick={confirmRevoke}
                variant="destructive-outline"
              >
                <LoadingSwap isLoading={isPending}>Revoke</LoadingSwap>
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <Separator className="mt-4" />
    </div>
  )
}

function RevokeAllDialog({ disabled }: { disabled: boolean }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  function handleRevokeAll() {
    startTransition(async () => {
      const { error } = await authClient.revokeSessions()
      if (error) {
        toast.error(error.message)
        return
      }
      toast.success("All sessions revoked successfully")
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out")
            router.invalidate()
          },
        },
      })
    })
  }

  return (
    <AlertDialog open={open || isPending}>
      <AlertDialogTrigger
        render={
          <Button
            disabled={disabled}
            onClick={() => setOpen(true)}
            size="sm"
            variant="destructive-outline"
          />
        }
      >
        Revoke All Sessions
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Revoke All Sessions</AlertDialogTitle>
          <AlertDialogDescription>
            This will sign you out from all devices except your current one.
            You'll need to sign in again on those devices.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setOpen(false)}>
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={handleRevokeAll}
            variant="destructive-outline"
          >
            <LoadingSwap isLoading={isPending}>Revoke All</LoadingSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
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
            <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
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
