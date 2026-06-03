import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 44"
      className={cn("h-9 w-auto", className)}
      aria-hidden="true"
      fill="none"
    >
      {/* dark lens / sole shape */}
      <path
        d="M6 22C6 22 28 8 60 8C92 8 114 22 114 22C114 22 92 36 60 36C28 36 6 22 6 22Z"
        fill="#161410"
        stroke="rgba(224,138,44,0.25)"
        strokeWidth="1"
      />
      {/* orange swoosh */}
      <path
        d="M14 25C14 25 34 16 60 16C86 16 104 22 104 22"
        stroke="#e08a2c"
        strokeWidth="2.4"
        strokeLinecap="round"
      />
      <path
        d="M20 19C20 19 38 27 62 27C86 27 100 21 100 21"
        stroke="#f0ece0"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
    </svg>
  )
}

export function Logo({
  className,
  compact = false,
}: {
  className?: string
  compact?: boolean
}) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <LogoMark />
      {!compact && (
        <>
          <span className="hidden h-7 w-px bg-border sm:block" />
          <div className="leading-none">
            <p className="font-display text-base font-semibold tracking-[0.18em] text-foreground">
              THE WANTED SOLE
            </p>
            <p className="font-display text-[0.6rem] tracking-[0.55em] text-muted-foreground">
              STUDIO
            </p>
          </div>
        </>
      )}
    </div>
  )
}
