-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'EMAIL_VERIFICATION';

-- AlterTable
ALTER TABLE "tokens" ADD COLUMN     "code" TEXT;

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "is_verified" BOOLEAN NOT NULL DEFAULT false;
