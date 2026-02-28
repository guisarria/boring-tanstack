import { authClient } from "#/lib/auth-client"

export default function BetterAuthHeader() {
  const { data: session, isPending } = authClient.useSession()

  if (isPending) {
    return (
      <div className="h-8 w-8 animate-pulse bg-neutral-100 dark:bg-neutral-800" />
    )
  }

  if (session?.user) {
    return (
      <div className="flex items-center gap-2">
        {session.user.image ? (
          <img
            alt=""
            className="h-8 w-8"
            height={32}
            src={session.user.image}
            width={32}
          />
        ) : (
          <div className="flex h-8 w-8 items-center justify-center bg-neutral-100 dark:bg-neutral-800">
            <span className="font-medium text-neutral-600 text-xs dark:text-neutral-400">
              {session.user.name?.charAt(0).toUpperCase() || "U"}
            </span>
          </div>
        )}
        <button
          className="h-9 flex-1 border border-neutral-300 bg-white px-4 font-medium text-neutral-900 text-sm transition-colors hover:bg-neutral-50 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-50 dark:hover:bg-neutral-800"
          onClick={() => {
            authClient.signOut()
          }}
          type="button"
        >
          Sign out
        </button>
      </div>
    )
  }

  // return (
  // 	<Link
  // 		to="/demo/better-auth"
  // 		className="h-9 px-4 text-sm font-medium bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-50 border border-neutral-300 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors inline-flex items-center"
  // 	>
  // 		Sign in
  // 	</Link>
  // );
}
