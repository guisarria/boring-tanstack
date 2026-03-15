import { useRouteContext } from "@tanstack/react-router"
import Avatar from "boring-avatars"

import { cn } from "@/lib/utils"

import { Avatar as AvatarRoot, AvatarImage } from "./ui/avatar"

export function UserAvatar({
  className,
  size = 400,
}: {
  className?: string
  size?: number
}) {
  const { user } = useRouteContext({ from: "__root__" })

  return (
    <div
      className={cn(
        "flex items-center flex-col justify-center after:border-transparent",
        className,
      )}
    >
      {user?.image ? (
        <AvatarRoot className={cn("rounded-full")}>
          <AvatarImage alt={user?.name} src={user?.image ?? ""} />
        </AvatarRoot>
      ) : (
        <Avatar
          size={size}
          name={user?.name ?? ""}
          className={cn("rounded-md size-auto")}
        />
      )}
    </div>
  )
}
