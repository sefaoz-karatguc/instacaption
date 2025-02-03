interface LogoProps {
  className?: string
}

export function Logo({ className = "" }: LogoProps) {
  return (
    <div className={`flex items-center ${className}`}>
      <svg
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="text-primary"
      >
        {/* Robot head */}
        <rect
          x="10"
          y="5"
          width="20"
          height="18"
          rx="3"
          className="stroke-current"
          strokeWidth="2"
        />
        
        {/* Robot display screen */}
        <rect
          x="13"
          y="8"
          width="14"
          height="8"
          rx="1"
          className="stroke-current"
          strokeWidth="1.5"
        />
        
        {/* Robot digital eyes */}
        <rect
          x="15"
          y="10"
          width="4"
          height="4"
          className="fill-current"
        />
        <rect
          x="21"
          y="10"
          width="4"
          height="4"
          className="fill-current"
        />
        
        {/* Robot antenna */}
        <circle
          cx="20"
          cy="2"
          r="1.5"
          className="fill-current"
        />
        <line
          x1="20"
          y1="2"
          x2="20"
          y2="5"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Robot neck */}
        <rect
          x="17"
          y="23"
          width="6"
          height="3"
          className="stroke-current"
          strokeWidth="1.5"
        />
        
        {/* Camera body */}
        <rect
          x="12"
          y="26"
          width="16"
          height="10"
          rx="2"
          className="stroke-current"
          strokeWidth="2"
        />
        
        {/* Camera lens */}
        <circle
          cx="20"
          cy="31"
          r="3.5"
          className="stroke-current"
          strokeWidth="2"
        />
        <circle
          cx="20"
          cy="31"
          r="1.5"
          className="fill-current"
        />
        
        {/* Camera flash */}
        <rect
          x="15"
          y="24"
          width="4"
          height="2"
          className="fill-current"
        />
        
        {/* Robot arms */}
        <path
          d="M10 31 C 6 31, 6 28, 8 28"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <path
          d="M30 31 C 34 31, 34 28, 32 28"
          className="stroke-current"
          strokeWidth="2"
          strokeLinecap="round"
        />
        
        {/* Circuit patterns */}
        <line
          x1="13"
          y1="19"
          x2="17"
          y2="19"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
        <line
          x1="23"
          y1="19"
          x2="27"
          y2="19"
          className="stroke-current"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
