"use client";

import { ChevronRight, Home } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Fragment } from "react";

export function Breadcrumbs() {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Generate breadcrumb items
  const breadcrumbs = segments.map((segment, index) => {
    const href = "/" + segments.slice(0, index + 1).join("/");
    const label = segment
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");

    return { href, label };
  });

  return (
    <nav className="text-muted-foreground flex items-center space-x-1 text-sm">
      <Link
        className={`
          hover:text-foreground flex items-center
          transition-colors
        `}
        href="/admin"
      >
        <Home className="size-4" />
      </Link>
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;
        return (
          <Fragment key={crumb.href}>
            <ChevronRight className="size-4" />
            {isLast ? (
              <span className="text-foreground font-medium">{crumb.label}</span>
            ) : (
              <Link
                className={`
                  hover:text-foreground
                  transition-colors
                `}
                href={crumb.href}
              >
                {crumb.label}
              </Link>
            )}
          </Fragment>
        );
      })}
    </nav>
  );
}
