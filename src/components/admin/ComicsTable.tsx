import { ChevronLeft, ChevronRight, Edit2, Eye, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { useConfirmDialog } from "@/components/admin/ConfirmDialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Comic {
  coverImage: string;
  createdAt: Date;
  id: number;
  slug: string;
  status: "Coming Soon" | "Completed" | "Dropped" | "Hiatus" | "Ongoing";
  title: string;
  updatedAt: Date;
  views: number;
}

interface ComicsTableProps {
  comics: Comic[];
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  isLoading?: boolean;
  onBulkDelete?(ids: number[]): Promise<void>;
  onDelete(id: number): Promise<void>;
  onNextPage(): void;
  onPrevPage(): void;
}

const statusColors: Record<string, string> = {
  Ongoing: "bg-blue-100 text-blue-800",
  Hiatus: "bg-yellow-100 text-yellow-800",
  Completed: "bg-green-100 text-green-800",
  Dropped: "bg-red-100 text-red-800",
  "Coming Soon": "bg-purple-100 text-purple-800",
};

export function ComicsTable({
  comics,
  onDelete,
  onBulkDelete,
  currentPage,
  hasNextPage,
  hasPrevPage,
  onNextPage,
  onPrevPage,
  isLoading,
}: ComicsTableProps) {
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [deletingId, setDeletingId] = useState<null | number>(null);
  const [isBulkDeleting, setIsBulkDeleting] = useState(false);
  const { confirm, ConfirmDialog: ConfirmDialogComponent } = useConfirmDialog();

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(comics.map((c) => c.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: number, checked: boolean) => {
    if (checked) {
      setSelectedIds([...selectedIds, id]);
    } else {
      setSelectedIds(selectedIds.filter((sid) => sid !== id));
    }
  };

  const handleDelete = (id: number) => {
    confirm({
      title: "Delete Comic",
      description:
        "Are you sure? This will delete the comic and all associated chapters. This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        setDeletingId(id);
        await onDelete(id);
        setDeletingId(null);
        setSelectedIds(selectedIds.filter((sid) => sid !== id));
      },
    });
  };

  const handleBulkDelete = () => {
    if (selectedIds.length === 0 || !onBulkDelete) return;

    confirm({
      title: "Bulk Delete Comics",
      description: `Are you sure? This will delete ${selectedIds.length} comic(s) and all their associated chapters. This action cannot be undone.`,
      confirmText: "Delete All",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        setIsBulkDeleting(true);
        try {
          await onBulkDelete(selectedIds);
          setSelectedIds([]);
        } finally {
          setIsBulkDeleting(false);
        }
      },
    });
  };

  return (
    <div className="space-y-4">
      <ConfirmDialogComponent />
      <Card>
        <CardHeader>
          <CardTitle>Comics</CardTitle>
          <CardDescription>Manage all comics in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-8">
                    <Checkbox
                      checked={selectedIds.length === comics.length && comics.length > 0}
                      onCheckedChange={handleSelectAll}
                    />
                  </TableHead>
                  <TableHead className="w-12">Cover</TableHead>
                  <TableHead>Title</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Views</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-24 text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comics.length === 0 ? (
                  <TableRow>
                    <TableCell className={`text-muted-foreground py-8 text-center`} colSpan={7}>
                      No comics found
                    </TableCell>
                  </TableRow>
                ) : (
                  comics.map((comic) => (
                    <TableRow key={comic.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedIds.includes(comic.id)}
                          onCheckedChange={(checked) =>
                            handleSelectOne(comic.id, checked as boolean)
                          }
                        />
                      </TableCell>
                      <TableCell>
                        <div
                          className={`
                            relative h-10 w-8 overflow-hidden rounded-sm
                          `}
                        >
                          <Image
                            alt={comic.title}
                            className="object-cover"
                            fill
                            src={comic.coverImage}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p className="font-medium">{comic.title}</p>
                          <p className="text-muted-foreground text-xs">{comic.slug}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={statusColors[comic.status]}>{comic.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right text-sm">
                        {comic.views.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-muted-foreground text-sm">
                        {new Date(comic.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className="flex justify-end gap-2">
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/comic/${comic.slug}`} target="_blank">
                              <Eye className="size-4" />
                            </Link>
                          </Button>
                          <Button asChild size="sm" variant="ghost">
                            <Link href={`/admin/comics/${comic.id}`}>
                              <Edit2 className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            disabled={isLoading || deletingId === comic.id}
                            onClick={() => handleDelete(comic.id)}
                            size="sm"
                            variant="ghost"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-muted-foreground text-sm">Page {currentPage}</div>
            <div className="flex gap-2">
              <Button
                disabled={!hasPrevPage || isLoading}
                onClick={onPrevPage}
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="size-4" />
              </Button>
              <Button
                disabled={!hasNextPage || isLoading}
                onClick={onNextPage}
                size="sm"
                variant="outline"
              >
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </div>

          {selectedIds.length > 0 && (
            <div className={`mt-4 flex items-center justify-between border-t pt-4`}>
              <p className="text-muted-foreground text-sm">{selectedIds.length} selected</p>
              {onBulkDelete && (
                <Button
                  disabled={isBulkDeleting || isLoading}
                  onClick={handleBulkDelete}
                  size="sm"
                  variant="destructive"
                >
                  {isBulkDeleting ? "Deleting..." : `Delete ${selectedIds.length}`}
                </Button>
              )}
              <Button size="sm" variant="destructive">
                Delete Selected
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
