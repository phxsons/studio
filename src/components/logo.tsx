import { cn } from "@/lib/utils";
import type { SVGProps } from "react";

export function Logo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("w-6 h-6", props.className)}
      {...props}
    >
      <title>RoadHog Logo</title>
      <circle cx="12" cy="12" r="10" />
      <path d="M12 18c-2.21 0-4-1.79-4-4h8c0 2.21-1.79 4-4 4z" />
      <circle cx="9" cy="10" r="0.5" fill="currentColor" />
      <circle cx="15" cy="10" r="0.5" fill="currentColor" />
      <path d="M7 14q-1 0-1-1" />
      <path d="M17 14q1 0 1-1" />
    </svg>
  );
}
