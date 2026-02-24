"use client";

import { Bookmark, BookOpen, LogOut, Menu, Search, User } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { cn } from "utils";

import type { FormEvent } from "react";

export function AppNavbar() {
  const pathname = usePathname();
  const router = useRouter();

  const { data: _session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/comics", label: "Browse" },
    { href: "/bookmarks", label: "Bookmarks", protected: true },
  ];

  const isActive = (href: string) => {
    if (href === "/") {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/comics?search=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
      setIsMobileMenuOpen(false);
    }
  };

  return (
    <nav
      className={`
        bg-background/95 supports-backdrop-filter:bg-background/60 sticky top-0 z-50 border-b
        backdrop-blur-sm
      `}
    >
      <div
        className={`
          container mx-auto flex h-16 items-center justify-between px-4
        `}
      >
        {/* Logo */}
        <Link className="flex items-center gap-2 text-xl font-bold" href="/">
          <BookOpen className="size-6" />
          <span
            className={`
              hidden
              sm:inline
            `}
          >
            ComicWise
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div
          className={`
            hidden items-center gap-6
            md:flex
          `}
        >
          {navLinks.map((link) => {
            if (link.protected && status !== "authenticated") {
              return null;
            }
            return (
              <Link
                className={cn(
                  `
                    hover:text-primary text-sm font-medium
                    transition-colors
                  `,
                  isActive(link.href) ? "text-foreground" : "text-muted-foreground"
                )}
                href={link.href}
                key={link.href}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Search Bar (Desktop) */}
        <form
          className={`
            mx-6 hidden max-w-sm flex-1
            lg:flex
          `}
          onSubmit={handleSearch}
        >
          <div className="relative w-full">
            <Search
              className={`
                text-muted-foreground absolute top-1/2 left-3 size-4
                -translate-y-1/2
              `}
            />
            <Input
              className="w-full pl-9"
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search comics..."
              type="search"
              value={searchQuery}
            />
          </div>
        </form>

        {/* User Menu */}
        <div className="flex items-center gap-2">
          {status === "loading" ? (
            <div className="bg-muted size-8 animate-pulse rounded-full" />
          ) : status === "authenticated" ? (
            <>
              <Link
                className={`
                  hidden
                  md:inline-block
                `}
                href="/bookmarks"
              >
                <Button size="icon" variant="ghost">
                  <Bookmark className="size-5" />
                </Button>
              </Link>
              <Link href="/profile">
                <Button size="icon" variant="ghost">
                  <User className="size-5" />
                </Button>
              </Link>
              <Button
                className={`
                  hidden
                  md:inline-flex
                `}
                onClick={() => signOut()}
                size="icon"
                variant="ghost"
              >
                <LogOut className="size-5" />
              </Button>
            </>
          ) : (
            <div
              className={`
                hidden gap-2
                md:flex
              `}
            >
              <Link href="/sign-in">
                <Button size="sm" variant="ghost">
                  Sign In
                </Button>
              </Link>
              <Link href="/register">
                <Button size="sm">Sign Up</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <Button
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            size="icon"
            variant="ghost"
          >
            <Menu className="size-5" />
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className={`
            border-t
            md:hidden
          `}
        >
          <div className="container mx-auto space-y-4 p-4">
            {/* Mobile Search */}
            <form className="relative" onSubmit={handleSearch}>
              <Search
                className={`
                  text-muted-foreground absolute top-1/2 left-3 size-4
                  -translate-y-1/2
                `}
              />
              <Input
                className="w-full pl-9"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search comics..."
                type="search"
                value={searchQuery}
              />
            </form>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => {
                if (link.protected && status !== "authenticated") {
                  return null;
                }
                return (
                  <Link
                    className={cn(
                      `
                        rounded-md px-4 py-2 text-sm font-medium
                        transition-colors
                      `,
                      isActive(link.href)
                        ? "bg-muted text-foreground"
                        : "text-muted-foreground hover:bg-muted"
                    )}
                    href={link.href}
                    key={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}

              {status === "authenticated" ? (
                <>
                  <Link
                    className={`
                      text-muted-foreground hover:bg-muted rounded-md px-4 py-2
                      text-sm
                      font-medium
                    `}
                    href="/profile"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <Button
                    className="justify-start"
                    onClick={() => {
                      signOut();
                      setIsMobileMenuOpen(false);
                    }}
                    variant="ghost"
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <div className="flex gap-2 pt-2">
                  <Link className="flex-1" href="/sign-in">
                    <Button className="w-full" size="sm" variant="outline">
                      Sign In
                    </Button>
                  </Link>
                  <Link className="flex-1" href="/register">
                    <Button className="w-full" size="sm">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
