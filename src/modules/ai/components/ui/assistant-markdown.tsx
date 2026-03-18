import { cjk } from "@streamdown/cjk"
import type { ComponentProps } from "react"
import { lazy, Suspense } from "react"
import { Streamdown } from "streamdown"

const EnhancedAssistantMarkdown = lazy(
  () => import("./assistant-markdown-enhanced"),
)

const basePlugins = { cjk }
const ENHANCED_SYNTAX_PATTERN = /```|~~~|\$\$|\\\(|\\\[/

export type AssistantMarkdownProps = ComponentProps<typeof Streamdown>

function usesEnhancedSyntax(children: AssistantMarkdownProps["children"]) {
  return typeof children === "string" && ENHANCED_SYNTAX_PATTERN.test(children)
}

function BaseAssistantMarkdown(props: AssistantMarkdownProps) {
  return <Streamdown plugins={basePlugins} {...props} />
}

export function AssistantMarkdown(props: AssistantMarkdownProps) {
  if (!usesEnhancedSyntax(props.children)) {
    return <BaseAssistantMarkdown {...props} />
  }

  return (
    <Suspense fallback={<BaseAssistantMarkdown {...props} />}>
      <EnhancedAssistantMarkdown {...props} />
    </Suspense>
  )
}
