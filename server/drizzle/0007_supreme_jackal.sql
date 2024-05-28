ALTER TABLE "devices" RENAME COLUMN "secret" TO "secretHash";--> statement-breakpoint
ALTER TABLE "devices" ALTER COLUMN "secretHash" SET DATA TYPE varchar(64);--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "passwordHash" varchar(64) NOT NULL;