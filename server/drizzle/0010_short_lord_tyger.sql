ALTER TABLE "visitors" DROP CONSTRAINT "visitors_nfcCardId_unique";--> statement-breakpoint
ALTER TABLE "visitors" ADD CONSTRAINT "uniqueVisitor" UNIQUE("deviceId","nfcCardId");