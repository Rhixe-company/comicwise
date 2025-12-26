import { incrementChapterViews } from "@/database/mutations";
import { getChapter, getNextChapter, getPreviousChapter } from "@/database/queries";
import { ChapterReader } from "components/ChapterReader";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string; chapterId: string }>;
}

export default async function ChapterReaderPage({ params }: PageProps) {
  const { chapterId } = await params;
  const chapterIdNum = parseInt(chapterId);

  if (isNaN(chapterIdNum)) {
    notFound();
  }

  const chapter = await getChapter(chapterIdNum);

  if (!chapter?.comic) {
    notFound();
  }

  const [nextChapter, prevChapter] = await Promise.all([
    getNextChapter(chapterIdNum),
    getPreviousChapter(chapterIdNum),
    incrementChapterViews(chapterIdNum),
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
