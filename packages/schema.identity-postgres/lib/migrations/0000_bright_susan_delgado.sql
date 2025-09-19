CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "core";
--> statement-breakpoint
CREATE TYPE "auth"."application_type" AS ENUM('web', 'mobile', 'desktop');--> statement-breakpoint
CREATE TYPE "core"."challenge_type" AS ENUM('profile.create', 'profile.update', 'settings.update');--> statement-breakpoint
CREATE TYPE "core"."identity_role" AS ENUM('user', 'moderator', 'admin');--> statement-breakpoint
CREATE TABLE "auth"."application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"os" varchar(64),
	"type" "auth"."application_type" NOT NULL,
	"version" varchar(16)
);
--> statement-breakpoint
CREATE TABLE "core"."challenge" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"type" "core"."challenge_type" NOT NULL,
	"details" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"isOptional" boolean DEFAULT true NOT NULL,
	"isPersistent" boolean DEFAULT false NOT NULL,
	"identityId" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."device" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"model" varchar(64),
	"locale" varchar(64),
	"operationSystem" varchar(64),
	"operationSystemVersion" varchar(12),
	"fingerprint" varchar(256) NOT NULL,
	"lastSeenAt" timestamp DEFAULT now(),
	"lastIp" "inet" NOT NULL,
	"pushToken" varchar(256)
);
--> statement-breakpoint
CREATE TABLE "core"."email" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"verifiedAt" timestamp,
	"identityId" uuid NOT NULL,
	"value" varchar(128) NOT NULL,
	CONSTRAINT "email_value_unique" UNIQUE("value")
);
--> statement-breakpoint
CREATE TABLE "core"."identity" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"removedAt" timestamp,
	"roles" "core"."identity_role"[] NOT NULL,
	"lastUsedProfileId" uuid
);
--> statement-breakpoint
CREATE TABLE "core"."password" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"expiresAt" date,
	"identityId" uuid NOT NULL,
	"value" varchar(128) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "core"."phone_number" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"isVerified" boolean DEFAULT false NOT NULL,
	"identityId" uuid NOT NULL,
	"value" varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "auth"."session" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp,
	"revokedAt" timestamp,
	"expiresAt" timestamp NOT NULL,
	"refreshToken" varchar(32) NOT NULL,
	"identityId" uuid NOT NULL,
	"deviceId" uuid,
	CONSTRAINT "session_refreshToken_unique" UNIQUE("refreshToken")
);
--> statement-breakpoint
ALTER TABLE "core"."challenge" ADD CONSTRAINT "challenge_identityId_identity_id_fk" FOREIGN KEY ("identityId") REFERENCES "core"."identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."email" ADD CONSTRAINT "email_identityId_identity_id_fk" FOREIGN KEY ("identityId") REFERENCES "core"."identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."password" ADD CONSTRAINT "password_identityId_identity_id_fk" FOREIGN KEY ("identityId") REFERENCES "core"."identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "core"."phone_number" ADD CONSTRAINT "phone_number_identityId_identity_id_fk" FOREIGN KEY ("identityId") REFERENCES "core"."identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_identityId_identity_id_fk" FOREIGN KEY ("identityId") REFERENCES "core"."identity"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "auth"."session" ADD CONSTRAINT "session_deviceId_device_id_fk" FOREIGN KEY ("deviceId") REFERENCES "auth"."device"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE VIEW "core"."identity_credentials" AS (
  SELECT
    "core"."identity"."id",
    "lastPassword"."value" AS "passwordHash",
    "lastPhoneNumber"."value" AS "phoneNumber",
    "lastEmail"."value" AS "email"
  FROM "core"."identity"
  
  LEFT JOIN LATERAL (
    SELECT "value", "identityId" FROM "core"."password"
    WHERE "core"."password"."identityId" = "core"."identity"."id"
    ORDER BY "core"."password"."createdAt" DESC LIMIT 1
  ) "lastPassword" ON "lastPassword"."identityId" = "core"."identity"."id"

  LEFT JOIN LATERAL (
    SELECT "value", "identityId" FROM "core"."phone_number"
    WHERE "core"."phone_number"."identityId" = "core"."identity"."id"
    ORDER BY "core"."phone_number"."createdAt" DESC LIMIT 1
  ) "lastPhoneNumber" ON "lastPhoneNumber"."identityId" = "core"."identity"."id"

  LEFT JOIN LATERAL (
    SELECT "value", "identityId" FROM "core"."email"
    WHERE "core"."email"."identityId" = "core"."identity"."id"
    ORDER BY "core"."email"."createdAt" DESC LIMIT 1
  ) "lastEmail" ON "lastEmail"."identityId" = "core"."identity"."id"

  WHERE "core"."identity"."removedAt" IS NULL
);