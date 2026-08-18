import { Photo } from "@/lib/photos";

interface Props {
  photo: Photo;
  eyebrow: string;
  title: string;
  /** Compact = shorter banner used on sub-pages; default is the taller hero variant. */
  compact?: boolean;
}

export default function PhotoBanner({ photo, eyebrow, title, compact }: Props) {
  return (
    <div
      className={`relative -mx-4 overflow-hidden ${compact ? "h-40" : "h-56"}`}
    >
      <img
        src={photo.src}
        alt={photo.alt}
        loading="eager"
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-char via-char/55 to-char/10" />
      <div className="absolute inset-0 bg-gradient-to-b from-char/70 via-transparent to-transparent" />

      <div className="absolute inset-x-0 bottom-0 px-4 pb-4">
        <p className="font-mono text-xs uppercase tracking-widest text-roast-light drop-shadow">
          {eyebrow}
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold italic text-husk drop-shadow">
          {title}
        </h1>
      </div>
    </div>
  );
}
