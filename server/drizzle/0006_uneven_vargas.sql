ALTER TABLE "devices" ALTER COLUMN "ownerId" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "identifier" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ADD COLUMN "secret" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "devices" ADD CONSTRAINT "devices_identifier_unique" UNIQUE("identifier");