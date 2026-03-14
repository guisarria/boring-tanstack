import type { ComponentPropsWithoutRef, ElementType } from "react"

import { cn } from "@/lib/utils"

function Main({ className, ...props }: ComponentPropsWithoutRef<"main">) {
  return <main data-slot="main" className={className} {...props} />
}

function Nav({ className, ...props }: ComponentPropsWithoutRef<"nav">) {
  return (
    <nav
      data-slot="nav"
      className={cn("max-w-5xl w-full py-2", className)}
      {...props}
    />
  )
}

function Section({ className, ...props }: ComponentPropsWithoutRef<"section">) {
  return (
    <section
      data-slot="section"
      className={cn("flex w-full flex-col items-center", className)}
      {...props}
    />
  )
}

function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return (
    <div
      data-slot="container"
      className={cn("mx-auto w-full max-w-5xl p-4", className)}
      {...props}
    />
  )
}

type ProseBaseProps = ComponentPropsWithoutRef<"div"> & {
  article?: boolean
  spaced?: boolean
}

type ProseWithChildren = ProseBaseProps & {
  dangerousHTML?: never
}

type ProseWithHTML = ProseBaseProps & {
  dangerousHTML: { __html: string }
  children?: never
}

type ProseProps = ProseWithChildren | ProseWithHTML

function Prose({
  article,
  spaced,
  dangerousHTML,
  className,
  children,
  ...props
}: ProseProps) {
  const Tag: "article" | "div" = article ? "article" : "div"

  const contentProps = dangerousHTML
    ? { dangerouslySetInnerHTML: dangerousHTML }
    : { children }

  return (
    <Tag
      data-slot="prose"
      className={cn(
        "text-base leading-7",
        "[&_h1]:text-4xl sm:[&_h1]:text-5xl [&_h1]:font-medium [&_h1]:tracking-tight",
        "[&_h2]:text-3xl sm:[&_h2]:text-4xl [&_h2]:font-medium [&_h2]:tracking-tight",
        "[&_h3]:text-2xl sm:[&_h3]:text-3xl [&_h3]:font-medium",
        "[&_p]:text-pretty",
        "[&_strong]:font-semibold",
        "[&_em]:italic",
        "[&_del]:line-through",
        "[&_code:not(pre_code)]:rounded border bg-muted/50 px-1 py-px font-mono text-sm",
        "[&_pre]:my-4 overflow-x-auto rounded-sm border bg-muted/50 p-4",
        "[&_img]:my-4 h-auto max-w-full rounded-sm border",
        "[&_blockquote]:my-4 border-l-4 border-border pl-4 text-muted-foreground",
        article && "max-w-prose",
        spaced && "space-y-6",
        className,
      )}
      {...props}
      {...contentProps}
    />
  )
}

// ─── GlowText ────────────────────────────────────────────────────────

type GlowTextProps<T extends ElementType = "span"> = {
  as?: T
  variant?: "default" | "strong"
} & Omit<ComponentPropsWithoutRef<T>, "as">

function GlowText<T extends ElementType = "span">({
  as,
  variant = "default",
  className,
  children,
  ...props
}: GlowTextProps<T>) {
  const Tag = as || "span"

  return (
    <Tag
      data-slot="glow-text"
      className={cn(
        "relative font-pixel text-5xl tracking-tight text-foreground lg:text-6xl",
        className,
      )}
      {...props}
    >
      <span className="relative z-10">{children}</span>

      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-0 select-none blur-xs animate-pulse",
          variant === "strong" && "blur-sm",
        )}
      >
        {children}
      </span>
    </Tag>
  )
}

export { Container, GlowText, Main, Nav, Prose, Section }
