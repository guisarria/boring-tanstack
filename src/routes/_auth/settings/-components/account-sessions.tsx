import { useRouter } from "@tanstack/react-router"
import {
  AlertCircle,
  LaptopIcon,
  LogOut,
  Shield,
  SmartphoneIcon,
  TabletIcon,
} from "lucide-react"
import { useState } from "react"
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
import { Separator } from "@/components/ui/separator"
import { authClient } from "@/modules/auth/auth-client"

type Session = {
  id: string
  createdAt: Date
  updatedAt: Date
  userId: string
  expiresAt: Date
  token: string
  ipAddress?: string | null | undefined
  userAgent?: string | null | undefined
}

export function AccountSessions({
  sessions,
  sessionId,
}: {
  sessions: Session[]
  sessionId: string | undefined
}) {
  const router = useRouter()
  const [sessionToRevoke, setSessionToRevoke] = useState<string | null>(null)

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case "laptop":
        return <LaptopIcon className="h-4 w-4" />
      case "mobile":
        return <SmartphoneIcon className="h-4 w-4" />
      case "tablet":
        return <TabletIcon className="h-4 w-4" />
      default:
        return <LaptopIcon className="h-4 w-4" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Active Sessions</CardTitle>
            <CardDescription>
              Manage your active sessions across devices
            </CardDescription>
          </div>
          <Shield className="size-6 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {sessions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <AlertCircle className="mb-2 h-10 w-10 text-muted-foreground" />
            <p className="text-muted-foreground">No active sessions found</p>
          </div>
        ) : (
          sessions.map((session) => {
            const userAgent = session.userAgent
              ? new UAParser(session.userAgent)
              : null

            return (
              <div key={session.id}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="mt-1 rounded-md bg-secondary p-2">
                      {getDeviceIcon(userAgent?.getDevice().type ?? "laptop")}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium">
                          {userAgent?.getDevice().model} (
                          {userAgent?.getDevice().vendor ?? "Unknown"})
                        </p>
                        {sessionId === session.token && (
                          <Badge className="text-xs" variant="outline">
                            Current
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {userAgent?.getBrowser().name} •{" "}
                        {userAgent?.getBrowser().version}
                      </p>
                      <p className="mt-1 text-muted-foreground text-xs">
                        IP: {session.ipAddress ? session.ipAddress : "Unknown"}{" "}
                        • {session.createdAt.toDateString()}
                      </p>
                    </div>
                  </div>
                  <AlertDialog
                    onOpenChange={(open) => !open && setSessionToRevoke(null)}
                    open={sessionToRevoke === session.id}
                  >
                    <AlertDialogTrigger
                      render={
                        <Button
                          className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                          onClick={() => setSessionToRevoke(session.id)}
                          size="sm"
                          variant="ghost"
                        />
                      }
                    >
                      <LogOut className="mr-1 h-4 w-4" />
                      Revoke
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Revoke Session</AlertDialogTitle>
                        <AlertDialogDescription>
                          Are you sure you want to revoke this session? This
                          will sign out the device and require
                          re-authentication.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-background hover:bg-destructive/90"
                          onClick={async () => {
                            const { error } = await authClient.revokeSession({
                              token: session.token,
                            })

                            if (error) {
                              toast.error(error.message)
                            } else {
                              toast.success("Session revoked successfully")
                              router.invalidate()
                            }
                          }}
                        >
                          Revoke
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
                <Separator className="mt-4" />
              </div>
            )
          })
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <p className="text-muted-foreground text-xs">
          Last checked: {new Date().toDateString()}
        </p>
        <AlertDialog>
          <AlertDialogTrigger
            render={
              <Button
                disabled={sessions.length === 0}
                size="sm"
                variant="destructive"
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
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-background hover:bg-destructive/90"
                onClick={async () => {
                  const { error } = await authClient.revokeSessions()
                  if (error) {
                    toast.error(error.message)
                  } else {
                    toast.success("All sessions revoked successfully")
                    router.invalidate()
                  }
                }}
              >
                Revoke All
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardFooter>
    </Card>
  )
}
