"use client";

import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Type {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ComicFiltersProps {
  genres: Genre[];
  types: Type[];
}

export function ComicFilters({ types, genres }: ComicFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const [filters, setFilters] = useState({
    search: searchParams.get("search") || "",
    type: searchParams.get("type") || "",
    status: searchParams.get("status") || "",
    sort: searchParams.get("sort") || "latest",
  });

  const handleApplyFilters = () => {
    const params = new URLSearchParams();

    if (filters.search) params.set("search", filters.search);
    if (filters.type) params.set("type", filters.type);
    if (filters.status) params.set("status", filters.status);
    if (filters.sort) params.set("sort", filters.sort);

    startTransition(() => {
      router.push(`/comics?${params.toString()}`);
    });
  };

  const handleReset = () => {
    setFilters({ search: "", type: "", status: "", sort: "latest" });
    startTransition(() => {
      router.push("/comics");
    });
  };

  return (
    <div className="bg-card rounded-lg border p-6">
      <h2 className="mb-4 text-lg font-semibold">Filters</h2>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <div className="space-y-2">
          <Label htmlFor="search">Search</Label>
          <div className="relative">
            <Search className="text-muted-foreground absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              className="pl-9"
              id="search"
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              onKeyDown={(e) => e.key === "Enter" && handleApplyFilters()}
              placeholder="Comic title..."
              value={filters.search}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="type">Type</Label>
          <Select
            onValueChange={(value) => setFilters({ ...filters, type: value })}
            value={filters.type}
          >
            <SelectTrigger id="type">
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Types</SelectItem>
              {types.map((type) => (
                <SelectItem key={type.id} value={String(type.id)}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="status">Status</Label>
          <Select
            onValueChange={(value) => setFilters({ ...filters, status: value })}
            value={filters.status}
          >
            <SelectTrigger id="status">
              <SelectValue placeholder="All Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Status</SelectItem>
              <SelectItem value="Ongoing">Ongoing</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="Hiatus">Hiatus</SelectItem>
              <SelectItem value="Dropped">Dropped</SelectItem>
              <SelectItem value="Season End">Season End</SelectItem>
              <SelectItem value="Coming Soon">Coming Soon</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="sort">Sort By</Label>
          <Select
            onValueChange={(value) => setFilters({ ...filters, sort: value })}
            value={filters.sort}
          >
            <SelectTrigger id="sort">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="latest">Latest</SelectItem>
              <SelectItem value="rating">Top Rated</SelectItem>
              <SelectItem value="views">Most Viewed</SelectItem>
              <SelectItem value="title">Title (A-Z)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-end gap-2">
          <Button className="flex-1" disabled={isPending} onClick={handleApplyFilters}>
            Apply
          </Button>
          <Button disabled={isPending} onClick={handleReset} variant="outline">
            Reset
          </Button>
        </div>
      </div>
    </div>
  );
}
