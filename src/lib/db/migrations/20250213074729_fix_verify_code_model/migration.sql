-- CreateTable
CREATE TABLE "VerifyCode" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "VerifyCode_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "VerifyCode_userId_key" ON "VerifyCode"("userId");

-- AddForeignKey
ALTER TABLE "VerifyCode" ADD CONSTRAINT "VerifyCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
