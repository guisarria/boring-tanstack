import { ScriptOnce } from "@tanstack/react-router"
import {
  createContext,
  type Dispatch,
  type PropsWithChildren,
  type ReactNode,
  type SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react"

type ColorScheme = "light" | "dark"

type ValueObject = Record<string, string>

export type UseThemeProps = {
  themes: string[]
  forcedTheme?: string
  setTheme: Dispatch<SetStateAction<string>>
  theme?: string
  systemTheme?: ColorScheme
}

export type Attribute = `data-${string}` | "class"

export type ThemeProviderProps = PropsWithChildren<{
  attribute?: Attribute | Attribute[]
  defaultTheme?: string
  disableTransitionOnChange?: boolean
  enableColorScheme?: boolean
  enableSystem?: boolean
  forcedTheme?: string
  storageKey?: string
  themes?: string[]
  value?: ValueObject
}>

const COLOR_SCHEMES: ColorScheme[] = ["light", "dark"]
const MEDIA = "(prefers-color-scheme: dark)"
const ThemeContext = createContext<UseThemeProps | undefined>(undefined)
const defaultContext: UseThemeProps = {
  setTheme: () => {
    /* no-op */
  },
  themes: [],
}

export const useTheme = () => useContext(ThemeContext) ?? defaultContext

export const ThemeProvider = (props: ThemeProviderProps): ReactNode => {
  const context = useContext(ThemeContext)

  if (context) {
    return props.children
  }
  return <Theme {...props} />
}

const applyClassAttribute = (
  name: string | undefined,
  attrValues: string[],
) => {
  const d = document.documentElement
  d.classList.remove(...attrValues)
  if (name) {
    d.classList.add(name)
  }
}

const applyDataAttribute = (attr: string, name: string | undefined) => {
  const d = document.documentElement
  if (name) {
    d.setAttribute(attr, name)
    return
  }
  d.removeAttribute(attr)
}

const applyAttributes = (
  resolved: string,
  attributeList: Attribute[],
  attrValues: string[],
  value?: ValueObject,
) => {
  const name = value ? value[resolved] : resolved

  for (const attr of attributeList) {
    if (attr === "class") {
      applyClassAttribute(name, attrValues)
    }
    if (attr.startsWith("data-")) {
      applyDataAttribute(attr, name)
    }
  }
}

const isColorScheme = (value: string): value is ColorScheme =>
  COLOR_SCHEMES.includes(value as ColorScheme)

const applyColorScheme = (
  resolved: string,
  defaultTheme: string,
  enableColorScheme: boolean,
) => {
  if (!enableColorScheme) {
    return
  }
  const fallback = isColorScheme(defaultTheme) ? defaultTheme : null
  const colorScheme = isColorScheme(resolved) ? resolved : fallback
  document.documentElement.style.colorScheme = colorScheme ?? ""
}

const getSystemTheme = (): ColorScheme => {
  if (typeof window === "undefined") {
    return "light"
  }
  return window.matchMedia(MEDIA).matches ? "dark" : "light"
}

const getTheme = (key: string, fallback?: string) => {
  if (typeof window === "undefined") {
    return fallback
  }
  try {
    return localStorage.getItem(key) || fallback
  } catch {
    return fallback
  }
}

const disableAnimation = () => {
  const css = document.createElement("style")
  css.appendChild(
    document.createTextNode(
      "*,*::before,*::after{-webkit-transition:none!important;-moz-transition:none!important;-o-transition:none!important;-ms-transition:none!important;transition:none!important}",
    ),
  )
  document.head.appendChild(css)

  return () => {
    window.getComputedStyle(document.body)
    setTimeout(() => {
      document.head.removeChild(css)
    }, 1)
  }
}

const getServerSnapshot = (): ColorScheme => "light"

const subscribeMediaQuery = (onStoreChange: () => void) => {
  const media = window.matchMedia(MEDIA)
  media.addEventListener("change", onStoreChange)
  return () => media.removeEventListener("change", onStoreChange)
}

const useSystemTheme = () =>
  useSyncExternalStore(subscribeMediaQuery, getSystemTheme, getServerSnapshot)

const defaultThemes = ["light", "dark"]

const Theme = ({
  forcedTheme,
  disableTransitionOnChange = false,
  enableSystem = true,
  enableColorScheme = true,
  storageKey = "theme",
  themes = defaultThemes,
  defaultTheme = enableSystem ? "system" : "light",
  attribute = "data-theme",
  value,
  children,
}: ThemeProviderProps) => {
  const [theme, setThemeState] = useState(() =>
    getTheme(storageKey, defaultTheme),
  )

  const systemTheme = useSystemTheme()

  const attributeList = useMemo(
    () => (Array.isArray(attribute) ? attribute : [attribute]),
    [attribute],
  )

  const attrValues = useMemo(
    () => (value ? Object.values(value) : themes),
    [value, themes],
  )

  const applyTheme = useCallback(
    (themeName: string | undefined) => {
      if (!themeName) {
        return
      }

      const resolved =
        themeName === "system" && enableSystem ? systemTheme : themeName

      const enable = disableTransitionOnChange ? disableAnimation() : null

      applyAttributes(resolved, attributeList, attrValues, value)
      applyColorScheme(resolved, defaultTheme, enableColorScheme)

      enable?.()
    },
    [
      enableSystem,
      systemTheme,
      disableTransitionOnChange,
      attributeList,
      attrValues,
      value,
      enableColorScheme,
      defaultTheme,
    ],
  )

  const setTheme = useCallback(
    (newValue: SetStateAction<string>) => {
      setThemeState((prev) => {
        const newTheme =
          typeof newValue === "function" ? newValue(prev ?? "") : newValue

        try {
          localStorage.setItem(storageKey, newTheme)
        } catch {
          // localStorage might not be available
        }

        return newTheme
      })
    },
    [storageKey],
  )

  useEffect(() => {
    const handleStorage = (e: StorageEvent) => {
      if (e.key !== storageKey) {
        return
      }
      setThemeState(e.newValue || defaultTheme)
    }

    window.addEventListener("storage", handleStorage)
    return () => window.removeEventListener("storage", handleStorage)
  }, [defaultTheme, storageKey])

  useEffect(() => {
    applyTheme(forcedTheme ?? theme)
  }, [applyTheme, forcedTheme, theme])

  const providerValue = useMemo(
    () => ({
      forcedTheme,
      setTheme,
      systemTheme: enableSystem ? systemTheme : undefined,
      theme,
      themes: enableSystem ? [...themes, "system"] : themes,
    }),
    [theme, forcedTheme, enableSystem, themes, setTheme, systemTheme],
  )

  return (
    <ThemeContext.Provider value={providerValue}>
      <ThemeScript
        attribute={attribute}
        defaultTheme={defaultTheme}
        enableColorScheme={enableColorScheme}
        enableSystem={enableSystem}
        forcedTheme={forcedTheme}
        storageKey={storageKey}
        themes={themes}
        value={value}
      />
      {children}
    </ThemeContext.Provider>
  )
}

const ThemeScript = ({
  forcedTheme,
  storageKey,
  attribute,
  enableSystem,
  enableColorScheme,
  defaultTheme,
  value,
  themes,
}: Omit<ThemeProviderProps, "children"> & { defaultTheme: string }) => {
  const scriptArgs = JSON.stringify([
    attribute,
    storageKey,
    defaultTheme,
    forcedTheme,
    themes,
    value,
    enableSystem,
    enableColorScheme,
  ]).slice(1, -1)

  return <ScriptOnce>{`(${themeScript.toString()})(${scriptArgs})`}</ScriptOnce>
}

const themeScript = (
  attribute: Attribute | Attribute[],
  storageKey: string,
  defaultTheme: string,
  forcedTheme: string | undefined,
  themes: string[],
  value: ValueObject | undefined,
  enableSystem: boolean,
  enableColorScheme: boolean,
) => {
  const el = document.documentElement
  const systemThemes = ["light", "dark"]
  const attributes = Array.isArray(attribute) ? attribute : [attribute]
  const attrValues = value ? Object.values(value) : themes

  function applyClassAttr(name: string | undefined) {
    el.classList.remove(...attrValues)
    if (name) {
      el.classList.add(name)
    }
  }

  function applyDataAttr(attr: string, name: string | undefined) {
    if (name) {
      el.setAttribute(attr, name)
      return
    }
    el.removeAttribute(attr)
  }

  function updateDOM(theme: string) {
    const name = value ? value[theme] : theme

    for (const attr of attributes) {
      if (attr === "class") {
        applyClassAttr(name)
      }
      if (attr.startsWith("data-")) {
        applyDataAttr(attr, name)
      }
    }

    setColorScheme(theme)
  }

  function setColorScheme(theme: string) {
    if (!enableColorScheme) {
      return
    }

    const fallback = systemThemes.includes(defaultTheme) ? defaultTheme : null
    const colorScheme = systemThemes.includes(theme) ? theme : fallback
    el.style.colorScheme = colorScheme || ""
  }

  function resolveSystemTheme() {
    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light"
  }

  if (forcedTheme) {
    const resolvedForcedTheme =
      forcedTheme === "system" && enableSystem
        ? resolveSystemTheme()
        : forcedTheme
    updateDOM(resolvedForcedTheme)
    return
  }

  try {
    const themeName = localStorage.getItem(storageKey) || defaultTheme
    const isSystem = enableSystem && themeName === "system"
    const theme = isSystem ? resolveSystemTheme() : themeName
    updateDOM(theme)
  } catch {
    // localStorage might not be available
  }
}
