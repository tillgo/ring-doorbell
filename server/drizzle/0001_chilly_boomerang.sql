ALTER TABLE "users" ALTER COLUMN "username" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "passwordHash" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "createdAt" timestamp DEFAULT now() NOT NULL;