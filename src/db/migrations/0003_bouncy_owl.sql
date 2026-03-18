CREATE TYPE "public"."chat_role" AS ENUM('system', 'user', 'assistant');--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "role" SET DATA TYPE "public"."chat_role" USING "role"::"public"."chat_role";--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "parts" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "attachments" SET DATA TYPE jsonb;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "attachments" SET DEFAULT '[]'::jsonb;--> statement-breakpoint
ALTER TABLE "message" ALTER COLUMN "createdAt" SET DEFAULT now();--> statement-breakpoint
CREATE INDEX "chat_userId_createdAt_idx" ON "chat" USING btree ("userId","createdAt");--> statement-breakpoint
CREATE INDEX "message_chatId_createdAt_idx" ON "message" USING btree ("chatId","createdAt");--> statement-breakpoint
CREATE INDEX "message_chatId_role_createdAt_idx" ON "message" USING btree ("chatId","role","createdAt");--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_parts_is_array" CHECK (jsonb_typeof("message"."parts") = 'array');--> statement-breakpoint
ALTER TABLE "message" ADD CONSTRAINT "message_attachments_is_array" CHECK (jsonb_typeof("message"."attachments") = 'array');