import type { SVGProps } from "react"

export function RedditIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24" fill="none" {...props}>
      {/* Classic Reddit Logo */}
      <path
        d="M12 2c5.523 0 10 4.477 10 10s-4.477 10-10 10S2 17.523 2 12 6.477 2 12 2z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <circle cx="8.5" cy="12" r="1.5" fill="currentColor" />
      <circle cx="15.5" cy="12" r="1.5" fill="currentColor" />
      <path d="M15.5 16.5c-1 1-3.5 1-4.5 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <path d="M18.5 10.5c0-0.828 0.672-1.5 1.5-1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M4 10.5c0-0.828 0.672-1.5 1.5-1.5" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8c3.5 0 6.5 1 8 2" stroke="currentColor" strokeWidth="2" />
      <path d="M12 8c-3.5 0-6.5 1-8 2" stroke="currentColor" strokeWidth="2" />
      <path d="M14 5l1-2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <circle cx="17" cy="5" r="1" fill="currentColor" />
    </svg>
  )
}

