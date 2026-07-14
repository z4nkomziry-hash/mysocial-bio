import { Link } from "wouter";
import { Link2 } from "lucide-react";

export function Logo({ className = "", asLink = true }: { className?: string; asLink?: boolean }) {
  const content = (
    <div className={`flex items-center gap-2 text-primary ${className}`}>
      <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
        <Link2 size={24} className="stroke-[2.5]" />
      </div>
      <span className="font-black text-2xl tracking-tight text-foreground">پەیوەند</span>
    </div>
  );

  if (asLink) {
    return (
      <Link href="/" className="inline-block hover:opacity-90 transition-opacity">
        {content}
      </Link>
    );
  }

  return content;
}
