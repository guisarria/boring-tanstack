import {
  type InitialConfigType,
  LexicalComposer,
} from "@lexical/react/LexicalComposer"
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext"
import { ContentEditable } from "@lexical/react/LexicalContentEditable"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin"
import { PlainTextPlugin } from "@lexical/react/LexicalPlainTextPlugin"
import {
  $createParagraphNode,
  $createTextNode,
  $getRoot,
  type EditorState,
} from "lexical"
import {
  type ClipboardEventHandler,
  forwardRef,
  type Ref,
  useCallback,
  useEffect,
  useImperativeHandle,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react"
import { cn } from "@/lib/utils"

const DEFAULT_NAMESPACE = "lexical-editor"

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

function setEditorContent(editorText: string): void {
  const root = $getRoot()
  root.clear()
  const paragraph = $createParagraphNode()
  paragraph.append($createTextNode(editorText))
  root.append(paragraph)
}

function getEditorContent(): string {
  return $getRoot().getTextContent()
}

function LexicalEditorInner({
  value,
  placeholder,
  className,
  onChange,
  onPaste,
  editorRef,
}: LexicalEditorProps & { editorRef: Ref<LexicalEditorHandle> }) {
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
        setEditorContent(value)
      })
    }
  }, [value, editor])

  const handleChange = useCallback((editorState: EditorState) => {
    editorState.read(() => {
      const textContent = getEditorContent()
      if (snapshotRef.current !== textContent) {
        snapshotRef.current = textContent
        onChangeRef.current(textContent)
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
      <PlainTextPlugin
        contentEditable={
          <ContentEditable
            aria-placeholder={placeholder ?? ""}
            className={cn("h-full w-full p-2 outline-none", className)}
            onPaste={onPaste}
            placeholder={
              <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 text-muted-foreground">
                {placeholder ?? ""}
              </div>
            }
          />
        }
        ErrorBoundary={LexicalErrorBoundary}
        placeholder={placeholder ? <span /> : undefined}
      />
      <OnChangePlugin onChange={handleChange} />
      <HistoryPlugin />
    </div>
  )
}

export const LexicalEditor = forwardRef<
  LexicalEditorHandle,
  LexicalEditorProps
>(function LexicalEditor(
  { value, onChange, placeholder, className, onPaste },
  ref
) {
  const initialConfig = useMemo<InitialConfigType>(
    () => ({
      namespace: DEFAULT_NAMESPACE,
      editable: true,
      onError: (error) => {
        console.error("Lexical editor error:", error)
        throw error
      },
    }),
    []
  )

  return (
    <LexicalComposer initialConfig={initialConfig}>
      <LexicalEditorInner
        className={cn("", className)}
        editorRef={ref}
        onChange={onChange}
        onPaste={onPaste}
        placeholder={placeholder}
        value={value}
      />
    </LexicalComposer>
  )
})
