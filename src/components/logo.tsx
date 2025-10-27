import { cn } from "@/lib/utils";
import Image from "next/image";
import type { ImgHTMLAttributes } from "react";

export function Logo(props: ImgHTMLAttributes<HTMLImageElement>) {
  return (
    <Image
      id={props.id}
      src="/logo.png"
      alt="RoadHog Logo"
      width={32}
      height={32}
      className={cn("w-8 h-8", props.className)}
    />
  );
}
