"use client";

import { Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

interface Comic {
  coverImage: string;
  id: number;
  rating: null | string;
  slug: string;
  status: string;
  title: string;
  views: number;
}

interface ComicCardProps {
  comic: Comic;
}

export function ComicCard({ comic }: ComicCardProps) {
  return (
    <Link href={`/comics/${comic.slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg">
        <div className="relative aspect-2/3 overflow-hidden">
          <Image
            alt={comic.title}
            className="object-cover transition-transform group-hover:scale-105"
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 16vw"
            src={comic.coverImage}
          />
          <div className="absolute top-2 right-2">
            <Badge className="text-xs" variant="secondary">
              {comic.status}
            </Badge>
          </div>
        </div>
        <CardContent className="p-3">
          <h3 className="mb-2 line-clamp-2 text-sm font-semibold">{comic.title}</h3>
          <div className="text-muted-foreground flex items-center justify-between text-xs">
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
