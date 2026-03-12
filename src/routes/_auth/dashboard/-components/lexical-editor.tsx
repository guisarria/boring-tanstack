import {
  CodeHighlightNode,
  CodeNode,
  registerCodeHighlighting,
} from "@lexical/code"
import { LinkNode } from "@lexical/link"
import { ListItemNode, ListNode } from "@lexical/list"
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown"
import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import { MarkdownShortcutPlugin } from "@lexical/react/LexicalMarkdownShortcutPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HeadingNode, QuoteNode } from "@lexical/rich-text"
import type { EditorState } from "lexical"
import {
  type ClipboardEventHandler,
  type Ref,
  type RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react"
import { cn } from "@/lib/utils"

const DEFAULT_NAMESPACE = "lexical-editor"

const EDITOR_NODES = [
  HeadingNode,
  QuoteNode,
  CodeNode,
  CodeHighlightNode,
  ListNode,
  ListItemNode,
  LinkNode,
]

const EDITOR_THEME = {
  code: "block rounded-md bg-muted px-4 py-3 font-mono text-sm my-2",
  codeHighlight: {
    atrule: "text-purple-400",
    attr: "text-yellow-400",
    boolean: "text-orange-400",
    builtin: "text-cyan-400",
    cdata: "text-gray-500",
    char: "text-green-400",
    class: "text-yellow-400",
    "class-name": "text-yellow-400",
    comment: "text-gray-500 italic",
    constant: "text-orange-400",
    deleted: "text-red-400",
    doctype: "text-gray-500",
    entity: "text-red-400",
    function: "text-blue-400",
    important: "text-orange-400",
    inserted: "text-green-400",
    keyword: "text-purple-400",
    namespace: "text-yellow-400",
    number: "text-orange-400",
    operator: "text-cyan-400",
    prolog: "text-gray-500",
    property: "text-cyan-400",
    punctuation: "text-gray-400",
    regex: "text-red-400",
    selector: "text-green-400",
    string: "text-green-400",
    symbol: "text-orange-400",
    tag: "text-red-400",
    url: "text-cyan-400",
    variable: "text-red-400",
  },
  heading: {
    h1: "text-3xl font-bold mt-4 mb-2",
    h2: "text-2xl font-bold mt-3 mb-2",
    h3: "text-xl font-bold mt-2 mb-1",
  },
  link: "text-primary underline cursor-pointer",
  list: {
    ul: "list-disc ml-4",
    ol: "list-decimal ml-4",
    listitem: "my-1",
  },
  paragraph: "my-1",
  quote:
    "border-l-4 border-muted-foreground/30 pl-4 italic text-muted-foreground my-2",
  text: {
    bold: "font-bold",
    code: "rounded bg-muted px-1.5 py-0.5 font-mono text-sm",
    italic: "italic",
    strikethrough: "line-through",
    underline: "underline",
    underlineStrikethrough: "underline line-through",
  },
}

type LexicalEditorProps = {
  autoFocus?: boolean
  className?: string
  disabled?: boolean
  onChange: (value: string) => void
  onPaste?: ClipboardEventHandler<HTMLDivElement>
  placeholder?: string
  value: string
}

export type LexicalEditorHandle = {
  focus: () => void
  focusAtEnd: () => void
  getValue: () => string
}

function CodeHighlightPlugin() {
  const [editor] = useLexicalComposerContext()
  useEffect(() => {
    return registerCodeHighlighting(editor)
  }, [editor])
  return null
}

function LexicalEditorInner({
  value,
  placeholder,
  className,
  onChange,
  onPaste,
  editorRef,
}: LexicalEditorProps & { editorRef?: Ref<LexicalEditorHandle> }) {
  const [editor] = useLexicalComposerContext()
  const onChangeRef = useRef(onChange)
  const snapshotRef = useRef(value)

  useEffect(() => {
    onChangeRef.current = onChange
  }, [onChange])

  useLayoutEffect(() => {
    if (snapshotRef.current !== value) {
      snapshotRef.current = value
      editor.update(() => {
        $convertFromMarkdownString(value, TRANSFORMERS)
      })
    }
  }, [value, editor])

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const markdown = $convertToMarkdownString(TRANSFORMERS)
      if (snapshotRef.current !== markdown) {
        snapshotRef.current = markdown
        onChangeRef.current(markdown)
      }
    })
  }, [])

  useImperativeHandle(
    editorRef,
    () => ({
      focus: () => {
        const rootElement = editor.getRootElement()
        if (rootElement) {
          rootElement.focus()
        }
      },
      focusAtEnd: () => {
        const rootElement = editor.getRootElement()
        if (rootElement) {
          rootElement.focus()
          const range = document.createRange()
          range.selectNodeContents(rootElement)
          range.collapse(false)
          const selection = window.getSelection()
          selection?.removeAllRanges()
          selection?.addRange(range)
        }
      },
      getValue: () => snapshotRef.current,
    }),
    [editor]
  )

  return (
    <div className="relative h-full w-full">
      <RichTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={placeholder ?? ""}
            className={cn("h-full w-full p-2 outline-none", className)}
            onPaste={onPaste}
            placeholder={
              <div className="pointer-events-none absolute top-3 left-2 text-muted-foreground opacity-50">
                {placeholder ?? ""}
              </div>
            }
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
      />
      <OnChangePlugin onChange={handleChange} />
      <HistoryPlugin />
      <ListPlugin />
      <MarkdownShortcutPlugin transformers={TRANSFORMERS} />
      <CodeHighlightPlugin />
    </div>
  )
}

export const LexicalEditor = function LexicalEditor({
  ref,
  value,
  onChange,
  placeholder,
  className,
  onPaste,
}: LexicalEditorProps & {
  ref?: RefObject<LexicalEditorHandle>
}) {
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace: DEFAULT_NAMESPACE,
      nodes: EDITOR_NODES,
      theme: EDITOR_THEME,
      editable: true,
      editorState: () => {
        $convertFromMarkdownString(value, TRANSFORMERS)
      },
      onError: (error) => {
        throw error
      },
    }),
    [value]
  )

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalEditorInner
        className={className}
        editorRef={ref}
        onChange={onChange}
        onPaste={onPaste}
        placeholder={placeholder}
        value={value}
      />
    </LexicalComposer>
  )
}
