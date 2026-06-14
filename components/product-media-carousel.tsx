"use client"

import Image from "next/image"
import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, ImageIcon, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ProductMediaItem = {
  type: "image" | "video"
  src: string
}

function youtubeEmbedUrl(value: string) {
  try {
    const url = new URL(value)
    if (url.hostname.includes("youtube.com")) {
      const id = url.searchParams.get("v")
      return id ? `https://www.youtube.com/embed/${id}` : value
    }
    if (url.hostname.includes("youtu.be")) {
      const id = url.pathname.replace("/", "")
      return id ? `https://www.youtube.com/embed/${id}` : value
    }
    return value
  } catch {
    return value
  }
}

function isDirectVideo(value: string) {
  return /\.(mp4|webm|ogg)(\?.*)?$/i.test(value)
}

export function ProductMediaCarousel({
  title,
  price,
  badge,
  imageMode = "cover",
  media,
}: {
  title: string
  price: string
  badge?: string
  imageMode?: "cover" | "contain"
  media: ProductMediaItem[]
}) {
  const items = useMemo(() => media.filter((item) => item.src.trim()), [media])
  const [index, setIndex] = useState(0)
  const current = items[index] ?? items[0]
  const canSlide = items.length > 1

  function previous() {
    setIndex((currentIndex) =>
      currentIndex === 0 ? items.length - 1 : currentIndex - 1,
    )
  }

  function next() {
    setIndex((currentIndex) =>
      currentIndex === items.length - 1 ? 0 : currentIndex + 1,
    )
  }

  return (
    <div className="mt-8 overflow-hidden rounded-2xl border border-primary/25 bg-[#eadcc5] shadow-xl shadow-primary/10">
      <div className="relative aspect-[16/9] min-h-[260px]">
        {current?.type === "video" ? (
          isDirectVideo(current.src) ? (
            <video
              key={current.src}
              src={current.src}
              className="h-full w-full bg-[#eadcc5] object-contain"
              controls
              playsInline
            />
          ) : (
            <iframe
              key={current.src}
              src={youtubeEmbedUrl(current.src)}
              title={`${title} vídeo`}
              className="h-full w-full border-0 bg-[#eadcc5]"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          )
        ) : current?.src ? (
          <Image
            src={current.src}
            alt={title}
            fill
            priority
            sizes="(min-width: 1024px) 65vw, 100vw"
            className={cn(
              imageMode === "contain" ? "object-contain p-8 sm:p-12" : "object-cover",
            )}
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            <ImageIcon className="h-10 w-10" />
          </div>
        )}

        {current?.type !== "video" && (
          <div className="absolute inset-0 bg-gradient-to-t from-[#efe4d0]/90 via-transparent to-transparent" />
        )}

        {canSlide && (
          <>
            <Button
              type="button"
              size="icon"
              className="absolute left-4 top-1/2 h-10 w-10 -translate-y-1/2 border border-primary/30 bg-card/85 text-foreground hover:bg-primary hover:text-primary-foreground"
              onClick={previous}
              aria-label="Mídia anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Button
              type="button"
              size="icon"
              className="absolute right-4 top-1/2 h-10 w-10 -translate-y-1/2 border border-primary/30 bg-card/85 text-foreground hover:bg-primary hover:text-primary-foreground"
              onClick={next}
              aria-label="Próxima mídia"
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </>
        )}

        <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="font-display text-xs uppercase text-primary">
              {current?.type === "video" ? "Vídeo do produto" : "Produto oficial"}
            </p>
            <p className="mt-1 font-display text-2xl font-bold uppercase text-foreground">
              {badge || "The Wanted Sole Studio"}
            </p>
          </div>
          <div className="rounded-full border border-primary/30 bg-card/85 px-4 py-2 text-right">
            <p className="font-display text-xs uppercase text-muted-foreground">Preço</p>
            <p className="font-display text-xl font-bold text-primary">{price}</p>
          </div>
        </div>
      </div>

      {items.length > 1 && (
        <div className="grid gap-3 border-t border-primary/25 bg-background/45 p-3 sm:grid-cols-4">
          {items.map((item, itemIndex) => (
            <button
              key={`${item.src}-${itemIndex}`}
              type="button"
              onClick={() => setIndex(itemIndex)}
              className={cn(
                "overflow-hidden rounded-xl border bg-[#eadcc5] text-left transition-colors",
                itemIndex === index
                  ? "border-primary"
                  : "border-primary/25 hover:border-primary/50",
              )}
            >
              <div className="relative aspect-[5/3]">
                {item.type === "video" ? (
                  <div className="flex h-full items-center justify-center bg-[#eadcc5] text-primary">
                    <Play className="h-7 w-7" />
                  </div>
                ) : (
                  <Image
                    src={item.src}
                    alt={`${title} preview ${itemIndex + 1}`}
                    fill
                    sizes="(min-width: 1024px) 16vw, 50vw"
                    className={cn(
                      "opacity-90",
                      itemIndex === 0 && imageMode === "contain"
                        ? "object-contain p-4"
                        : "object-cover",
                    )}
                  />
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
