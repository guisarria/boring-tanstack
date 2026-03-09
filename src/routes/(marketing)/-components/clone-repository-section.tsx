import { CopyButton } from "@/components/ui/copy-button"

export function CloneRepository() {
  return (
    <section className="container flex w-full flex-col items-center pt-28 pb-40">
      <div className="flex flex-col items-center gap-y-6 text-center">
        <h2 className="font-bold text-3xl tracking-tight">Ready to build?</h2>
        <p className="text-muted-foreground">
          Clone the repository and start shipping in minutes.
        </p>
        <div className="flex w-full items-center gap-x-2 rounded-md border border-border px-4 py-3 font-mono text-sm lg:max-w-lg">
          <span aria-hidden className="select-none text-cyan-300">
            $
          </span>
          <code className="flex-1 select-all text-left text-foreground text-sm">
            git clone github.com/guisarria/boring-tanstack
          </code>
          <CopyButton textToCopy="git clone github.com/guisarria/boring-tanstack" />
        </div>
      </div>
    </section>
  )
}
