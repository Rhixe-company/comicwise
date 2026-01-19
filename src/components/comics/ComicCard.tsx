"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import Link from "next/link";
import { Star, Eye } from "lucide-react";

interface Comic {
  id: number;
  title: string;
  slug: string;
  coverImage: string;
  status: string;
  rating: string | null;
  views: number;
}

interface ComicCardProps {
  comic: Comic;
}

export function ComicCard({ comic }: ComicCardProps) {
  return (
    <Link href={`/comics/${comic.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-[2/3] overflow-hidden">
          <Image
            src={comic.coverImage}
            alt={comic.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
          />
          <div className="absolute right-2 top-2">
            <Badge variant="secondary" className="text-xs">
              {comic.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold">{comic.title}</h3>
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <Star className="size-3 fill-yellow-400 text-yellow-400" />
              <span>{comic.rating || "N/A"}</span>
            </div>
            <div className="flex items-center gap-1">
              <Eye className="size-3" />
              <span>{comic.views.toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
