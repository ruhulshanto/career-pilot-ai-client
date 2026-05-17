import React from "react";

export function CareerPilotTrajectoryIcon(
  props: React.SVGProps<SVGSVGElement> & {
    isHovered?: boolean;
    isClicked?: boolean;
  }
) {
  const { isHovered = false, isClicked = false, ...rest } = props;

  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      style={{
        transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
        transform: isClicked ? "scale(0.85) rotate(-5deg)" : isHovered ? "scale(1.08) rotate(2deg)" : "scale(1)",
      }}
      {...rest}
    >
      <style>
        {`
          @keyframes pulse-glow {
            0%, 100% { opacity: 0.3; }
            50% { opacity: 0.8; }
          }
          @keyframes spin-slow {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          @keyframes trajectory-flow {
            0% { stroke-dashoffset: 200; }
            100% { stroke-dashoffset: 0; }
          }
          .trajectory-path {
            transition: all 0.5s ease;
          }
          .trajectory-path:hover {
            filter: drop-shadow(0 0 6px currentColor);
          }
          .node-pulse {
            animation: pulse-glow 2s ease-in-out infinite;
          }
          .node-pulse:nth-child(odd) {
            animation-delay: 0.5s;
          }
        `}
      </style>

      <g
        stroke="currentColor"
        strokeWidth="2.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        style={{
          transition: "all 0.4s ease",
          opacity: isHovered ? 1 : 0.85,
        }}
      >
        {/* OUTER GLOBE - Fixed bottom left gap */}
        <path 
          d="M18 16C24 10 40 10 46 16" 
          className="trajectory-path"
          style={{
            strokeDasharray: isHovered ? "100" : "0",
            strokeDashoffset: isHovered ? "0" : "0",
            transition: "stroke-dasharray 0.8s ease",
          }}
        />
        <path 
          d="M50 20C54 28 54 40 48 48" 
          className="trajectory-path"
          style={{
            strokeDasharray: isHovered ? "100" : "0",
            strokeDashoffset: isHovered ? "0" : "0",
            transition: "stroke-dasharray 0.8s ease 0.1s",
          }}
        />

        {/* BOTTOM CONTINUOUS CURVE - Extended to close gap */}
        <path 
          d="M48 48C40 56 24 56 14 44" 
          className="trajectory-path"
          style={{
            strokeDasharray: isHovered ? "120" : "0",
            strokeDashoffset: isHovered ? "0" : "0",
            transition: "stroke-dasharray 0.8s ease 0.2s",
          }}
        />
        <path 
          d="M14 44C10 40 10 36 10 36" 
          className="trajectory-path"
          style={{
            strokeDasharray: isHovered ? "60" : "0",
            strokeDashoffset: isHovered ? "0" : "0",
            transition: "stroke-dasharray 0.8s ease 0.3s",
          }}
        />

        <path d="M10 36C10 30 12 24 16 20" />

        {/* TOP CONNECTION */}
        <path 
          d="M18 16C26 18 32 20 38 22" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease",
          }}
        />
        <path 
          d="M38 22C42 18 46 17 50 20" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.05s",
          }}
        />

        {/* MIDDLE ARC */}
        <path 
          d="M10 36C20 34 30 34 42 40" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.1s",
          }}
        />

        {/* INNER CONNECTIONS */}
        <path 
          d="M22 52C30 48 36 44 42 40" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.15s",
          }}
        />
        <path 
          d="M22 52C20 42 20 30 26 30" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.2s",
          }}
        />
        <path 
          d="M26 30C30 26 34 22 38 22" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.25s",
          }}
        />
        <path 
          d="M38 22C42 26 44 32 42 40" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.3s",
          }}
        />
        <path 
          d="M42 40C46 34 48 28 50 20" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.35s",
          }}
        />

        {/* FIXED LOWER RIGHT CONNECTOR */}
        <path 
          d="M42 40C44 44 44 48 44 52" 
          style={{
            strokeWidth: isHovered ? "3.2" : "2.8",
            transition: "stroke-width 0.3s ease 0.4s",
          }}
        />

        {/* SMALL DASH */}
        <path d="M14 20L16 18" />

        {/* NODES - with enhanced styling and animations */}
        <circle 
          cx="18" cy="16" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
        <circle 
          cx="38" cy="22" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease 0.05s",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
        <circle 
          cx="50" cy="20" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease 0.1s",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
        <circle 
          cx="10" cy="36" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease 0.15s",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
        <circle 
          cx="26" cy="30" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease 0.2s",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
        <circle 
          cx="42" cy="40" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease 0.25s",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
        <circle 
          cx="22" cy="52" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease 0.3s",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
        <circle 
          cx="44" cy="52" r="2.7" 
          fill="currentColor" 
          className="node-pulse"
          style={{
            r: isHovered ? "3.5" : "2.7",
            transition: "r 0.3s ease 0.35s",
            filter: isHovered ? "drop-shadow(0 0 8px currentColor)" : "none",
          }}
        />
      </g>
    </svg>
  );
}