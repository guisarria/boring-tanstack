const MeshGradientIcon = () => {
  return (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      style={{ width: "100%", height: "100%", maxWidth: "500px" }}
    >
      <defs>
        {/* Clips the entire drawing into a perfect circle */}
        <clipPath id="circleClip">
          <circle cx="250" cy="250" r="250" />
        </clipPath>

        {/* Applies the soft mesh blur effect */}
        <filter
          id="heavyBlur"
          x="-50%"
          y="-50%"
          width="200%"
          height="200%"
          colorInterpolationFilters="sRGB"
        >
          <feGaussianBlur stdDeviation="80" />
        </filter>
      </defs>

      <g clipPath="url(#circleClip)">
        {/* Base beige/tan background */}
        <rect width="500" height="500" fill="#cfae95" />

        {/* Top-right teal blob */}
        <circle
          cx="400"
          cy="150"
          r="220"
          fill="#7bded0"
          filter="url(#heavyBlur)"
        />

        {/* Top-left golden/yellow blob */}
        <circle
          cx="100"
          cy="180"
          r="200"
          fill="#eacb88"
          filter="url(#heavyBlur)"
        />

        {/* Bottom mauve/brown blob */}
        <circle
          cx="250"
          cy="450"
          r="220"
          fill="#a27771"
          filter="url(#heavyBlur)"
        />
      </g>
    </svg>
  )
}

export default MeshGradientIcon
