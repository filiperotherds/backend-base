/*
  Warnings:

  - You are about to drop the column `customerId` on the `estimate` table. All the data in the column will be lost.
  - You are about to drop the column `payment_method` on the `estimate` table. All the data in the column will be lost.
  - You are about to drop the `Customer` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Site` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `estimate_item` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `invite` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `member` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `product` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Customer" DROP CONSTRAINT "Customer_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "Site" DROP CONSTRAINT "Site_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "estimate" DROP CONSTRAINT "estimate_customerId_fkey";

-- DropForeignKey
ALTER TABLE "estimate_item" DROP CONSTRAINT "estimate_item_estimate_id_fkey";

-- DropForeignKey
ALTER TABLE "estimate_item" DROP CONSTRAINT "estimate_item_product_id_fkey";

-- DropForeignKey
ALTER TABLE "invite" DROP CONSTRAINT "invite_author_id_fkey";

-- DropForeignKey
ALTER TABLE "invite" DROP CONSTRAINT "invite_organizationId_fkey";

-- DropForeignKey
ALTER TABLE "member" DROP CONSTRAINT "member_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "member" DROP CONSTRAINT "member_user_id_fkey";

-- DropForeignKey
ALTER TABLE "product" DROP CONSTRAINT "product_organizationId_fkey";

-- AlterTable
ALTER TABLE "estimate" DROP COLUMN "customerId",
DROP COLUMN "payment_method";

-- DropTable
DROP TABLE "Customer";

-- DropTable
DROP TABLE "Site";

-- DropTable
DROP TABLE "estimate_item";

-- DropTable
DROP TABLE "invite";

-- DropTable
DROP TABLE "member";

-- DropTable
DROP TABLE "product";

-- DropEnum
DROP TYPE "PaymentMethod";

-- DropEnum
DROP TYPE "Role";
