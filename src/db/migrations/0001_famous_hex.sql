CREATE TYPE "public"."schedule_event_color" AS ENUM('sky', 'amber', 'violet', 'rose', 'emerald', 'orange');--> statement-breakpoint
CREATE TABLE "schedule_event" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"location" text,
	"color" "schedule_event_color" DEFAULT 'sky' NOT NULL,
	"start_at" timestamp NOT NULL,
	"end_at" timestamp NOT NULL,
	"all_day" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "schedule_event_end_after_start" CHECK ("schedule_event"."end_at" > "schedule_event"."start_at")
);
--> statement-breakpoint
ALTER TABLE "schedule_event" ADD CONSTRAINT "schedule_event_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "schedule_event_userId_startAt_idx" ON "schedule_event" USING btree ("user_id","start_at");--> statement-breakpoint
CREATE INDEX "schedule_event_userId_endAt_idx" ON "schedule_event" USING btree ("user_id","end_at");