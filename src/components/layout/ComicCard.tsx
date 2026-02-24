import { Eye, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter } from "@/components/ui/card";

import type { Comic } from "@/types";

interface ComicCardProps {
  authorName?: null | string;
  comic: Partial<Comic> & { coverImage: string; id: number; rating?: null | string; title: string };
  typeName?: null | string;
}

export function ComicCard({ comic, authorName, typeName }: ComicCardProps) {
  return (
    <Link href={`/comics/${comic.id}`}>
      <Card
        className={`
          group overflow-hidden transition-all
          hover:shadow-lg
        `}
      >
        <div className="relative aspect-2/3 overflow-hidden">
          <Image
            alt={comic.title}
            className={`
              object-cover transition-transform
              group-hover:scale-105
            `}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={comic.coverImage || "/placeholder-comic.png"}
          />
          {comic.status && (
            <Badge className="absolute top-2 right-2" variant="secondary">
              {comic.status}
            </Badge>
          )}
        </div>

        <CardContent className="p-4">
          <h3 className="line-clamp-2 font-semibold">{comic.title}</h3>
          {authorName && <p className="text-muted-foreground mt-1 text-sm">{authorName}</p>}
          {typeName && <p className="text-muted-foreground mt-1 text-xs">{typeName}</p>}
        </CardContent>

        <CardFooter
          className={`
            text-muted-foreground flex items-center gap-4 p-4 pt-0 text-sm
          `}
        >
          {comic.rating && (
            <div className="flex items-center gap-1">
              <Star className="size-4 fill-yellow-400 text-yellow-400" />
              <span>{comic.rating}</span>
            </div>
          )}
          {comic.views !== undefined && (
            <div className="flex items-center gap-1">
              <Eye className="size-4" />
              <span>{Number(comic.views)}</span>
            </div>
          )}
        </CardFooter>
      </Card>
    </Link>
  );
}
