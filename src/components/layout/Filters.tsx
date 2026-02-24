"use client";

import { SlidersHorizontal, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface Type {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface FiltersProps {
  genres: Genre[];
  types: Type[];
}

export function Filters({ types, genres }: FiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [selectedType, setSelectedType] = useState<null | number>(
    searchParams.get("type") ? Number(searchParams.get("type")) : null
  );
  const [selectedGenres, setSelectedGenres] = useState<number[]>(
    searchParams.get("genres") ? searchParams.get("genres")!.split(",").map(Number) : []
  );
  const [selectedStatus, setSelectedStatus] = useState<null | string>(
    searchParams.get("status") || null
  );
  const [sortBy, setSortBy] = useState<string>(searchParams.get("sort") || "latest");
  const [isOpen, setIsOpen] = useState(false);

  const statuses = ["Ongoing", "Completed", "Hiatus", "Dropped", "Coming Soon"];
  const sortOptions = [
    { value: "latest", label: "Latest" },
    { value: "rating", label: "Highest Rated" },
    { value: "views", label: "Most Popular" },
    { value: "title", label: "A-Z" },
  ];

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const applyFilters = () => {
    const params = new URLSearchParams();

    if (selectedType) {
      params.set("type", selectedType.toString());
    }
    if (selectedGenres.length > 0) {
      params.set("genres", selectedGenres.join(","));
    }
    if (selectedStatus) {
      params.set("status", selectedStatus);
    }
    if (sortBy) {
      params.set("sort", sortBy);
    }

    router.push(`/comics?${params.toString()}`);
  };

  const resetFilters = () => {
    setSelectedType(null);
    setSelectedGenres([]);
    setSelectedStatus(null);
    setSortBy("latest");
    router.push("/comics");
  };

  const hasActiveFilters = selectedType || selectedGenres.length > 0 || selectedStatus;

  return (
    <>
      {/* Mobile Toggle */}
      <div
        className={`
          mb-4
          md:hidden
        `}
      >
        <Button className="w-full" onClick={() => setIsOpen(!isOpen)} variant="outline">
          <SlidersHorizontal className="mr-2 size-4" />
          Filters {hasActiveFilters && `(${1 + selectedGenres.length})`}
        </Button>
      </div>

      {/* Filters Panel */}
      <Card
        className={`
          mb-6
          ${isOpen ? "block" : "hidden md:block"}
        `}
      >
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Filters</span>
            {hasActiveFilters && (
              <Button
                className={`
                text-sm
              `}
                onClick={resetFilters}
                size="sm"
                variant="ghost"
              >
                Reset
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sort By */}
          <div>
            <Label className="mb-3 block">Sort By</Label>
            <div className="grid grid-cols-2 gap-2">
              {sortOptions.map((option) => (
                <Button
                  className="w-full"
                  key={option.value}
                  onClick={() => setSortBy(option.value)}
                  size="sm"
                  variant={sortBy === option.value ? "default" : "outline"}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>

          {/* Type Filter */}
          <div>
            <Label className="mb-3 block">Type</Label>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <Badge
                  className={`
                    hover:bg-primary/10
                    cursor-pointer
                  `}
                  key={type.id}
                  onClick={() => setSelectedType(selectedType === type.id ? null : type.id)}
                  variant={selectedType === type.id ? "default" : "outline"}
                >
                  {type.name}
                  {selectedType === type.id && <X className="ml-1 size-3" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <Label className="mb-3 block">Status</Label>
            <div className="flex flex-wrap gap-2">
              {statuses.map((status) => (
                <Badge
                  className={`
                    hover:bg-primary/10
                    cursor-pointer
                  `}
                  key={status}
                  onClick={() => setSelectedStatus(selectedStatus === status ? null : status)}
                  variant={selectedStatus === status ? "default" : "outline"}
                >
                  {status}
                  {selectedStatus === status && <X className="ml-1 size-3" />}
                </Badge>
              ))}
            </div>
          </div>

          {/* Genre Filter */}
          <div>
            <Label className="mb-3 block">
              Genres
              {selectedGenres.length > 0 && ` (${selectedGenres.length})`}
            </Label>
            <div className="flex flex-wrap gap-2">
              {genres.map((genre) => (
                <Badge
                  className={`
                    hover:bg-primary/10
                    cursor-pointer
                  `}
                  key={genre.id}
                  onClick={() => toggleGenre(genre.id)}
                  variant={selectedGenres.includes(genre.id) ? "default" : "outline"}
                >
                  {genre.name}
                  {selectedGenres.includes(genre.id) && (
                    <X
                      className={`
                    ml-1 size-3
                  `}
                    />
                  )}
                </Badge>
              ))}
            </div>
          </div>

          {/* Apply Button */}
          <Button className="w-full" onClick={applyFilters}>
            Apply Filters
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
