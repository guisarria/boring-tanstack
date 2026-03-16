import { useId } from "react"

import { cn } from "@/lib/utils"
import { getRandomColor, getUnit, hashCode } from "@/lib/utils"

const ELEMENTS = 3
const SIZE = 80

const AI_COLORS = [
  "#ff006e",
  "#ffbe0b",
  "#00f5d4",
  "#8338ec",
  "#fb5607",
  "#3a86ff",
  "#ff006e",
]

function generateProperties(name: string, colors: string[]) {
  const numFromName = hashCode(name)
  const range = colors.length

  return Array.from({ length: ELEMENTS }, (_, i) => ({
    color: getRandomColor(numFromName + i, colors, range),
    translateX: getUnit(numFromName * (i + 1), SIZE / 10, 1),
    translateY: getUnit(numFromName * (i + 1), SIZE / 10, 2),
    scale: 1.2 + getUnit(numFromName * (i + 1), SIZE / 20) / 10,
    rotate: getUnit(numFromName * (i + 1), 360, 1),
  }))
}

export function AiBotAvatar({
  isStreaming = true,
  size = 36,
  className,
}: {
  isStreaming?: boolean
  size?: number
  className?: string
}) {
  const maskID = useId()
  const properties = generateProperties("ai-assistant", AI_COLORS)

  return (
    <svg
      viewBox={`0 0 ${SIZE} ${SIZE}`}
      fill="none"
      role="img"
      aria-label="AI Assistant"
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      shapeRendering="geometricPrecision"
      className={cn("rounded-full shadow-lg saturate-50", className)}
    >
      <defs>
        <filter
          id={`liquidGlass_${maskID}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.015"
            numOctaves="3"
            seed="0"
            result="turbulence"
          >
            <animate
              attributeName="baseFrequency"
              values="0.015;0.02;0.018;0.025;0.015"
              dur={isStreaming ? "8s" : "24s"}
              repeatCount="indefinite"
            />
          </feTurbulence>

          <feGaussianBlur in="SourceGraphic" stdDeviation={0} result="blur" />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="redChannel"
          />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="greenChannel"
          />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blueChannel"
          />

          <feDisplacementMap
            in="redChannel"
            in2={isStreaming ? "turbulence" : "SourceGraphic"}
            scale={isStreaming ? 12 : 0}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispRed"
          />
          <feDisplacementMap
            in="greenChannel"
            in2={isStreaming ? "turbulence" : "SourceGraphic"}
            scale={isStreaming ? 6 : 0}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispGreen"
          />
          <feDisplacementMap
            in="blueChannel"
            in2={isStreaming ? "turbulence" : "SourceGraphic"}
            scale={isStreaming ? 18 : 0}
            xChannelSelector="R"
            yChannelSelector="G"
            result="dispBlue"
          />

          <feBlend in="dispRed" in2="dispGreen" mode="screen" result="rg" />
          <feBlend in="rg" in2="dispBlue" mode="screen" result="chromatic" />

          <feFlood floodColor="#ffffff" floodOpacity={0.4} result="specular" />
          <feComposite
            in="specular"
            in2="chromatic"
            operator="in"
            result="specularMask"
          />

          <feOffset in="specularMask" dx={-8} dy={-8} result="specularOffset" />
          <feGaussianBlur
            in="specularOffset"
            stdDeviation={4}
            result="specularBlur"
          />

          <feBlend
            in="specularBlur"
            in2="chromatic"
            mode="screen"
            result="withSpecular"
          />

          <feFlood
            floodColor="#ffffff"
            floodOpacity={0.15}
            result="highlight"
          />
          <feComposite
            in="highlight"
            in2="withSpecular"
            operator="in"
            result="highlightMask"
          />
          <feGaussianBlur
            in="highlightMask"
            stdDeviation={2}
            result="highlightBlur"
          />
          <feBlend in="highlightBlur" in2="withSpecular" mode="screen" />
        </filter>

        <filter
          id={`liquidShine_${maskID}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceAlpha" stdDeviation={3} result="blur" />
          <feOffset in="blur" dx="-2" dy="-2" result="offsetBlur" />
          <feFlood floodColor="#ffffff" floodOpacity={0.3} result="glowColor" />
          <feComposite
            in="glowColor"
            in2="offsetBlur"
            operator="in"
            result="innerGlow"
          />
          <feMerge>
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="innerGlow" />
          </feMerge>
        </filter>

        <filter
          id={`iridescent_${maskID}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feGaussianBlur in="SourceGraphic" stdDeviation={0} result="blur" />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="redChannel"
          />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0  0 1 0 0 0  0 0 0 0 0  0 0 0 1 0"
            result="greenChannel"
          />

          <feColorMatrix
            in="blur"
            type="matrix"
            values="0 0 0 0 0  0 0 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="blueChannel"
          />

          <feBlend
            in="redChannel"
            in2="greenChannel"
            mode="screen"
            result="blend1"
          />
          <feBlend
            in="blend1"
            in2="blueChannel"
            mode="screen"
            result="iridescent"
          />

          <feFlood floodColor="#ffffff" floodOpacity={0.3} result="specular" />
          <feComposite
            in="specular"
            in2="iridescent"
            operator="in"
            result="specularMask"
          />

          <feOffset
            in="specularMask"
            dx={-10}
            dy={-10}
            result="specularOffset"
          />
          <feGaussianBlur
            in="specularOffset"
            stdDeviation={0}
            result="specularBlur"
          />

          <feBlend in="specularBlur" in2="iridescent" mode="screen" />
        </filter>

        <filter
          id={`filter_${maskID}`}
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity={0} result="BackgroundImageFix" />
          <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
          <feGaussianBlur stdDeviation={8} result="effect1_foregroundBlur" />
        </filter>

        <filter
          id={`grain_${maskID}`}
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
        >
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.65"
            numOctaves="5"
            stitchTiles="stitch"
            result="noise"
          />

          <feColorMatrix
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="coloredNoise"
          />

          <feDisplacementMap
            in="SourceGraphic"
            in2="noise"
            scale="8"
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />

          <feBlend in="SourceGraphic" in2="displaced" mode="screen" />
        </filter>

        <linearGradient
          id={`glassSheen_${maskID}`}
          x1="0%"
          y1="0%"
          x2="100%"
          y2="100%"
        >
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
          <stop offset="30%" stopColor="#ffffff" stopOpacity="0.1" />
          <stop offset="50%" stopColor="#ffffff" stopOpacity="0" />
          <stop offset="70%" stopColor="#ffffff" stopOpacity="0.05" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.2" />
        </linearGradient>

        <radialGradient
          id={`innerShadow_${maskID}`}
          cx="50%"
          cy="50%"
          r="50%"
          fx="50%"
          fy="50%"
        >
          <stop offset="60%" stopColor="#000000" stopOpacity="0" />
          <stop offset="85%" stopColor="#000000" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#000000" stopOpacity="0.3" />
        </radialGradient>
      </defs>

      <mask
        id={maskID}
        maskUnits="userSpaceOnUse"
        x={0}
        y={0}
        width={SIZE}
        height={SIZE}
      >
        <rect width={SIZE} height={SIZE} rx={SIZE * 2} fill="#FFFFFF" />
      </mask>

      <g mask={`url(#${maskID})`}>
        <rect width={SIZE} height={SIZE} fill={properties[0].color}>
          <animate
            attributeName="fill"
            values={`${AI_COLORS[0]};${AI_COLORS[1]};${AI_COLORS[2]};${AI_COLORS[3]};${AI_COLORS[4]};${AI_COLORS[5]};${AI_COLORS[0]}`}
            dur={isStreaming ? "4s" : "12s"}
            repeatCount="indefinite"
          />
          <animate
            attributeName="rx"
            values={`${SIZE * 2};${SIZE * 2.3};${SIZE * 1.9};${SIZE * 2.1};${SIZE * 2}`}
            dur={isStreaming ? "5s" : "15s"}
            repeatCount="indefinite"
          />
        </rect>

        <path
          filter={`url(#filter_${maskID})`}
          d="M32.414 59.35L50.376 70.5H72.5v-71H33.728L26.5 13.381l19.057 27.08L32.414 59.35z"
          fill={properties[1].color}
          transform={`translate(${properties[1].translateX} ${properties[1].translateY}) rotate(${properties[1].rotate} ${SIZE / 2} ${SIZE / 2}) scale(${properties[1].scale})`}
        >
          <animate
            attributeName="fill"
            values={`${AI_COLORS[2]};${AI_COLORS[4]};${AI_COLORS[0]};${AI_COLORS[5]};${AI_COLORS[2]}`}
            dur={isStreaming ? "3s" : "9s"}
            repeatCount="indefinite"
          />
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`${properties[1].rotate} ${SIZE / 2} ${SIZE / 2}`}
            to={`${properties[1].rotate + 360} ${SIZE / 2} ${SIZE / 2}`}
            dur={isStreaming ? "8s" : "24s"}
            repeatCount="indefinite"
            additive="sum"
          />
        </path>

        <path
          filter={`url(#filter_${maskID})`}
          style={{ mixBlendMode: "overlay" }}
          d="M22.216 24L0 46.75l14.108 38.129L78 86l-3.081-59.276-22.378 4.005 12.972 20.186-23.35 27.395L22.215 24z"
          fill={properties[2].color}
          transform={`translate(${properties[2].translateX} ${properties[2].translateY}) rotate(${properties[2].rotate} ${SIZE / 2} ${SIZE / 2}) scale(${properties[2].scale})`}
        />

        {isStreaming && (
          <>
            <rect
              width={SIZE}
              height={SIZE}
              fill="transparent"
              filter={`url(#liquidGlass_${maskID})`}
              opacity={0.6}
            />
            <rect
              width={SIZE}
              height={SIZE}
              fill="url(#glassSheen_${maskID})"
              opacity={0.5}
            />
            <rect
              width={SIZE}
              height={SIZE}
              fill="url(#innerShadow_${maskID})"
              opacity={0.4}
            />
            <rect
              width={SIZE}
              height={SIZE}
              fill="transparent"
              filter={`url(#grain_${maskID})`}
              opacity={0.3}
            />
          </>
        )}

        {!isStreaming && (
          <rect
            width={SIZE}
            height={SIZE}
            fill="transparent"
            filter={`url(#liquidGlass_${maskID})`}
            opacity={0.3}
          />
        )}
      </g>
    </svg>
  )
}
