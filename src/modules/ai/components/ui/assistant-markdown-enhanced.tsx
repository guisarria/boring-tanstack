import { cjk } from "@streamdown/cjk"
import { code } from "@streamdown/code"
import { math } from "@streamdown/math"
import type { ComponentProps } from "react"
import { Streamdown } from "streamdown"

const enhancedPlugins = { cjk, code, math }

type EnhancedAssistantMarkdownProps = ComponentProps<typeof Streamdown>

export default function EnhancedAssistantMarkdown(
  props: EnhancedAssistantMarkdownProps,
) {
  return <Streamdown plugins={enhancedPlugins} {...props} />
}
