/*
  Warnings:

  - You are about to drop the `address` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estimate` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `organization` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `project` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `service` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `user_profile` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector";

-- CreateEnum
CREATE TYPE "ServiceStatus" AS ENUM ('SEARCHING', 'PENDING', 'ACCEPTED', 'IN_PROGRESS', 'COMPLETED', 'CANCELED');

-- CreateEnum
CREATE TYPE "MatchStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED', 'IGNORED');

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "address" DROP CONSTRAINT "address_user_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "estimate" DROP CONSTRAINT "estimate_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "organization" DROP CONSTRAINT "organization_owner_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_service_id_fkey";

-- DropForeignKey
ALTER TABLE "project" DROP CONSTRAINT "project_user_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "user_profile" DROP CONSTRAINT "user_profile_user_id_fkey";

-- DropTable
DROP TABLE "address";

-- DropTable
DROP TABLE "estimate";

-- DropTable
DROP TABLE "organization";

-- DropTable
DROP TABLE "project";

-- DropTable
DROP TABLE "service";

-- DropTable
DROP TABLE "user_profile";

-- DropEnum
DROP TYPE "EstimateStatus";

-- CreateTable
CREATE TABLE "professional_profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 5.0,
    "total_reviews" INTEGER NOT NULL DEFAULT 0,
    "base_latitude" DOUBLE PRECISION,
    "base_longitude" DOUBLE PRECISION,
    "max_distance_km" DOUBLE PRECISION NOT NULL DEFAULT 30.0,
    "bio" TEXT,
    "embedding" vector(384),
    "is_active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "professional_profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_request" (
    "id" TEXT NOT NULL,
    "client_id" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "embedding" vector(384),
    "is_emergency" BOOLEAN NOT NULL DEFAULT false,
    "scheduled_at" TIMESTAMP(3),
    "status" "ServiceStatus" NOT NULL DEFAULT 'SEARCHING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_request_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_address" (
    "id" TEXT NOT NULL,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "zip_code" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION NOT NULL,
    "longitude" DOUBLE PRECISION NOT NULL,
    "service_request_id" TEXT NOT NULL,

    CONSTRAINT "service_address_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_match" (
    "id" TEXT NOT NULL,
    "service_request_id" TEXT NOT NULL,
    "professional_profile_id" TEXT NOT NULL,
    "similarityScore" DOUBLE PRECISION NOT NULL,
    "distanceKm" DOUBLE PRECISION NOT NULL,
    "status" "MatchStatus" NOT NULL DEFAULT 'PENDING',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "service_match_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "professional_profile_user_id_key" ON "professional_profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_address_service_request_id_key" ON "service_address"("service_request_id");

-- CreateIndex
CREATE UNIQUE INDEX "service_match_service_request_id_professional_profile_id_key" ON "service_match"("service_request_id", "professional_profile_id");

-- AddForeignKey
ALTER TABLE "professional_profile" ADD CONSTRAINT "professional_profile_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_request" ADD CONSTRAINT "service_request_client_id_fkey" FOREIGN KEY ("client_id") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_address" ADD CONSTRAINT "service_address_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_match" ADD CONSTRAINT "service_match_service_request_id_fkey" FOREIGN KEY ("service_request_id") REFERENCES "service_request"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "service_match" ADD CONSTRAINT "service_match_professional_profile_id_fkey" FOREIGN KEY ("professional_profile_id") REFERENCES "professional_profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
