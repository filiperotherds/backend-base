/*
  Warnings:

  - You are about to drop the column `cpf_cnpj` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `domain` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `organization` table. All the data in the column will be lost.
  - You are about to drop the column `should_attach_users_by_domain` on the `organization` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cnpj]` on the table `organization` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[cpf]` on the table `user` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "organization_cpf_cnpj_key";

-- DropIndex
DROP INDEX "organization_domain_key";

-- DropIndex
DROP INDEX "organization_email_key";

-- AlterTable
ALTER TABLE "organization" DROP COLUMN "cpf_cnpj",
DROP COLUMN "domain",
DROP COLUMN "email",
DROP COLUMN "should_attach_users_by_domain",
ADD COLUMN     "cnpj" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "birth_date" TIMESTAMP(3),
ADD COLUMN     "cpf" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "organization_cnpj_key" ON "organization"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "user_cpf_key" ON "user"("cpf");
