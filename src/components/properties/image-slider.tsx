"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

type Slide = { src: string; alt?: string }

interface ImageSliderProps {
  images: Slide[]
  className?: string
  heightClassName?: string // e.g. "h-64 md:h-96"
  showIndicators?: boolean
  showArrows?: boolean
}

export function ImageSlider({
  images,
  className,
  heightClassName = "h-64 md:h-96",
  showIndicators = true,
  showArrows = true,
}: ImageSliderProps) {
  const containerRef = React.useRef<HTMLDivElement>(null)
  const itemRefs = React.useRef<Array<HTMLDivElement | null>>([])
  const [index, setIndex] = React.useState(0)

  // Guard empty input
  const slides: Slide[] =
    images && images.length > 0
      ? images
      : [
          { src: "/primary-property-image.jpg", alt: "Primary property image" },
          { src: "/secondary-property-image.jpg", alt: "Secondary property image" },
        ]

  // Keep refs array in sync
  itemRefs.current = Array(slides.length)
    .fill(null)
    .map((_, i) => itemRefs.current[i] || null)

  const scrollTo = (i: number) => {
    const el = itemRefs.current[i]
    if (el) el.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" })
  }

  const onPrev = () => {
    const next = (index - 1 + slides.length) % slides.length
    setIndex(next)
    scrollTo(next)
  }

  const onNext = () => {
    const next = (index + 1) % slides.length
    setIndex(next)
    scrollTo(next)
  }

  const onDotClick = (i: number) => {
    setIndex(i)
    scrollTo(i)
  }

  // Update index on scroll (keeps dots in sync if user swipes)
  const handleScroll = React.useCallback(() => {
    const c = containerRef.current
    if (!c) return
    const w = c.clientWidth
    const i = Math.round(c.scrollLeft / Math.max(1, w))
    if (i !== index) setIndex(Math.min(Math.max(i, 0), slides.length - 1))
  }, [index, slides.length])

  React.useEffect(() => {
    const c = containerRef.current
    if (!c) return
    const onScroll = () => handleScroll()
    c.addEventListener("scroll", onScroll, { passive: true })
    return () => c.removeEventListener("scroll", onScroll)
  }, [handleScroll])

  // Keyboard support
  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") onPrev()
    if (e.key === "ArrowRight") onNext()
  }

  return (
    <section
      className={cn("relative rounded-lg border bg-card", className)}
      role="region"
      aria-roledescription="carousel"
      aria-label="Property images"
    >
      <div
        ref={containerRef}
        className={cn(
          "w-full overflow-x-auto scroll-smooth snap-x snap-mandatory rounded-lg",
          "no-scrollbar", // hide scrollbar visually
          heightClassName,
        )}
        tabIndex={0}
        onKeyDown={onKeyDown}
        aria-live="polite"
      >
        <div className="flex w-full">
          {slides.map((s, i) => (
            <div
              key={i}
              ref={(el) => {
                itemRefs.current[i] = el;
              }}
              className={cn("relative w-full shrink-0 snap-center", heightClassName)}
              aria-roledescription="slide"
              aria-label={`Image ${i + 1} of ${slides.length}`}
            >
              <img
                src={s.src || "/placeholder.svg"}
                alt={s.alt || `Property image ${i + 1}`}
                className="h-full w-full object-cover"
                crossOrigin="anonymous"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>
      </div>

      {showArrows && slides.length > 1 && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-between px-2">
          <button
            type="button"
            onClick={onPrev}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Previous image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            type="button"
            onClick={onNext}
            className="pointer-events-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-background/80 text-foreground shadow hover:bg-background focus:outline-none focus-visible:ring-2 focus-visible:ring-primary"
            aria-label="Next image"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      )}

      {showIndicators && slides.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-background/80 px-2 py-1 shadow">
          <div className="flex items-center gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                className={cn(
                  "h-2 w-2 rounded-full transition-colors",
                  i === index ? "bg-primary" : "bg-muted-foreground/40 hover:bg-muted-foreground/70",
                )}
                aria-label={`Go to image ${i + 1}`}
                aria-pressed={i === index}
                onClick={() => onDotClick(i)}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  )
}
