import { cn } from "@/lib/utils";
import Image from "next/image";
interface IconImageProps extends React.HTMLAttributes<HTMLDivElement> {
  alt: string;
  src: string;
}

export const IconImage = ({
  alt,
  src,
  className,
  ...props
}: IconImageProps) => {
  const style = `rounded-lg w-6 h-6 relative`;
  const img = "rounded-full border border-black/20";
  if (!alt || !src) return;
  return (
    <div className={cn(style, className)} {...props}>
      <Image
        fill
        priority
        className={img}
        alt={alt}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        style={{ objectFit: "contain" }}
        src={src}
      />
    </div>
  );
};
