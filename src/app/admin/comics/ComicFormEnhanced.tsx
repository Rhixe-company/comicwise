"use client";

import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

interface Author {
  id: number;
  name: string;
}

interface Artist {
  id: number;
  name: string;
}

interface Genre {
  id: number;
  name: string;
}

interface ComicFormEnhancedProps {
  artists?: Artist[];
  authors?: Author[];
  genres?: Genre[];
}

export function ComicFormEnhanced({
  authors = [],
  artists = [],
  genres = [],
}: ComicFormEnhancedProps) {
  const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Comic</CardTitle>
        <CardDescription>Fill in the details to create a new comic</CardDescription>
      </CardHeader>
      <CardContent>
        <form className="space-y-6">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" name="title" placeholder="Enter comic title" required />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Enter comic description"
              required
              rows={4}
            />
          </div>

          {/* Cover Image */}
          <div className="space-y-2">
            <Label htmlFor="coverImage">Cover Image URL *</Label>
            <Input
              id="coverImage"
              name="coverImage"
              placeholder="https://example.com/cover.jpg"
              required
              type="url"
            />
            <p className="text-muted-foreground text-sm">Provide a URL to the cover image</p>
          </div>

          {/* Status */}
          <div className="space-y-2">
            <Label htmlFor="status">Status *</Label>
            <Select defaultValue="Ongoing" name="status">
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Ongoing">Ongoing</SelectItem>
                <SelectItem value="Hiatus">Hiatus</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Dropped">Dropped</SelectItem>
                <SelectItem value="Coming Soon">Coming Soon</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Publication Date */}
          <div className="space-y-2">
            <Label htmlFor="publicationDate">Publication Date *</Label>
            <Input
              defaultValue={new Date().toISOString().split("T")[0]}
              id="publicationDate"
              name="publicationDate"
              required
              type="date"
            />
          </div>

          {/* Rating */}
          <div className="space-y-2">
            <Label htmlFor="rating">Rating (0-10)</Label>
            <Input
              defaultValue="0"
              id="rating"
              max="10"
              min="0"
              name="rating"
              step="0.1"
              type="number"
            />
          </div>

          {/* Author Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="authorId">Author</Label>
            <Select name="authorId">
              <SelectTrigger>
                <SelectValue placeholder="Select an author" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No author</SelectItem>
                {authors.map((author) => (
                  <SelectItem key={author.id} value={String(author.id)}>
                    {author.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Artist Dropdown */}
          <div className="space-y-2">
            <Label htmlFor="artistId">Artist</Label>
            <Select name="artistId">
              <SelectTrigger>
                <SelectValue placeholder="Select an artist" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">No artist</SelectItem>
                {artists.map((artist) => (
                  <SelectItem key={artist.id} value={String(artist.id)}>
                    {artist.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Genre Multi-Select */}
          <div className="space-y-2">
            <Label>Genres</Label>
            <div
              className={`
                grid grid-cols-2 gap-3
                md:grid-cols-3
              `}
            >
              {genres.map((genre) => (
                <label className="flex items-center gap-2" key={genre.id}>
                  <input
                    checked={selectedGenres.includes(genre.id)}
                    className="size-4 rounded-sm border-gray-300"
                    name={`genre-${genre.id}`}
                    onChange={() => toggleGenre(genre.id)}
                    type="checkbox"
                  />
                  <span className="text-sm">{genre.name}</span>
                </label>
              ))}
            </div>
            {genres.length === 0 && (
              <p className="text-muted-foreground text-sm">No genres available</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4">
            <Button type="submit">Create Comic</Button>
            <Button onClick={() => window.history.back()} type="button" variant="outline">
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
