import { ChapterReader } from "@/components/ChapterReader";
import { incrementChapterViews } from "@/database/mutations";
import { getChapter, getNextChapter, getPreviousChapter } from "@/database/queries";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export default async function ChapterReaderPage({ params }: PageProps) {
  const { chapterId } = await params;
  const chapterIdNumber = Number.parseInt(chapterId);

  if (isNaN(chapterIdNumber)) {
    notFound();
  }

  const chapter = await getChapter(chapterIdNumber);

  if (!chapter?.comic) {
    notFound();
  }

  const [nextChapter, prevChapter] = await Promise.all([
    getNextChapter(chapterIdNumber),
    getPreviousChapter(chapterIdNumber),
    incrementChapterViews(chapterIdNumber),
  ]);

  return (
    <ChapterReader
      chapter={chapter}
      comic={chapter.comic}
      images={chapter.images}
      prevChapter={prevChapter}
      nextChapter={nextChapter}
    />
  );
}
