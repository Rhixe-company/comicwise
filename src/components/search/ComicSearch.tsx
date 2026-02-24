/**
 * Comic Search Autocomplete Component
 * Full-featured search with suggestions, recent searches, and trending
 */

"use client";

import { Clock, SearchIcon, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "utils";

interface SearchResult {
  description?: string;
  id: number;
  slug: string;
  title: string;
}

interface SearchSuggestion {
  count?: number;
  query: string;
  trending?: boolean;
}

export function ComicSearchAutocomplete() {
  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Load recent searches from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("recentSearches");
    if (stored) {
      setRecentSearches(JSON.parse(stored).slice(0, 5));
    }
  }, []);

  // Fetch suggestions
  useEffect(() => {
    if (query.length < 2) {
      setSuggestions([]);
      setResults([]);
      return;
    }

    const fetchSuggestions = async () => {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/search?action=suggest&q=${encodeURIComponent(query)}`);
        const data = await response.json();
        setSuggestions(data.suggestions || []);

        // Also fetch initial results
        const searchResponse = await fetch(`/api/search?q=${encodeURIComponent(query)}&limit=5`);
        const searchData = await searchResponse.json();
        setResults(searchData.data || []);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      } finally {
        setIsLoading(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(debounceTimer);
  }, [query]);

  // Close on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    // Save to recent searches
    const updated = [searchQuery, ...recentSearches.filter((s) => s !== searchQuery)].slice(0, 5);
    setRecentSearches(updated);
    localStorage.setItem("recentSearches", JSON.stringify(updated));

    // Navigate to search results
    window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch(query);
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  return (
    <div className="relative w-full" ref={containerRef}>
      <div className="relative">
        <SearchIcon
          className={`
            text-muted-foreground absolute top-1/2 left-3 size-4
            -translate-y-1/2
          `}
        />
        <input
          className={cn(
            `
              border-input bg-background w-full rounded-lg border py-2 pr-4
              pl-10
            `,
            "placeholder:text-muted-foreground",
            `
              focus:ring-primary focus:border-transparent focus:ring-2
              focus:outline-none
            `
          )}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search comics..."
          ref={inputRef}
          type="text"
          value={query}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          className={`
            border-input bg-popover absolute top-full z-50 mt-2 w-full rounded-lg
            border shadow-md
          `}
        >
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div
                className={`
                  border-primary size-4 animate-spin rounded-full border-2
                  border-r-transparent
                `}
              />
            </div>
          ) : (
            <>
              {/* Search Results */}
              {query.length >= 2 && results.length > 0 && (
                <div className="border-b">
                  <div
                    className={`
                      text-muted-foreground px-3 py-2 text-xs font-semibold
                      tracking-wide uppercase
                    `}
                  >
                    Results
                  </div>
                  {results.map((result) => (
                    <button
                      className={cn(
                        `
                          hover:bg-accent w-full px-3 py-2 text-left
                          transition-colors
                        `,
                        "truncate text-sm"
                      )}
                      key={result.id}
                      onClick={() => handleSearch(result.title)}
                    >
                      <div className="font-medium">{result.title}</div>
                      {result.description && (
                        <div
                          className={`
                            text-muted-foreground line-clamp-1 text-xs
                          `}
                        >
                          {result.description}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Suggestions */}
              {suggestions.length > 0 && (
                <div className="border-b">
                  <div
                    className={`
                      text-muted-foreground px-3 py-2 text-xs font-semibold
                      tracking-wide uppercase
                    `}
                  >
                    Suggestions
                  </div>
                  {suggestions.map((suggestion) => (
                    <button
                      className={cn(
                        `
                          hover:bg-accent w-full px-3 py-2 text-left
                          transition-colors
                        `,
                        "flex items-center justify-between"
                      )}
                      key={suggestion.query}
                      onClick={() => handleSearch(suggestion.query)}
                    >
                      <span className="text-sm">{suggestion.query}</span>
                      {suggestion.trending && <TrendingUp className={`size-3 text-orange-500`} />}
                      {suggestion.count && (
                        <span className="text-muted-foreground text-xs">{suggestion.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {query.length < 2 && recentSearches.length > 0 && (
                <div>
                  <div
                    className={`
                      text-muted-foreground px-3 py-2 text-xs font-semibold
                      tracking-wide uppercase
                    `}
                  >
                    Recent Searches
                  </div>
                  {recentSearches.map((search) => (
                    <button
                      className={cn(
                        `
                          hover:bg-accent w-full px-3 py-2 text-left
                          transition-colors
                        `,
                        "flex items-center gap-2 text-sm"
                      )}
                      key={search}
                      onClick={() => handleSearch(search)}
                    >
                      <Clock className="text-muted-foreground size-3" />
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {query.length >= 2 && results.length === 0 && suggestions.length === 0 && (
                <div
                  className={`
                    text-muted-foreground px-3 py-8 text-center text-sm
                  `}
                >
                  No results found for "{query}"
                </div>
              )}

              {query.length < 2 && recentSearches.length === 0 && (
                <div
                  className={`
                    text-muted-foreground px-3 py-4 text-center text-sm
                  `}
                >
                  Type at least 2 characters to search
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Simplified search box for headers
 */
export function ComicSearchBox() {
  const [query, setQuery] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim().length >= 2) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`;
    }
  };

  return (
    <form className="w-full max-w-md" onSubmit={handleSearch}>
      <div className="relative">
        <SearchIcon
          className={`
            text-muted-foreground pointer-events-none absolute top-1/2 left-3 size-4
            -translate-y-1/2
          `}
        />
        <input
          className={cn(
            `
              border-input bg-background w-full rounded-lg border py-2 pr-4
              pl-10
            `,
            "placeholder:text-muted-foreground",
            `
              focus:ring-primary focus:border-transparent focus:ring-2
              focus:outline-none
            `
          )}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search comics..."
          type="search"
          value={query}
        />
      </div>
    </form>
  );
}
