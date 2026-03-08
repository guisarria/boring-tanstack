import { cn } from "@/lib/utils"

export function EncoderDisc({
  className,
  ...props
}: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      className={cn(className)}
      shapeRendering="geometricPrecision"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="-432 -432 862 862"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <title>Encoder Disc</title>

      <circle className="fill-background" r="420" />

      {/* Outer ring segments — 1, 4, 5, 8 filled */}
      <g className="fill-orange-600">
        <path d="M0,-420 A420,420 0 0,1 297,-297 L198,-198 A280,280 0 0,0 0,-280 Z" />
        <path d="M297,297 A420,420 0 0,1 0,420 L0,280 A280,280 0 0,0 198,198 Z" />
        <path d="M0,420 A420,420 0 0,1 -297,297 L-198,198 A280,280 0 0,0 0,280 Z" />
        <path d="M-297,-297 A420,420 0 0,1 0,-420 L0,-280 A280,280 0 0,0 -198,-198 Z" />
      </g>

      {/* Middle ring segments — 5, 6, 7, 8 filled */}
      <g className="fill-orange-600">
        <path d="M0,280 A280,280 0 0,1 -198,198 L-120,120 A170,170 0 0,0 0,170 Z" />
        <path d="M-198,198 A280,280 0 0,1 -280,0 L-170,0 A170,170 0 0,0 -120,120 Z" />
        <path d="M-280,0 A280,280 0 0,1 -198,-198 L-120,-120 A170,170 0 0,0 -170,0 Z" />
        <path d="M-198,-198 A280,280 0 0,1 0,-280 L0,-170 A170,170 0 0,0 -120,-120 Z" />
      </g>

      {/* Inner ring segments — 3, 4, 5, 6 filled */}
      <g className="fill-orange-600">
        <path d="M170,0 A170,170 0 0,1 120,120 L70,70 A100,100 0 0,0 100,0 Z" />
        <path d="M120,120 A170,170 0 0,1 0,170 L0,100 A100,100 0 0,0 70,70 Z" />
        <path d="M0,170 A170,170 0 0,1 -120,120 L-70,70 A100,100 0 0,0 0,100 Z" />
        <path d="M-120,120 A170,170 0 0,1 -170,0 L-100,0 A100,100 0 0,0 -70,70 Z" />
      </g>

      {/* Circle outlines */}
      <g className="fill-transparent stroke-foreground" strokeWidth="22">
        <circle r="420" />
        <circle r="280" />
        <circle r="170" />
        <circle r="100" />
      </g>

      {/* Radial lines */}
      <g className="fill-transparent stroke-foreground" strokeWidth="22">
        <line x1="0" x2="0" y1="-420" y2="420" />
        <line x1="-420" x2="420" y1="0" y2="0" />
        <line x1="-297" x2="297" y1="-297" y2="297" />
        <line x1="297" x2="-297" y1="-297" y2="297" />
      </g>
    </svg>
  )
}
