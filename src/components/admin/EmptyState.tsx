import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  actionHref?: string;
  actionLabel?: string;
  description: string;
  icon: LucideIcon;
  onAction?(): void;
  title: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction,
}: EmptyStateProps) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12">
        <div
          className={`
            bg-muted flex size-20 items-center justify-center rounded-full
          `}
        >
          <Icon className="text-muted-foreground size-10" />
        </div>
        <h3 className="mt-4 text-lg font-semibold">{title}</h3>
        <p className="text-muted-foreground mt-2 max-w-sm text-center text-sm">{description}</p>
        {actionLabel && (actionHref || onAction) && (
          <div className="mt-6">
            {actionHref ? (
              <Button asChild>
                <Link href={actionHref}>{actionLabel}</Link>
              </Button>
            ) : (
              <Button onClick={onAction}>{actionLabel}</Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
