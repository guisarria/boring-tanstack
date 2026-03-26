import { useEffect, useRef, useSyncExternalStore } from "react"

const BOTTOM_THRESHOLD_PX = 80

export function useStickToBottom() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null)
  const isLockedRef = useRef(true)
  const subscribersRef = useRef(new Set<() => void>())

  function subscribe(cb: () => void) {
    subscribersRef.current.add(cb)
    return () => {
      subscribersRef.current.delete(cb)
    }
  }

  const getSnapshot = () => isLockedRef.current

  const isAtBottom = useSyncExternalStore(subscribe, getSnapshot, () => true)

  function setLocked(next: boolean) {
    if (isLockedRef.current !== next) {
      isLockedRef.current = next
      for (const cb of subscribersRef.current) cb()
    }
  }

  function scrollToBottom() {
    bottomRef.current?.scrollIntoView({ block: "end", behavior: "instant" })
    setLocked(true)
  }

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    const onScroll = () => {
      const gap = el.scrollHeight - el.scrollTop - el.clientHeight
      setLocked(gap < BOTTOM_THRESHOLD_PX)
    }

    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const content = scrollRef.current
    if (!content) return

    const observer = new ResizeObserver(() => {
      if (isLockedRef.current) {
        bottomRef.current?.scrollIntoView({ block: "end", behavior: "instant" })
      }
    })

    for (const child of content.children) {
      observer.observe(child)
    }
    observer.observe(content)

    return () => observer.disconnect()
  }, [])

  return { scrollRef, bottomRef, isAtBottom, scrollToBottom }
}
