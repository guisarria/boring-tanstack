import { useRouteContext } from "@tanstack/react-router"
import Avatar from "boring-avatars"

import { cn } from "@/lib/utils"

import { AvatarImage } from "./ui/avatar"

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
        <AvatarImage
          alt={user?.name}
          className={cn("rounded-md")}
          src={user?.image ?? ""}
        />
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
