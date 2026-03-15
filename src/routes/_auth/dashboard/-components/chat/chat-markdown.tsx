import { type Components, Streamdown } from "streamdown"

const BLOCK_TAGS = new Set([
  "div",
  "img",
  "table",
  "ul",
  "ol",
  "blockquote",
  "pre",
])

const streamdownComponents: Components = {
  p: ({ children }) => {
    const childArray = Array.isArray(children) ? children : [children]
    const hasBlockChild = childArray.some(
      (child) =>
        typeof child === "object" &&
        child !== null &&
        "type" in child &&
        typeof child.type === "string" &&
        BLOCK_TAGS.has(child.type),
    )

    return hasBlockChild ? <>{children}</> : <p>{children}</p>
  },
}

export function AssistantMarkdown({
  children,
  isStreaming,
}: {
  children: string
  isStreaming: boolean
}) {
  return (
    <Streamdown
      animated={isStreaming}
      isAnimating={isStreaming}
      components={streamdownComponents}
    >
      {children}
    </Streamdown>
  )
}
