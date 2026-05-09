import { useState } from 'react'

export function PropertyGallery({ images, title }: { images: string[]; title: string }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const active = images[activeIndex] ?? images[0]

  return (
    <div className="space-y-4">
      <div className="glass-panel relative overflow-hidden rounded-3xl">
        <img alt={title} className="h-[420px] w-full object-cover" src={active} />
        {images.length > 1 ? (
          <div className="absolute bottom-4 right-4 flex gap-2">
            <button
              className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-white"
              onClick={() => setActiveIndex((activeIndex - 1 + images.length) % images.length)}
              type="button"
            >
              Prev
            </button>
            <button
              className="rounded-full bg-slate-950/80 px-4 py-2 text-sm text-white"
              onClick={() => setActiveIndex((activeIndex + 1) % images.length)}
              type="button"
            >
              Next
            </button>
          </div>
        ) : null}
      </div>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
        {images.map((image, index) => (
          <button
            key={image}
            className={`overflow-hidden rounded-2xl border ${index === activeIndex ? 'border-cyan-300' : 'border-white/10'}`}
            onClick={() => setActiveIndex(index)}
            type="button"
          >
            <img alt={`${title} ${index + 1}`} className="h-24 w-full object-cover" src={image} />
          </button>
        ))}
      </div>
    </div>
  )
}
