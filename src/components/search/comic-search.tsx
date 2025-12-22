/**
 * Comic Search Autocomplete Component
 * Full-featured search with suggestions, recent searches, and trending
 */

"use client";

import { cn } from 'utils';
import { Clock, SearchIcon, TrendingUp } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface SearchResult {
  id: number;
  title: string;
  slug: string;
  description?: string;
}

interface SearchSuggestion {
  query: string;
  count?: number;
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
    <div ref={containerRef} className="relative w-full">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Search comics..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          )}
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute top-full mt-2 w-full rounded-lg border border-input bg-popover shadow-md z-50">
          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <div className="animate-spin h-4 w-4 border-2 border-primary border-r-transparent rounded-full" />
            </div>
          ) : (
            <>
              {/* Search Results */}
              {query.length >= 2 && results.length > 0 && (
                <div className="border-b">
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Results
                  </div>
                  {results.map((result) => (
                    <button
                      key={result.id}
                      onClick={() => handleSearch(result.title)}
                      className={cn(
                        "w-full text-left px-3 py-2 hover:bg-accent transition-colors",
                        "truncate text-sm"
                      )}
                    >
                      <div className="font-medium">{result.title}</div>
                      {result.description && (
                        <div className="text-xs text-muted-foreground line-clamp-1">
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
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Suggestions
                  </div>
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion.query}
                      onClick={() => handleSearch(suggestion.query)}
                      className={cn(
                        "w-full text-left px-3 py-2 hover:bg-accent transition-colors",
                        "flex items-center justify-between"
                      )}
                    >
                      <span className="text-sm">{suggestion.query}</span>
                      {suggestion.trending && <TrendingUp className="h-3 w-3 text-orange-500" />}
                      {suggestion.count && (
                        <span className="text-xs text-muted-foreground">{suggestion.count}</span>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {/* Recent Searches */}
              {query.length < 2 && recentSearches.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Recent Searches
                  </div>
                  {recentSearches.map((search) => (
                    <button
                      key={search}
                      onClick={() => handleSearch(search)}
                      className={cn(
                        "w-full text-left px-3 py-2 hover:bg-accent transition-colors",
                        "flex items-center gap-2 text-sm"
                      )}
                    >
                      <Clock className="h-3 w-3 text-muted-foreground" />
                      {search}
                    </button>
                  ))}
                </div>
              )}

              {/* Empty State */}
              {query.length >= 2 && results.length === 0 && suggestions.length === 0 && (
                <div className="px-3 py-8 text-center text-sm text-muted-foreground">
                  No results found for "{query}"
                </div>
              )}

              {query.length < 2 && recentSearches.length === 0 && (
                <div className="px-3 py-4 text-center text-sm text-muted-foreground">
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
    <form onSubmit={handleSearch} className="w-full max-w-md">
      <div className="relative">
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          type="search"
          placeholder="Search comics..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className={cn(
            "w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background",
            "placeholder:text-muted-foreground",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          )}
        />
      </div>
    </form>
  );
}
