import { cn } from "@/lib/utils"

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 128 48"
      className={cn("h-9 w-auto", className)}
      aria-hidden="true"
      fill="none"
    >
      <path
        d="M14 28C27 13 43 12 59 24C73 34 88 35 114 18"
        stroke="#151412"
        strokeWidth="13"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M14 28C27 13 43 12 59 24C73 34 88 35 114 18"
        stroke="#f3eadb"
        strokeWidth="5.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M15 30C29 17 44 16 59 27C74 37 91 34 114 20"
        stroke="#d88a33"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M12 21C28 7 45 8 62 20C78 31 94 29 116 15"
        stroke="#151412"
        strokeWidth="7"
        strokeLinecap="round"
        strokeLinejoin="round"
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
          <span className="hidden h-8 w-px bg-primary/35 sm:block" />
          <div className="leading-none">
            <p className="font-display text-base font-semibold tracking-[0.22em] text-foreground">
              THE WANTED SOLE
            </p>
            <p className="mt-1 font-display text-[0.6rem] tracking-[0.65em] text-primary">
              STUDIO
            </p>
          </div>
        </>
      )}
    </div>
  )
}
