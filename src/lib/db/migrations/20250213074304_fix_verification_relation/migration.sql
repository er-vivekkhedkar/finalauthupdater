-- DropIndex
DROP INDEX "Verification_userId_key";

-- CreateIndex
CREATE INDEX "Verification_userId_idx" ON "Verification"("userId");
