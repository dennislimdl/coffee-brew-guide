import { Photo } from "@/lib/photos";

export default function PhotoThumb({ photo }: { photo: Photo }) {
  return (
    <img
      src={photo.src}
      alt={photo.alt}
      loading="lazy"
      className="h-16 w-16 shrink-0 rounded-lg object-cover ring-1 ring-husk/10"
    />
  );
}
