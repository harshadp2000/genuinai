import { cn } from "@/lib/utils";

export function Logo({ className }: { className?: string }) {
  return (
    <svg
      role="img"
      aria-label="GenuinAI Logo"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn("h-6 w-6", className)}
    >
      <path d="M12 2a10 10 0 1 0 10 10" />
      <path d="M12 12a5 5 0 1 1-5 5" />
      <path d="M12 22v-2" />
      <path d="M22 12h-2" />
    </svg>
  );
}
