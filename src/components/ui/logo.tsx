import React from 'react';
import { cn } from "@/lib/utils";
import Image from "next/image";

interface LogoProps extends React.HTMLAttributes<HTMLDivElement> {
  withText?: boolean;
}

export function Logo({ withText = true, className, ...props }: LogoProps) {
  return (
    <div className={cn("flex items-center gap-2", className)} {...props}>
      <Image
        src="/logo.jpeg"
        alt="Rudrova Labs"
        width={36}
        height={36}
        className="rounded-lg object-cover"
        priority
      />
      {withText && (
        <span className="font-heading font-bold text-xl tracking-tight leading-none pt-0.5">
          Rudrova Labs
        </span>
      )}
    </div>
  );
}
