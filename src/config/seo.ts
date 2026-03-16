import type { AnyRouteMatch } from "@tanstack/react-router"

const BASE_URL = "https://boring-tanstack.vercel.app"
const SITE_NAME = "Boring TanStack"
const DEFAULT_DESCRIPTION =
  "A modern full-stack starter built with TanStack Start, React, and Drizzle."
const DEFAULT_IMAGE = "/og-image.png"
const TWITTER_HANDLE = "@example"

export interface SeoResult {
  meta: NonNullable<AnyRouteMatch["meta"]>
  links?: NonNullable<AnyRouteMatch["links"]>
  scripts?: NonNullable<AnyRouteMatch["scripts"]>
  styles?: NonNullable<AnyRouteMatch["styles"]>
}

export interface SeoOptions extends Partial<SeoResult> {
  title: string
  description?: string
  keywords?: string[]

  url?: string
  image?: string

  ogType?: "website" | "article"

  noIndex?: boolean
  noFollow?: boolean
}

const absoluteUrl = (path?: string) => {
  if (!path) return
  if (/^https?:\/\//.test(path)) return path
  return new URL(path, BASE_URL).toString().replace(/\/$/, "")
}

const metaTag = (key: "name" | "property", name: string, content?: string) =>
  content ? [{ [key]: name, content }] : []

export const seo = ({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords,
  url,
  image,
  ogType = "website",

  noIndex,
  noFollow,

  meta = [],
  links = [],
  scripts,
  styles,
}: SeoOptions): SeoResult => {
  const fullTitle = title === SITE_NAME ? title : `${title} | ${SITE_NAME}`
  const pageUrl = absoluteUrl(url)
  const imageUrl = absoluteUrl(image ?? DEFAULT_IMAGE)

  const robots = [
    noIndex ? "noindex" : "index",
    noFollow ? "nofollow" : "follow",
  ].join(",")

  return {
    meta: [
      { title: fullTitle },

      ...metaTag("name", "description", description),

      ...(keywords?.length
        ? [{ name: "keywords", content: keywords.join(", ") }]
        : []),

      { name: "robots", content: robots },

      ...metaTag("property", "og:type", ogType),
      ...metaTag("property", "og:locale", "en_US"),
      ...metaTag("property", "og:title", title),
      ...metaTag("property", "og:site_name", SITE_NAME),
      ...metaTag("property", "og:description", description),
      ...metaTag("property", "og:url", pageUrl),
      ...metaTag("property", "og:image", imageUrl),

      { name: "twitter:site", content: TWITTER_HANDLE },
      { name: "twitter:card", content: "summary_large_image" },
      ...metaTag("name", "twitter:title", title),
      ...metaTag("name", "twitter:description", description),
      ...metaTag("name", "twitter:image", imageUrl),

      ...meta,
    ],

    links: [
      ...(pageUrl ? [{ rel: "canonical", href: pageUrl }] : []),
      ...links,
    ],

    scripts,
    styles,
  }
}
