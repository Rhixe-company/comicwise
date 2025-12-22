ALTER TABLE "reading_progress" RENAME TO "readingProgress";--> statement-breakpoint
ALTER TABLE "readingProgress" DROP CONSTRAINT "reading_progress_user_id_user_id_fk";
--> statement-breakpoint
ALTER TABLE "readingProgress" DROP CONSTRAINT "reading_progress_comic_id_comic_id_fk";
--> statement-breakpoint
ALTER TABLE "readingProgress" DROP CONSTRAINT "reading_progress_chapter_id_chapter_id_fk";
--> statement-breakpoint
DROP INDEX "reading_progress_user_id_idx";--> statement-breakpoint
DROP INDEX "reading_progress_comic_id_idx";--> statement-breakpoint
DROP INDEX "reading_progress_chapter_id_idx";--> statement-breakpoint
DROP INDEX "reading_progress_last_read_idx";--> statement-breakpoint
DROP INDEX "reading_progress_user_comic_idx";--> statement-breakpoint
ALTER TABLE "readingProgress" ADD CONSTRAINT "readingProgress_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readingProgress" ADD CONSTRAINT "readingProgress_comic_id_comic_id_fk" FOREIGN KEY ("comic_id") REFERENCES "public"."comic"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "readingProgress" ADD CONSTRAINT "readingProgress_chapter_id_chapter_id_fk" FOREIGN KEY ("chapter_id") REFERENCES "public"."chapter"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "readingProgress_user_id_idx" ON "readingProgress" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "readingProgress_comic_id_idx" ON "readingProgress" USING btree ("comic_id");--> statement-breakpoint
CREATE INDEX "readingProgress_chapter_id_idx" ON "readingProgress" USING btree ("chapter_id");--> statement-breakpoint
CREATE INDEX "readingProgress_last_read_idx" ON "readingProgress" USING btree ("last_read_at");--> statement-breakpoint
CREATE INDEX "readingProgress_user_comic_idx" ON "readingProgress" USING btree ("user_id","comic_id");