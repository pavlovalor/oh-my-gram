CREATE SCHEMA "auth";
--> statement-breakpoint
CREATE SCHEMA "core";
--> statement-breakpoint
CREATE TYPE "auth"."application_type" AS ENUM('web', 'mobile', 'desktop');--> statement-breakpoint
CREATE TYPE "auth"."certificate_type" AS ENUM('RSA-OAEP', 'RSA-OAEP-256', 'ECDH-ES', 'ECDH-ES+A128KW', 'ECDH-ES+A192KW', 'ECDH-ES+A256KW');--> statement-breakpoint
CREATE TABLE "auth"."application" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"os" varchar(64),
	"type" "auth"."application_type" NOT NULL,
	"version" varchar(16)
);
--> statement-breakpoint
CREATE TABLE "auth"."certificate" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"createdAt" timestamp DEFAULT now(),
	"expiresAt" timestamp NOT NULL,
	"type" "auth"."certificate_type" NOT NULL
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
	"removedAt" timestamp
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
	"createdAt" timestamp DEFAULT now(),
	"updatedAt" timestamp,
	"revokedAt" timestamp,
	"expiresAt" timestamp NOT NULL,
	"refreshToken" varchar(32) NOT NULL,
	"identityId" uuid NOT NULL,
	"deviceId" uuid,
	CONSTRAINT "session_refreshToken_unique" UNIQUE("refreshToken")
);
--> statement-breakpoint
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
    select "value", "identityId" from "core"."password"
    WHERE "core"."password"."identityId" = "core"."identity"."id"
    order by "core"."password"."createdAt" desc limit 1
  ) "lastPassword" on "lastPassword"."identityId" = "core"."identity"."id"

  LEFT JOIN LATERAL (
    select "value", "identityId" from "core"."phone_number"
    WHERE "core"."phone_number"."identityId" = "core"."identity"."id"
    order by "core"."phone_number"."createdAt" desc limit 1
  ) "lastPhoneNumber" on "lastPhoneNumber"."identityId" = "core"."identity"."id"

  LEFT JOIN LATERAL (
    select "value", "identityId" from "core"."email"
    WHERE "core"."email"."identityId" = "core"."identity"."id"
    order by "core"."email"."createdAt" desc limit 1
  ) "lastEmail" on "lastEmail"."identityId" = "core"."identity"."id"

  WHERE "core"."identity"."removedAt" <> null
);